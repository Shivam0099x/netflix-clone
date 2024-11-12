import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

axios.defaults.withCredentials = true

export const useAuthStore = create((set) => ({
	user: null,
	isSigningUp: false,
	isCheckingAuth: true,
	isLoggingOut: false,
	isLoggingIn: false,
	signup: async (credentials) => {
		set({ isSigningUp: true });
		try {
			const response = await axios.post("http://localhost:5000/api/v1/auth/signup", credentials);
			set({ user: response.data.user, isSigningUp: false });
			console.log(response.data.user);
			toast.success("Account created successfully");
		}  catch (error) {
            console.log(error.response); // Log full error response for debugging
            toast.error(error.response?.data?.error || error.response?.data?.message  || "Signup failed");
            set({ isSigningUp: false, user: null });
         }
         
	},
	login: async (credentials) => {
		set({ isLoggingIn: true });
		try {
			const response = await axios.post("http://localhost:5000/api/v1/auth/login", credentials);
			set({ user: response.data.user, isLoggingIn: false });
			toast.success("Login successfully");
		} catch (error) {
			set({ isLoggingIn: false, user: null });
			toast.error(error.response.data.message || "Login failed");
		}
	},
	logout: async () => {
		set({ isLoggingOut: true });
		try {
			await axios.post("http://localhost:5000/api/v1/auth/logout");
			set({ user: null, isLoggingOut: false });
			toast.success("Logged out successfully");
		} catch (error) {
			set({ isLoggingOut: false });
			toast.error(error.response.data.message || "Logout failed");
		}
	},
	authCheck: async () => {
		set({ isCheckingAuth: true });
		try {
			const response = await axios.get("http://localhost:5000/api/v1/auth/authCheck");

			set({ user: response.data.user, isCheckingAuth: false });
		} catch (error) {
			set({ isCheckingAuth: false, user: null });
			
		}
	},
}));