import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import SearchBarPetsitter from "@/components/SearchBarPetSitter";
import PetSitterCard from "@/components/PetSitterCard";
import PetSitterModal from "@/components/PetSitterModal";
import {
  Pagination,
  PetSitterQueryParams,
  ResponsePetsitter,
} from "@/types/type";
import { getPetSittersWithPagination } from "@/services/petsitter.service";
import { useAuthContext } from "@/context/AuthContext";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";

export default function PetSitterPage() {
  const [filters, setFilters] = useState<PetSitterQueryParams>({
    minRate: 0,
    maxRate: 100,
    radius: 10,
  });
  const [petsitters, setPetsitters] = useState<ResponsePetsitter[]>([]);
  const [loading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [locationPermission, setLocationPermission] = useState(false);
  const [resultPagination, setResultPagination] = useState<Pagination>({
    currentPage: "1",
    itemsPerPage: "10",
    totalItems: "0",
    totalPages: "0",
  });
  const [selectedPetSitter, setSelectedPetSitter] =
    useState<ResponsePetsitter | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Récupération du contexte d'authentification
  const { petsitter } = useAuthContext();

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
        setFilters({ ...filters, longitude: longitude, latitude: latitude });
      } catch (error) {
        console.log("Error getting location:", error);
      }
    })();
  }, []);

  useEffect(() => {
    getPetSitter(true);
  }, [filters, userLocation]);

  const getPetSitter = async (reset: boolean = false) => {
    try {
      setIsLoading(true);
      const page = reset ? 1 : parseInt(resultPagination.currentPage) + 1;
      const res = await getPetSittersWithPagination(filters, {
        page,
        limit: 10,
      });

      if (reset) {
        //@ts-ignore
        setPetsitters(res.data.petsitters);
      } else {
        //@ts-ignore
        setPetsitters((prev) => [...prev, ...res.data.petsitters]);
      }

      setResultPagination(res.pagination);
    } catch (e) {
      console.log("Erreur getPetSitter :", e);
      if (reset) {
        setPetsitters([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    if (
      !loading &&
      parseInt(resultPagination.currentPage) <
        parseInt(resultPagination.totalPages)
    ) {
      getPetSitter();
    }
  };

  const updateFilters = (newFilters: PetSitterQueryParams) => {
    console.log("update filter", newFilters);
    setFilters(newFilters);
  };

  const handleSelectPetSitter = (item: ResponsePetsitter) => {
    setSelectedPetSitter(item);
    setModalVisible(true);
  };

  const renderFooter = () => {
    if (loading) {
      return (
        <View style={{ padding: 20, alignItems: "center" }}>
          <ActivityIndicator
            size="large"
            color={isDark ? "#D946EF" : "#3849d6"}
          />
        </View>
      );
    }

    if (petsitters.length === 0) {
      return (
        <View style={{ padding: 20, alignItems: "center" }}>
          <Text style={{ color: isDark ? "#FFFFFF" : "#000000" }}>
            Aucun pet-sitter trouvé
          </Text>
        </View>
      );
    }

    if (
      parseInt(resultPagination.currentPage) <
      parseInt(resultPagination.totalPages)
    ) {
      return (
        <TouchableOpacity
          onPress={loadMore}
          style={{
            padding: 15,
            alignItems: "center",
            backgroundColor: isDark ? "#D946EF" : "#3849d6",
            marginHorizontal: 20,
            marginVertical: 10,
            borderRadius: 40,
            width: "40%",
            alignSelf: "center",
          }}
        >
          <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>
            Charger plus
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={{ padding: 20, alignItems: "center" }}>
        <Text
          style={{ color: isDark ? "#FFFFFF" : "#000000", textAlign: "center" }}
        >
          Y'a plus de pet-sitters à charger ! 😺
        </Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-fuchsia-50 dark:bg-gray-900">
      <SearchBarPetsitter
        onSearch={updateFilters}
        onSearchCity={(longitude, latitude) => {
          console.log("longitude", longitude);
          console.log("latitude", latitude);
          if (longitude && latitude) {
            setUserLocation({ longitude, latitude });
          }
        }}
        count={resultPagination ? parseInt(resultPagination.totalItems) : 0}
      />

      <FlatList
        data={petsitters}
        keyExtractor={(item) => `${item.petsitter.id}-${item.user.id}`}
        contentContainerStyle={{ paddingHorizontal: 10, paddingTop: 10 }}
        renderItem={({ item }) => (
          <PetSitterCard item={item} onSelect={handleSelectPetSitter} />
        )}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />

      <PetSitterModal
        petSitter={selectedPetSitter}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}
