import React, { useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput, TouchableOpacity } from "react-native";
import { login } from "@/services/auth.service";
import { Link, router } from "expo-router";
import { useAuthContext } from "@/context/AuthContext";
import { User } from "@/types/type";
import * as WebBrowser from "expo-web-browser";
import { GoogleSVG } from "@/assets/svg/icons";
import { ToastType, useToast } from "@/context/ToastContext";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { getUserById } from "@/services/user.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSocket } from "@/services/socket";


WebBrowser.maybeCompleteAuthSession();

const SignInScreen = () => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { setUser } = useAuthContext();
  const { showToast } = useToast();

  const emailDomains = [
    "gmail.com",
    "epfedu.fr",
    "outlook.com",
    "hotmail.com",
    "aol.com",
    "hotmail.fr",
    "msn.com",
    "yahoo.fr",
    "wanadoo.fr",
    "orange.fr",
    "yandex.ru",
    "mail.ru",
    "free.fr",
    "ymail.com",
    "sfr.fr",
    "laposte.net",
  ];
  const suggestEmailDomains = (email: string) => {
    const [usernamePart, domainPart] = email.split("@");

    if (!domainPart) return [];

    return emailDomains
      .filter((domain) => domain.startsWith(domainPart)) //filtrage en fonction de l'input
      .map((domain) => `${usernamePart}@${domain}`); //creation des suggestions des adresses mail full
  };

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      showToast("Veuillez remplir tous les champs.", ToastType.ERROR);
      return;
    }

    setLoading(true);
    try {
      const user = await login(form);
      if (user as User) {
        setUser(user.data);
        const socket = await createSocket();

        if (!socket) {
          console.error("❌ Socket non initialisé");
          showToast("Connexion échouée, tokens manquants", ToastType.ERROR);
          return;
        }

        socket.on("connect", () => {
          console.log("✅ Socket maintenant connecté");
          socket.emit("register", user.data.username);
        });

        handleRedirect();
        showToast("Connexion réussie avec succès", ToastType.SUCCESS);
      }
    } catch (error: any) {
      console.error(error);

      showToast(error.message || "Une erreur s'est produite", ToastType.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleRedirect = () => {
    router.dismissAll();
    router.replace("/(auth)/home");
  };

  // Fonction pour basculer la visibilité du mot de passe
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePressButtonAsync = async () => {
    setGoogleLoading(true);
    try {
      const callbackUrl = Linking.createURL("(auth)/home", {
        scheme: "meow",
      }); // a changer { scheme: "kikipaul.meow" } en prod

      console.log(callbackUrl);

      const result = await WebBrowser.openAuthSessionAsync(
        `https://meowback-production.up.railway.app/authRoutes/google?scheme=${callbackUrl}`,
        callbackUrl,
        {
          showInRecents: true,
          createTask: true,
          dismissButtonStyle: "cancel",
          windowName: "MeowMeowMeow",
        }
      );

      if (result.type === "success") {
        console.log(result);
        const url = new URL(result.url);
        const accessToken = url.searchParams.get("accessToken");
        const refreshToken = url.searchParams.get("refreshToken");
        const userId = url.searchParams.get("user_id");

        if (accessToken && refreshToken && userId) {
          await AsyncStorage.setItem("accessToken", accessToken!);
          await AsyncStorage.setItem("refreshToken", refreshToken!);
          const user = await getUserById(userId!);
          console.log(user);
          if (user as User) {
            setUser(user.data);
          }
        }
        handleRedirect();
      } else {
        showToast("Erreur pendant la connexion avec Google", ToastType.ERROR);
      }
    } catch (error: any) {
      console.log("error", error);
      showToast("Erreur lors de l'authentification", ToastType.ERROR);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 justify-center items-center px-5 bg-fushia-50 dark:bg-gray-900">
        <Text className="text-3xl font-bold mb-5 text-black dark:text-white">
          MEOW🐱
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
              handleChange("email", value.toLocaleLowerCase());
              setSuggestions(suggestEmailDomains(value)); //it'll generate suggestions
            }}
            onFocus={() => setSuggestions(suggestEmailDomains(form.email))}
            keyboardType="email-address"
            autoCapitalize="none"
            className="w-full border rounded-lg p-3 mb-1 border-gray-300 bg-white text-black dark:border-gray-500 dark:bg-slate-600 dark:text-white"
          />

          {suggestions.length > 0 && (
            <View className="absolute top-full w-full bg-white shadow-md rounded-lg p-2 z-50">
              {suggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    handleChange("email", suggestion.toLocaleLowerCase()); // Autofill email when clicked
                    setSuggestions([]);
                  }}
                  className="p-2 border-b border-gray-200"
                >
                  <Text className="text-black text-center">{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View className="w-full relative mb-4">
          <TextInput
            placeholder="Mot de passe"
            value={form.password}
            onChangeText={(value) => handleChange("password", value)}
            secureTextEntry={!showPassword} // Utilise l'état pour déterminer si le mot de passe est visible
            className="w-full border rounded-lg p-3 border-gray-300 bg-white text-black dark:border-gray-500 dark:bg-slate-600 dark:text-white pr-10"
          />
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={24}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        <View className="flex-row pb-3 justify-between w-full ">
          <Link
            className="font-Jakarta text-lg text-blue-500"
            href="/(auth)/sign-up"
          >
            Pas de compte ?
          </Link>
          <Link
            className="font-Jakarta text-lg text-blue-500"
            href="/(auth)/forgot-password"
          >
            Mot de passe oublié ?
          </Link>
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          className="w-full bg-black py-3 rounded-lg items-center dark:bg-indigo-900"
          disabled={loading}
        >
          {loading ? (
            <View className="flex-row items-center space-x-2">
              <Text className="text-white text-base font-bold">
                Connexion...
              </Text>
              <ActivityIndicator color="#fff" />
            </View>
          ) : (
            <View className="flex-row items-center space-x-2">
              <Text className="text-white text-base font-bold">Continuer</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text className="my-5 text-gray-600 dark:text-gray-300">ou</Text>

        {googleLoading ? (
          <View className="bg-gray-200 px-6 py-3 rounded-lg dark:bg-blue-600 mb-1 w-full flex-row items-center justify-center ">
            <ActivityIndicator color="#fff" />
            <Text className="text-base font-bold ml-3 text-black  dark:text-white">
              Connexion ...
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            className="bg-gray-200 px-6 py-3 rounded-lg dark:bg-blue-600 mb-1 w-full flex-row items-center justify-center "
            onPress={() => {
              handlePressButtonAsync();
            }}
          >
            <GoogleSVG size={16} />
            <Text className="text-base font-bold ml-3 text-black  dark:text-white">
              Continuer avec Google
            </Text>
          </TouchableOpacity>
        )}

        <Text className="text-xs text-center mt-6 text-gray-600 dark:text-gray-300">
          En cliquant sur continuer, vous acceptez la politique privée et les
          conditions générales.
        </Text>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default SignInScreen;
