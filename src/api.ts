import axios from "axios";

const API = axios.create({
  baseURL: "https://flower-delivery-y3lj.onrender.com", // <-- твой бекенд URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;