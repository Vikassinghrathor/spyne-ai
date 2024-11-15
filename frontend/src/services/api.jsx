import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const authService = {
  async register(userData) {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  async login(credentials) {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  async getProfile() {
    const response = await api.get("/auth/profile");
    return response.data;
  },
};

export const carService = {
  async createCar(carData) {
    const formData = new FormData();
    formData.append("title", carData.title);
    formData.append("description", carData.description);
    formData.append("tags", JSON.stringify(carData.tags));

    carData.images.forEach((image) => {
      formData.append("images", image);
    });

    const response = await api.post("/cars", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async getCars(search = "") {
    const response = await api.get(`/cars${search ? `?search=${search}` : ""}`);
    return response.data;
  },

  async getCarById(id) {
    const response = await api.get(`/cars/${id}`);
    return response.data;
  },

  async updateCar(id, carData) {
    const formData = new FormData();
    formData.append("title", carData.title);
    formData.append("description", carData.description);
    formData.append("tags", JSON.stringify(carData.tags));

    if (carData.images) {
      carData.images.forEach((image) => {
        formData.append("images", image);
      });
    }

    const response = await api.put(`/cars/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async deleteCar(id) {
    const response = await api.delete(`/cars/${id}`);
    return response.data;
  },
};
