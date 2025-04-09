import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Header = () => {
  const router = useRouter();

  return (
    <SafeAreaView className="bg-slate-50 dark:bg-slate-900 flex-row items-center justify-between px-4 py-3">
      <TouchableOpacity
        onPress={() => router.back()}
        className="bg-slate-200 dark:bg-slate-800 p-2 rounded-full"
      >
        <AntDesign
          name="left"
          size={24}
          color="black"
          className="text-slate-700 dark:text-slate-300"
        />
      </TouchableOpacity>

      <Text className="text-3xl font-bold text-slate-900 dark:text-white">
        MEOW
      </Text>

      <View className="flex-row space-x-2">
        <TouchableOpacity
          onPress={() => router.push("/(settings)/settings")}
          className="bg-slate-200 dark:bg-slate-800 p-2 rounded-full"
        >
          <AntDesign
            name="setting"
            size={24}
            className="text-slate-700 dark:text-slate-300"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Header;
