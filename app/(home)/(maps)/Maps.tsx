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
  ActivityIndicator,
  SectionList,
  Animated,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import BottomSheet from "@gorhom/bottom-sheet";
import SearchBarMap from "@/components/SearchBarMap";
import UserLocationMarker from "@/components/UserLocationMarker";
import PetSitterBottomSheet from "@/components/PetSitterBottomSheet";
import { Cat, Dog } from "lucide-react-native";
import { useColorScheme } from "react-native";
import { darkMapStyle, lightMapStyle } from "@/utils/constants";
import { getPetSitters } from "@/services/petsitter.service";
import {
  PaginationParams,
  PetSitterQueryParams,
  ResponsePetsitter,
} from "@/types/type";
import { AntDesign, Feather } from "@expo/vector-icons";

const Maps = () => {
  const mapRef = useRef<MapView | null>(null);
  const bottomSheetRef = useRef<BottomSheet | null>(null);

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
  const [petsitter, setPetsitter] = useState<ResponsePetsitter[] | null>([]);
  const [loading, setIsLoading] = useState(false);

  // État pour le BottomSheet
  const [selectedPetSitter, setSelectedPetSitter] =
    useState<ResponsePetsitter | null>(null);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [tooltipVisible, setTooltipVisible] = useState<string | null>(null);
  const tooltipOpacity = useRef(new Animated.Value(0)).current;

  const showTooltip = (petSitterId: string) => {
    setTooltipVisible(petSitterId);
    Animated.timing(tooltipOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      hideTooltip();
    }, 10000);
  };

  const hideTooltip = () => {
    Animated.timing(tooltipOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setTooltipVisible(null);
    });
  };

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

  const centerOnMarker = (latitude: number, longitude: number) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: latitude - 0.0001,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        1000
      );
    }
  };

  const togglePetType = () => {
    setPetType(petType === "cat" ? "dog" : "cat");
  };

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

  const onSearchCity = (longitude?: number, latitude?: number) => {
    if (mapRef.current && longitude && latitude) {
      mapRef.current.animateToRegion(
        {
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        1000
      );
    } else {
      centerOnUserLocation();
    }
  };

  const openPetSitterDetails = (ps: ResponsePetsitter) => {
    setSelectedPetSitter(ps);
    bottomSheetRef.current?.snapToIndex(0);
    showTooltip(ps.petsitter.id);
  };

  useEffect(() => {
    getPetSitter();
  }, []);

  useEffect(() => {
    console.log("filter : ", filters);
    getPetSitter(pagination, filters);
  }, [filters]);

  const getBgColor = () => {
    return isDark ? "#1a202c" : "rgba(253, 242, 255, 0.98)";
  };

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
              petsitter.length > 0 &&
              petsitter.map((ps) => {
                const { latitude, longitude } = ps.petsitter || {};

                if (
                  typeof latitude !== "number" ||
                  typeof longitude !== "number" ||
                  isNaN(latitude) ||
                  isNaN(longitude)
                ) {
                  return null;
                }

                return (
                  <Marker
                    key={ps.petsitter.id}
                    coordinate={{ latitude, longitude }}
                    onPress={() => {
                      openPetSitterDetails(ps);
                      centerOnMarker(latitude, longitude);
                    }}
                  >
                    <View style={{ alignItems: "center" }}>
                      {/* Tooltip */}
                      {tooltipVisible === ps.petsitter.id && (
                        <Animated.View
                          style={{
                            opacity: tooltipOpacity,
                            marginBottom: 5,
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            backgroundColor: isDark ? "#374151" : "#ffffff",
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: isDark ? "#4B5563" : "#D1D5DB",
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 12,
                              fontWeight: "600",
                              color: isDark ? "#ffffff" : "#000000",
                              textAlign: "center",
                            }}
                          >
                            {ps.user.firstName} {ps.user.lastName}
                          </Text>
                        </Animated.View>
                      )}

                      {/* Marqueur avec le tarif */}
                      <View
                        className={`px-2 py-1 rounded-full border ${
                          isDark
                            ? "bg-gray-800 border-gray-600"
                            : "bg-white border-gray-300"
                        }`}
                      >
                        <Text
                          className={`text-base font-bold ${
                            isDark ? "text-white" : "text-black"
                          }`}
                        >
                          {ps.petsitter.hourly_rate} €
                        </Text>
                      </View>
                    </View>
                  </Marker>
                );
              })}

            {userLocation && (
              <UserLocationMarker
                coordinate={userLocation}
                heading={0}
                zoomLevel={zoomLevel}
                petType={petType}
              />
            )}
          </MapView>

          <SearchBarMap
            onSearch={updateFilters}
            initialCity=""
            count={petsitter?.length}
            onSearchCity={onSearchCity}
          />

          {loading && (
            <View className="absolute top-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/50 p-4 rounded-lg">
              <ActivityIndicator size="large" color="#2563EB" />
              <Text className="text-white mt-2 font-semibold text-center">
                Chargement des pet sitters...
              </Text>
            </View>
          )}

          <View className="absolute bottom-6 right-6 flex gap-3 flex-col space-y-3">
            <TouchableOpacity
              onPress={togglePetType}
              className=" shadow-md "
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: getBgColor(),
              }}
            >
              {petType === "cat" ? (
                <Cat size={24} color="#2563EB" />
              ) : (
                <Dog size={24} color="#2563EB" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={centerOnUserLocation}
              className="shadow-md"
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: getBgColor(),
              }}
            >
              <AntDesign name="enviromento" size={24} color="#d946ef" />
            </TouchableOpacity>
          </View>

          {/* BottomSheet Gorhom */}
          <PetSitterBottomSheet
            petSitter={selectedPetSitter}
            bottomSheetRef={bottomSheetRef}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Maps;
