import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import {useRouter} from "expo-router";


const manage = () => {
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

            <Text className="text-lg font-semibold text-center mt-4 mb-2">Gérer le compte</Text>

            {/* Liste des paramètres */}
            <ScrollView className="px-4">
                <TouchableOpacity
                    className="flex-row items-center justify-between py-4 border-b border-gray-200">
                    <Text className="text-base text-black">Se déconnecter</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="flex-row items-center justify-between py-4 border-b border-gray-200">
                    <Text className="text-base text-black">Supprimer le compte</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default manage;