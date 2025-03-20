import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft, ChevronRight } from "lucide-react-native";

const settingsOptions = [
    { title: "Mode sombre", value: "Système" },
    { title: "Statut en ligne", value: "Activé" },
    { title: "Accessibilité" },
    { title: "Confidentialité et sécurité" },
    { title: "Notifications et sons", value: "Activé" },
    { title: "Stockage et données" },
    { title: "Mention légales et politiques" },
    { title: "Gérer le compte" },
];

const home_settings = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft size={24} className="text-black" />
                </TouchableOpacity>
                <Text className="flex-1 text-center text-xl font-bold">MEOW</Text>
            </View>

            <Text className="text-lg font-semibold text-center mt-4 mb-2">Paramètres</Text>

            {/* Liste des paramètres */}
            <ScrollView className="px-4">
                {settingsOptions.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        className="flex-row items-center justify-between py-4 border-b border-gray-200"
                    >
                        <Text className="text-base text-black">{item.title}</Text>
                        <View className="flex-row items-center">
                            {item.value && <Text className="text-gray-500 mr-2">{item.value}</Text>}
                            <ChevronRight size={20} className="text-gray-400" />
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

export default home_settings;