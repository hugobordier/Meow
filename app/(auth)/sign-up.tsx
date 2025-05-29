import { register } from "@/services/auth.service";
import { User } from "@/types/user";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  useColorScheme,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { AntDesign } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { ToastType, useToast } from "@/context/ToastContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserById } from "@/services/user.service";
import { GoogleSVG } from "@/assets/svg/icons";
import { useAuthContext } from "@/context/AuthContext";

export default function SignUpScreen() {
  const { showToast } = useToast();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key in keyof User]?: string }>({});
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [user, setUserpage] = useState<User>({
    username: "",
    lastName: "",
    firstName: "",
    email: "",
    password: "",
    age: 0,
    birthDate: "",
    phoneNumber: "",
  });
  const [googleLoading, setGoogleLoading] = useState(false);

  const { setUser } = useAuthContext();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleChange = (name: keyof User, value: string) => {
    setUserpage((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDateConfirm = (date: Date) => {
    const currentDate = new Date();
    const birthDate = new Date(date);
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDifference = currentDate.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    setUserpage((prevState) => ({
      ...prevState,
      birthDate: date.toISOString().split("T")[0],
      age,
    }));
    setDatePickerVisibility(false);
  };

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
      .filter((domain) => domain.startsWith(domainPart))
      .map((domain) => `${usernamePart}@${domain}`.toLocaleLowerCase());
  };

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
  const phoneRegex = /^0\d{9}$/;

  const validateFields = () => {
    let newErrors: { [key in keyof User]?: string } = {};
    if (!user.username.trim()) newErrors.username = "Nom d'utilisateur requis";
    if (!user.lastName.trim()) newErrors.lastName = "Nom de famille requis";
    if (!user.firstName.trim()) newErrors.firstName = "Prénom requis";
    if (!user.email.trim() || !emailRegex.test(user.email))
      newErrors.email = "Email invalide";
    if (!user.password.trim()) {
      newErrors.password = "Mot de passe requis";
    } else if (!passwordRegex.test(user.password)) {
      newErrors.password =
        "Le mot de passe doit contenir au minimum :\n• 1 lettre minuscule\n• 1 lettre majuscule\n• 1 chiffre\n• 1 caractère spécial\n• 6 caractères minimum";
    }
    if (!user.birthDate) newErrors.birthDate = "Date de naissance requise";
    if (!user.phoneNumber.trim()) {
      newErrors.phoneNumber = "Numéro de téléphone requis";
    } else if (!phoneRegex.test(user.phoneNumber)) {
      newErrors.phoneNumber = "Numéro de téléphone invalide";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!validateFields()) {
      setLoading(false);
      return;
    }
    try {
      //@ts-ignore
      await register(user);
      router.push("../(auth)/sign-in");
    } catch (error) {
      console.log(error);
      setSubmitError("Erreur lors de l'inscription. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleRedirect = () => {
    router.dismissAll();
    router.replace("/(auth)/home");
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
        }
        handleRedirect();
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
            style={{ padding: 12 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 10 }}
          >
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                padding: 8,
              }}
            >
              {/* Card Container avec effet glassmorphism */}
              <View
                style={{
                  ...cardStyle,
                  borderRadius: 20,
                  borderWidth: 1,
                  padding: 16,
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
                <View style={{ alignItems: "center", marginBottom: 20 }}>
                  <Text
                    style={{
                      fontSize: 38,
                      fontWeight: "bold",
                      marginBottom: 6,
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
                    Créer un compte
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      opacity: 0.7,
                      textAlign: "center",
                      ...textStyle,
                    }}
                  >
                    Entrez vos informations pour créer un compte
                  </Text>
                </View>

                {/* Form Fields */}
                <View style={{ width: "100%", marginBottom: 8 }}>
                  <TextInput
                    style={{
                      ...inputStyle,
                      borderWidth: 1,
                      borderRadius: 10,
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      fontSize: 15,
                      width: "100%",
                    }}
                    placeholder="Nom d'utilisateur"
                    placeholderTextColor={placeholderColor}
                    value={user.username}
                    onChangeText={(value) => handleChange("username", value)}
                  />
                  {errors.username && (
                    <Text
                      style={{
                        color: "#ef4444",
                        textAlign: "center",
                        marginTop: 2,
                        fontSize: 12,
                      }}
                    >
                      {errors.username}
                    </Text>
                  )}
                </View>

                <View style={{ width: "100%", marginBottom: 8 }}>
                  <TextInput
                    style={{
                      ...inputStyle,
                      borderWidth: 1,
                      borderRadius: 10,
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      fontSize: 15,
                      width: "100%",
                    }}
                    placeholder="Nom de famille"
                    placeholderTextColor={placeholderColor}
                    value={user.lastName}
                    onChangeText={(value) => handleChange("lastName", value)}
                  />
                  {errors.lastName && (
                    <Text
                      style={{
                        color: "#ef4444",
                        textAlign: "center",
                        marginTop: 2,
                        fontSize: 12,
                      }}
                    >
                      {errors.lastName}
                    </Text>
                  )}
                </View>

                <View style={{ width: "100%", marginBottom: 8 }}>
                  <TextInput
                    style={{
                      ...inputStyle,
                      borderWidth: 1,
                      borderRadius: 10,
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      fontSize: 15,
                      width: "100%",
                    }}
                    placeholder="Prénom"
                    placeholderTextColor={placeholderColor}
                    value={user.firstName}
                    onChangeText={(value) => handleChange("firstName", value)}
                  />
                  {errors.firstName && (
                    <Text
                      style={{
                        color: "#ef4444",
                        textAlign: "center",
                        marginTop: 2,
                        fontSize: 12,
                      }}
                    >
                      {errors.firstName}
                    </Text>
                  )}
                </View>

                <View style={{ width: "100%", marginBottom: 8 }}>
                  <TextInput
                    style={{
                      ...inputStyle,
                      borderWidth: 1,
                      borderRadius: 10,
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      fontSize: 15,
                      width: "100%",
                    }}
                    placeholder="email@domain.com"
                    placeholderTextColor={placeholderColor}
                    value={user.email}
                    onChangeText={(value) => {
                      handleChange("email", value.toLowerCase());
                      setSuggestions(suggestEmailDomains(value));
                    }}
                    onFocus={() =>
                      setSuggestions(suggestEmailDomains(user.email))
                    }
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
                            handleChange("email", suggestion);
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

                  {errors.email && (
                    <Text
                      style={{
                        color: "#ef4444",
                        textAlign: "center",
                        marginTop: 2,
                        fontSize: 12,
                      }}
                    >
                      {errors.email}
                    </Text>
                  )}
                </View>

                <View style={{ width: "100%", marginBottom: 8 }}>
                  <TextInput
                    style={{
                      ...inputStyle,
                      borderWidth: 1,
                      borderRadius: 10,
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      fontSize: 15,
                      width: "100%",
                    }}
                    placeholder="Mot de passe"
                    placeholderTextColor={placeholderColor}
                    value={user.password}
                    secureTextEntry
                    onChangeText={(value) => handleChange("password", value)}
                  />
                  {errors.password && (
                    <Text
                      style={{
                        color: "#ef4444",
                        textAlign: "center",
                        marginTop: 2,
                        fontSize: 12,
                      }}
                    >
                      {errors.password}
                    </Text>
                  )}
                </View>

                <View style={{ width: "100%", marginBottom: 8 }}>
                  <TouchableOpacity
                    onPress={() => setDatePickerVisibility(true)}
                    style={{
                      ...inputStyle,
                      borderWidth: 1,
                      borderRadius: 10,
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      width: "100%",
                    }}
                  >
                    <Text
                      style={{
                        color: user.birthDate
                          ? isDark
                            ? "#ffffff"
                            : "#000000"
                          : placeholderColor,
                        fontSize: 15,
                      }}
                    >
                      {user.birthDate || "Sélectionner la date de naissance"}
                    </Text>
                  </TouchableOpacity>

                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleDateConfirm}
                    onCancel={() => setDatePickerVisibility(false)}
                  />

                  {errors.birthDate && (
                    <Text
                      style={{
                        color: "#ef4444",
                        textAlign: "center",
                        marginTop: 2,
                        fontSize: 12,
                      }}
                    >
                      {errors.birthDate}
                    </Text>
                  )}
                </View>

                <View style={{ width: "100%", marginBottom: 8 }}>
                  <TextInput
                    style={{
                      ...inputStyle,
                      borderWidth: 1,
                      borderRadius: 10,
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      fontSize: 15,
                      width: "100%",
                    }}
                    placeholder="Numéro de téléphone portable"
                    placeholderTextColor={placeholderColor}
                    value={user.phoneNumber}
                    onChangeText={(value) => handleChange("phoneNumber", value)}
                    keyboardType="numeric"
                  />
                  {errors.phoneNumber && (
                    <Text
                      style={{
                        color: "#ef4444",
                        textAlign: "center",
                        marginTop: 2,
                        fontSize: 12,
                      }}
                    >
                      {errors.phoneNumber}
                    </Text>
                  )}
                </View>

                {/* Password Requirements */}
                <View style={{ marginBottom: 16 }}>
                  <Text
                    style={{
                      ...textStyle,
                      opacity: 0.7,
                      fontSize: 12,
                      marginBottom: 2,
                    }}
                  >
                    Le mot de passe doit contenir au minimum:
                  </Text>
                  {[
                    "• 1 Lettre minuscule",
                    "• 1 Lettre majuscule",
                    "• 1 Chiffre",
                    "• 1 Caractère spécial",
                    "• 6 Caractères",
                  ].map((requirement, index) => (
                    <Text
                      key={index}
                      style={{
                        ...textStyle,
                        opacity: 0.7,
                        fontSize: 12,
                        marginBottom: 1,
                      }}
                    >
                      {requirement}
                    </Text>
                  ))}
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                  style={{
                    backgroundColor: isDark ? "#6366f1" : "#1f2937",
                    paddingHorizontal: 20,
                    paddingVertical: 14,
                    borderRadius: 10,
                    marginBottom: 12,
                    width: "100%",
                    shadowColor: isDark ? "#6366f1" : "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  <Text
                    style={{
                      color: "#ffffff",
                      textAlign: "center",
                      fontSize: 15,
                      fontWeight: "600",
                    }}
                  >
                    {loading ? "Chargement..." : "Continuer"}
                  </Text>
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
                      paddingHorizontal: 20,
                      paddingVertical: 14,
                      borderRadius: 10,
                      marginBottom: 12,
                      width: "100%",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ActivityIndicator color={isDark ? "#ffffff" : "#000000"} />
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
                      paddingHorizontal: 20,
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
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}
