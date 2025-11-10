import axios from "axios";

export const API_BASE_URL = "https://nft-task-backend.onrender.com";

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});
