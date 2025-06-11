import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon, CheckSquare, Square } from "lucide-react-native";
import tw from "twrnc";
import { useRouter } from "expo-router";

const Online = () => {
    const router = useRouter();
    const [isOnline, setIsOnline] = useState(true);

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            {/* Header */}
            <View style={tw`flex-row items-center px-4 py-3 border-b border-gray-200`}>
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeftIcon size={24} color="black" />
                </TouchableOpacity>
                <Text style={tw`flex-1 text-center text-xl font-bold`}>MEOW</Text>
            </View>

            <Text style={tw`text-lg font-semibold text-center mt-4 mb-2`}>Statut en ligne</Text>

            {/* Option de statut en ligne */}
            <View style={tw`px-4`}>
                <TouchableOpacity
                    style={tw`flex-row justify-between items-center py-4 border-b border-gray-200`}
                    onPress={() => setIsOnline(!isOnline)}
                >
                    <Text style={tw`text-gray-800`}>Indiquer quand vous êtes en ligne</Text>
                    {isOnline ? <CheckSquare size={24} color="black" /> : <Square size={24} color="black" />}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Online;
