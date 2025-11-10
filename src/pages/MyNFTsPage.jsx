import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useWallet } from "../hooks/useWallet";
import { useListNFT, useCancelListing } from "../api/nftAPIs";
import { useUserNFTs } from "../api/userAPIs";
import Loading from "../components/Loading";
import { NFT_ADDRESS } from "../contracts/config";

function MyNFTsPage() {
  const { userAddress } = useWallet();
  const { data: userNFTs = [], isLoading: isFetchingNFTs, refetch: refetchNFTs } = useUserNFTs(userAddress);
  const { mutateAsync: listNFT } = useListNFT();
  const { mutateAsync: cancelListing } = useCancelListing();

  const [listingPrice, setListingPrice] = useState({});
  const [loadingAction, setLoadingAction] = useState({});

  useEffect(() => {
    refetchNFTs();
  }, [userAddress])

  const handleListClick = async (nftId) => {
    const price = listingPrice[nftId];
    if (!price) toast.error("Please enter a price.");

    try {
      setLoadingAction((prev) => ({ ...prev, [nftId]: "listing" }));
      await listNFT({ nftId: nftId, price, seller: userAddress, contractAddress: NFT_ADDRESS });
      setListingPrice((prev) => ({ ...prev, [nftId]: "" }));
    } finally {
      refetchNFTs();
      setLoadingAction((prev) => ({ ...prev, [nftId]: null }));
    }
  };

  const handleCancelClick = async (nftId) => {
    const listingId = userNFTs.find(
      (l) => l.nftId === nftId && l.isInSale
    )?._id;

    if (!listingId) return;

    try {
      setLoadingAction((prev) => ({ ...prev, [nftId]: "canceling" }));
      await cancelListing({ listingId });
    } finally {
      refetchNFTs();
      setLoadingAction((prev) => ({ ...prev, [nftId]: null }));
    }
  };

  if (isFetchingNFTs) return <Loading text="Loading your NFTs..." />;

  if (!userAddress) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-400 text-lg">
        Please connect your wallet to view and list NFTs.
      </div>
    );
  }

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto text-gray-100">
      <h2 className="text-4xl font-extrabold text-center mb-12 bg-gradient-to-r from-sky-400 to-blue-500 text-transparent bg-clip-text drop-shadow-lg">
        My NFTs
      </h2>

      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {userNFTs.length > 0 ? (
          userNFTs.map((nft) => {
            const isListed = nft.isInSale;
            const isLoading = loadingAction[nft.nftId];

            return (
              <div
                key={nft.nftId}
                className="backdrop-blur-md bg-gray-900/70 border border-gray-800 rounded-2xl shadow-md overflow-hidden transition-all duration-800 hover:shadow-blue-500/30 hover:scale-105"
              >
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="w-full h-64 object-cover border-b border-gray-800"
                />

                <div className="p-5">
                  <h3 className="text-xl font-semibold text-sky-300">
                    {nft.name}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Token ID:{" "}
                    <span className="font-mono text-gray-300">{nft.nftId}</span>
                  </p>

                  {isListed ? (
                    <>
                      <p className="text-green-400 font-medium mt-3">
                        Listed for Sale
                      </p>
                      <button
                        onClick={() => handleCancelClick(nft.nftId)}
                        disabled={isLoading === "canceling"}
                        className={`mt-4 w-full px-4 py-2 rounded-xl font-medium text-white transition-all duration-800 ${isLoading === "canceling"
                          ? "bg-gray-600 cursor-not-allowed"
                          : "bg-gradient-to-r from-red-500 to-pink-600 hover:scale-105 hover:shadow-red-500/40"
                          }`}
                      >
                        {isLoading === "canceling" ? "Canceling..." : "Cancel Listing"}
                      </button>
                    </>
                  ) : (
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 shadow-inner">
                        <span className="text-gray-400 text-sm mr-2">ETH</span>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Enter price"
                          value={listingPrice[nft.nftId] || ""}
                          onChange={(e) =>
                            setListingPrice((prev) => ({
                              ...prev,
                              [nft.nftId]: e.target.value,
                            }))
                          }
                          className="flex-1 bg-transparent outline-none text-sm text-gray-200 placeholder-gray-500"
                        />
                      </div>
                      <button
                        onClick={() => handleListClick(nft.nftId)}
                        disabled={isLoading === "listing"}
                        className={`w-full px-4 py-2 rounded-xl font-medium text-white transition-all duration-800 ${isLoading === "listing"
                          ? "bg-gray-600 cursor-not-allowed"
                          : "bg-gradient-to-r from-sky-500 to-blue-600 hover:scale-105 hover:shadow-blue-500/40"
                          }`}
                      >
                        {isLoading === "listing" ? "Listing..." : "List NFT"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            You don’t own any NFTs in this collection.
          </p>
        )}
      </div>
    </div>
  );
}

export default MyNFTsPage;
