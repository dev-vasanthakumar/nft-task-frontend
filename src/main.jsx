import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App.jsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);

// MP = 0x038f38dafab3e8796bc2a8214a0704eb1ea5de4a;
// NFT = 0x6e59caa82591dd5c878bc0f0fefc152a1c9e0b22;
