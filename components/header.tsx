import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, View, Text, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Header = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const iconColor = isDark ? "#CBD5E1" : "#334155";

  return (
    <View
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom * 0.2 }}
      className="bg-fuchsia-50 dark:bg-gray-900 flex-row items-center justify-between px-4"
    >
      <View className="w-12 h-1 "></View>
      <Text className="text-3xl font-bold text-slate-900 dark:text-white">
        {"       "}MEOW
      </Text>

      <View className="flex-row space-x-2">
        <TouchableOpacity
          onPress={() => router.push("/settings/HomeSettings")}
          className="bg-slate-200 dark:bg-slate-800 p-2 rounded-full"
        >
          <AntDesign name="setting" size={24} color={iconColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
