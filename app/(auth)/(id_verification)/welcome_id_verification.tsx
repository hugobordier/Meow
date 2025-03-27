import { TouchableOpacity, View, Text, Pressable, Image } from "react-native"
import Header from "@/components/header"
import { Link } from "react-native-feather";
import React from "react";
import { router } from "expo-router";

const welcomeIdVerif = () => {
    return (
        <View className="bg-white flex-1 justify-start bg-fuchsia-50 relative px-4">
            <Header />

            <View className="justify-center items-center">
                <Image
                    source={require("@/assets/icons/icon.png")}
                    style={{ width: 159, height: 159 }}
                />
                <Text className="text-xl font-bold">
                    Bienvenue sur Meow
                </Text>
                <Text className="text-sm text-gray-400 text-center">
                    Simplifiez-vous la vie, meow après meow
                </Text>
            </View>

            <View className="w-full h-48 bg-slate-300 rounded-3xl shadow-md mt-10 flex items-center justify-evenly px-4">
                <Text className="font-bold text-xl mb-2 text-center">
                    Vérification d’identité obligatoire
                </Text>

                <Text className="text-center text-sm leading-5">
                    Documents requis pour la vérification de votre compte:{'\n'}
                    • Carte d’identité{'\n'}
                    • Relevé d’identité bancaire (RIB){'\n'}
                    • Certificat d’assurance{'\n'}
                </Text>
            </View>

            <Text className="text-xs text-center mt-10 text-gray-600 dark:text-gray-300">
                La vérification de l’identité peut prendre jusqu’à 7 jours ouvrés.
            </Text>

            <TouchableOpacity
                className="bg-black px-6 py-3 rounded-lg mb-1 mt-6 w-full"
            >
                <Pressable onPress={() => router.push("/(auth)/(id_verification)/id_card_verification")}>
                    <Text className="text-white text-center">
                        Continuer
                    </Text>
                </Pressable>
            </TouchableOpacity>


            <Pressable onPress={() => router.push("/(home)/homeMainPetsitter")}>
                <Text className="text-red-500 text-center mt-6">
                    Ignorer cette étape pour le moment
                </Text>
            </Pressable>


            <Text className="text-xs text-center mt-6 text-gray-600 dark:text-gray-300">
                En cliquant sur continuer, vous acceptez la politique privée et les
                conditions générales.
            </Text>
        </View>
    );
};

export default welcomeIdVerif;