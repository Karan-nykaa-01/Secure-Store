/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axiosInstance";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // CHECK AUTH
  const checkAuth = async () => {
    try {
      const response = await axiosInstance.get("/auth/me");
      if (response.data.success) {
        setUser(response.data.user);
        // If on login page and authenticated, redirect to dashboard
        if (location.pathname === "/login") {
          navigate("/");
        }
      }
    } catch (error) {
      // User not authenticated
      setUser(null);
      // Redirect to login if trying to access protected routes
      const publicRoutes = ["/login"];
      if (!publicRoutes.includes(location.pathname)) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // LOGIN
  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      
      if (response.data.user) {
        setUser(response.data.user);
        return response.data;
      }
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      throw new Error(message);
    }
  };

  // LOGOUT
  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      setUser(null);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
