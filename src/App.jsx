import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import MarketplacePage from "./pages/MarketplacePage";
import MyNFTsPage from "./pages/MyNFTsPage";
import CreateNFTPage from "./pages/CreateNFTPage";

const BackgroundGlow = ({ position, color }) => (
  <div
    className={`absolute ${position} w-96 h-96 ${color} rounded-full blur-3xl animate-pulse pointer-events-none`}
  />
);

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black">
        {/* Decorative Background */}
        <BackgroundGlow position="-top-40 -left-40" color="bg-cyan-500/20" />
        <BackgroundGlow position="-bottom-40 -right-40" color="bg-blue-500/20" />

        {/* Navigation */}
        <Navbar />

        {/* Toast Notifications */}
        <ToastContainer position="top-right" autoClose={4000} />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1f2937",
              color: "#e5e7eb",
              border: "1px solid #374151",
            },
          }}
        />

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-6 py-10 text-gray-100 relative z-10">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/my-nfts" element={<MyNFTsPage />} />
            <Route path="/create-nft" element={<CreateNFTPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;
