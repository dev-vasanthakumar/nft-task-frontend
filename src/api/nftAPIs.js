import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { api } from "../config/axios";

export const useCreateNFT = () => {
  return useMutation({
    mutationFn: async (metadata) => {
      const { data } = await api.post("/nft", metadata);
      return data;
    },
  });
};

export const useListNFTs = () => {
  return useQuery({
    queryKey: ["nftList"],
    queryFn: async () => {
      const { data } = await api.get("/nft");
      return data;
    },
  });
};

export const useBuyNFT = () => {
  return useMutation({
    mutationFn: async ({ nftId, address, price, txnHash }) => {
      const { data } = await api.post("/nft/buy", { nftId, address, price, txnHash });
      return data;
    },
  });
};

export const useListNFT = () => {
  return useMutation({
    mutationFn: async ({ nftId, price, seller, contractAddress }) => {
      const { data } = await api.post("/user/nft/list-for-sale", { nftId, price, seller, contractAddress });
      return data;
    },
  });
};

export const useCancelListing = () => {
  return useMutation({
    mutationFn: async ({ listingId }) => {
      const { data } = await api.post("/user/nft/cancel-listing", { listingId });
      return data;
    },
  });
};

export const useGetNftId = () => {
  return useQuery({
    queryKey: ["nextNftId"],
    queryFn: async () => {
      const { data } = await api.get("/nft/next-id");
      return data.nextId;
    },
  });
};