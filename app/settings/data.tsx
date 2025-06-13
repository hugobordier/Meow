import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";

const LegalScreen = () => {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";
  const [autoDownload, setAutoDownload] = useState(true);

  const backgroundColor = isDark ? "#0f172a" : "#f3f4f6"; // slate-900 / gray-100
  const borderColor = isDark ? "#334155" : "#e5e7eb"; // slate-700 / gray-200
  const textColor = isDark ? "#f8fafc" : "#111827"; // slate-50 / gray-900
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
        Mentions légales & Sécurité
      </Text>

      {/* Contenu */}
      <ScrollView style={{ paddingHorizontal: 16 }}>
        <View
          style={{
            paddingVertical: 16,
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
            📜 Mentions Légales
          </Text>
          <Text
            style={{
              fontSize: 14,
              lineHeight: 22,
              color: subTextColor,
            }}
          >
            En vertu de la loi n° 2025-42 du 1er avril relative à la
            dématérialisation des contrats intergalactiques, l’utilisateur
            reconnaît que toute interaction avec l’application MEOW peut être
            surveillée par des chats invisibles.
            {"\n\n"}
            Toute utilisation de MEOW implique l’acceptation totale de
            conditions générales absurdes, y compris, mais sans s’y limiter,
            l’envoi automatique de mèmes de chats tristes si vous quittez l'app
            sans dire au revoir.
            {"\n\n"}
            Vos données sont stockées dans un coffre fort numérique protégé par
            une horde de licornes juridiques. Toute infraction sera poursuivie
            dans un tribunal galactique.
          </Text>
        </View>

        <View style={{ paddingVertical: 16 }}>
          <Text
            style={{
              fontSize: 12,
              fontStyle: "italic",
              color: subTextColor,
            }}
          >
            Dernière mise à jour : Aujourd’hui, parce que personne ne lit ça de
            toute façon.
          </Text>
        </View>
      </ScrollView>

      {/* Option basique */}
      <TouchableOpacity
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 16,
          borderTopWidth: 1,
          borderColor,
        }}
        onPress={() => setAutoDownload(!autoDownload)}
      >
        <Text style={{ color: textColor, fontSize: 16 }}>
          📡 Téléchargement automatique des médias
        </Text>
        <Text
          style={{
            fontWeight: "bold",
            color: autoDownload ? "#10b981" : subTextColor, // green-500 / gris
          }}
        >
          {autoDownload ? "Activé" : "Désactivé"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default LegalScreen;
