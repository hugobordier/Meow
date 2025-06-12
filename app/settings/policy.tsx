import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  findNodeHandle,
  UIManager,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { useRouter } from "expo-router";

const policyOption = [
  { title: "Politique de confidentialité", key: "privacy" },
  { title: "Condition de service", key: "terms" },
  { title: "Politique d'utilisation des cookies", key: "cookies" },
  { title: "Règlement (UE) 2021/1232", key: "regulation" },
];

const PolicyScreen = () => {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";

  const backgroundColor = isDark ? "#0f172a" : "#ffffff";
  const borderColor = isDark ? "#334155" : "#e5e7eb";
  const textColor = isDark ? "#f8fafc" : "#111827";
  const subTextColor = isDark ? "#94a3b8" : "#6b7280";

  const scrollRef = useRef<ScrollView>(null);
  const sectionRefs = {
    privacy: useRef(null),
    terms: useRef(null),
    cookies: useRef(null),
    regulation: useRef(null),
  };

  const scrollToSection = (key: string) => {
    const sectionRef = sectionRefs[key];
    const scrollNode = findNodeHandle(scrollRef.current);
    const targetNode = findNodeHandle(sectionRef.current);

    if (scrollNode && targetNode) {
      UIManager.measureLayout(
        targetNode,
        scrollNode,
        () => {
          console.warn("Failed to measure layout.");
        },
        (x, y) => {
          scrollRef.current?.scrollTo({ y, animated: true });
        }
      );
    }
  };

  const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
  in venenatis ex. Praesent feugiat magna euismod, convallis augue in,
  commodo lectus. Integer euismod libero vel sapien luctus, vel
  scelerisque magna faucibus. Donec dapibus fermentum velit, ut
  hendrerit magna suscipit at.`;

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
        Mentions légales et politiques
      </Text>

      <ScrollView ref={scrollRef} style={{ paddingHorizontal: 16 }}>
        {/* Menu */}
        {policyOption.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => scrollToSection(item.key)}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 16,
              borderBottomWidth: 1,
              borderColor,
            }}
          >
            <Text style={{ fontSize: 16, color: textColor }}>{item.title}</Text>
          </TouchableOpacity>
        ))}

        {/* Sections */}
        {policyOption.map((item) => (
          <View
            key={item.key}
            ref={sectionRefs[item.key]}
            style={{
              paddingVertical: 24,
              borderBottomWidth: 1,
              borderColor,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: textColor,
                marginBottom: 8,
              }}
            >
              📄 {item.title}
            </Text>
            <Text
              style={{
                fontSize: 14,
                lineHeight: 22,
                color: subTextColor,
              }}
            >
              {lorem}
            </Text>
          </View>
        ))}

        <Text
          style={{
            fontSize: 12,
            fontStyle: "italic",
            marginVertical: 24,
            textAlign: "center",
            color: subTextColor,
          }}
        >
          Dernière mise à jour : Aujourd’hui 🐾
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PolicyScreen;
