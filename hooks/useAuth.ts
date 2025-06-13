import { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "@/services/api";
import { User, PetSitter } from "@/types/type";
import { createSocket } from "@/services/socket";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [petsitter, setPetsitter] = useState<PetSitter | null>(null);
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

        if (data) {
          setUser(data.data);
          setIsAuthenticated(true);

          try {
            const petsitterResponse = await api.get(
              `/Petsitter/user/${data.data.id}`
            );
            if (petsitterResponse.data) {
              setPetsitter(petsitterResponse.data);
              console.log("✅ Profil petsitter trouvé");
            }
          } catch (petsitterError: any) {
            console.log(" Pas de profil petsitter pour cet utilisateur");
            setPetsitter(null);
          }

          const socket = await createSocket();
          if (!socket) {
            console.log("❌ Socket non initialisé");
            //showToast("Connexion échouée, tokens manquants", ToastType.ERROR);
            return;
          }
          socket.on("connect", () => {
            console.log("🔌 Reconnexion socket automatique");
            socket.emit("register", data.data.username);
            console.log("✅ Socket connecté");
          });
        }
      } catch (error: any) {
        console.log("Auth check failed", error);
        console.log("Auth check failed", error.message);
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
    setPetsitter(null);
    setIsAuthenticated(false);
  }, []);

  const refreshPetsitterProfile = useCallback(async () => {
    if (!user) return;

    try {
      console.log("user.id", user.id);
      const petsitterResponse = await api.get(`/Petsitter/user/${user.id}`);
      if (petsitterResponse.data) {
        setPetsitter(petsitterResponse.data);
        console.log("✅ Profil petsitter mis à jour");
      }
    } catch (error) {
      console.log("user.id", user.id);
      console.log("ℹ️ Pas de profil petsitter disponible");
      setPetsitter(null);
    }
  }, [user]);

  return {
    user,
    setUser,
    petsitter,
    setPetsitter,
    isAuthenticated,
    loading,
    logout,
    refreshPetsitterProfile,
  };
};
