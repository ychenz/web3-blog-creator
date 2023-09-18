import React, { useEffect } from "react";
import "./App.css";
import { Typography } from "antd";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { ConnectWalletButton } from "./components/ConnectWalletButton";
import { useQuery } from "react-query";
import { CreateBlogModal } from "./components/CreateBlogModal";
import { BlogSiteTable } from "./components/BlogSiteTable";
import { BlogSite } from "./types";
import { getBlogSites } from "./api";

const { Title } = Typography;

// 1. Creator must connect a wallet first, this wallet address will be the creator identifier
// 2. Once connected, creator can create a new blog site
// 3. Call the smart contract to create a new blog site
//    (with a name, stored in table land SQL. In future, we should allow adding description and store in IPFS)
// 4. Display the blog site name and URLs when user logged in
function App() {
    const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis();
    // Filecoin testnet chain id is 314159
    const chainId: string = parseInt(chainIdHex!).toString();

    const [blogSites, setBlogSites] = React.useState<BlogSite[]>([]);

    /** API queries */
    const { data: existingBlogSites, status } = useQuery(["blogSites", account], () =>
        getBlogSites(account)
    );

    useEffect(() => {
        if (isWeb3Enabled) {
            // TODO: call smart contract method "getBlogSite" get blog sites by use `useWeb3Contract`

            console.log("Logged in as:", account);

            if (existingBlogSites) {
                setBlogSites(existingBlogSites);
            }
        }
    }, [isWeb3Enabled, existingBlogSites]);

    const onCreateBlogSuccess = (data: { id: number; siteCid: string; siteName: string }) => {
        const { siteCid, siteName, id } = data;
        // Inserting new blog site
        setBlogSites([...blogSites, { id, name: siteName, owner: account!, siteCid: siteCid }]);
    };

    return (
        <div className="App">
            <header className="Header-container">
                <Title>Blog Creator</Title>
                <ConnectWalletButton />
            </header>

            {isWeb3Enabled ? (
                <>
                    <CreateBlogModal
                        style={{ marginBottom: 16 }}
                        onCreateBlogSuccess={onCreateBlogSuccess}
                    />
                    {blogSites.length > 0 ? <BlogSiteTable blogSites={blogSites} /> : null}
                </>
            ) : (
                <Title level={3}>Please connect a Wallet to get started</Title>
            )}
        </div>
    );
}

export default App;
