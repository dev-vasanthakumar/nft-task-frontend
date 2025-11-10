import { useState, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";
import NFTCollectionABI from "../abis/NFT.json";
import toast from "react-hot-toast";
import { switchToEthereumHoodi } from "../utils/networkUtils";

const nftCollectionAddress = "0xA375c1c0e0be1350aDbb62A89253673aB39597E0";

export function useWallet() {
    const [isConnecting, setIsConnecting] = useState(false);
    const [userAddress, setUserAddress] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [nftContract, setNftContract] = useState(null);
    const [error, setError] = useState(null);

    const connectWallet = async () => {
        setIsConnecting(true);
        setError(null);

        try {
            if (!window.ethereum) throw new Error("MetaMask not found. Please install it.");

            await switchToEthereumHoodi();

            await window.ethereum.request({ method: "eth_requestAccounts" });
            const browserProvider = new BrowserProvider(window.ethereum);
            const signerInstance = await browserProvider.getSigner();
            const address = signerInstance.address;

            const nft = new Contract(nftCollectionAddress, NFTCollectionABI, signerInstance);

            setProvider(browserProvider);
            setSigner(signerInstance);
            setUserAddress(address);
            setNftContract(nft);

            // toast.success("Wallet connected");
        } catch (err) {
            console.error("Connection failed:", err);
            setError(err.message);
            toast.error(err.message);
        } finally {
            setIsConnecting(false);
        }
    };

    const disconnectWallet = () => {
        setUserAddress(null);
        setProvider(null);
        setSigner(null);
        setNftContract(null);
        toast("Wallet disconnected");
    };

    // Auto-connect if wallet is already connected
    useEffect(() => {
        const checkConnection = async () => {
            if (!window.ethereum) return;

            const accounts = await window.ethereum.request({ method: "eth_accounts" });
            if (accounts.length > 0) {
                await connectWallet();
            }
        };

        checkConnection();

        // Listen for account changes
        window.ethereum?.on("accountsChanged", (accounts) => {
            if (accounts.length === 0) {
                disconnectWallet();
            } else {
                connectWallet();
            }
        });

        return () => {
            window.ethereum?.removeAllListeners("accountsChanged");
        };
    }, []);

    return {
        connectWallet,
        disconnectWallet,
        isConnecting,
        userAddress,
        provider,
        signer,
        nftContract,
        error,
    };
}
