import { create } from "zustand";
import axios from '../lib/axios-custom'
import toast from "react-hot-toast";

type AuthUserType = {
    id: string
    fullName: string
    email: string
    username: string
    role: string
};
type AuthState = {
    authUser: AuthUserType | null;
    isLoading: boolean;
  
    setAuthUser: (user: AuthUserType | null) => void;
    fetchAuthUser: () => Promise<void>;
    login: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
  
  };
  
  export const useAuthStore = create<AuthState>((set) => ({
    authUser: null,
    isLoading: false,
  
    setAuthUser: (user) => set({ authUser: user }),
  
    fetchAuthUser: async () => {
      set({ isLoading: true });
      try {
        const res = await axios.get("/api/user/my-account");
        console.log(res.data.result)
        set({ authUser: res.data.result });
      } catch (error) {
        console.error(error);
      } finally {
        set({ isLoading: false });
      }
    },
  
    login: async (email: string, password: string) => {
      set({ isLoading: true })
      try {
        await axios.post("/api/auth/login", { email, password })
        await useAuthStore.getState().fetchAuthUser()
        toast.success("Logged in successfully")
      } catch (error: unknown) {
        console.log(error)
        toast.error("Wrong email or passsword. Please try again")
        throw error
      } finally {
        set({ isLoading: false })
      }
    },

  
    logout: async () => {
      set({ isLoading: true })
      try {
        await axios.post("/api/auth/logout")
        set({ authUser: null })
        toast.success("Logged out successfully")
      } catch (error: unknown) {
        console.log(error)
        toast.error("Something went wrong")
      } finally {
        set({ isLoading: false })
      }
    },
    
  }));