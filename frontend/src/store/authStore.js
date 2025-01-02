import { create } from "zustand";
import axios from "axios";
axios.defaults.withCredentials = true;

const API_URL = "http://localhost:3000/api/auth";

export const useAuthStore = create((set) => ({
    user: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
    isCheckingAuth: true,

    signup: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/signup`, {name, email, password});
            set({ isLoading: false, isAuthenticated: true, user: response.data.user });
        } catch (error) {
            set({ isLoading: false, error: error.response.data.message || "Failed to sign up" });
        }
    },

    verifyEmail: async (code)=>{
        set({isLoading: true, error: null})
        try{
            const response = await axios.post(`${API_URL}/verify-email`, {code})
            set({isLoading: false, isAuthenticated: true, user: response.data.user})
        }
        catch(error){
            set({isLoading: false, error: error.response.data.message || "Failed to verify email" })
        }

    },

  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setUser: (user) => set({ user }),
}));
