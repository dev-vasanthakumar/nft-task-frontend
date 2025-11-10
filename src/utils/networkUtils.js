export const ETHEREUM_HOODI_PARAMS = {
    chainId: "0x88bb0", // 560048 in hex
    chainName: "Ethereum Hoodi Testnet",
    nativeCurrency: {
        name: "ETH",
        symbol: "ETH",
        decimals: 18,
    },
    rpcUrls: ["https://0xrpc.io/hoodi"],
    blockExplorerUrls: ["https://hoodi.etherscan.io"],
};

export const switchToEthereumHoodi = async () => {
    if (!window.ethereum) throw new Error("MetaMask not detected.");

    try {
        // Attempt to switch to Hoodi
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: ETHEREUM_HOODI_PARAMS.chainId }],
        });
    } catch (error) {
        // If Hoodi is not added, attempt to add it
        if (error.code === 4902) {
            try {
                await window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [ETHEREUM_HOODI_PARAMS],
                });
            } catch (addError) {
                console.error("Failed to add Ethereum Hoodi network:", addError);
                throw addError;
            }
        } else {
            console.error("Failed to switch to Ethereum Hoodi network:", error);
            throw error;
        }
    }
};
