import React, { useState } from "react";
import { Button, Modal, Input, Typography } from "antd";
import { useMutation } from "react-query";
import { useMoralis } from "react-moralis";
import { createSiteRequest } from "../api";

const { Text } = Typography;

interface CreateBlogModalProps {
    style?: React.CSSProperties;
    onCreateBlogSuccess: (data: { id: number; siteCid: string; siteName: string }) => void;
}

export const CreateBlogModal: React.FC<CreateBlogModalProps> = (props: CreateBlogModalProps) => {
    const { onCreateBlogSuccess, style } = props;
    const { isWeb3Enabled, account } = useMoralis();

    // states
    const [modalOpen, setModalOpen] = useState(false);
    const [checkError, setCheckError] = useState(false);
    const [blogName, setBlogName] = useState("");
    const [blogThemeColor, setBlogThemeColor] = useState("");

    /** API queries */
    const { mutate: createSiteMutate, status: createSiteMutateStatus } = useMutation({
        mutationFn: createSiteRequest,
        onSuccess: (data) => {
            console.log("Create site onSuccess:");
            console.log(data);

            onCreateBlogSuccess({ id: data.id, siteCid: data.siteCid, siteName: data.siteName });
            setModalOpen(false);
            setBlogName("");
            setBlogThemeColor("");
            setCheckError(false);
        },
        onError: (error) => {
            console.error("Create site onError:");
            console.error(error);
        },
    });

    /** Modal handlers */
    const showModal = () => {
        setModalOpen(true);
    };

    const handleCancel = () => {
        setModalOpen(false);
    };

    /** Handle when user click on ok to finish creating blog */
    const handleOk = () => {
        // TODO: call smart contract method "createBlogSite" to create a new blog site
        console.log("TODO: call smart contract method 'createBlogSite' to create a new blog site");

        // Check input error
        setCheckError(true);

        if (!blogName || !blogThemeColor) return;

        if (isWeb3Enabled) {
            createSiteMutate({
                name: blogName,
                themeColor: blogThemeColor,
                creatorAddress: account!,
            });
        }
    };

    return (
        <div style={style}>
            {/* Trigger button */}
            <Button onClick={showModal}>Create Blog</Button>

            <Modal
                title="Create a New Blog"
                open={modalOpen}
                confirmLoading={createSiteMutateStatus === "loading"}
                onCancel={handleCancel}
                // disable cancel when site creation is in progress
                cancelButtonProps={{ disabled: createSiteMutateStatus === "loading" }}
                onOk={handleOk}
                okText={createSiteMutateStatus === "loading" ? "Working..." : "Create"}
                closable={false}
                maskClosable={false}
            >
                <Text style={{ marginBottom: "8px" }}>Blog Site Name</Text>
                <Input
                    style={{ marginBottom: "16px" }}
                    placeholder="Blog Name"
                    type="text"
                    status={checkError && !blogName ? "error" : ""}
                    required
                    onChange={(e) => setBlogName(e.target.value)}
                />
                <Text style={{ marginBottom: "8px" }}>Theme Color</Text>
                <Input
                    style={{ marginBottom: "16px" }}
                    placeholder="Blog Theme Color"
                    type="color"
                    status={checkError && !blogThemeColor ? "error" : ""}
                    required
                    onChange={(e) => setBlogThemeColor(e.target.value)}
                />
            </Modal>
        </div>
    );
};
