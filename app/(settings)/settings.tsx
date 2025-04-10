import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { usePreferencesStore } from "@/store/preferences";
import { SafeAreaView } from "react-native-safe-area-context";

const SettingsScreen = () => {
  const { noAds, fantinMode, toggleNoAds, toggleFantinMode } =
    usePreferencesStore();

  return (
    <SafeAreaView className="flex-1 bg-slate-900 px-4 py-6">
      <Text className="text-white text-3xl font-bold mb-6">Réglages</Text>

      <View className="space-y-4">
        <TouchableOpacity
          onPress={toggleNoAds}
          className={`px-4 py-3 rounded-2xl ${
            noAds ? "bg-green-600" : "bg-gray-700"
          }`}
        >
          <Text className="text-white text-lg font-semibold">
            {noAds ? "✅ Mode Sans Pub Activé" : "🚫 Activer le Mode Sans Pub"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleFantinMode}
          className={`px-4 py-3 rounded-2xl ${
            fantinMode ? "bg-purple-600" : "bg-gray-700"
          }`}
        >
          <Text className="text-white text-lg font-semibold">
            {fantinMode ? "🎵 Mode Fantin Activé" : "😼 Activer le Mode Fantin"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;
