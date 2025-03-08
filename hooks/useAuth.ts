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

        const { data } = await api.get("/authRoutes/test");
        console.log("data", data);
        console.log(data);
        setUser(data);
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

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data } = await api.post("/login", { email, password });

      await AsyncStorage.setItem("accessToken", data.token);
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed", error);
      throw new Error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem("accessToken");
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return { user, isAuthenticated, loading, login, logout };
};
