import axios from "axios";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
export const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000";

export const api = axios.create({
  baseURL: API_BASE_URL,
});