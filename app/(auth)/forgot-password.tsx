import { View, Text, TextInput, Pressable } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleResetPassword = () => {
    console.log("Email envoyé à :", email);
    // Ici, ajouter la logique d'envoi de l'email de réinitialisation
  };

  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
      <Text className="text-2xl font-bold mb-6">MEOW</Text>
      <Text className="text-lg font-semibold mb-2">Mot de passe oublié</Text>
      <Text className="text-center text-gray-600 mb-4">
        Entrez votre email pour réinitialiser votre mot de passe
      </Text>
      <TextInput
        className="w-full border border-gray-300 rounded-md p-3 mb-4"
        placeholder="email@domain.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Pressable
        className="w-full bg-black p-3 rounded-md items-center"
        onPress={handleResetPassword}
      >
        <Text className="text-white font-semibold">Continuer</Text>
      </Pressable>
      <Text className="text-xs text-gray-500 text-center mt-4">
        En cliquant pour continuer, vous acceptez la politique privée et les
        conditions générales.
      </Text>
    </View>
  );
}
