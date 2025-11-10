import React from "react";
import { Link } from "react-router-dom";
import { Github, MessageCircle, Linkedin } from "lucide-react";

// Optional: Social icons or other sections can be added here
const exploreLinks = [
  { label: "Home", to: "/" },
  { label: "Marketplace", to: "/marketplace" },
  { label: "My NFTs", to: "/my-nfts" },
  { label: "Profile", to: "/profile" },
];

const XIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5"
    {...props}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H17.36l-5.268-6.888-6.033 6.888H2.75l7.704-8.799L2.25 2.25h6.635l4.746 6.229 4.613-6.229z" />
  </svg>
);

const FooterSection = ({ title, children }) => (
  <div>
    <h4 className="text-gray-200 font-semibold mb-6 text-lg">{title}</h4>
    {children}
  </div>
);

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-400 mt-20">
      {/* Top Gradient Border */}
      <div className="absolute inset-x-0 -top-1 bg-gradient-to-r from-sky-500 via-blue-500 to-sky-500" />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10 relative z-10">
        {/* Brand Info */}
        <div>
          <h3 className="text-2xl font-extrabold bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
            Elite NFT
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-gray-400">
            A secure decentralized platform for minting, buying, and selling NFTs. Designed to support creators, collectors, and the Web3 ecosystem.
          </p>
        </div>

        {/* Explore Links */}
        <FooterSection title="Explore">
          <ul className="space-y-3 text-sm">
            {exploreLinks.map(({ label, to }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="hover:text-sky-400 transition-colors duration-200"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </FooterSection>

        {/* Additional sections like Social or Support can go here */}
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 text-center text-sm py-6 text-gray-500">
        © {new Date().getFullYear()}{" "}
        <span className="text-sky-400 font-semibold">Elite NFT</span>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
