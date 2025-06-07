import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import type { ResponsePetsitter } from "@/types/type";

export default function PetSitterCard({
  item,
  onSelect,
}: {
  item: ResponsePetsitter;
  onSelect: (item: ResponsePetsitter) => void;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  if (!item) return null;

  const { petsitter, user } = item;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        backgroundColor: isDark ? "#2C2C2E" : "#fff",
        borderRadius: 10,
        padding: 10,
      }}
    >
      <Image
        source={{ uri: user.profilePicture ? user.profilePicture : "https://www.canbind.ca/wp-content/uploads/2025/01/placeholder-image-person-jpg.jpg" }}
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          marginRight: 10,
        }}
      />

      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontWeight: "bold",
            color: isDark ? "#FFFFFF" : "#000000",
          }}
        >
          {user.firstName} {user.lastName} - {petsitter.hourly_rate}€/h
        </Text>
        {user.city && user.country && <Text
          style={{
            color: isDark ? "#8E8E93" : "gray",
            fontSize: 12,
          }}
        >
          {user.city}, {user.country}
        </Text>}
        {petsitter.animal_types && petsitter.animal_types.length > 0 && (
          <Text
            style={{
              color: isDark ? "#8E8E93" : "gray",
              fontSize: 12,
              marginTop: 2,
            }}
          >
            {petsitter.animal_types.join(", ")}
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: isDark ? "#D946EF" : "black",
          borderRadius: 10,
          paddingHorizontal: 10,
          paddingVertical: 6,
        }}
        onPress={() => onSelect(item)}
      >
        <Text style={{ color: "white" }}>Demander</Text>
      </TouchableOpacity>
    </View>
  );
}

