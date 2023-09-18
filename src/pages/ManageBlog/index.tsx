import React from "react";
import { HighlightOutlined, MoneyCollectOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Typography, Breadcrumb, Layout, Menu } from "antd";
import { useParams, Link } from "react-router-dom";

import { ConnectWalletButton } from "../../components/ConnectWalletButton";
import { Blogs } from "./Blogs";
import { Memberships } from "./Memberships";

import "./styles.css";

const { Title } = Typography;
const { Content, Sider } = Layout;

enum SubPageKeys {
    ManageBlog = "manage-blog",
    ManageMembershipTier = "manage-membership-tier",
}

const subPageMenuItems: MenuProps["items"] = [
    {
        key: SubPageKeys.ManageBlog.toString(),
        icon: React.createElement(HighlightOutlined),
        label: "Manage Blog",
    },
    {
        key: SubPageKeys.ManageMembershipTier.toString(),
        icon: React.createElement(MoneyCollectOutlined),
        label: "Manage Membership Tier",
    },
];

export const ManageBlog = (): React.ReactElement => {
    const [currentSubPage, setCurrentSubPage] = React.useState(SubPageKeys.ManageBlog.toString());

    return (
        <div className="ManageBlog-Root">
            <header className="Header-container">
                <Title>Managing Blog</Title>
                <ConnectWalletButton />
            </header>

            <Layout>
                <Sider width={200} style={{ background: "#fff" }}>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={[currentSubPage]}
                        defaultOpenKeys={[currentSubPage]}
                        style={{ height: "100%", borderRight: 0 }}
                        items={subPageMenuItems}
                        onClick={(menuInfo) => {
                            setCurrentSubPage(menuInfo.key);
                        }}
                    />
                </Sider>

                <Layout style={{ padding: "0 24px 24px", backgroundColor: "white" }}>
                    <Breadcrumb style={{ margin: "16px 0" }}>
                        <Breadcrumb.Item>
                            <Link to={"/"} style={{ color: "#1677ff" }}>
                                Home
                            </Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>Manage</Breadcrumb.Item>
                    </Breadcrumb>

                    <Content style={{ minHeight: 500 }}>
                        {currentSubPage === SubPageKeys.ManageBlog ? <Blogs /> : <Memberships />}
                    </Content>
                </Layout>
            </Layout>
        </div>
    );
};
