import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ArrowLeftIcon, CheckSquare, Square } from "lucide-react-native";
import tw from "twrnc";
import {useRouter} from "expo-router";

const online = () => {
    const router = useRouter();
    const [isOnline, setIsOnline] = useState(true);

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
            <Text style={tw`text-center text-lg font-semibold mt-4`}>Statut en ligne</Text>

            {/* Option de statut en ligne */}
            <TouchableOpacity
                style={tw`flex-row justify-between items-center p-4 border-b border-gray-200`}
                onPress={() => setIsOnline(!isOnline)}
            >
                <Text style={tw`text-gray-800`}>Indiquer quand vous êtes en ligne</Text>
                {isOnline ? <CheckSquare size={24} color="black" /> : <Square size={24} color="black" />}
            </TouchableOpacity>
        </View>
    );
};

export default online;
