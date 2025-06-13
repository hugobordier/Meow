import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, ChevronRight } from "lucide-react-native";
import { usePreferencesStore } from "@/store/preferences";
import { logout } from "@/services/api";
import { getSocket } from "@/services/socket";

const socket = getSocket();
const settingsOptions = [
  {
    title: "Statut en ligne",
    value: "Activé",
    screen: "/settings/online" as const,
  },
  {
    title: "Confidentialité et sécurité",
    screen: "/settings/security" as const,
  },
  { title: "Stockage et données", screen: "/settings/data" as const },
  {
    title: "Mention légales et politiques",
    screen: "/settings/policy" as const,
  },
];

const HomeSettings = () => {
  const { noAds, fantinMode, toggleNoAds, toggleFantinMode } =
    usePreferencesStore();
  const router = useRouter();
  const theme = useColorScheme();
  const isDark = theme === "dark";

  return (
    <SafeAreaView className="flex-1 bg-gray-100 dark:bg-slate-900">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-200 dark:border-slate-700">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={isDark ? "#fff" : "#000"} />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-xl font-bold text-black dark:text-white">
          MEOW
        </Text>
      </View>

      <Text className="text-lg font-semibold text-center mt-4 mb-2 text-black dark:text-white">
        Paramètres
      </Text>

      {/* Liste des paramètres */}
      <ScrollView className="px-4">
        {settingsOptions.map((item, index) => (
          <TouchableOpacity
            key={index}
            className="flex-row items-center justify-between py-4 border-b border-gray-200 dark:border-slate-700"
            onPress={() => item.screen && router.push(item.screen)}
          >
            <Text className="text-base text-black dark:text-white">
              {item.title}
            </Text>
            <View className="flex-row items-center">
              {item.value && (
                <Text className="text-gray-500 dark:text-gray-400 mr-2">
                  {item.value}
                </Text>
              )}
              <ChevronRight size={20} color={isDark ? "#ccc" : "#888"} />
            </View>
          </TouchableOpacity>
        ))}

        {/* Options spéciales */}
        <TouchableOpacity
          onPress={toggleFantinMode}
          className="flex-row items-center justify-between py-4 border-b border-gray-200 dark:border-slate-700"
        >
          <Text className="text-base text-black dark:text-white">
            {fantinMode
              ? "🎵 Mode Fantin Activé 🔊"
              : "🎶 Activer le Mode Fantin"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleNoAds}
          className="flex-row items-center justify-between py-4 border-b border-gray-200 dark:border-slate-700"
        >
          <Text className="text-base text-black dark:text-white">
              {noAds ? "🧘 Mode Aleksei Activé ✨" : "🚫 Désactiver le Mode Aleksei"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push('/(auth)/(id_verification)/welcome_id_verification')}
          className="flex-row items-center justify-between py-4 border-b border-gray-200 dark:border-slate-700"
        >
          <Text className="text-base text-black dark:text-white">
            Devenir petsitter
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () => {
            const socket = getSocket();
            if (socket) {
              socket.disconnect();
              console.log("Socket déconnecté !");
            } else {
              console.log("Aucun socket actif");
            }

            await logout();
          }}
          className="flex-row items-center justify-between py-4"
        >
          <Text className="text-base text-red-500 dark:text-red-400 font-semibold">
            Se déconnecter
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeSettings;
