import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Platform,
  Keyboard,
  Alert,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { LocateFixed } from "lucide-react-native";
import SearchBarMap from "@/components/SearchBarMap";
import UserLocationMarker from "@/components/UserLocationMarker";
import { Cat, Dog } from "lucide-react-native";
import { useColorScheme } from "react-native";
import { darkMapStyle, lightMapStyle } from "@/utils/constants";
import { getPetSitters } from "@/services/petsitter.service";
import { PaginationParams, PetSitterQueryParams } from "@/types/type";
import { isLoaded, isLoading } from "expo-font";

export default function MeowMapScreen() {
  const mapRef = useRef<MapView | null>(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 48.8566,
    longitude: 2.3522,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const [petType, setPetType] = useState<"cat" | "dog">("cat");
  const [zoomLevel, setZoomLevel] = useState(0.01);
  const [pagination] = useState<PaginationParams | null>({
    page: 1,
    limit: 100000,
  });
  const [filters, setFilters] = useState<PetSitterQueryParams | null>(null);
  const [petsitter, setPetsitter] = useState<any | null>(null);
  const [loading, setIsLoading] = useState(false);
  const colorScheme = useColorScheme();

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

        setMapRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } catch (error) {
        console.error("Error getting location:", error);
      }
    })();
  }, []);

  useEffect(() => {
    if (!locationPermission) return;

    let locationSubscription: Location.LocationSubscription | null = null;

    const startLocationTracking = async () => {
      try {
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 5, // Update every 5 meters
          },
          (location) => {
            const { latitude, longitude } = location.coords;
            setUserLocation({ latitude, longitude });
          }
        );
      } catch (error) {
        console.warn("Erreur lors de la géolocalisation :", error);
      }
    };

    startLocationTracking();

    return () => {
      locationSubscription?.remove();
    };
  }, [locationPermission]);

  const handleSearch = () => {};

  const centerOnUserLocation = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        1000
      );
    } else {
      Alert.alert(
        "Localisation non disponible",
        "Nous ne pouvons pas accéder à votre position actuelle. "
      );
    }
  };

  // Toggle between cat and dog marker
  const togglePetType = () => {
    setPetType(petType === "cat" ? "dog" : "cat");
  };

  // Handle map region change to update zoom level
  const onRegionChange = (region: any) => {
    const { latitudeDelta, longitudeDelta } = region;
    const MAX_DELTA = 0.1;
    const MIN_DELTA = 0.001;

    if (
      latitudeDelta > MAX_DELTA ||
      longitudeDelta > MAX_DELTA ||
      latitudeDelta < MIN_DELTA ||
      longitudeDelta < MIN_DELTA
    ) {
      return;
    }

    setZoomLevel(region.latitudeDelta);
  };

  const getPetSitter = async (
    pagination?: PaginationParams | null,
    filters?: PetSitterQueryParams | null
  ) => {
    try {
      setIsLoading(true);
      const res = await getPetSitters(filters, pagination);
      setPetsitter(res.data || []);
    } catch (e) {
      setPetsitter([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFilters = (newFilters: Partial<PetSitterQueryParams>) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };
  useEffect(() => {
    getPetSitter();
    console.log(loading);
    console.log("long", petsitter);
  }, [isLoading]);
  useEffect(() => {
    getPetSitter(pagination, filters);
  }, [filters]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <MapView
            maxDelta={10}
            ref={mapRef}
            style={{ flex: 1 }}
            region={mapRegion}
            customMapStyle={
              colorScheme === "dark" ? darkMapStyle : lightMapStyle
            }
            provider={PROVIDER_GOOGLE}
            showsUserLocation={false}
            followsUserLocation={false}
            onRegionChange={onRegionChange}
          >
            {petsitter &&
              petsitter.petsitters.map((ps: any) => (
                <Marker
                  key={ps.petsitter.id}
                  coordinate={{
                    latitude: ps.petsitter.latitude,
                    longitude: ps.petsitter.longitude,
                  }}
                >
                  <View className="bg-white px-2 py-1 rounded-full border border-gray-300">
                    <Text className="text-base font-bold">
                      {ps.petsitter.hourly_rate} €
                    </Text>
                  </View>
                </Marker>
              ))}

            {userLocation && (
              <UserLocationMarker
                coordinate={userLocation}
                heading={0}
                zoomLevel={zoomLevel}
                petType={petType}
              />
            )}
          </MapView>

          <SearchBarMap onSearch={handleSearch} initialCity="Paris" />

          {/* Control buttons container */}
          <View className="absolute bottom-6 right-6 flex flex-col space-y-3">
            {/* Toggle pet type */}
            <TouchableOpacity
              onPress={togglePetType}
              className="bg-white p-3 rounded-full shadow-md border border-gray-200"
              style={{ elevation: 5 }}
            >
              {petType === "cat" ? (
                <Cat size={24} color="#2563EB" />
              ) : (
                <Dog size={24} color="#2563EB" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                getPetSitter(pagination, filters);
              }}
              className="bg-white p-3 rounded-full shadow-md border border-gray-200"
              style={{ elevation: 5 }}
            >
              <Dog size={24} color="#2563EB" />
            </TouchableOpacity>

            {/* Recenter button */}
            <TouchableOpacity
              onPress={centerOnUserLocation}
              className="bg-white p-3 rounded-full shadow-md border border-gray-200"
              style={{ elevation: 5 }}
            >
              <LocateFixed size={24} color="#2563EB" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
