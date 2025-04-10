import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, ChevronRight } from "lucide-react-native";


const settingsOptions = [
    { title: "Mode sombre", value: "Système", screen: "/settings/dark_mode" as const },
    { title: "Statut en ligne", value: "Activé", screen: "/settings/online" as const },
    { title: "Confidentialité et sécurité", screen: "/settings/security" as const },
    { title: "Notifications et sons", value: "Activé", screen: "/settings/notif" as const },
    { title: "Stockage et données", screen: "/settings/data"  as const},
    { title: "Mention légales et politiques", screen: "/settings/policy" as const },
    { title: "Gérer le compte", screen: "/settings/manage" as const },
];

const HomeSettings = () => {

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

            <Text className="text-lg font-semibold text-center mt-4 mb-2">Paramètres</Text>

            {/* Liste des paramètres */}
            <ScrollView className="px-4">
                {settingsOptions.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        className="flex-row items-center justify-between py-4 border-b border-gray-200"
                        onPress={() => item.screen && router.push(item.screen)}
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

export default HomeSettings;
