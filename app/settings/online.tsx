import React, { useState } from "react";
import { Text, TouchableOpacity, View, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, CheckSquare, Square } from "lucide-react-native";
import { useRouter } from "expo-router";

const Online = () => {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);
  const isDark = useColorScheme() === "dark";

  const backgroundColor = isDark ? "#0f172a" : "#ffffff"; // dark: slate-900
  const borderColor = isDark ? "#334155" : "#e5e7eb"; // dark: slate-700
  const textColor = isDark ? "#f8fafc" : "#111827"; // light / dark
  const subTextColor = isDark ? "#94a3b8" : "#6b7280"; // slate-400 / gray-500

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderColor,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={textColor} />
        </TouchableOpacity>
        <Text
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 20,
            fontWeight: "bold",
            color: textColor,
          }}
        >
          MEOW
        </Text>
      </View>

      {/* Titre */}
      <Text
        style={{
          fontSize: 18,
          fontWeight: "600",
          textAlign: "center",
          marginTop: 16,
          marginBottom: 8,
          color: textColor,
        }}
      >
        Statut en ligne
      </Text>

      {/* Option */}
      <View style={{ paddingHorizontal: 16 }}>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderColor,
          }}
          onPress={() => setIsOnline(!isOnline)}
        >
          <Text style={{ fontSize: 16, color: textColor }}>
            Indiquer quand vous êtes en ligne
          </Text>
          {isOnline ? (
            <CheckSquare size={24} color={textColor} />
          ) : (
            <Square size={24} color={textColor} />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Online;
