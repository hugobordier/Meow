import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  StatusBar,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { Link, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";

const { width: screenWidth } = Dimensions.get("window");

export default function HomePage() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const cardStyle = {
    backgroundColor: isDark
      ? "rgba(30, 30, 60, 0.8)"
      : "rgba(255, 255, 255, 0.9)",
    borderColor: isDark ? "rgba(99, 102, 241, 0.3)" : "rgba(0, 0, 0, 0.1)",
  };

  const buttonStyle = {
    backgroundColor: isDark
      ? "rgba(99, 102, 241, 0.8)"
      : "rgba(229, 231, 235, 0.8)",
    borderColor: isDark
      ? "rgba(99, 102, 241, 0.4)"
      : "rgba(156, 163, 175, 0.3)",
  };

  const textStyle = {
    color: isDark ? "#ffffff" : "#000000",
  };

  return (
    <LinearGradient
      colors={
        isDark
          ? ["#0f0f23", "#1e1e3f", "#2d2d5a", "#3c3c75"]
          : ["#f8fafc", "#e2e8f0", "#cbd5e1", "#94a3b8"]
      }
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 16,
              paddingVertical: 20,
            }}
          >
            <View
              style={{
                ...cardStyle,
                borderRadius: 20,
                borderWidth: 1,
                padding: 24,
                width: "100%",
                maxWidth: 400,
                alignItems: "center",
                shadowColor: isDark ? "#6366f1" : "#000",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: isDark ? 0.3 : 0.1,
                shadowRadius: 16,
                elevation: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 42,
                  fontWeight: "bold",
                  marginBottom: 32,
                  ...textStyle,
                }}
              >
                MEOW🐱
              </Text>

              <Link href="/sign-up" asChild>
                <TouchableOpacity
                  style={{
                    ...buttonStyle,
                    borderWidth: 1,
                    paddingHorizontal: 24,
                    paddingVertical: 14,
                    borderRadius: 12,
                    marginBottom: 16,
                    width: "100%",
                    shadowColor: isDark ? "#6366f1" : "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                  onPress={() => router.push("/(auth)/sign-up")}
                >
                  <Text
                    style={{
                      ...textStyle,
                      fontSize: 16,
                      fontWeight: "600",
                      textAlign: "center",
                    }}
                  >
                    Créer un compte
                  </Text>
                </TouchableOpacity>
              </Link>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 16,
                  width: "100%",
                }}
              >
                <View
                  style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: isDark
                      ? "rgba(99, 102, 241, 0.3)"
                      : "rgba(156, 163, 175, 0.5)",
                  }}
                />
                <Text
                  style={{
                    marginHorizontal: 12,
                    ...textStyle,
                    opacity: 0.7,
                    fontSize: 14,
                  }}
                >
                  ou
                </Text>
                <View
                  style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: isDark
                      ? "rgba(99, 102, 241, 0.3)"
                      : "rgba(156, 163, 175, 0.5)",
                  }}
                />
              </View>

              <Link href="/sign-in" asChild>
                <TouchableOpacity
                  style={{
                    backgroundColor: isDark ? "#6366f1" : "#1f2937",
                    paddingHorizontal: 24,
                    paddingVertical: 14,
                    borderRadius: 12,
                    marginBottom: 16,
                    width: "100%",
                    shadowColor: isDark ? "#6366f1" : "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                  onPress={() => router.push("/(auth)/sign-in")}
                >
                  <Text
                    style={{
                      color: "#ffffff",
                      fontSize: 16,
                      fontWeight: "600",
                      textAlign: "center",
                    }}
                  >
                    Se connecter
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
