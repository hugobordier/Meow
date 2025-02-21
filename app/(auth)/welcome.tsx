import { useNavigation, Link } from "expo-router";
import React from "react";
import { View, Text, Button } from "react-native";

const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-xl font-bold text-red-50">Welcome</Text>
      <Link className="text-xl font-bold text-red-50" href="/(auth)/sign-in">
        Sign In
      </Link>
      <Link className="text-xl font-bold text-red-50" href="/(auth)/sign-up">
        Sign Up
      </Link>
      <Link className="text-xl font-bold text-red-50" href="/">
        test
      </Link>
    </View>
  );
};

export default WelcomeScreen;
