export const getMaskedWalletAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(address.length - 4)}`;
};

export const getLighthouseURL = (siteCid: string) => {
    return `https://gateway.lighthouse.storage/ipfs/${siteCid}`;
};
