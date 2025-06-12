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

const securityOption = [
  { title: "Discussions signalées", key: "reported" },
  { title: "Personnes bloquées", key: "blocked" },
  { title: "Localisation", key: "location" },
  { title: "Confirmation de lecture", key: "read" },
  { title: "Verrouillage de l'application", key: "lock" },
];

const SecurityScreen = () => {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";

  const backgroundColor = isDark ? "#0f172a" : "#ffffff";
  const borderColor = isDark ? "#334155" : "#e5e7eb";
  const textColor = isDark ? "#f8fafc" : "#111827";
  const subTextColor = isDark ? "#94a3b8" : "#6b7280";

  const scrollRef = useRef<ScrollView>(null);
  const sectionRefs = {
    reported: useRef(null),
    blocked: useRef(null),
    location: useRef(null),
    read: useRef(null),
    lock: useRef(null),
  };

  const scrollToSection = (key: string) => {
    //@ts-ignore
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
        Confidentialité et sécurité
      </Text>

      <ScrollView ref={scrollRef} style={{ paddingHorizontal: 16 }}>
        {securityOption.map((item, index) => (
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

        {securityOption.map((item) => (
          <View
            key={item.key}
            //@ts-ignore
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
              🔒 {item.title}
            </Text>
            <Text
              style={{
                fontSize: 14,
                lineHeight: 22,
                color: subTextColor,
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut
              perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium. Aliquam erat volutpat. Quisque
              varius tellus sit amet est pulvinar, vitae pharetra augue
              bibendum.
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

export default SecurityScreen;
