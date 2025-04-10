import { create } from "zustand";
import { persist, PersistOptions, StorageValue } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type PreferencesState = {
  noAds: boolean;
  fantinMode: boolean;
  toggleNoAds: () => void;
  toggleFantinMode: () => void;
};

type PreferencesPersist = PersistOptions<PreferencesState>;

const asyncStorage: PersistOptions<PreferencesState>["storage"] = {
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

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      noAds: false,
      fantinMode: false,
      toggleNoAds: () => set((state) => ({ noAds: !state.noAds })),
      toggleFantinMode: () =>
        set((state) => ({ fantinMode: !state.fantinMode })),
    }),
    {
      name: "user-preferences",
      storage: asyncStorage,
    }
  )
);
