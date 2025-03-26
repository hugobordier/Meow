import { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "@/services/api";
import { User } from "@/types/type";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("accessToken");
        if (!token) {
          setLoading(false);
          return;
        }

        const { data } = await api.get("/authRoutes/me");
        console.log("dat", data.data);
        setUser(data.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth check failed", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem("accessToken");
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return { user, setUser, isAuthenticated, loading, logout };
};
