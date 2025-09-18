import axios from "axios";

const API = axios.create({
  baseURL: "https://flower-delivery-y3lj.onrender.com/",
});

export default API;