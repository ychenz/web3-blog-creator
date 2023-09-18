import { Blog, BlogSite } from "./types";

// blog requests
interface BlogParams {
    creatorAddress: string;
    creatorSiteId: number;
    creatorMembershipTierId: number | null;
    blogName: string;
    blogContent: string;
}

export const createBlogRequest = async (params: BlogParams) => {
    const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
    });

    return res.json();
};

export const getBlogs = async (creatorSiteId: number | null): Promise<Blog[]> => {
    if (creatorSiteId) {
        const res = await fetch(`/api/blogs?creatorSiteId=${creatorSiteId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        return res.json();
    }

    return [];
};

// Creator site requests
interface SiteParams {
    name: string;
    themeColor: string;
    creatorAddress: string;
}

export const createSiteRequest = async (params: SiteParams) => {
    const res = await fetch("/api/createSite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
    });

    return res.json();
};

export const getBlogSites = async (creatorAddress: string | null): Promise<BlogSite[]> => {
    if (creatorAddress) {
        const res = await fetch(`/api/blogSites?creatorAddress=${creatorAddress}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        return res.json();
    }

    return [];
};

interface MembershipTierParam {
    tierName: string;
    tierDescription: string;
    tierMonthlyPrice: number; // In eth or fil
    creatorSiteId: number;
    creatorAddress: string;
}

interface MembershipTier extends MembershipTierParam {
    id: number;
}

export const createMembershipTierRequest = async (params: MembershipTierParam) => {
    const res = await fetch("/api/membershipTier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
    });

    return res.json();
};

export const getMembershipTier = async (
    creatorSiteId: number | null
): Promise<MembershipTier[]> => {
    if (creatorSiteId) {
        const res = await fetch(`/api/membershipTiers?creatorSiteId=${creatorSiteId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        return res.json();
    }

    return [];
};
