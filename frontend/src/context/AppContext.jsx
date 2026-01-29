/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axiosInstance";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // CHECK AUTH
  const checkAuth = async () => {
    try {
      const res = await axiosInstance.get("/auth/me");
      setUser(res.data.user);
    } catch (error) {
      setUser(null);
      console.error("Authentication check failed", error);
    } finally {
      setCheckingAuth(false);
    }
  };

  // LOGIN
  const login = async (email, password) => {
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      toast.success(res.data.message || "Login successful");
      setUser(res.data.user);
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Login failed");
    }
  };

  // LOGOUT
  const logout = async () => {
    try {
      const res = await axiosInstance.get("/auth/logout");
      toast.success(res.data.message || "Logout successful");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Logout failed");
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        checkingAuth,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
