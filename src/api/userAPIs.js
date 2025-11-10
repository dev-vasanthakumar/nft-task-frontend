import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { api } from "../config/axios";

export const useConnectWallet = () => {
    return useMutation({
        mutationFn: async (walletAddress) => {
            const { data } = await api.post("/user/connect", { walletAddress });
            return data;
        },
    });
};

export const useFetchUserProfile = (walletAddress) => {
    return useQuery({
        queryKey: ["userProfile", walletAddress],
        queryFn: async () => {
            const { data } = await api.get(`/user/profile?wallet=${walletAddress}`);
            return data;
        },
        enabled: !!walletAddress,
    });
};

export const useUserNFTs = (walletAddress) => {
    return useQuery({
        queryKey: ["userNFTs", walletAddress],
        queryFn: async () => {
            if (!walletAddress) return [];
            const { data } = await api.get(`/user/owned-nfts/${walletAddress}`);
            return data?.nfts || [];
        },
        enabled: !!walletAddress,
    });
};

export const useUserListings = (walletAddress) => {
    return useQuery({
        queryKey: ["userListings", walletAddress],
        queryFn: async () => {
            if (!walletAddress) return [];
            const { data } = await api.get(`/user/owned-nfts/${walletAddress}`);
            return data?.listings || [];
        },
        enabled: !!walletAddress,
    });
};