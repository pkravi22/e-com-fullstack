import axios from "axios";

const api = axios.create({
  baseURL: "https://e-com-fullstack.onrender.com/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
