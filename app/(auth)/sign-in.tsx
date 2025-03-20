import React, { useState } from "react";
import { Alert, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput, TouchableOpacity } from "react-native";
import { login } from "@/services/auth.service";
import { router } from "expo-router";
import { useAuthContext } from "@/context/AuthContext"; // Utilisation du contexte pour setUser
import { User } from "@/types/user";

const SignInScreen = () => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const { setUser } = useAuthContext();

  const emailDomains = ['gmail.com', 'epfedu.fr', 'yahoo.com', 'outlook.com', 'hotmail.com', 'aol.com', 'hotmail.fr', 'msn.com', 'yahoo.fr', 'wanadoo.fr', 'orange.fr', 'yandex.ru', 'mail.ru', 'free.fr', 'ymail.com', 'sfr.fr', 'laposte.net'];
  const suggestEmailDomains = (email: string) => {
    const [usernamePart, domainPart] = email.split('@');

    if (!domainPart) return [];

    return emailDomains
      .filter((domain) => domain.startsWith(domainPart)) //filtrage en fonction de l'input
      .map((domain) => `${usernamePart}@${domain}`); //creation des suggestions des adresses mail full
  }

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
      const user = await login(form);
      if (user as User) {
        setUser(user);
      }
      router.push("/(home)/home");
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
    <SafeAreaView className="flex-1 justify-center items-center px-5 bg-white dark:bg-gray-700">
      <Text className="text-3xl font-bold mb-5 text-black dark:text-white">
        MEOW
      </Text>

      <Text className="text-lg font-semibold mb-2 text-black dark:text-gray-300">
        Se connecter
      </Text>
      <Text className="text-sm mb-6 text-center text-gray-600 dark:text-gray-400">
        Entrez votre email pour vous connecter à votre compte
      </Text>

      <View className="w-full mb-3 relative">
        <TextInput
          placeholder="email@domain.com"
          value={form.email}
          onChangeText={(value) => {
            handleChange("email", value)
            setSuggestions(suggestEmailDomains(value)); //it'll generate suggestions
          }}
          onFocus={() => setSuggestions(suggestEmailDomains(form.email))}
          keyboardType="email-address"
          autoCapitalize="none"
          className="w-full border rounded-lg px-4 py-2 bg-white text-black dark:border-gray-500 dark:bg-slate-600 dark:text-white mb-0"
        />

        {suggestions.length > 0 && (
          <View className="absolute top-full w-full bg-white shadow-md rounded-lg p-2 z-50">
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity key={index} onPress={() => {
                handleChange("email", suggestion); // Autofill email when clicked
                setSuggestions([]);
              }}
                className="p-2 border-b border-gray-200">
                <Text className="text-black text-center">{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <TextInput
        placeholder="Mot de passe"
        value={form.password}
        onChangeText={(value) => handleChange("password", value)}
        secureTextEntry
        className="w-full border rounded-lg p-3 mb-4 border-gray-300 bg-white text-black dark:border-gray-500 dark:bg-slate-600 dark:text-white"
      />

      <TouchableOpacity
        onPress={handleLogin}
        className="w-full bg-black py-4 rounded-lg items-center dark:bg-indigo-900"
        disabled={loading}
      >
        <Text className="text-white text-base font-bold">
          {loading ? "Connexion..." : "Continuer"}
        </Text>
      </TouchableOpacity>

      <Text className="my-5 text-gray-600 dark:text-gray-300">ou</Text>

      <TouchableOpacity 
        className="w-full flex-row items-center py-4 border rounded-lg mb-3 border-gray-300 bg-white dark:border-gray-500 dark:bg-slate-600"
        onPress={() => {
          console.log("Tentative de connexion avec Google");
        }}
      >
        <Text className="text-base ml-3 text-black dark:text-white">
          Continuer avec Google
        </Text>
      </TouchableOpacity>

      <Text className="text-xs text-center mt-6 text-gray-600 dark:text-gray-300">
        En cliquant sur continuer, vous acceptez la politique privée et les
        conditions générales.
      </Text>
    </SafeAreaView>
  );
};

export default SignInScreen;
