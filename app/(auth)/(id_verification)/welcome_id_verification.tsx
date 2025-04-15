import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function WelcomeIdVerif() {
  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="p-4">
        <Text className="text-gray-500 text-base">
          Completer le profil (carte d'identité)
        </Text>
      </View>

      {/* Colorful logo */}
      <View className="absolute left-4 top-16">
        <Image
          source={require("@/assets/images/asterisk-logo.png")}
          className="w-12 h-12"
        />
      </View>

      {/* Welcome section with image */}
      <View className="mx-4 mt-2 rounded-lg overflow-hidden border border-blue-400">
        <LinearGradient
          colors={["#ffb6c1", "#98fb98"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="p-4 items-center"
        >
          <Image
            source={require("@/assets/images/person-with-dog.png")}
            className="w-40 h-40"
            resizeMode="contain"
          />
          <Text className="text-black text-xl font-bold mt-2">
            Bienvenue sur Meow
          </Text>
          <Text className="text-gray-700 text-xs">
            Simplifiez-vous la vie avec notre application
          </Text>
        </LinearGradient>
      </View>

      {/* Verification requirements box */}
      <View className="mx-4 mt-6 bg-gray-200 p-4 rounded-lg">
        <Text className="text-black font-bold text-center text-base mb-2">
          Vérification d'identité obligatoire
        </Text>
        <Text className="text-black mb-2">
          Documents requis pour la vérification de votre compte:
        </Text>
        <View className="ml-4">
          <Text className="text-black">• Carte d'identité</Text>
          <Text className="text-black">• Relevé d'identité bancaire (RIB)</Text>
          <Text className="text-black">• Certificat d'assurance</Text>
        </View>
      </View>

      {/* Verification time notice */}
      <View className="mx-4 mt-6">
        <Text className="text-gray-500 text-center">
          La vérification de l'identité peut prendre jusqu'à 7 jours ouvrés.
        </Text>
      </View>

      {/* Continue button */}
      <TouchableOpacity
        className="mx-4 mt-6 bg-black py-4 rounded-lg"
        activeOpacity={0.8}
      >
        <Text className="text-white text-center font-semibold">Continuer</Text>
      </TouchableOpacity>

      {/* Skip option */}
      <TouchableOpacity className="mt-2">
        <Text className="text-red-500 text-center">
          Ignorer cette étape pour le moment
        </Text>
      </TouchableOpacity>

      {/* Terms notice */}
      <View className="mx-8 mt-4 mb-8">
        <Text className="text-gray-500 text-center text-xs">
          En cliquant sur continuer vous acceptez les politiques de
          confidentialités et les conditions générales.
        </Text>
      </View>
    </ScrollView>
  );
}
