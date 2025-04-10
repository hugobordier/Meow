import React, {useState} from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {ArrowLeft, CheckSquare, Square} from "lucide-react-native";
import {useRouter} from "expo-router";
import tw from "twrnc";

const data = () => {
    const router = useRouter();
    const [isOnline, setIsOnline] = useState(true);


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
                    <TouchableOpacity
                        className="flex-row items-center justify-between py-4 border-b border-gray-200"
                    >
                        <Text className="text-base text-black">"Stockage"</Text>
                    </TouchableOpacity>
            </ScrollView>
            <TouchableOpacity
                style={tw`flex-row justify-between items-center p-4 border-b border-gray-200`}
                onPress={() => setIsOnline(!isOnline)}
            >
                <Text style={tw`text-gray-800`}>Téléchargement automatique des médias</Text>
                {isOnline ? <CheckSquare size={24} color="black" /> : <Square size={24} color="black" />}
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default data;