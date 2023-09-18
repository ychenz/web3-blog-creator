import React from "react";
import { Table, Space, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { getLighthouseURL, getMaskedWalletAddress } from "../helpers";
import { BlogSite } from "../types";

export const BlogSiteTable: React.FC<{ blogSites: BlogSite[] }> = (props) => {
    const { blogSites } = props;
    const navigate = useNavigate();

    const dataSource = blogSites.map((blogSite) => {
        const { name, owner, siteCid } = blogSite;

        return {
            key: siteCid,
            name,
            owner: getMaskedWalletAddress(owner),
            siteCid,
        };
    });

    const columns = [
        {
            title: "Blog Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Blog Onwer",
            dataIndex: "owner",
            key: "owner",
        },
        {
            title: "Site URL",
            dataIndex: "siteCid",
            key: "siteCid",
            render: (siteCid: string) => (
                <a href={getLighthouseURL(siteCid)} target="_blank">
                    {getLighthouseURL(siteCid)}
                </a>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: any) => (
                <Space size="middle">
                    <Button onClick={() => navigate(`/manage/${record.siteCid}`)}>
                        Manage Site
                    </Button>
                </Space>
            ),
        },
    ];

    return <Table columns={columns} dataSource={dataSource} />;
};
