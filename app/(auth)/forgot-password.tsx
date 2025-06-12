import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  useColorScheme,
  StatusBar,
} from "react-native";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { forgotPassword, verifyResetCode } from "@/services/auth.service";
import { formatTime } from "@/utils/formatTime";
import { useToast, ToastType } from "@/context/ToastContext";
import AnimatedButton from "@/components/AnimatedButton";
import React from "react";

export default function ForgotPassword() {
  const { showToast } = useToast();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resetCode, setResetCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(600);
  const [password, setPassword] = useState("");
  const [buttonVisible, setButtonVisible] = useState(false);

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      await forgotPassword(email.toLowerCase());
      setEmailSent(true);
      showToast("Email envoyé avec succès", ToastType.SUCCESS);
      
      // Démarrer un timer de 10 minutes pour réinitialiser emailSent
      setTimeout(() => {
        setEmailSent(false);
      }, 600000);

      const interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === 1) {
            clearInterval(interval);
            setEmailSent(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    } catch (err: any) {
      showToast(err, ToastType.ERROR);
      setError(err || "Une Erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    if (!password.trim()) {
      showToast("Mot de passe requis", ToastType.ERROR);
      return;
    } else if (!passwordRegex.test(password)) {
      showToast(
        "Le mot de passe doit contenir au minimum :\n• 1 lettre minuscule\n• 1 lettre majuscule\n• 1 chiffre\n• 1 caractère spécial\n• 6 caractères minimum",
        ToastType.ERROR
      );
      return;
    }
    setLoading(true);
    try {
      await verifyResetCode(email, resetCode, password);
      setMessage("Mot de passe réinitialisé avec succès");
      setButtonVisible(true);
      showToast("Mot de passe réinitialisé avec succès", ToastType.SUCCESS);
    } catch (err: any) {
      showToast("Le code n'est pas valide", ToastType.ERROR);
      setError(
        err || "Une erreur est survenue lors de la vérification du code"
      );
    } finally {
      setLoading(false);
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
            contentContainerStyle={{ 
              paddingTop: 60,
              justifyContent: 'center',
              flexGrow: 1
            }}
          >
            <View
              style={{
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
                  padding: 24,
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
                <View style={{ alignItems: "center", marginBottom: 32 }}>
                  <Text
                    style={{
                      fontSize: 38,
                      fontWeight: "bold",
                      marginBottom: 8,
                      ...textStyle,
                    }}
                  >
                    MEOW 🐱
                  </Text>
                </View>

                {!emailSent ? (
                  <>
                    {/* Email Reset Section */}
                    <View style={{ alignItems: "center", marginBottom: 24 }}>
                      <Text
                        style={{
                          fontSize: 22,
                          fontWeight: "600",
                          marginBottom: 8,
                          ...textStyle,
                        }}
                      >
                        Mot de passe oublié
                      </Text>
                      <Text
                        style={{
                          fontSize: 15,
                          opacity: 0.7,
                          textAlign: "center",
                          ...textStyle,
                        }}
                      >
                        Entrez votre email pour réinitialiser votre mot de passe
                      </Text>
                    </View>

                    <View style={{ width: "100%", marginBottom: 24 }}>
                      <TextInput
                        style={{
                          ...inputStyle,
                          borderWidth: 1,
                          borderRadius: 12,
                          paddingHorizontal: 16,
                          paddingVertical: 16,
                          fontSize: 16,
                          width: "100%",
                        }}
                        placeholder="email@domain.com"
                        placeholderTextColor={placeholderColor}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                      />
                    </View>

                    <TouchableOpacity
                      onPress={() => {
                        Keyboard.dismiss();
                        handleResetPassword();
                      }}
                      style={{
                        backgroundColor: isDark ? "#6366f1" : "#1f2937",
                        paddingHorizontal: 20,
                        paddingVertical: 16,
                        borderRadius: 12,
                        marginBottom: 20,
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
                        <ActivityIndicator color="#ffffff" />
                      ) : (
                        <Text
                          style={{
                            color: "#ffffff",
                            textAlign: "center",
                            fontSize: 16,
                            fontWeight: "600",
                          }}
                        >
                          Continuer
                        </Text>
                      )}
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    {/* Code Verification Section */}
                    <View style={{ alignItems: "center", marginBottom: 24 }}>
                      <Text
                        style={{
                          fontSize: 22,
                          fontWeight: "600",
                          marginBottom: 8,
                          ...textStyle,
                        }}
                      >
                        Vérifiez votre email
                      </Text>
                      <Text
                        style={{
                          fontSize: 15,
                          opacity: 0.7,
                          textAlign: "center",
                          ...textStyle,
                        }}
                      >
                        Entrez le code de réinitialisation reçu par email
                      </Text>
                    </View>

                    <View style={{ width: "100%", marginBottom: 20 }}>
                      <TextInput
                        style={{
                          ...inputStyle,
                          borderWidth: 1,
                          borderRadius: 12,
                          paddingHorizontal: 16,
                          paddingVertical: 24,
                          fontSize: 32,
                          fontWeight: "600",
                          textAlign: "center",
                          letterSpacing: 8,
                          width: "100%",
                        }}
                        placeholder="123 456"
                        placeholderTextColor={placeholderColor}
                        keyboardType="number-pad"
                        maxLength={6}
                        value={resetCode}
                        onChangeText={(text) => {
                          if (text.length <= 6) {
                            setResetCode(text);
                          }
                          if (text.length === 6) {
                            Keyboard.dismiss();
                          }
                        }}
                      />
                    </View>

                    <View style={{ alignItems: "center", marginBottom: 16 }}>
                      <Text
                        style={{
                          fontSize: 15,
                          opacity: 0.7,
                          ...textStyle,
                        }}
                      >
                        Entrez votre nouveau mot de passe :
                      </Text>
                    </View>

                    <View style={{ width: "100%", marginBottom: 16 }}>
                      <TextInput
                        style={{
                          ...inputStyle,
                          borderWidth: 1,
                          borderRadius: 12,
                          paddingHorizontal: 16,
                          paddingVertical: 16,
                          fontSize: 16,
                          width: "100%",
                        }}
                        placeholder="Nouveau mot de passe"
                        placeholderTextColor={placeholderColor}
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                      />
                    </View>

                    {/* Password Requirements */}
                    <View style={{ marginBottom: 24 }}>
                      <Text
                        style={{
                          ...textStyle,
                          opacity: 0.7,
                          fontSize: 12,
                          marginBottom: 4,
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
                            marginBottom: 2,
                          }}
                        >
                          {requirement}
                        </Text>
                      ))}
                    </View>

                    <TouchableOpacity
                      onPress={handleVerifyCode}
                      style={{
                        backgroundColor: isDark ? "#6366f1" : "#1f2937",
                        paddingHorizontal: 20,
                        paddingVertical: 16,
                        borderRadius: 12,
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
                        <ActivityIndicator color="#ffffff" />
                      ) : (
                        <Text
                          style={{
                            color: "#ffffff",
                            textAlign: "center",
                            fontSize: 16,
                            fontWeight: "600",
                          }}
                        >
                          Changer le mot de passe
                        </Text>
                      )}
                    </TouchableOpacity>

                    {buttonVisible && (
                      <View style={{ marginBottom: 16 }}>
                        <AnimatedButton
                          text="Se connecter"
                          route="/(auth)/sign-in"
                          visible={buttonVisible}
                          style={{ 
                            backgroundColor: "#16b2e8",
                            borderRadius: 12,
                          }}
                        />
                      </View>
                    )}

                    <Text
                      style={{
                        fontSize: 14,
                        textAlign: "center",
                        opacity: 0.7,
                        ...textStyle,
                      }}
                    >
                      Le code expirera dans {formatTime(timeLeft)}.
                    </Text>
                  </>
                )}

                {/* Terms */}
                <Text
                  style={{
                    fontSize: 11,
                    textAlign: "center",
                    marginTop: 20,
                    opacity: 0.7,
                    paddingHorizontal: 12,
                    ...textStyle,
                  }}
                >
                  En cliquant pour continuer, vous acceptez la{" "}
                  <Text style={{ opacity: 1, fontWeight: "500" }}>
                    politique privée
                  </Text>{" "}
                  et les{" "}
                  <Text style={{ opacity: 1, fontWeight: "500" }}>
                    conditions générales
                  </Text>
                  .
                </Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}