import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon, CheckSquare, Square } from "lucide-react-native";
import tw from "twrnc";
import { useRouter } from "expo-router";

const Notif = () => {
    const router = useRouter();
    const [settings, setSettings] = useState({
        doNotDisturb: false,
        showPreviews: true,
        inAppSounds: true
    });

    const toggleSetting = (setting: keyof typeof settings) => {
        setSettings(prev => ({
            ...prev,
            [setting]: !prev[setting]
        }));
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            {/* Header */}
            <View style={tw`flex-row items-center px-4 py-3 border-b border-gray-200`}>
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeftIcon size={24} color="black" />
                </TouchableOpacity>
                <Text style={tw`flex-1 text-center text-xl font-bold`}>MEOW</Text>
            </View>

            <Text style={tw`text-lg font-semibold text-center mt-4 mb-2`}>Notifications et sons</Text>

            {/* Options */}
            <View style={tw`px-4`}>
                <TouchableOpacity
                    style={tw`flex-row justify-between items-center py-4 border-b border-gray-200`}
                    onPress={() => toggleSetting('doNotDisturb')}
                >
                    <Text style={tw`text-gray-800`}>Ne pas déranger</Text>
                    {settings.doNotDisturb ? <CheckSquare size={24} color="black" /> : <Square size={24} color="black" />}
                </TouchableOpacity>

                <Text style={tw`text-lg font-semibold text-center mt-4 mb-2`}>Notifications</Text>

                <TouchableOpacity
                    style={tw`flex-row justify-between items-center py-4 border-b border-gray-200`}
                    onPress={() => toggleSetting('showPreviews')}
                >
                    <Text style={tw`text-gray-800`}>Afficher les aperçus</Text>
                    {settings.showPreviews ? <CheckSquare size={24} color="black" /> : <Square size={24} color="black" />}
                </TouchableOpacity>

                <Text style={tw`text-lg font-semibold text-center mt-4 mb-2`}>Sons et vibrations</Text>

                <TouchableOpacity
                    style={tw`flex-row justify-between items-center py-4 border-b border-gray-200`}
                    onPress={() => toggleSetting('inAppSounds')}
                >
                    <Text style={tw`text-gray-800`}>Lorsque l'application est utilisée</Text>
                    {settings.inAppSounds ? <CheckSquare size={24} color="black" /> : <Square size={24} color="black" />}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Notif;
