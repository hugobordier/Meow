import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { forgotPassword, verifyResetCode } from "@/services/auth.service";
import { formatTime } from "@/utils/formatTime";
import { useToast, ToastType } from "@/context/ToastContext";
import AnimatedButton from "@/components/AnimatedButton";

export default function ForgotPassword() {
  const { showToast } = useToast();

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
      showToast("Email envoyé avec succes", ToastType.SUCCESS);
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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-4xl font-bold">MEOW 🐱</Text>

        {!emailSent ? (
          <View className="w-full max-w-md">
            <Text className="text-lg font-bold text-center mt-8">
              Mot de passe oublié
            </Text>
            <Text className="text-gray-500 text-center mt-2 mb-6">
              Entrez votre email pour réinitialiser votre mot de passe
            </Text>

            <TextInput
              className="w-full p-4 border border-gray-300  rounded-md  text-gray-600 placeholder:text-gray-400"
              placeholder="email@domain.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              textAlign="left"
            />

            <Pressable
              onPress={() => {
                Keyboard.dismiss();
                handleResetPassword();
              }}
              className="bg-black p-4 rounded-md mt-6 w-full items-center"
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-semibold">Continuer</Text>
              )}
            </Pressable>

            <Text className="text-xs text-center text-gray-400 mt-4">
              En cliquant pour continuer, vous acceptez la{" "}
              <Text className="text-black">politique privée</Text> et les{" "}
              <Text className="text-black">conditions générales</Text>.
            </Text>
          </View>
        ) : (
          <View className="w-full max-w-md">
            <Text className="text-lg font-bold text-center mt-2">
              Vérifiez votre email
            </Text>
            <Text className="text-gray-500 text-center mt-2">
              Entrez le code de réinitialisation reçu par email
            </Text>

            <TextInput
              className="w-full p-4 border h-24 border-gray-300 text-6xl rounded-md mt-6 text-gray-600 placeholder:text-gray-400"
              placeholder="123 456"
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
              textAlign="center"
              textAlignVertical="center"
            />

            <Text className="text-gray-500 text-center mt-2">
              Entrez votre nouveau mot de passe :
            </Text>

            <TextInput
              className="w-full p-2   pt-1 border text-center border-gray-300 text-lg rounded-md mt-3 text-gray-600 placeholder:text-gray-400"
              placeholder="Nouveau mot de passe"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              textAlign="center"
              placeholderClassName="text-center"
            />

            <Pressable
              onPress={handleVerifyCode}
              className="bg-black p-4 rounded-md mt-6 mb-2 w-full items-center"
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-semibold">
                  Changer le mot de passe
                </Text>
              )}
            </Pressable>

            {buttonVisible && (
              <AnimatedButton
                text="Se connecter"
                route="/(auth)/sign-in"
                visible={buttonVisible}
                style={{ backgroundColor: "#16b2e8" }}
              ></AnimatedButton>
            )}

            <Text className="text-lg underline text-center text-gray-400 mt-4">
              Le code expirera dans {formatTime(timeLeft)}.
            </Text>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}
