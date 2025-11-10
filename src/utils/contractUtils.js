import { BrowserProvider, Contract, parseEther } from "ethers";
import NFT_ABI from "../abis/NFT.json";
import MARKETPLACE_ABI from "../abis/Marketplace.json";

const NFT_ADDRESS = '0xA375c1c0e0be1350aDbb62A89253673aB39597E0';
const MARKETPLACE_ADDRESS = "0x11a35d303241A90084fb21c6fDcaDfAC2dcD48C3";

export const getProviderAndSigner = async () => {
    if (!window.ethereum) throw new Error("MetaMask not detected.");
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return { provider, signer };
};

export const safeMintNFT = async (recipientAddress, tokenURI, nftId) => {
    console.log("🚀 ~ safeMintNFT ~ recipientAddress, tokenURI:", recipientAddress, tokenURI, nftId);
    const { signer } = await getProviderAndSigner();
    const contract = new Contract(NFT_ADDRESS, NFT_ABI, signer);
    const tx = await contract.safeMint(recipientAddress, nftId);
    await tx.wait();
    return tx.hash;
};

export const getWalletAddress = async () => {
    const { signer } = await getProviderAndSigner();
    console.log("🚀 ~ getWalletAddress ~ signer:", signer);
    return signer.address;
};

export const approveMarketplaceIfNeeded = async (nftContractAddress, ownerAddress) => {
    const { signer } = await getProviderAndSigner();
    const nftContract = new Contract(nftContractAddress, NFT_ABI, signer);

    const isApproved = await nftContract.isApprovedForAll(ownerAddress, MARKETPLACE_ADDRESS);

    if (!isApproved) {
        console.log("🔐 Marketplace not approved. Sending approval transaction...");
        const tx = await nftContract.setApprovalForAll(MARKETPLACE_ADDRESS, true);
        await tx.wait();
        console.log("✅ Marketplace approved.");
    } else {
        console.log("✅ Marketplace already approved.");
    }
};
// export const buyAnNFT = async (nftContractAddress, tokenId, sellerAddress, price) => {
//     try {
//         const { signer } = await getProviderAndSigner();
//         // const buyerAddress = signer.address;

//         // Ensure marketplace is approved by the seller
//         await approveMarketplaceIfNeeded(nftContractAddress, sellerAddress);

//         const marketplace = new Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, signer);

//         const estimatedGas = await marketplace.buy.estimateGas(
//             nftContractAddress,
//             tokenId,
//             sellerAddress,
//             price,
//         );
//         console.log("🚀 ~ buyAnNFT ~ estimatedGas:", estimatedGas)

//         const tx = await marketplace.buy(nftContractAddress, tokenId, sellerAddress, price, {
//             value: price,
//             gasLimit: estimatedGas,
//         });

//         await tx.wait();
//         return tx.hash;
//     } catch (error) {
//         console.error("❌ buyNFT failed:", error);
//         throw new Error(error?.reason || error?.message || "Transaction failed");
//     }
// };


export const buyAnNFT = async (nftContractAddress, tokenId, sellerAddress, price) => {
    try {
        const { signer } = await getProviderAndSigner();

        const marketplace = new Contract(MARKETPLACE_ADDRESS, MARKETPLACE_ABI, signer);

        const valueInWei = parseEther(price.toString());

        console.log("Sending transaction with:", {
            contract: nftContractAddress,
            tokenId,
            seller: sellerAddress,
            priceInEther: price,
            valueInWei: valueInWei.toString(),
        });
        const estimatedGas = await marketplace.buy.estimateGas(
            nftContractAddress,
            tokenId,
            sellerAddress,
            valueInWei
        );
        console.log("🚀 ~ buyAnNFT ~ estimatedGas:", estimatedGas)

        const tx = await marketplace.buy(
            nftContractAddress,
            tokenId,
            sellerAddress,
            valueInWei,
            {
                value: valueInWei,
                gasLimit: estimatedGas,
            }
        );

        await tx.wait();
        return tx.hash;
    } catch (error) {
        console.error("❌ buyNFT failed:", error);
        throw new Error(error?.reason || error?.message || "Transaction failed");
    }
};

