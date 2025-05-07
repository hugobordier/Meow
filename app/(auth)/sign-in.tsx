import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
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
import {
  AuthRequestConfig,
  DiscoveryDocument,
  makeRedirectUri,
  useAuthRequest,
} from "expo-auth-session";
import { BASE_URL } from "@/utils/constants";

WebBrowser.maybeCompleteAuthSession();

const SignInScreen = () => {
  const config: AuthRequestConfig = {
    clientId: "google",
    scopes: ["openid", "profile", "email"],
    redirectUri: makeRedirectUri(),
  };

  console.log(config.redirectUri);

  const discovery: DiscoveryDocument = {
    authorizationEndpoint: `${BASE_URL}/api/authorize`,
    tokenEndpoint: `${BASE_URL}/api/token`,
  };
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [request, response, promptAsync] = useAuthRequest(config, discovery);
  const [isLoading, setIsLoading] = useState(false);
  const isWeb = Platform.OS === "web";

  useEffect(() => {
    handleResponse();
  }, [response]);

  async function handleResponse() {
    if (response?.type === "success") {
      try {
        setIsLoading(true);
        const { code } = response.params;

        const formData = new FormData();
        formData.append("code", code);

        if (isWeb) {
          formData.append("platform", "web");
        }

        if (request?.codeVerifier) {
          formData.append("code_verifier", request.codeVerifier);
        } else {
          console.warn("No code verifier found in request object");
        }
        const userResponse = await fetch(`${BASE_URL}/api/google`, {
          method: "POST",
          body: formData,
        });

        if (!userResponse.ok) {
          throw new Error("Failed to fetch user info");
        }
        const userData = await userResponse.json();
        console.log(userData);
      } catch (e) {
        console.error("Error handling auth response:", e);
      } finally {
        setIsLoading(false);
      }
    } else if (response?.type === "cancel") {
      alert("Sign in cancelled");
    } else if (response?.type === "error") {
      console.log("lallalala eror");
    }
  }

  const signIn = async () => {
    console.log("signIn");
    try {
      if (!request) {
        console.log("No request");
        return;
      }

      await promptAsync();
    } catch (e) {
      console.log(e);
    }
  };

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
      }
      handleRedirect();
      showToast("Connexion réussie avec succès", ToastType.SUCCESS);
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

        <TouchableOpacity
          className="bg-gray-200 px-6 py-3 rounded-lg dark:bg-blue-600 mb-1 w-full flex-row items-center justify-center "
          onPress={() => {
            console.log("Tentative de connexion avec Google");
            signIn();
          }}
        >
          <GoogleSVG size={16} />
          <Text className="text-base font-bold ml-3 text-black  dark:text-white">
            Continuer avec Google
          </Text>
        </TouchableOpacity>

        <Text className="text-xs text-center mt-6 text-gray-600 dark:text-gray-300">
          En cliquant sur continuer, vous acceptez la politique privée et les
          conditions générales.
        </Text>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default SignInScreen;
