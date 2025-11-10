import React, { useState, useEffect } from "react";
import { BrowserProvider } from "ethers";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { safeMintNFT, getWalletAddress } from "../utils/contractUtils";
import { ETHEREUM_HOODI_PARAMS } from "../utils/networkUtils";
import { useCreateNFT, useGetNftId } from "../api/nftAPIs";
import { PINATA_JWT, NFT_ADDRESS } from "../contracts/config";

function CreateNFTPage() {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        image: null,
        externalLink: "",
    });
    const [preview, setPreview] = useState(null);
    const [walletAddress, setWalletAddress] = useState(null);
    const [isMinting, setIsMinting] = useState(false);

    const { mutateAsync: createNFT } = useCreateNFT();
    const { data: nextNftId } = useGetNftId();
    const navigate = useNavigate();

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on("chainChanged", (chainId) => {
                if (chainId !== ETHEREUM_HOODI_PARAMS.chainId) {
                    toast.error("Please switch to Polygon Amoy Testnet.");
                }
            });
        }
        connectWallet();
    }, []);

    const connectWallet = async () => {
        if (!window.ethereum) return toast.error("MetaMask not detected.");
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setWalletAddress(signer.address);
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image") {
            const file = files[0];
            setFormData((prev) => ({ ...prev, image: file }));
            setPreview(URL.createObjectURL(file));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, description, image, externalLink } = formData;
        if (!name || !description || !image) {
            return toast.error("Please fill all fields and upload an image.");
        }

        let loadingToast;
        try {
            setIsMinting(true);
            loadingToast = toast.loading("Uploading metadata to IPFS...");

            const { imageUrl, metadataUrl } = await uploadToIPFS({ name, description, image, externalLink });
            toast.dismiss(loadingToast);

            const mintToast = toast.loading("Minting NFT on blockchain...");
            const { txHash } = await safeMint(metadataUrl, nextNftId);
            toast.dismiss(mintToast);

            await createNFT({
                name,
                description,
                image: imageUrl,
                tokenURI: metadataUrl,
                txHash,
                walletAddress,
                contractAddress: NFT_ADDRESS,
                nftId: nextNftId,
                externalLink,
            });

            toast.success("NFT minted successfully!");
            resetForm();
            navigate("/my-nfts");
        } catch (err) {
            toast.dismiss(loadingToast);
            toast.dismiss();
            toast.error(err.message || "Error minting NFT. Please try again.");
            console.error(err);
        } finally {
            setIsMinting(false);
        }
    };

    const resetForm = () => {
        setFormData({ name: "", description: "", image: null, externalLink: "" });
        setPreview(null);
    };

    const uploadToIPFS = async ({ name, description, image, externalLink }) => {
        const form = new FormData();
        form.append("file", image);

        const imageRes = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
            method: "POST",
            headers: { Authorization: `Bearer ${PINATA_JWT}` },
            body: form,
        });

        if (!imageRes.ok) throw new Error("Image upload failed.");
        const imageData = await imageRes.json();
        const imageUrl = `https://gateway.pinata.cloud/ipfs/${imageData.IpfsHash}`;

        const metadata = { name, description, image: imageUrl, external_url: externalLink };
        const metadataRes = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${PINATA_JWT}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(metadata),
        });

        if (!metadataRes.ok) throw new Error("Metadata upload failed.");
        const metadataData = await metadataRes.json();
        const metadataUrl = `https://gateway.pinata.cloud/ipfs/${metadataData.IpfsHash}`;

        return { imageUrl, metadataUrl };
    };

    const safeMint = async (tokenURI, nftId) => {
        const address = await getWalletAddress();
        const txHash = await safeMintNFT(address, tokenURI, nftId);
        return { txHash };
    };

    if (!walletAddress) {
        return (
            <div className="flex justify-center items-center h-64 text-gray-400 text-lg">
                Please connect your wallet to mint NFTs.
            </div>
        );
    }

    return (
        <div className="px-6 py-12 max-w-3xl mx-auto text-gray-100">
            <h2 className="text-4xl font-extrabold text-center mb-10 bg-gradient-to-r from-sky-400 to-blue-500 text-transparent bg-clip-text drop-shadow-lg">
                Create NFT
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500"
                        placeholder="NFT Name"
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-400 mb-1">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500"
                        placeholder="NFT Description"
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-400 mb-1">External Link</label>
                    <input
                        type="url"
                        name="externalLink"
                        value={formData.externalLink}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500"
                        placeholder="https://example.com"
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-400 mb-1">Image</label>
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-gray-200"
                    />
                    {preview && (
                        <img
                            src={preview}
                            alt="Preview"
                            className="mt-4 w-full h-64 object-cover rounded-xl border border-gray-700"
                        />
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isMinting}
                    className={`w-full px-4 py-2 rounded-xl font-medium text-white transition-all duration-800 ${isMinting
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-sky-500 to-blue-600 hover:scale-105 hover:shadow-blue-500/40"
                        }`}
                >
                    {isMinting ? "Minting..." : "Mint NFT"}
                </button>
            </form>
        </div>
    );
}

export default CreateNFTPage;
