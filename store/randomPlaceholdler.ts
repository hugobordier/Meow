import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type PlaceholderState = {
  randomPlaceholder: string;
  setRandomPlaceholder: (text: string) => void;
};

const asyncStorage: PersistOptions<PlaceholderState>["storage"] = {
  getItem: async (name) => {
    const value = await AsyncStorage.getItem(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: async (name, value) => {
    await AsyncStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: async (name) => {
    await AsyncStorage.removeItem(name);
  },
};

export const usePlaceholderStore = create<PlaceholderState>()(
  persist(
    (set) => ({
      randomPlaceholder: "",
      setRandomPlaceholder: (text) => set({ randomPlaceholder: text }),
    }),
    {
      name: "placeholder-storage",
      storage: asyncStorage,
    }
  )
);
