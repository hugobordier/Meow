import React, { useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  View,
  useColorScheme,
  StatusBar,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
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
import { api } from "@/services/api";

WebBrowser.maybeCompleteAuthSession();

const SignInScreen = () => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { setUser,setPetsitter } = useAuthContext();
  const { showToast } = useToast();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

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
      .filter((domain) => domain.startsWith(domainPart))
      .map((domain) => `${usernamePart}@${domain}`);
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

        try {
          const petsitterResponse = await api.get(`/Petsitter/user/${user.data.id}`);
          if (petsitterResponse.data) {
            setPetsitter(petsitterResponse.data);
            console.log("✅ Profil petsitter trouvé");
          }
        } catch (petsitterError: any) {
          console.log(" Pas de profil petsitter pour cet utilisateur");
          setPetsitter(null);
        }


        socket.on("connect", () => {
          console.log("✅ Socket maintenant connecté");
          socket.emit("register", user.data.username);
        });

        handleRedirect(user.data);
        showToast("Connexion réussie avec succès", ToastType.SUCCESS);
      }
    } catch (error: any) {
      console.error(error);
      showToast(error.message || "Une erreur s'est produite", ToastType.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleRedirect = (user: User) => {
    router.dismissAll();
    const userCreationDate = new Date(user.createdAt);
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    if (userCreationDate < oneDayAgo) {
      console.log("on entre dans le if donc le user est plus vieux que 1 jour");
      router.replace("/(home)/(main)/home");
    } else {
      router.replace("/(auth)/home");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePressButtonAsync = async () => {
    setGoogleLoading(true);
    console.log("on entre dans le button google");
    try {
      const callbackUrl = Linking.createURL("(auth)/home", {
        scheme: "meow",
      });
      console.log("callback : ", callbackUrl);

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
          try {
            const petsitterResponse = await api.get(`/Petsitter/user/${user.data.id}`);
            if (petsitterResponse.data) {
              setPetsitter(petsitterResponse.data);
              console.log("✅ Profil petsitter trouvé");
            }
          } catch (petsitterError: any) {
            console.log(" Pas de profil petsitter pour cet utilisateur");
            setPetsitter(null);
          }
          console.log("user.data", user.data);
          handleRedirect(user.data);
        }
      } else {
        showToast("Erreur pendant la connexion avec Google", ToastType.ERROR);
      }
    } catch (error: any) {
      console.log("error", error);
      showToast("Erreur lors de l'authentification", ToastType.ERROR);
    } finally {
      setGoogleLoading(false);
    }
  };

  // Styles dynamiques basés sur le thème
  const cardStyle = {
    backgroundColor: isDark
      ? "rgba(30, 30, 60, 0.8)"
      : "rgba(255, 255, 255, 0.9)",
    borderColor: isDark ? "rgba(99, 102, 241, 0.3)" : "rgba(0, 0, 0, 0.1)",
  };

  const inputStyle = {
    backgroundColor: isDark
      ? "rgba(45, 45, 80, 0.6)"
      : "rgba(255, 255, 255, 0.8)",
    borderColor: isDark
      ? "rgba(99, 102, 241, 0.4)"
      : "rgba(156, 163, 175, 0.5)",
    color: isDark ? "#ffffff" : "#000000",
  };

  const textStyle = {
    color: isDark ? "#ffffff" : "#000000",
  };

  const placeholderColor = isDark
    ? "rgba(156, 163, 175, 0.8)"
    : "rgba(107, 114, 128, 0.8)";

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      {/* Gradient Background couvre tout l'écran */}
      <LinearGradient
        colors={
          isDark
            ? ["#0f0f23", "#1e1e3f", "#2d2d5a", "#3c3c75"]
            : ["#f8fafc", "#e2e8f0", "#cbd5e1", "#94a3b8"]
        }
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          backgroundColor="transparent"
          translucent
        />

        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 20,
            }}
            showsVerticalScrollIndicator={false}
          >
            {/* Card Container avec effet glassmorphism */}
            <View
              style={{
                ...cardStyle,
                borderRadius: 20,
                borderWidth: 1,
                padding: 20,
                width: "100%",
                maxWidth: 400,
                shadowColor: isDark ? "#6366f1" : "#000",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: isDark ? 0.3 : 0.1,
                shadowRadius: 16,
                elevation: 8,
              }}
            >
              {/* Header */}
              <View style={{ alignItems: "center", marginBottom: 24 }}>
                <Text
                  style={{
                    fontSize: 38,
                    fontWeight: "bold",
                    marginBottom: 8,
                    ...textStyle,
                  }}
                >
                  MEOW🐱
                </Text>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "600",
                    marginBottom: 6,
                    ...textStyle,
                  }}
                >
                  Se connecter
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    opacity: 0.7,
                    textAlign: "center",
                    ...textStyle,
                  }}
                >
                  Entrez votre email pour vous connecter à votre compte
                </Text>
              </View>

              {/* Email Input */}
              <View
                style={{
                  width: "100%",
                  marginBottom: 12,
                  position: "relative",
                }}
              >
                <TextInput
                  placeholder="email@domain.com"
                  value={form.email}
                  onChangeText={(value) => {
                    handleChange("email", value.toLocaleLowerCase());
                    setSuggestions(suggestEmailDomains(value));
                  }}
                  onFocus={() =>
                    setSuggestions(suggestEmailDomains(form.email))
                  }
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={{
                    ...inputStyle,
                    borderWidth: 1,
                    borderRadius: 10,
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    fontSize: 15,
                    width: "100%",
                  }}
                  placeholderTextColor={placeholderColor}
                />

                {suggestions.length > 0 && (
                  <View
                    style={{
                      position: "absolute",
                      top: "100%",
                      width: "100%",
                      backgroundColor: isDark
                        ? "rgba(30, 30, 60, 0.95)"
                        : "rgba(255, 255, 255, 0.95)",
                      borderRadius: 10,
                      padding: 6,
                      zIndex: 50,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.1,
                      shadowRadius: 8,
                      elevation: 5,
                    }}
                  >
                    {suggestions.map((suggestion, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          handleChange("email", suggestion.toLocaleLowerCase());
                          setSuggestions([]);
                        }}
                        style={{
                          padding: 6,
                          borderBottomWidth:
                            index < suggestions.length - 1 ? 1 : 0,
                          borderBottomColor: isDark
                            ? "rgba(99, 102, 241, 0.2)"
                            : "rgba(229, 231, 235, 0.5)",
                        }}
                      >
                        <Text
                          style={{
                            ...textStyle,
                            textAlign: "center",
                            fontSize: 14,
                          }}
                        >
                          {suggestion}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Password Input */}
              <View
                style={{
                  width: "100%",
                  position: "relative",
                  marginBottom: 16,
                }}
              >
                <TextInput
                  placeholder="Mot de passe"
                  value={form.password}
                  onChangeText={(value) => handleChange("password", value)}
                  secureTextEntry={!showPassword}
                  style={{
                    ...inputStyle,
                    borderWidth: 1,
                    borderRadius: 10,
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    paddingRight: 40,
                    fontSize: 15,
                    width: "100%",
                  }}
                  placeholderTextColor={placeholderColor}
                />
                <TouchableOpacity
                  onPress={togglePasswordVisibility}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: [{ translateY: -12 }],
                  }}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color={
                      isDark
                        ? "rgba(156, 163, 175, 0.8)"
                        : "rgba(107, 114, 128, 0.8)"
                    }
                  />
                </TouchableOpacity>
              </View>

              {/* Links */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                  marginBottom: 20,
                }}
              >
                <Link href="/(auth)/sign-up" asChild>
                  <TouchableOpacity>
                    <Text
                      style={{
                        fontSize: 14,
                        color: isDark ? "#818cf8" : "#3b82f6",
                        fontWeight: "500",
                      }}
                    >
                      Pas de compte ?
                    </Text>
                  </TouchableOpacity>
                </Link>
                <Link href="/(auth)/forgot-password" asChild>
                  <TouchableOpacity>
                    <Text
                      style={{
                        fontSize: 14,
                        color: isDark ? "#818cf8" : "#3b82f6",
                        fontWeight: "500",
                      }}
                    >
                      Mot de passe oublié ?
                    </Text>
                  </TouchableOpacity>
                </Link>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                onPress={handleLogin}
                style={{
                  backgroundColor: isDark ? "#6366f1" : "#1f2937",
                  paddingVertical: 14,
                  borderRadius: 10,
                  alignItems: "center",
                  marginBottom: 16,
                  width: "100%",
                  shadowColor: isDark ? "#6366f1" : "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 4,
                }}
                disabled={loading}
              >
                {loading ? (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{
                        color: "#ffffff",
                        fontSize: 15,
                        fontWeight: "600",
                        marginRight: 8,
                      }}
                    >
                      Connexion...
                    </Text>
                    <ActivityIndicator color="#fff" size="small" />
                  </View>
                ) : (
                  <Text
                    style={{
                      color: "#ffffff",
                      fontSize: 15,
                      fontWeight: "600",
                    }}
                  >
                    Continuer
                  </Text>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 12,
                  width: "75%",
                  alignSelf: "center",
                }}
              >
                <View
                  style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: isDark
                      ? "rgba(99, 102, 241, 0.3)"
                      : "rgba(156, 163, 175, 0.5)",
                  }}
                />
                <Text
                  style={{
                    marginHorizontal: 8,
                    ...textStyle,
                    opacity: 0.7,
                    fontSize: 14,
                  }}
                >
                  ou
                </Text>
                <View
                  style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: isDark
                      ? "rgba(99, 102, 241, 0.3)"
                      : "rgba(156, 163, 175, 0.5)",
                  }}
                />
              </View>

              {/* Google Button */}
              {googleLoading ? (
                <View
                  style={{
                    backgroundColor: isDark
                      ? "rgba(99, 102, 241, 0.8)"
                      : "rgba(229, 231, 235, 0.8)",
                    paddingVertical: 14,
                    borderRadius: 10,
                    marginBottom: 12,
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ActivityIndicator
                    color={isDark ? "#ffffff" : "#000000"}
                    size="small"
                  />
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "600",
                      marginLeft: 10,
                      color: isDark ? "#ffffff" : "#000000",
                    }}
                  >
                    Connexion ...
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={{
                    backgroundColor: isDark
                      ? "rgba(99, 102, 241, 0.8)"
                      : "rgba(229, 231, 235, 0.8)",
                    paddingVertical: 14,
                    borderRadius: 10,
                    marginBottom: 12,
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: isDark
                      ? "rgba(99, 102, 241, 0.4)"
                      : "rgba(156, 163, 175, 0.3)",
                  }}
                  onPress={handlePressButtonAsync}
                >
                  <GoogleSVG size={16} />
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "600",
                      marginLeft: 10,
                      color: isDark ? "#ffffff" : "#000000",
                    }}
                  >
                    Continuer avec Google
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Terms */}
            <Text
              style={{
                fontSize: 11,
                textAlign: "center",
                marginTop: 16,
                opacity: 0.7,
                paddingHorizontal: 12,
                ...textStyle,
              }}
            >
              En cliquant sur continuer, vous acceptez la politique privée et
              les conditions générales.
            </Text>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default SignInScreen;
