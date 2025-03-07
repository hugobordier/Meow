import { useNavigation, Link } from "expo-router";
import React from "react";
import { View, Text, Image } from "react-native";
import { icons } from "@/constants";

const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-xl font-bold text-primary-500">Welcome</Text>
      <Link
        className="text-xl font-bold text-primary-500"
        href="/(auth)/sign-in"
      >
        Sign In
      </Link>
      <Link
        className="text-xl font-bold text-primary-500"
        href="/(auth)/sign-up"
      >
        Sign Up
      </Link>
      <Link className="text-xl font-bold text-primary-500" href="/">
        test
      </Link>
      <Link
        className="text-xl font-bold text-primary-500"
        href="../(discussion)/chatScreen"
      >
        chat
      </Link>
      <Image source={icons.email}></Image>
    </View>
  );
};

export default WelcomeScreen;
