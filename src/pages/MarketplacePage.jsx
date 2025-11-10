import React, { useState } from "react";
import { useWallet } from "../hooks/useWallet";
import { useBuyNFT, useListNFTs } from "../api/nftAPIs";
import Loading from "../components/Loading";
import toast from "react-hot-toast";
import { buyAnNFT } from "../utils/contractUtils";

function MarketplacePage() {
  const { userAddress } = useWallet();
  const { data: listings = [], isLoading, refetch: refetchListNFTs } = useListNFTs();
  const { mutateAsync: buyNFT } = useBuyNFT();

  const [buyingItem, setBuyingItem] = useState(null);

  const handleBuy = async (item) => {
    try {
      setBuyingItem(item._id?.toString());
      toast.loading("Processing purchase...");

      // Call smart contract to buy NFT
      const txHash = await buyAnNFT(
        item.contractAddress,
        item.nftId,
        item.owner,
        item.price
      );

      // Update backend after successful transaction
      await buyNFT({
        nftId: item._id,
        address: userAddress,
        price: item.price,
        txnHash: txHash
      });

      toast.success("NFT purchased successfully!");
      refetchListNFTs();
    } catch (error) {
      console.error("Purchase failed:", error);
      toast.error(error.message || "Transaction failed");
    } finally {
      setBuyingItem(null);
      toast.dismiss();
    }
  };

  if (isLoading) return <Loading text="Loading listings..." />;

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto text-gray-100">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-sky-400 via-blue-500 to-sky-500 text-transparent bg-clip-text drop-shadow-lg">
          Explore the Marketplace
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Explore a world of rare digital art, minted by creators, powered by Web3, and truly yours.
        </p>
      </div>

      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {listings?.nfts?.length > 0 ? (
          listings?.nfts?.map((item) => {
            const isOwner =
              item.owner.toLowerCase() === userAddress?.toLowerCase();
            const isDisabled = isOwner || !userAddress;
            const isBuying = buyingItem === item._id?.toString();

            return (
              <div
                key={item._id}
                className="group relative backdrop-blur-md bg-gray-900/70 border border-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-800 hover:shadow-blue-500/40 hover:scale-105"
              >
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-64 object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs px-3 py-1 rounded-full shadow-md">
                    {item.category || "NFT"}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-semibold text-sky-300 group-hover:text-blue-400 transition-colors">
                    {item.name}
                  </h3>

                  <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                    {item.description || "A unique digital collectible."}
                  </p>

                  <p className="mt-3 text-gray-300 font-medium">
                    Price:{" "}
                    <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent font-bold">
                      {item.price} ETH
                    </span>
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Seller:{" "}
                    <span className="font-mono text-gray-300">
                      {`${item.owner.slice(0, 6)}...${item.owner?.slice(-4)}`}
                    </span>
                  </p>

                  <button
                    onClick={() => handleBuy(item)}
                    disabled={isDisabled || isBuying}
                    className={`mt-5 w-full px-5 py-2 rounded-xl font-medium transition-all duration-800 shadow-md ${isDisabled
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-sky-500 to-blue-600 hover:scale-105 hover:shadow-blue-500/40 text-white"
                      }`}
                  >
                    {isOwner
                      ? "Your Listing"
                      : isBuying
                        ? "Buying..."
                        : "Buy NFT"}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 col-span-full text-lg">
            No NFTs are currently listed. Be the first to create one!
          </p>
        )}
      </div>
    </div>
  );
}

export default MarketplacePage;
