import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"
import React from "react";
import { TouchableOpacity } from "react-native";
import { View, Text } from "react-native";

const Header = () => {
    const router = useRouter();

    return (
        <View
            style={{ marginTop: 40 }}
            className="flex-row items-center justify-between px-4 py-3">
            <TouchableOpacity onPress={() => router.back()}>
                <AntDesign name="left" size={28} color="black" />
            </TouchableOpacity>

            <Text className="text-3xl font-bold">
                MEOW
            </Text>

            <TouchableOpacity onPress={() => router.push("/(auth)/home")}>
                <AntDesign name="setting" size={28} color="black" />
            </TouchableOpacity>
        </View>
    );
};
export default Header;