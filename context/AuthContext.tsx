import React, { createContext, useContext, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { PetSitter, User } from "@/types/type";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  petsitter: PetSitter | null;
  setPetsitter: (petsitter: PetSitter | null) => void;
  refreshPetsitterProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { 
    user, 
    setUser, 
    isAuthenticated, 
    loading, 
    logout, 
    petsitter, 
    setPetsitter,
    refreshPetsitterProfile 
  } = useAuth();

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        isAuthenticated, 
        loading, 
        setUser, 
        logout, 
        petsitter, 
        setPetsitter,
        refreshPetsitterProfile 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuthContext doit être utilisé à l'intérieur d'AuthProvider"
    );
  }
  return context;
};