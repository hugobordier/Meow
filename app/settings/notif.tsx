import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ArrowLeftIcon, CheckSquare, Square } from "lucide-react-native";
import tw from "twrnc";
import {useRouter} from "expo-router";

const notif = () => {
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
            <Text style={tw`text-center text-lg font-semibold mt-4`}>Notifications et sons</Text>

            {/* Option de notif */}
            <TouchableOpacity
                style={tw`flex-row justify-between items-center p-4 border-b border-gray-200`}
                onPress={() => setIsOnline(!isOnline)}
            >
                <Text style={tw`text-gray-800`}>Ne pas déranger</Text>
                {isOnline ? <CheckSquare size={24} color="black" /> : <Square size={24} color="black" />}
            </TouchableOpacity>


            <Text style={tw`text-center text-lg font-semibold mt-4`}>Notifications</Text>

            {/* Option de notif */}
            <TouchableOpacity
                style={tw`flex-row justify-between items-center p-4 border-b border-gray-200`}
                onPress={() => setIsOnline(!isOnline)}
            >
                <Text style={tw`text-gray-800`}>Afficher les aperçus</Text>
                {isOnline ? <CheckSquare size={24} color="black" /> : <Square size={24} color="black" />}
            </TouchableOpacity>


            <Text style={tw`text-center text-lg font-semibold mt-4`}>Sons et vibrations</Text>

            {/* Option de notif */}
            <TouchableOpacity
                style={tw`flex-row justify-between items-center p-4 border-b border-gray-200`}
                onPress={() => setIsOnline(!isOnline)}
            >
                <Text style={tw`text-gray-800`}>Lorsque l'application est utilisée</Text>
                {isOnline ? <CheckSquare size={24} color="black" /> : <Square size={24} color="black" />}
            </TouchableOpacity>
        </View>
    );
};

export default notif;
