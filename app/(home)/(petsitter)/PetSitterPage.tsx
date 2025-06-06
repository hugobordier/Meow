import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  useColorScheme,
} from "react-native";
import SearchBarPetsitter from "@/components/SearchBarPetSitter";
import PetSitterCard from "@/components/PetSitterCard";
import {
  PaginationParams,
  PetSitterQueryParams,
  ResponsePetsitter,
} from "@/types/type";
import { getPetSitters } from "@/services/petsitter.service";
import * as Location from "expo-location";

// Données complètes (simulant une grande liste)
const allData = [
  {
    id: "1",
    title: "Garder un chat",
    price: 20,
    time: "de 15h à 22h le 13/09/2025",
    image: "https://placekitten.com/100/100",
  },
  {
    id: "2",
    title: "Garder un chien",
    price: 30,
    time: "de 20h à 22h le 15/09/2025",
    image: "https://placedog.net/100/100?id=1",
  },
  {
    id: "3",
    title: "Garder un chien",
    price: 15,
    time: "de 15h à 19h le 12/09/2025",
    image: "https://placedog.net/100/100?id=2",
  },
  {
    id: "4",
    title: "Garder un chat",
    price: 15,
    time: "de 08h à 12h le 15/09/2025",
    image: "https://placekitten.com/101/101",
  },
  {
    id: "5",
    title: "Garder un chien",
    price: 23,
    time: "de 09h à 15h le 13/09/2025",
    image: "https://placedog.net/100/100?id=3",
  },
  {
    id: "6",
    title: "Garder un chat",
    price: 17,
    time: "de 10h à 22h le 15/09/2025",
    image: "https://placekitten.com/102/102",
  },
  {
    id: "7",
    title: "Garder un lapin",
    price: 12,
    time: "de 14h à 18h le 16/09/2025",
    image: "https://placekitten.com/103/103",
  },
  {
    id: "8",
    title: "Garder un chien",
    price: 25,
    time: "de 07h à 19h le 17/09/2025",
    image: "https://placedog.net/100/100?id=4",
  },
  {
    id: "9",
    title: "Garder un chat",
    price: 18,
    time: "de 16h à 20h le 18/09/2025",
    image: "https://placekitten.com/104/104",
  },
  {
    id: "10",
    title: "Garder un chien",
    price: 22,
    time: "de 12h à 18h le 19/09/2025",
    image: "https://placedog.net/100/100?id=5",
  },
  {
    id: "11",
    title: "Garder un chat",
    price: 19,
    time: "de 13h à 17h le 20/09/2025",
    image: "https://placekitten.com/105/105",
  },
  {
    id: "12",
    title: "Garder un chien",
    price: 28,
    time: "de 08h à 16h le 21/09/2025",
    image: "https://placedog.net/100/100?id=6",
  },
  {
    id: "13",
    title: "Garder un hamster",
    price: 10,
    time: "de 18h à 22h le 22/09/2025",
    image: "https://placekitten.com/106/106",
  },
  {
    id: "14",
    title: "Garder un chien",
    price: 35,
    time: "de 06h à 18h le 23/09/2025",
    image: "https://placedog.net/100/100?id=7",
  },
  {
    id: "15",
    title: "Garder un chat",
    price: 16,
    time: "de 17h à 21h le 24/09/2025",
    image: "https://placekitten.com/107/107",
  },
];

export default function PetSitterPage() {
  const [displayedData, setDisplayedData] = useState(allData.slice(0, 10));
  const [currentIndex, setCurrentIndex] = useState(10);
  const [pagination] = useState<PaginationParams | null>({
    page: 1,
    limit: 100000,
  });
  const [filters, setFilters] = useState<PetSitterQueryParams | null>(null);
  const [petsitter, setPetsitter] = useState<ResponsePetsitter[] | null>([]);
  const [loading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [locationPermission, setLocationPermission] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission refusée",
          "Nous avons besoin de votre localisation pour cette fonctionnalité."
        );
        return;
      }

      setLocationPermission(true);

      try {
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        setUserLocation({
          latitude,
          longitude,
        });
      } catch (error) {
        console.error("Error getting location:", error);
      }
    })();
  }, []);

  const getPetSitter = async (
    pagination?: PaginationParams | null,
    filters?: PetSitterQueryParams | null
  ) => {
    try {
      setIsLoading(true);

      const res = await getPetSitters(filters, pagination);

      setPetsitter(res.petsitters);
    } catch (e) {
      console.error("Erreur getPetSitter :", e);
      setPetsitter([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFilters = (newFilters: PetSitterQueryParams) => {
    console.log("update fileter", newFilters);
    setFilters(newFilters);
  };

  const loadMore = () => {
    const nextItems = allData.slice(currentIndex, currentIndex + 10);
    setDisplayedData([...displayedData, ...nextItems]);
    setCurrentIndex(currentIndex + 10);
  };

  const handleSelectPetSitter = (item: any) => {
    Alert.alert(
      "Pet-sitter sélectionné",
      `Vous avez sélectionné: ${item.title}`
    );
  };

  const renderFooter = () => {
    if (currentIndex >= allData.length) {
      return (
        <View style={{ padding: 20, alignItems: "center" }}>
          <Text style={{ color: "gray" }}>
            Tous les résultats ont été chargés
          </Text>
        </View>
      );
    }

    return (
      <View style={{ padding: 20, alignItems: "center" }}>
        <TouchableOpacity
          style={{
            backgroundColor: isDark ? "#D946EF" : "#3849d6",
            borderRadius: 10,
            paddingHorizontal: 20,
            paddingVertical: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
          onPress={loadMore}
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
            Afficher plus ({Math.min(10, allData.length - currentIndex)}{" "}
            résultats)
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-fuchsia-50 dark:bg-gray-900">
      <SearchBarPetsitter />
      <FlatList
        data={displayedData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 10, paddingTop: 10 }}
        renderItem={({ item }) => (
          <PetSitterCard item={item} onSelect={handleSelectPetSitter} />
        )}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
