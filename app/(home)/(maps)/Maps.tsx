import React, { useState } from "react";
import { View, Text, Image, Pressable } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useRouter } from "expo-router";
import { TextInput } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

const markers = [
  { id: 1, price: "15€", latitude: 48.8566, longitude: 2.3522 },
  { id: 2, price: "20€", latitude: 48.857, longitude: 2.353 },
  { id: 3, price: "23€", latitude: 48.855, longitude: 2.351 },
  { id: 4, price: "24€", latitude: 48.858, longitude: 2.354 },
  { id: 5, price: "25€", latitude: 48.859, longitude: 2.355 },
  { id: 6, price: "30€", latitude: 48.86, longitude: 2.356 },
];

export default function MeowMapScreen() {
  const router = useRouter();

  return (
    <View className="flex-1">
      {/* Map */}
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 48.8566,
          longitude: 2.3522,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        provider="google"
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.price}
          >
            <View className="bg-white px-2 py-1 rounded-full border border-gray-300">
              <Text className="text-sm font-bold">{marker.price}</Text>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Search bar in absolute position - styled like the image */}
      <View className="absolute top-4 left-4 right-4 bg-fuchsia-50 dark:bg-gray-900 p-4 shadow-sm rounded-2xl">
        <View className="flex-row items-center">
          <View className="flex-row flex-1 items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            <Feather
              name="search"
              size={20}
              color="#666"
              style={{ marginRight: 6 }}
            />
            <View className="flex-1">
              <Text className="font-medium text-gray-800 dark:text-gray-100">
                Paris
              </Text>
              <View className="flex-row items-center">
                <Text className="text-xs text-gray-500 dark:text-gray-400">
                  Sep 12 - 15 · Chat ·{" "}
                </Text>
              </View>
            </View>
            <Pressable>
              <Feather name="edit-2" size={18} color="#666" />
            </Pressable>
          </View>
        </View>

        {/* Filters - directly below search bar */}
        <View className="flex-row items-center justify-between mt-3">
          <View className="flex-row">
            <Pressable className="bg-gray-100  dark:bg-gray-800 px-4 py-2 rounded-full mr-2 border dark:border-gray-700 border-gray-200">
              <Text className="text-sm dark:text-white">Filtre</Text>
            </Pressable>
            <Pressable className="bg-gray-100  dark:bg-gray-800 px-4 py-2 rounded-full border dark:border-gray-700 border-gray-200">
              <Text className="text-sm dark:text-white">Trier</Text>
            </Pressable>
          </View>
          <Text className="text-gray-500 text-sm">6 résultats</Text>
        </View>
      </View>
    </View>
  );
}
