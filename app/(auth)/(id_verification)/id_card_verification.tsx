import { View, Text, Image, Pressable, TouchableOpacity } from "react-native"
import Header from "@/components/header"
import React from "react";
import { router } from "expo-router";
import UploadDocuments from "@/context/fileUpload";

const idCardVerif = () => {
    return (
        <View className="bg-white flex-1 justify-start bg-fuchsia-50 relative px-4">
            <Header />

            <View className="justify-center items-center mt-6">
                <Text className="text-xl font-bold">
                    Vérification de la carte d’identité
                </Text>

                <Image
                    source={require("@/assets/images/id_card_example.jpg")}
                    style={{ width: 225, height: 149 }}
                    className="mt-6"
                />

                <Text className="mt-6 mb-6 text-center">
                    Veuillez joindre votre carte d’identité recto-verso au format .pdf, .jpeg ou .pnj comme ci-dessus.
                </Text>

                <UploadDocuments />

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

                <Text className="text-xs text-center mt-6 text-gray-600 dark:text-gray-300">
                    En cliquant sur continuer, vous acceptez la politique privée et les
                    conditions générales.
                </Text>

            </View>
        </View>
    );
};

export default idCardVerif;