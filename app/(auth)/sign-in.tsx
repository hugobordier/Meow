import { Link } from "expo-router";
import React, { useState } from "react";
import ConfettiCannon from "react-native-confetti-cannon";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { icons, images } from "@/constants";
import loader from "@/assets/svg/loader";
import { api } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignInScreen = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    console.log(form);
    try {
      const { data } = await api.post("authRoutes/login", form, {
        headers: { "Content-Type": "application/json" },
      });
      console.log(data);
      if (data.accessToken) {
        await AsyncStorage.setItem("accessToken", data.accessToken);
      }

      Alert.alert("Success", "You are logged in!");
      // Redirige ou stocke le token ici
    } catch (error: any) {
      console.error(error.message);
      Alert.alert("Error", error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const test = async () => {
    try {
      const { data } = await api.get("authRoutes/test", {
        headers: { "Content-Type": "application/json" },
      });
      console.log(data);
    } catch (error: any) {
      console.error(error.message);
      Alert.alert("Error", error.response?.data?.message || "Login failed");
    }
  };

  return (
    <ScrollView className="flex-1 bg-white h-full dark:bg-gray-700 ">
      <View className="flex-1 bg-white dark:bg-gray-700">
        <View className="relative w-full h-64">
          <Text className="text-4xl text-black dark:text-white font-JakartaSemiBold absolute bottom-5 left-1/3">
            Welcome 👋
          </Text>
        </View>

        <View className="p-5">
          <View className="my-2 w-full">
            <Text className="text-lg text-black font-JakartaSemiBold mb-3 dark:text-white">
              Email
            </Text>
            <View className="flex flex-row items-center bg-neutral-100 rounded-full border border-neutral-100">
              <Image source={icons.email} className="w-5 h-5 ml-4" />
              <TextInput
                placeholder="Enter email"
                textContentType="emailAddress"
                placeholderTextColor="rgb(100,100,100)"
                value={form.email}
                onChangeText={(value) => setForm({ ...form, email: value })}
                className="flex-1 p-4 text-[15px] font-JakartaSemiBold text-left rounded-full"
              />
            </View>
          </View>

          <View className="my-2 w-full">
            <Text className="text-lg text-black font-JakartaSemiBold mb-3">
              Password
            </Text>
            <View className="flex flex-row items-center bg-neutral-100 rounded-full border border-neutral-100">
              <Image source={icons.lock} className="w-5 h-5 ml-4" />
              <TextInput
                placeholder="Enter password"
                secureTextEntry
                textContentType="password"
                placeholderTextColor="rgb(100,100,100)"
                value={form.password}
                onChangeText={(value) => setForm({ ...form, password: value })}
                className="flex-1 p-4 text-[15px] font-JakartaSemiBold text-left rounded-full"
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            className="mt-6 bg-primary-500 py-3 rounded-full items-center"
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white font-bold font-JakartaSemiBold">
                Sign In
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={test}
            disabled={loading}
            className="mt-6 bg-primary-500 py-3 rounded-full items-center"
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white font-bold font-JakartaSemiBold">
                test
              </Text>
            )}
          </TouchableOpacity>

          {loading && (
            <View className="flex items-center justify-center mt-4">
              <Image
                source={{
                  uri: `data:image/svg+xml;base64,${loader}`,
                }}
                className="w-10 h-10"
              />
            </View>
          )}

          <Link
            href="/sign-up"
            className="text-lg text-center text-general-200 mt-10"
          >
            Don't have an account?{" "}
            <Text className="text-primary-500">Sign Up</Text>
          </Link>
        </View>
      </View>
      <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} />
    </ScrollView>
  );
};

export default SignInScreen;
