import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useRouter } from "expo-router";
import SearchBarMap from "@/components/SearchBarMap"; // Importez le composant

// Données enrichies des marqueurs avec plus d'informations
const initialMarkers = [
  {
    id: 1,
    price: "15€",
    latitude: 48.8566,
    longitude: 2.3522,
    animal: "Chat",
    services: ["Alimentation", "Jeux"],
    city: "Paris",
  },
  {
    id: 2,
    price: "20€",
    latitude: 48.857,
    longitude: 2.353,
    animal: "Chat",
    services: ["Alimentation", "Promenade"],
    city: "Paris",
  },
  {
    id: 3,
    price: "23€",
    latitude: 48.855,
    longitude: 2.351,
    animal: "Chien",
    services: ["Promenade", "Jeux", "Soins"],
    city: "Paris",
  },
  {
    id: 4,
    price: "24€",
    latitude: 48.858,
    longitude: 2.354,
    animal: "Chat",
    services: ["Toilettage", "Soins"],
    city: "Paris",
  },
  {
    id: 5,
    price: "25€",
    latitude: 48.859,
    longitude: 2.355,
    animal: "Oiseau",
    services: ["Alimentation"],
    city: "Paris",
  },
  {
    id: 6,
    price: "30€",
    latitude: 48.86,
    longitude: 2.356,
    animal: "Chien",
    services: ["Promenade", "Jeux", "Alimentation"],
    city: "Paris",
  },
  {
    id: 7,
    price: "18€",
    latitude: 48.87,
    longitude: 2.34,
    animal: "Chat",
    services: ["Jeux", "Soins"],
    city: "Paris",
  },
  {
    id: 8,
    price: "22€",
    latitude: 45.75,
    longitude: 4.85,
    animal: "Chat",
    services: ["Alimentation", "Jeux"],
    city: "Lyon",
  },
  {
    id: 9,
    price: "27€",
    latitude: 43.296,
    longitude: 5.37,
    animal: "Chien",
    services: ["Promenade", "Soins"],
    city: "Marseille",
  },
];

export default function MeowMapScreen() {
  const router = useRouter();
  const [markers, setMarkers] = useState(initialMarkers);
  const [filteredMarkers, setFilteredMarkers] = useState(initialMarkers);
  const [mapRegion, setMapRegion] = useState({
    latitude: 48.8566,
    longitude: 2.3522,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const handleSearch = (searchParams: {
    city: any;
    dates: any;
    filters: any;
  }) => {
    const { city, dates, filters } = searchParams;

    const filtered = markers.filter((marker) => {
      if (
        city &&
        city.trim() !== "" &&
        !marker.city.toLowerCase().includes(city.toLowerCase())
      ) {
        return false;
      }

      if (filters.animal && marker.animal !== filters.animal) {
        return false;
      }

      const markerPrice = parseInt(marker.price.replace("€", ""));
      if (markerPrice < filters.minPrice || markerPrice > filters.maxPrice) {
        return false;
      }

      // Filtre par services
      if (filters.services && filters.services.length > 0) {
        const hasMatchingService = filters.services.some((service: string) =>
          marker.services.includes(service)
        );
        if (!hasMatchingService) {
          return false;
        }
      }

      return true;
    });

    setFilteredMarkers(filtered);

    if (filtered.length > 0) {
      setMapRegion({
        latitude: filtered[0].latitude,
        longitude: filtered[0].longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <MapView style={{ flex: 1 }} region={mapRegion} provider="google">
            {filteredMarkers.map((marker) => (
              <Marker
                key={marker.id}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                title={marker.price}
                description={`${marker.animal} - ${marker.services.join(", ")}`}
              >
                <View className="bg-white px-2 py-1 rounded-full border border-gray-300">
                  <Text className="text-base font-bold">{marker.price}</Text>
                </View>
              </Marker>
            ))}
          </MapView>

          <SearchBarMap onSearch={handleSearch} initialCity="Paris" />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
