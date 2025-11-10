import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../assets/logo.png";
import { useWallet } from "../hooks/useWallet";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Marketplace", path: "/marketplace" },
  { label: "Create NFT", path: "/create-nft" },
  { label: "My NFTs", path: "/my-nfts" },
];

const NavLink = ({ to, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="text-gray-300 hover:text-sky-400 font-medium transition"
  >
    {label}
  </Link>
);

const WalletButton = ({ isMobile, connectWallet, isConnecting, userAddress }) => {
  const baseClasses =
    "px-5 py-2 rounded-xl font-medium text-white shadow-lg transition-all duration-800";
  const stateClasses = isConnecting
    ? "bg-gray-600 cursor-not-allowed"
    : "bg-gradient-to-r from-sky-500 to-blue-600 hover:scale-105 hover:shadow-blue-500/50";

  const label = isConnecting
    ? "Connecting..."
    : userAddress
    ? `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`
    : "Connect Wallet";

  return (
    <button
      onClick={connectWallet}
      disabled={isConnecting}
      className={`${!isMobile ? "hidden md:block" : ""} ${baseClasses} ${stateClasses}`}
    >
      {label}
    </button>
  );
};

const Navbar = () => {
  const { connectWallet, userAddress, isConnecting } = useWallet();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="backdrop-blur-md bg-gray-900/80 border-b border-gray-800 px-6 py-4 sticky top-0 z-50 shadow-lg">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Elite NFT Logo" className="w-10 h-10 object-contain rounded-lg" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500 font-extrabold text-xl tracking-wide">
            Elite NFT
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6">
          {navLinks.map(({ label, path }) => (
            <NavLink key={path} to={path} label={label} />
          ))}
        </div>

        {/* Wallet Button (Desktop) */}
        <WalletButton
          isMobile={false}
          connectWallet={connectWallet}
          isConnecting={isConnecting}
          userAddress={userAddress}
        />

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-300 hover:text-sky-400 transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4 bg-gray-900/90 border border-gray-800 rounded-xl p-4 animate-slideDown">
          {navLinks.map(({ label, path }) => (
            <NavLink key={path} to={path} label={label} onClick={() => setMenuOpen(false)} />
          ))}
          <WalletButton
            isMobile={true}
            connectWallet={connectWallet}
            isConnecting={isConnecting}
            userAddress={userAddress}
          />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
