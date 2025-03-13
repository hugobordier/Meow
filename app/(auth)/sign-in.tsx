import { Link } from "expo-router";
import React, { useState } from "react";
import { Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignInScreen = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("authRoutes/login", form, {
        headers: { "Content-Type": "application/json" },
      });

      if (data.accessToken) {
        await AsyncStorage.setItem("accessToken", data.accessToken);
        Alert.alert("Succès", "Connexion réussie !");
      }
    } catch (error: any) {
      console.error(error.message);
      Alert.alert(
        "Erreur",
        error.response?.data?.message || "Échec de la connexion"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center px-5 bg-white dark:bg-black">
      <Text className="text-3xl font-bold mb-5 text-black dark:text-white">
        MEOW
      </Text>

      <Text className="text-lg font-semibold mb-2 text-black dark:text-gray-300">
        Se connecter
      </Text>
      <Text className="text-sm mb-6 text-center text-gray-600 dark:text-gray-400">
        Entrez votre email pour vous connecter à votre compte
      </Text>

      <TextInput
        placeholder="email@domain.com"
        value={form.email}
        onChangeText={(value) => handleChange("email", value)}
        keyboardType="email-address"
        autoCapitalize="none"
        className="w-full border rounded-lg p-3 mb-4 border-gray-300 bg-white text-black dark:border-gray-600 dark:bg-gray-800 dark:text-white"
      />

      <TextInput
        placeholder="Mot de passe"
        value={form.password}
        onChangeText={(value) => handleChange("password", value)}
        secureTextEntry
        className="w-full border rounded-lg p-3 mb-4 border-gray-300 bg-white text-black dark:border-gray-600 dark:bg-gray-800 dark:text-white"
      />

      <TouchableOpacity
        onPress={handleLogin}
        className="w-full bg-black py-4 rounded-lg items-center"
        disabled={loading}
      >
        <Text className="text-white text-base font-bold">
          {loading ? "Connexion..." : "Continuer"}
        </Text>
      </TouchableOpacity>

      <Text className="my-5 text-gray-600 dark:text-gray-400">ou</Text>

      <TouchableOpacity className="w-full flex-row items-center py-4 border rounded-lg mb-3 border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800">
        <Text className="text-base ml-3 text-black dark:text-white">
          Continuer avec Google
        </Text>
      </TouchableOpacity>

      <Text className="text-xs text-center mt-6 text-gray-600 dark:text-gray-400">
        En cliquant sur continuer, vous acceptez la politique privée et les
        conditions générales.
      </Text>
    </SafeAreaView>
  );
};

export default SignInScreen;
