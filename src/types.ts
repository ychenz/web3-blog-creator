export interface BlogSite {
    id: number;
    name: string;
    owner: string;
    siteCid: string;
}

export interface Blog {
    blogCid: string;
    blogName: string;
    creatorAddress: string;
    creatorSiteId: string;
    creatorMembershipTierId: number | null;
}
