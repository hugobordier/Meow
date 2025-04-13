import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput, TouchableOpacity } from "react-native";
import { login } from "@/services/auth.service";
import { Link, router } from "expo-router";
import { useAuthContext } from "@/context/AuthContext"; // Utilisation du contexte pour setUser
import { User } from "@/types/type";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { GoogleSVG } from "@/assets/svg/icons";
import { ToastType, useToast } from "@/context/ToastContext";

WebBrowser.maybeCompleteAuthSession();

//TODO cacher les infos, si vous regarez ça depuis un comit précedent, vous etes vilain >:(
const iosClientId =
  "984005830165-9n5uacij1cho2vg1mn3fqvs2ti97v9e4.apps.googleusercontent.com";
const androidClientId =
  "984005830165-6qbciblgiaeeq73jhgvt2nadmmkvf2ht.apps.googleusercontent.com";
const webClientId =
  "984005830165-9oqh54f5rceb0rg7ipm74niuduv3lbpd.apps.googleusercontent.com";

const SignInScreen = () => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const { setUser } = useAuthContext();
  const { showToast } = useToast();

  const emailDomains = [
    "gmail.com",
    "epfedu.fr",
    "yahoo.com",
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

  const config = {
    webClientId,
    iosClientId,
    androidClientId,
  };

  const [request, response, promptAsync] = Google.useAuthRequest(config);

  const getUserProfile = async (token: any) => {
    if (!token) return;
    try {
      const response = await fetch("https://www.googleapi.com/userinfo/v2/me", {
        //TODO url probablement mauvais, copié d'un tuto, à verifier/changer
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = await response.json();
    } catch (error) {
      console.log(error);
    }
  };

  const handleToken = () => {
    if (response?.type === "success") {
      const { authentication } = response;
      const token = authentication?.accessToken;
      getUserProfile(token);
    }
  };

  useEffect(() => {
    //native function of react
    handleToken();
  }, [response]);

  const handleRedirect = () => {
    router.dismissAll();
    router.replace("/(auth)/home");
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center px-5 bg-white dark:bg-gray-700">
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

      <TextInput
        placeholder="Mot de passe"
        value={form.password}
        onChangeText={(value) => handleChange("password", value)}
        secureTextEntry
        className="w-full border rounded-lg p-3 mb-4 border-gray-300 bg-white text-black dark:border-gray-500 dark:bg-slate-600 dark:text-white"
      />
      <View className="flex-row pb-3 justify-between w-full ">
        <Link
          className="font-Jakarta text-lg text-blue-500"
          href="/(auth)/home"
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
        <Text className="text-white text-base font-bold">
          {loading ? "Connexion..." : "Continuer"}
        </Text>
      </TouchableOpacity>

      <Text className="my-5 text-gray-600 dark:text-gray-300">ou</Text>

      <TouchableOpacity
        className="bg-gray-200 px-6 py-3 rounded-lg dark:bg-blue-600 mb-1 w-full flex-row items-center justify-center "
        onPress={() => {
          console.log("Tentative de connexion avec Google");
          promptAsync();
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
  );
};

export default SignInScreen;
