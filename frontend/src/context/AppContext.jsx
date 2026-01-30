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
  const [uploads, setUploads] = useState([]);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // CHECK AUTH
  const checkAuth = async () => {
    try {
      const response = await axiosInstance.get("/auth/me");
      setUser(response.data.user);
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
      const response = await axiosInstance.post("/auth/login", { email, password });
      toast.success(response.data.message || "Login successful");
      setUser(response.data.user);
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Login failed");
    }
  };

  // LOGOUT
  const logout = async () => {
    try {
      const response = await axiosInstance.get("/auth/logout");
      toast.success(response.data.message || "Logout successful");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Logout failed");
    }
  };

  // UPLOAD IMAGE
  const uploadImage = async (file, onProgress) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axiosInstance.post('/aws/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          if (onProgress) {
            onProgress(percentCompleted);
          }
        },
      });

      toast.success('Image uploaded successfully!');
      // Refresh uploads after successful upload
      await fetchUploadHistory();
      return response.data;
    } catch (error) {
      console.error('Upload error:', error);
      const message = error.response?.data?.message || 'Upload failed';
      toast.error(message);
      throw new Error(message);
    }
  };

  // FETCH UPLOAD HISTORY
  const fetchUploadHistory = async (limit = 5) => {
    try {
      const response = await axiosInstance.get(`/aws/history?limit=${limit}`);
      setUploads(response.data.uploads || []);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error(error.response?.data?.message || 'Failed to load upload history');
      setUploads([]);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        checkingAuth,
        uploads,
        login,
        logout,
        checkAuth,
        uploadImage,
        fetchUploadHistory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
