import { Link } from "expo-router";
import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

const SignUpScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-100 px-6 justify-center">
      <View className="bg-white p-6 rounded-2xl shadow-lg">
        <Text className="text-2xl font-bold text-center text-gray-900">
          Sign Up
        </Text>

        <TextInput
          placeholder="Email"
          className="border border-gray-300 rounded-md p-3 mt-4"
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          className="border border-gray-300 rounded-md p-3 mt-4"
        />
        <TextInput
          placeholder="Confirm Password"
          secureTextEntry
          className="border border-gray-300 rounded-md p-3 mt-4"
        />

        <TouchableOpacity className="bg-blue-600 mt-6 p-3 rounded-md">
          <Text className="text-white text-center font-semibold">Sign Up</Text>
        </TouchableOpacity>

        <Text className="text-gray-500 text-center mt-4">
          Already have an account?{" "}
          <Link href="/(auth)/sign-in" className="text-blue-600 font-semibold">
            Sign In
          </Link>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default SignUpScreen;
