import { Link } from "expo-router";
import React from "react";
import { View, Text, Image } from "react-native";
import { useAuthContext } from "@/context/AuthContext";

const HomeScreen = () => {
  const { user } = useAuthContext();

  return (
    <View className="flex-1 justify-center bg-fuchsia-50 dark:bg-gray-700 items-center">
      <Text className="text-2xl dark:text-stone-400 font-bold mt-4">
        {user ? `Hello, ${user.username}` : "Welcome to Expo Router"}{" "}
      </Text>
      <Image
        source={require("@/assets/icons/icon.png")}
        style={{ width: 200, height: 200 }}
      />
      <Link
        href="/(auth)/homePage"
        className="p-4 bg-slate-300 rounded-full mt-3 "
      >
        <Text className="text-blue-500 font-JakartaBold dark:text-black mt-4">
          Go to HomePage
        </Text>
      </Link>
    </View>
  );
};

export default HomeScreen;
