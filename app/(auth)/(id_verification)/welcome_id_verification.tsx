import {
  TouchableOpacity,
  View,
  Text,
  Pressable,
  Image,
  Dimensions,
  useColorScheme,
  ScrollView,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const WelcomeIdVerif = () => {
  const router = useRouter();
  const imageSize = Dimensions.get("window").width / 2;
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  return (
    <SafeAreaView
      className={`flex-1 ${isDarkMode ? "bg-gray-900" : "bg-fuchsia-50"}`}
    >
      <View className="absolute top-0 left-0 right-0">
        <Image
          source={require("@/assets/images/gradient.png")}
          style={{
            width: Dimensions.get("window").width,
            height: 300, // Tu peux ajuster la hauteur selon ton design
            resizeMode: "cover",
            opacity: isDarkMode ? 0.5 : 1,
          }}
        />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 40,
          paddingTop: 40,
        }}
      >
        <View className="justify-center items-center">
          <Image
            source={require("@/assets/images/person-with-dog.png")}
            style={{ width: imageSize, height: imageSize }}
          />

          <Text
            className={`text-3xl font-bold mt-4 ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            Bienvenue sur Meow
          </Text>
          <Text className="text-sm text-gray-400 text-center">
            Simplifiez-vous la vie, meow après meow
          </Text>
        </View>

        <View
          className={`w-full h-48 rounded-3xl shadow-md mt-10 flex items-center justify-evenly px-4 ${
            isDarkMode ? "bg-gray-800" : "bg-slate-300"
          }`}
        >
          <Text
            className={`font-bold text-xl mb-2 text-center ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            Vérification d'identité obligatoire
          </Text>

          <Text
            className={`text-center text-sm leading-5 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Documents requis pour la vérification de votre compte:{"\n"}• Carte
            d'identité{"\n"}• Relevé d'identité bancaire (RIB){"\n"}• Certificat
            d'assurance{"\n"}
          </Text>
        </View>

        <Text className="text-xs text-center mt-10 text-gray-500 dark:text-gray-400">
          La vérification de l'identité peut prendre jusqu'à 7 jours ouvrés.
        </Text>

        <TouchableOpacity
          className={`px-6 py-3 rounded-lg mb-1 mt-6 w-full ${
            isDarkMode ? "bg-fuchsia-700" : "bg-black"
          }`}
          onPress={() =>
            router.push("/(auth)/(id_verification)/id_card_verification")
          }
        >
          <Text className="text-white text-center">Continuer</Text>
        </TouchableOpacity>

        <Pressable onPress={() => router.push("/(home)/homeMainPetsitter")}>
          <Text
            className={`text-center mt-6 ${
              isDarkMode ? "text-red-400" : "text-red-500"
            }`}
          >
            Ignorer cette étape pour le moment
          </Text>
        </Pressable>

        <Text className="text-xs text-center mt-6 text-gray-500 dark:text-gray-400">
          En cliquant sur continuer, vous acceptez la politique privée et les
          conditions générales.
        </Text>

        <TouchableOpacity onPress={() => router.back()} className="mt-4 mb-8">
          <Text
            className={`text-center ${
              isDarkMode ? "text-fuchsia-400" : "text-fuchsia-700"
            }`}
          >
            Retour
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WelcomeIdVerif;
