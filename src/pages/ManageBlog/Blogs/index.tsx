import React, { useEffect, useState } from "react";
import { Typography, Button, Input, Checkbox, Radio, Space, Form, Table } from "antd";
import { Navigate, useParams, useNavigate } from "react-router";
import {
    getLighthouseURL,
    getMaskedWalletAddress,
    getEncryptedLighthouseURL,
} from "../../../helpers";
import { getBlogSites, getMembershipTier, createBlogRequest, getBlogs } from "../../../api";
import { useMutation, useQuery } from "react-query";
import { useMoralis } from "react-moralis";
import { Blog } from "../../../types";

const { Title, Text } = Typography;
const { TextArea } = Input;

export const Blogs = (): React.ReactElement => {
    const { siteCid } = useParams();
    const { account, isWeb3Enabled } = useMoralis();
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [isPaidBlog, setIsPaidBlog] = useState(false);

    /**
     * API queries
     */
    // Getting blog id
    const { data: blogSites, refetch: refetchBlogSites } = useQuery(["blogSites", account], () =>
        getBlogSites(account)
    );
    const creatorSiteId =
        (blogSites &&
            isWeb3Enabled && // @ts-ignore
            blogSites.find((blogSite) => blogSite.siteCid === siteCid)?.id) ||
        null;

    const { data: membershipTiers, refetch: refetchMembershipTiers } = useQuery(
        ["membershipTiers", creatorSiteId],
        () => getMembershipTier(creatorSiteId || null)
    );

    const { data: existingBlogs, status: getBlogsStatus } = useQuery(
        ["blogs", creatorSiteId],
        () => getBlogs(creatorSiteId)
    );

    const { mutate: createBlogMutate, status: createBlogMutateStatus } = useMutation({
        mutationFn: createBlogRequest,
        onSuccess: (res) => {
            console.log("Save blog Success:");
            console.log(res);

            // Refetch blogs

            setBlogs([...blogs, res.data]);
        },
        onError: (error) => {
            console.error("Create membership tier Error:");
            console.error(error);
        },
    });

    /** Initializing data */
    useEffect(() => {
        if (isWeb3Enabled) {
            // Need to refetch blog sites & MembershipTier since ids can be null if it's created for the first time
            refetchBlogSites();
            refetchMembershipTiers();

            if (existingBlogs) {
                setBlogs(existingBlogs);
            }
        }
    }, [isWeb3Enabled, existingBlogs]);

    /**
     * Callbacks
     */
    const onFinish = (values: any) => {
        if (creatorSiteId && account) {
            createBlogMutate({
                blogName: values.blogName,
                blogContent: values.blogContent,
                creatorMembershipTierId: values.creatorMemberShipTierId || null,
                creatorSiteId: creatorSiteId,
                creatorAddress: account,
            });
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.error("Failed to submit membershipt Tier form:", errorInfo);
    };

    const blogTableData = blogs.map((blog: Blog) => ({
        blogName: blog.blogName,
        blogCid: blog.blogCid,
        creatorMembershipTierId: blog.creatorMembershipTierId,
    }));

    return (
        <div>
            <Title level={3}>Managing Blog Site {getMaskedWalletAddress(siteCid!)}</Title>

            <Title level={5}>Existing Blogs</Title>
            {blogs ? (
                <Table
                    loading={getBlogsStatus === "loading"}
                    columns={[
                        {
                            title: "Blog Name",
                            dataIndex: "blogName",
                            key: "blogName",
                        },
                        {
                            title: "Blog URL",
                            dataIndex: "blogCid",
                            key: "blogCid",
                            render: (blogCid: string, record) => (
                                <a
                                    href={
                                        record.creatorMembershipTierId
                                            ? getEncryptedLighthouseURL(blogCid)
                                            : getLighthouseURL(blogCid)
                                    }
                                    target="_blank"
                                >
                                    {record.creatorMembershipTierId
                                        ? getEncryptedLighthouseURL(blogCid)
                                        : getLighthouseURL(blogCid)}
                                </a>
                            ),
                        },
                        {
                            title: "Membership Tier Name",
                            dataIndex: "creatorMembershipTierId",
                            key: "creatorMembershipTierId",
                            render: (creatorMembershipTierId: number) => (
                                <Text>
                                    {
                                        //@ts-ignore
                                        membershipTiers && membershipTiers.length > 0
                                            ? membershipTiers.find(
                                                  (tier) => tier.id === creatorMembershipTierId
                                              )?.tierName
                                            : "Free"
                                    }
                                </Text>
                            ),
                        },
                    ]}
                    dataSource={blogTableData}
                />
            ) : (
                <Text type="secondary">Nothing created yet.</Text>
            )}

            <Title style={{ marginTop: "32px" }} level={5}>
                Add New Blog
            </Title>

            <Form
                name="basic"
                layout="vertical"
                initialValues={{ remember: false }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Blog Name"
                    name="blogName"
                    rules={[{ required: true, message: "Please input your blog name!" }]}
                >
                    <Input type="text" />
                </Form.Item>

                <Form.Item
                    label="Blog Content"
                    name="blogContent"
                    rules={[{ required: true, message: "Please input your blog content!" }]}
                >
                    <TextArea rows={20} />
                </Form.Item>

                <Form.Item
                    label="Monetization"
                    name="isPaidBlog"
                    rules={[
                        {
                            required: false,
                        },
                    ]}
                >
                    <Checkbox
                        style={{ marginBottom: "16px" }}
                        checked={isPaidBlog}
                        disabled={membershipTiers?.length === 0}
                        onChange={(e) => {
                            setIsPaidBlog(!isPaidBlog);
                        }}
                    >
                        This is a Paid Blog
                    </Checkbox>
                </Form.Item>

                {isPaidBlog ? (
                    <Form.Item
                        label="Subscription tier"
                        name="creatorMemberShipTierId"
                        rules={[
                            { required: true, message: "Please select required subscription!" },
                        ]}
                    >
                        <Radio.Group>
                            <Space direction="vertical">
                                {membershipTiers?.map((tier) => (
                                    <Radio key={tier.id} value={tier.id}>
                                        {tier.tierName} - {tier.tierDescription}, FIL{" "}
                                        {tier.tierMonthlyPrice} / month
                                    </Radio>
                                ))}
                            </Space>
                        </Radio.Group>
                    </Form.Item>
                ) : null}

                <Form.Item wrapperCol={{ span: 16 }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={createBlogMutateStatus === "loading"}
                    >
                        Save Blog
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};
