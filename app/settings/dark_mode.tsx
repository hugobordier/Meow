import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeftIcon } from "lucide-react-native";
import tw from "twrnc";

const dark_mode = () => {
    const router = useRouter();
    const [selected, setSelected] = useState("Activé");

    return (
        <View style={tw`flex-1 bg-white`}>
            {/* Header */}
            <View style={tw`flex-row items-center p-4 border-b border-gray-200`}>
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeftIcon size={24} color="black" />
                </TouchableOpacity>
                <Text style={tw`text-lg font-bold text-center flex-1`}>MEOW</Text>
            </View>

            {/* Titre */}
            <Text style={tw`text-center text-lg font-semibold mt-4`}>Mode sombre</Text>

            {/* Options */}
            <TouchableOpacity
                style={tw`p-4 border-b border-gray-200`}
                onPress={() => setSelected("Activé")}
            >
                <Text style={tw`${selected === "Activé" ? "font-bold" : "text-gray-600"}`}>Activé</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={tw`p-4 border-b border-gray-200`}
                onPress={() => setSelected("Désactivé")}
            >
                <Text style={tw`${selected === "Désactivé" ? "font-bold" : "text-gray-600"}`}>Désactivé</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={tw`p-4 border-b border-gray-200`}
                onPress={() => setSelected("Automatique")}
            >
                <Text style={tw`${selected === "Automatique" ? "font-bold" : "text-gray-600"}`}>Automatique</Text>
            </TouchableOpacity>
        </View>
    );
};

export default dark_mode;
