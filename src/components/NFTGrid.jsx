import React, { useState } from "react";

function NFTGrid({ allNFTs }) {
  const [selectedNFT, setSelectedNFT] = useState(null);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {allNFTs.length > 0 ? (
          allNFTs.map((nft) => (
            <div
              key={nft.tokenId}
              className="backdrop-blur-md bg-gray-900/70 border border-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-blue-500/30 transition-all duration-800 transform hover:scale-105"
            >
              <img
                src={nft.metadata.image}
                alt={nft.metadata.name}
                className="w-full h-64 object-cover border-b border-gray-800"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-sky-300">
                  {nft.metadata.name}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  Owner:{" "}
                  <span className="font-mono text-gray-300">
                    {`${nft.owner.slice(0, 6)}...${nft.owner.slice(-4)}`}
                  </span>
                </p>

                <button
                  onClick={() => setSelectedNFT(nft)}
                  className="mt-4 w-full px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-sm font-semibold shadow-md hover:scale-105 hover:shadow-blue-500/40 transition-transform"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            Connect your wallet to see Live collections
          </p>
        )}
      </div>

      {selectedNFT && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900/90 border border-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-xl relative">
            <button
              onClick={() => setSelectedNFT(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl"
            >
              ✕
            </button>

            <img
              src={selectedNFT.metadata.image}
              alt={selectedNFT.metadata.name}
              className="w-full h-72 object-cover rounded-xl mb-4"
            />

            <h2 className="text-2xl font-bold text-sky-300 mb-2">
              {selectedNFT.metadata.name}
            </h2>
            <p className="text-gray-400 mb-3">
              {selectedNFT.metadata.description || "No description available."}
            </p>
            <p className="text-sm text-gray-400">
              Owner:{" "}
              <span className="font-mono text-gray-300">
                {`${selectedNFT.owner.slice(0, 6)}...${selectedNFT.owner.slice(
                  -4
                )}`}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default NFTGrid;
