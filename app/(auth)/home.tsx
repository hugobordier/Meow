import { Link, router } from "expo-router";
import React from "react";
import { View, Text, Image, Pressable, useColorScheme } from "react-native";
import { useAuthContext } from "@/context/AuthContext";
import Svg, { Path } from "react-native-svg";

const HomeScreen = () => {
  const { user } = useAuthContext();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const handleRedirect = () => {
    router.dismissAll();
    router.replace("/(home)/(onboarding)/onBoarding");
  };

  return (
    <View className="flex-1 justify-start bg-fuchsia-50 dark:bg-gray-900 relative">
      <View>
        <Image
          source={require("@/assets/icons/chiensHome.jpg")}
          style={{ width: "100%", height: 251 }}
        />
        <Svg
          height="100"
          width="100%"
          viewBox="0 0 375 100"
          style={{ position: "absolute", bottom: -25, left: 0 }}
        >
          <Path
            d="M0,80 Q187.5,0 375,80 Z"
            fill={isDarkMode ? "#111827" : "#fdf4ff"}
          />
        </Svg>
      </View>

      <View className="items-center mt-6">
        <Text className="text-4xl font-bold mb-1 dark:text-white">MEOW🐱</Text>
        <Text className="text-xl font-bold mt-2 dark:text-white">
          Que voulez-vous faire {user?.username}?
        </Text>
      </View>

      <View className="flex-row mt-20 justify-center items-center">
        <View className="flex-1 justify-center items-center">
          <Text className="font-bold mb-6 underline dark:text-white">
            Proposer des services
          </Text>
          <Link
            href="/(auth)/(id_verification)/welcome_id_verification"
            className="w-40 h-56 bg-slate-300 rounded-3xl flex items-center justify-center shadow-md"
          >
            <View className="flex items-center justify-center rounded-3xl w-full dark:bg-fuchsia-200 h-full shadow-md dark:shadow-slate-50">
              <Text className="text-9xl">🐶</Text>
            </View>
          </Link>
        </View>

        <View className="flex-1 justify-center  items-center">
          <Text className="font-bold mb-6 underline dark:text-white">
            Rechercher un pet-sitter
          </Text>
          <Pressable
            onPress={handleRedirect}
            className="w-40 h-56 bg-slate-300 rounded-3xl dark:bg-fuchsia-200 flex items-center justify-center shadow-md  dark:shadow-slate-50"
          >
            <View className="flex items-center justify-center  w-full h-full">
              <Text className="text-9xl">🏡</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
