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
import {
  Pagination,
  PetSitterQueryParams,
  ResponsePetsitter,
} from "@/types/type";
import { getPetSitters } from "@/services/petsitter.service";
import * as Location from "expo-location";

export default function PetSitterPage() {
  const [filters, setFilters] = useState<PetSitterQueryParams>({
    minRate: 0,
    maxRate: 100,
    radius: 10,
  });
  const [petsitters, setPetsitters] = useState<ResponsePetsitter[]>([]);
  const [loading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
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
    totalPages: "0"
  });

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

  useEffect(() => {
    getPetSitter(true);
  }, [filters, userLocation]);

  const getPetSitter = async (reset: boolean = false) => {
    try {
      setIsLoading(true);
      console.log("on rentre dans getPetSitter")
      const page = reset ? 1 : currentPage;
      const res = await getPetSitters(filters, { page, limit: 10 });
      
      if (reset) {
        setPetsitters(res.petsitters);
        setCurrentPage(1);
      } else {
        setPetsitters(prev => [...prev, ...res.petsitters]);
      }
      
      setResultPagination(res.pagination);
    } catch (e) {
      console.error("Erreur getPetSitter :", e);
      if (reset) {
        setPetsitters([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    console.log("on rentre dans loadMore")
    console.log(resultPagination)
    if (!loading && currentPage < parseInt(resultPagination.totalPages)) {
      setCurrentPage(prev => prev + 1);
      getPetSitter();
    }
  };

  const updateFilters = (newFilters: PetSitterQueryParams) => {
    console.log("update filter", newFilters);
    setFilters(newFilters);
  };

  const handleSelectPetSitter = (item: ResponsePetsitter) => {
    Alert.alert(
      "Pet-sitter sélectionné",
      `Vous avez sélectionné: ${item.user.firstName} ${item.user.lastName}`
    );
  };

  const renderFooter = () => {
    if (loading) {
      return (
        <View style={{ padding: 20, alignItems: "center" }}>
          <ActivityIndicator size="large" color={isDark ? "#D946EF" : "#3849d6"} />
        </View>
      );
    }

    // if (petsitters.length === 0) {
    //   return (
    //     <View style={{ padding: 20, alignItems: "center" }}>
    //       <Text style={{ color: isDark ? "#FFFFFF" : "#000000" }}>
    //         Aucun pet-sitter trouvé
    //       </Text>
    //     </View>
    //   );
    // }

    if (true) {
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

    return null;
  };

  return (
    <View className="flex-1 bg-fuchsia-50 dark:bg-gray-900">
      <SearchBarPetsitter 
        onSearch={updateFilters}
        onSearchCity={(longitude, latitude) => {
          if (longitude && latitude) {
            setUserLocation({ longitude, latitude });
          }
        }}
        count={resultPagination ? parseInt(resultPagination.totalItems) : 0  }
      />
      <FlatList
        data={petsitters}
        keyExtractor={(item) => item.petsitter.id}
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
