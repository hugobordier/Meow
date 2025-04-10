import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import {useRouter} from "expo-router";

const securityOption = [
    { title: "Discussions signalées"},
    { title: "Personnes bloquées"},
    { title: "Localisation" },
    { title: "Confirmation de lecture" },
    { title: "Vérouillage de l'application" },
];

const security = () => {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft size={24} className="text-black" />
                </TouchableOpacity>
                <Text className="flex-1 text-center text-xl font-bold">MEOW</Text>
            </View>

            <Text className="text-lg font-semibold text-center mt-4 mb-2">Confidentialité et securité</Text>

            {/* Liste des paramètres */}
            <ScrollView className="px-4">
                {securityOption.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        className="flex-row items-center justify-between py-4 border-b border-gray-200"
                    >
                        <Text className="text-base text-black">{item.title}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

export default security;