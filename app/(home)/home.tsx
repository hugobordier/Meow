import { useNavigation, Link } from "expo-router";
import React from "react";
import { View, Text, Image } from "react-native";

const HomeScreen = () => {
  return (
    <View className="flex-1 justify-center bg-fuchsia-50 dark:bg-slate-800 items-center">
      <Text className="text-2xl dark:text-stone-400 font-bold mt-4">
        Welcome to Expo Router
      </Text>
      <Image
        source={require("@/assets/icons/icon.png")}
        style={{ width: 200, height: 200 }}
      />
    </View>
  );
};

export default HomeScreen;
