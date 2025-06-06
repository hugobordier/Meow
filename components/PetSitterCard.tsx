import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

export default function PetSitterCard({
  item,
  onSelect,
}: {
  item: any;
  onSelect: (item: any) => void;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  if (!item) return null;

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
        source={{ uri: item.image }}
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
          {item.title} {item.price} €/h
        </Text>
        <Text
          style={{
            color: isDark ? "#8E8E93" : "gray",
          }}
        >
          {item.time}
        </Text>
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
        <Text style={{ color: "white" }}> Faire une </Text>
        <Text style={{ color: "white" }}> demande</Text>
      </TouchableOpacity>
    </View>
  );
}
