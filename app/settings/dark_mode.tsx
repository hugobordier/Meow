import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeftIcon } from "lucide-react-native";
import tw from "twrnc";

const dark_mode = () => {
    const router = useRouter();
    const [selected, setSelected] = useState("Activé");

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            {/* Header */}
            <View style={tw`flex-row items-center px-4 py-3 border-b border-gray-200`}>
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeftIcon size={24} color="black" />
                </TouchableOpacity>
                <Text style={tw`flex-1 text-center text-xl font-bold`}>MEOW</Text>
            </View>

            <Text style={tw`text-lg font-semibold text-center mt-4 mb-2`}>Mode sombre</Text>

            {/* Options */}
            <View style={tw`px-4`}>
                <TouchableOpacity
                    style={tw`py-4 border-b border-gray-200`}
                    onPress={() => setSelected("Activé")}
                >
                    <Text style={tw`${selected === "Activé" ? "font-bold" : "text-gray-600"}`}>Activé</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={tw`py-4 border-b border-gray-200`}
                    onPress={() => setSelected("Désactivé")}
                >
                    <Text style={tw`${selected === "Désactivé" ? "font-bold" : "text-gray-600"}`}>Désactivé</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={tw`py-4 border-b border-gray-200`}
                    onPress={() => setSelected("Automatique")}
                >
                    <Text style={tw`${selected === "Automatique" ? "font-bold" : "text-gray-600"}`}>Automatique</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default dark_mode;
