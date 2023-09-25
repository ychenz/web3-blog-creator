import React, { useEffect, useState } from "react";
import { Typography, Button, Form, Input, Table } from "antd";
import { useParams } from "react-router";
import { createMembershipTierRequest, getBlogSites, getMembershipTier } from "../../../api";
import { useQueryClient, useMutation, useQuery } from "react-query";
import { useMoralis } from "react-moralis";

const { Title, Text } = Typography;

type MembershipTier = {
    id?: number;
    tierName: string;
    tierMonthlyPrice: number;
    tierDescription: string;
};

export const Memberships = (): React.ReactElement => {
    const { siteCid } = useParams();
    const { account } = useMoralis();
    const queryClient = useQueryClient();
    const [membershipTiers, setMembershipTiers] = useState<MembershipTier[]>([]);

    /** API queries */
    // Getting blog id
    const { data: blogSites } = useQuery(["blogSites", account], () => getBlogSites(account));

    const creatorSiteId = blogSites
        ? // @ts-ignore
          blogSites.find((blogSite) => blogSite.siteCid === siteCid).id
        : null;

    const { data: existingMembershipTiers, status: getMembershipTierStatus } = useQuery(
        ["membershipTiers", creatorSiteId],
        () => getMembershipTier(creatorSiteId)
    );

    const { mutate: createTierMutate, status: createTierMutateStatus } = useMutation({
        mutationFn: createMembershipTierRequest,
        onSuccess: (data) => {
            console.log("Create membership tier onSuccess:");
            console.log(data);

            // Invalid query cache
            queryClient.invalidateQueries(["membershipTiers", creatorSiteId]);
            setMembershipTiers([
                ...membershipTiers,
                {
                    id: data,
                    tierName: data.tierName,
                    tierDescription: data.tierDescription,
                    tierMonthlyPrice: data.tierMonthlyPrice,
                },
            ]);
        },
        onError: (error) => {
            console.error("Create membership tier Error:");
            console.error(error);
        },
    });

    /** Initializing data */
    useEffect(() => {
        if (existingMembershipTiers) {
            setMembershipTiers(existingMembershipTiers);
        }
    }, [existingMembershipTiers]);

    const onFinish = (values: any) => {
        if (creatorSiteId && account) {
            createTierMutate({
                tierName: values.tierName,
                tierDescription: values.tierDescription,
                tierMonthlyPrice: values.tierMonthlyPrice, // In eth or fil
                creatorSiteId: creatorSiteId,
                creatorAddress: account,
            });
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.error("Failed to submit membershipt Tier form:", errorInfo);
    };

    return (
        <div>
            <Title level={5}>Existing Membership Tiers</Title>
            {membershipTiers ? (
                <Table
                    loading={getMembershipTierStatus === "loading"}
                    columns={[
                        {
                            title: "Membership Tier Name",
                            dataIndex: "tierName",
                            key: "tierName",
                        },
                        {
                            title: "Membership Tier Description",
                            dataIndex: "tierDescription",
                            key: "tierDescription",
                        },
                        {
                            title: "Monthly Price (FIL)",
                            dataIndex: "tierMonthlyPrice",
                            key: "tierMonthlyPrice",
                        },
                    ]}
                    dataSource={membershipTiers}
                />
            ) : (
                <Text type="secondary">Nothing created yet.</Text>
            )}

            <Title style={{ marginTop: "32px" }} level={5}>
                Add New Membership Tier
            </Title>

            <Form
                name="basic"
                layout="vertical"
                initialValues={{ remember: false }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item<MembershipTier>
                    label="Membership Tier Name"
                    name="tierName"
                    rules={[
                        { required: true, message: "Please input your membership tier name!" },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<MembershipTier>
                    label="Membership Tier Description"
                    name="tierDescription"
                    rules={[
                        {
                            required: true,
                            message: "Please input your membership tier description!",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<MembershipTier>
                    label="Membership Tier Price/month (FIL)"
                    name="tierMonthlyPrice"
                    rules={[
                        { required: true, message: "Please input your membership tier price!" },
                    ]}
                >
                    <Input type="number" />
                </Form.Item>

                <Form.Item wrapperCol={{ span: 16 }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={createTierMutateStatus === "loading"}
                    >
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};
