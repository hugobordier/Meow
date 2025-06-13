import type React from "react";
import debounce from "lodash/debounce";
import { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  Animated,
  useColorScheme,
  ActivityIndicator,
  Keyboard,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import type {
  AnimalType,
  AvailabilityDay,
  AvailabilityInterval,
  PetSitterQueryParams,
  ServiceType,
} from "@/types/type";
import { type CityResult, searchCityByName } from "@/utils/serrchCityByName";
import { ScrollView } from "react-native-gesture-handler";
import * as Location from "expo-location";

type SearchBarPetSitterProps = {
  onSearch?: (params: PetSitterQueryParams) => void;
  onSearchCity?: (longitude?: number, latitude?: number) => void;
  initialCity?: string;
  count?: number;
};

const SearchBarPetSitter: React.FC<SearchBarPetSitterProps> = ({
  onSearch,
  onSearchCity,
  initialCity = "",
  count = 0,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [city, setCity] = useState<string>(initialCity);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showCitySuggestions, setShowCitySuggestions] =
    useState<boolean>(false);
  const [citySuggestions, setCitySuggestions] = useState<CityResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<
    "current" | "city" | "none"
  >("current");
  const [selectedCoordinates, setSelectedCoordinates] = useState<{
    longitude: number;
    latitude: number;
  } | null>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [filters, setFilters] = useState<PetSitterQueryParams>({
    minRate: 0,
    maxRate: 100,
    radius: 10,
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
        setFilters({ ...filters, longitude: longitude, latitude: latitude });
      } catch (error) {
        console.log("Error getting location:", error);
      }
    })();
  }, []);

  const filterAnim = useRef(new Animated.Value(0)).current;
  const filterScaleAnim = useRef(new Animated.Value(0.95)).current;

  const filterHeight = filterAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 500],
  });

  const filterOpacity = filterAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const filterScale = filterScaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.95, 1],
  });

  const suggestionAnim = useRef(new Animated.Value(0)).current;
  const suggestionScaleAnim = useRef(new Animated.Value(0.95)).current;

  const suggestionHeight = suggestionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 250],
  });

  const suggestionOpacity = suggestionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const suggestionScale = suggestionScaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.95, 1],
  });

  const availableServices: ServiceType[] = [
    "Promenade",
    "Alimentation",
    "Jeux",
    "Soins",
    "Toilettage",
    "Dressage",
    "Garderie",
    "Médication",
    "Nettoyage",
    "Transport",
  ];

  const availableDays: AvailabilityDay[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const dayMapping: Record<AvailabilityDay, string> = {
    Monday: "Lundi",
    Tuesday: "Mardi",
    Wednesday: "Mercredi",
    Thursday: "Jeudi",
    Friday: "Vendredi",
    Saturday: "Samedi",
    Sunday: "Dimanche",
  };

  const availableTimeSlots: AvailabilityInterval[] = [
    "Matin",
    "Après-midi",
    "Soir",
    "Nuit",
  ];

  const availaibleAnimal: AnimalType[] = [
    "Chat",
    "Chien",
    "Oiseau",
    "Rongeur",
    "Reptile",
    "Poisson",
    "Furet",
    "Cheval",
    "Autre",
  ];

  const toggleFilters = () => {
    if (showCitySuggestions) {
      hideCitySuggestions();
    }

    if (!showFilters) {
      setShowFilters(true);
      Animated.parallel([
        Animated.timing(filterAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(filterScaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(filterAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(filterScaleAnim, {
          toValue: 0.95,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start(() => {
        setShowFilters(false);
      });
    }
  };

  const showCityResults = () => {
    if (showFilters) {
      Animated.parallel([
        Animated.timing(filterAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(filterScaleAnim, {
          toValue: 0.95,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start(() => {
        setShowFilters(false);
        displayCitySuggestions();
      });
    } else {
      displayCitySuggestions();
    }
  };

  const displayCitySuggestions = () => {
    setShowCitySuggestions(true);
    Animated.parallel([
      Animated.timing(suggestionAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(suggestionScaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const hideCitySuggestions = () => {
    Animated.parallel([
      Animated.timing(suggestionAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(suggestionScaleAnim, {
        toValue: 0.95,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setShowCitySuggestions(false);
      Keyboard.dismiss();
    });
  };

  const handleSearch = () => {
    console.log("FILTRE :", filters);
    if (onSearch) {
      onSearch(filters);
    }
  };

  const debouncedCitySearch = useCallback(
    debounce(async (text: string) => {
      console.log("Debounced search city call: ", text);
      if (text.length > 1) {
        setIsSearching(true);

        try {
          const results = await searchCityByName(text);
          console.log("API results:", results);

          if (results.length > 0) {
            setCitySuggestions(results);
            if (!showCitySuggestions) {
              showCityResults();
            }
          } else {
            setCitySuggestions([]);
            if (showCitySuggestions) {
              hideCitySuggestions();
            }
          }
        } catch (error) {
          console.log("Error searching cities:", error);
          setCitySuggestions([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setCitySuggestions([]);
        if (showCitySuggestions) {
          hideCitySuggestions();
        }
      }
    }, 500),
    [showCitySuggestions]
  );

  const handleCityInputChange = (text: string) => {
    setCity(text);
    debouncedCitySearch(text);
  };

  const useCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission refusée",
          "Nous avons besoin de votre localisation pour cette fonctionnalité."
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      setUserLocation({ latitude, longitude });
    } catch (error) {
      console.log("Error getting location:", error);
      Alert.alert("Erreur", "Impossible d'obtenir votre position actuelle.");
    }
  };

  const selectCity = (selectedCity: CityResult) => {
    setCity(selectedCity.city!);
    hideCitySuggestions();
    if (selectedCity && onSearchCity) {
      onSearchCity(selectedCity.longitude, selectedCity.latitude);
      setFilters({
        ...filters,
        longitude: selectedCity.longitude,
        latitude: selectedCity.latitude,
      });
      setSelectedLocation("city");
      setSelectedCoordinates({
        longitude: selectedCity.longitude,
        latitude: selectedCity.latitude,
      });
    }
  };

  const getBgColor = () => {
    return isDark ? "#1a202c" : "#fff";
  };

  const getTextColor = () => {
    return isDark ? "#f8fafc" : "#2d3748";
  };

  const getInputBgColor = () => {
    return isDark ? "#2d3748" : "#f9fafb";
  };

  const getAccentColor = () => {
    return isDark ? "#d946ef" : "#3849d6";
  };

  const getBorderColor = () => {
    return isDark ? "#4a5568" : "#cbd5e0";
  };

  const toggleAnimalType = (animal: AnimalType) => {
    const current = filters.animal_types || [];
    const isSelected = current.includes(animal);
    const updated = isSelected
      ? current.filter((a) => a !== animal)
      : [...current, animal];

    setFilters({ ...filters, animal_types: updated });
  };

  const toggleService = (service: ServiceType) => {
    const current = filters.services || [];
    const isSelected = current.includes(service);
    const updated = isSelected
      ? current.filter((s) => s !== service)
      : [...current, service];

    setFilters({ ...filters, services: updated });
  };

  const toggleDay = (day: AvailabilityDay) => {
    const current = filters.availability_days || [];
    const isSelected = current.includes(day);
    const updated = isSelected
      ? current.filter((s) => s !== day)
      : [...current, day];

    setFilters({ ...filters, availability_days: updated });
  };

  const toggleTimeSlot = (slot: AvailabilityInterval) => {
    const current = filters.availability_intervals || [];
    const isSelected = current.includes(slot);
    const updated = isSelected
      ? current.filter((s) => s !== slot)
      : [...current, slot];

    setFilters({ ...filters, availability_intervals: updated });
  };

  const resetFilters = () => {
    setFilters({ minRate: 0, maxRate: 100, radius: 10 });
  };

  const applyFilters = () => {
    toggleFilters();
    handleSearch();
  };

  const handleMinPriceChange = (value: number) => {
    setFilters((prev) => ({
      ...prev,
      minRate: isNaN(prev.minRate!) ? value : Math.min(value, prev.maxRate!),
    }));
  };

  const handleMaxPriceChange = (value: number) => {
    setFilters((prev) => ({
      ...prev,
      maxRate: isNaN(prev.maxRate!) ? value : Math.max(value, prev.minRate!),
    }));
  };

  const handleDistanceChange = (value: number) => {
    setFilters((prev) => ({
      ...prev,
      radius: value,
    }));
  };

  const getSearchBarBorderRadius = () => {
    if (showFilters || showCitySuggestions) {
      return {
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      };
    }
    return { borderRadius: 16 };
  };

  const getMenuBorderRadius = () => {
    return {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16,
    };
  };

  return (
    <View style={{ position: "relative", zIndex: 1 }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
        <View
          style={{
            backgroundColor: getBgColor(),
            padding: 16,
            ...getSearchBarBorderRadius(),
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                flexDirection: "row",
                flex: 1,
                alignItems: "center",
                backgroundColor: getInputBgColor(),
                borderRadius: 12,
                padding: 12,
              }}
            >
              <Feather
                name="search"
                size={20}
                color="#666"
                style={{ marginRight: 8 }}
              />
              <View style={{ flex: 1 }}>
                <TextInput
                  value={city}
                  onChangeText={handleCityInputChange}
                  placeholder="Ville"
                  placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
                  style={{
                    fontWeight: "500",
                    color: getTextColor(),
                  }}
                  onFocus={() => {
                    if (city.length >= 0) {
                      showCityResults();
                    }
                  }}
                />
                {filters.availability_days &&
                  filters.availability_days?.length > 0 && (
                    <Text
                      style={{
                        fontSize: 12,
                        color: getTextColor(),
                      }}
                    >
                      {filters.availability_days &&
                      filters.availability_days.length > 0
                        ? filters.availability_days
                            .map((day: string) =>
                              //@ts-ignore
                              filters.availability_days.length > 3
                                ? day.slice(0, 2)
                                : day
                            )
                            .join(" - ")
                        : ""}
                    </Text>
                  )}
              </View>
              {isSearching && (
                <ActivityIndicator
                  size="small"
                  color={getAccentColor()}
                  style={{ marginLeft: 4 }}
                />
              )}
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 12,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Pressable
                onPress={toggleFilters}
                style={{
                  backgroundColor: showFilters
                    ? getAccentColor()
                    : getInputBgColor(),
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 9999,
                  marginRight: 8,
                  borderWidth: 1,
                  borderColor: getBorderColor(),
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    marginRight: 4,
                    color: showFilters ? "white" : getTextColor(),
                  }}
                >
                  Filtre
                </Text>
                <Feather
                  name="sliders"
                  size={14}
                  color={showFilters ? "white" : getTextColor()}
                />
              </Pressable>
              <View
                style={{
                  backgroundColor: getInputBgColor(),
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 9999,
                  borderWidth: 1,
                  borderColor: getBorderColor(),
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Feather
                  name="map-pin"
                  size={14}
                  color={getTextColor()}
                  style={{ marginRight: 4 }}
                />
                <Text
                  style={{
                    fontSize: 14,
                    color: getTextColor(),
                  }}
                >
                  {filters.radius} km
                </Text>
              </View>
            </View>
            <Text style={{ color: getTextColor(), fontSize: 14 }}>
              {count} résultats
            </Text>
          </View>
        </View>
      </View>

      {showCitySuggestions && (
        <Animated.View
          style={{
            position: "absolute",
            top: "100%",
            left: "4%",
            right: "4%",
            width: "92%",
            backgroundColor: getBgColor(),
            opacity: suggestionOpacity,
            height: suggestionHeight,
            transform: [
              { scaleY: suggestionScale },
              {
                translateY: suggestionAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
            transformOrigin: "top",
            overflow: "hidden",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 8,
            zIndex: 1000,
            ...getMenuBorderRadius(),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: getBorderColor(),
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: getTextColor(),
              }}
            >
              Rechercher une ville
            </Text>
            <Pressable onPress={hideCitySuggestions}>
              <Feather name="x" size={20} color={getTextColor()} />
            </Pressable>
          </View>
          <ScrollView style={{ flex: 1 }}>
            <Pressable
              onPress={useCurrentLocation}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 14,
                paddingHorizontal: 16,
                borderBottomWidth: 1,
                borderBottomColor: getBorderColor(),
              }}
            >
              <Feather
                name="map-pin"
                size={18}
                color={getAccentColor()}
                style={{ marginRight: 12 }}
              />
              <Text style={{ color: getAccentColor(), fontWeight: "500" }}>
                Utiliser votre position actuelle
              </Text>
            </Pressable>

            {citySuggestions.map((suggestion) => (
              <Pressable
                key={suggestion.formattedAddress}
                onPress={() => selectCity(suggestion)}
                style={{
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: getBorderColor(),
                }}
              >
                <Text style={{ color: getTextColor(), fontWeight: "bold" }}>
                  {suggestion.city || suggestion.formattedAddress}
                </Text>
                <Text style={{ color: getTextColor(), fontSize: 12 }}>
                  {suggestion.formattedAddress}
                </Text>
                <Text style={{ color: getTextColor(), fontSize: 12 }}>
                  {suggestion.country}
                </Text>
              </Pressable>
            ))}

            {citySuggestions.length === 0 && !isSearching && (
              <View style={{ paddingVertical: 20, alignItems: "center" }}>
                <Text style={{ color: getTextColor(), opacity: 0.6 }}>
                  Aucun résultat trouvé
                </Text>
              </View>
            )}
          </ScrollView>
        </Animated.View>
      )}

      {/* Menu déroulant des filtres - Position absolue */}
      {showFilters && (
        <Animated.View
          style={{
            position: "absolute",
            top: "100%",
            left: "4%",
            right: "4%",
            width: "92%",
            backgroundColor: getBgColor(),
            opacity: filterOpacity,
            height: filterHeight,
            transform: [
              { scaleY: filterScale },
              {
                translateY: filterAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
            transformOrigin: "top",
            overflow: "hidden",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 8,
            zIndex: 1000,
            ...getMenuBorderRadius(),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: getBorderColor(),
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: getTextColor(),
              }}
            >
              Filtres
            </Text>
            <Pressable onPress={toggleFilters}>
              <Feather name="x" size={20} color={getTextColor()} />
            </Pressable>
          </View>

          <ScrollView style={{ flex: 1, padding: 16 }}>
            {/* Filtre de distance */}
            <View style={{ marginBottom: 16 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    color: getTextColor(),
                  }}
                >
                  Distance
                </Text>
                <View
                  style={{
                    backgroundColor: getAccentColor(),
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    borderRadius: 9999,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "500",
                      fontSize: 14,
                    }}
                  >
                    {filters.radius} km
                  </Text>
                </View>
              </View>

              <View style={{ marginBottom: 12 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    marginBottom: 8,
                    color: getTextColor(),
                  }}
                >
                  Rechercher depuis :
                </Text>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <Pressable
                    onPress={() => {
                      if (selectedLocation === "current") {
                        setSelectedLocation("none");
                        setSelectedCoordinates(null);
                        setFilters({
                          ...filters,
                          longitude: undefined,
                          latitude: undefined,
                        });
                      } else {
                        setSelectedLocation("current");
                        setSelectedCoordinates(userLocation); //revenir
                        setFilters({
                          ...filters,
                          longitude: userLocation?.longitude,
                          latitude: userLocation?.latitude,
                        });
                      }
                    }}
                    style={{
                      flex: 1,
                      backgroundColor:
                        selectedLocation === "current"
                          ? getAccentColor()
                          : getInputBgColor(),
                      paddingVertical: 10,
                      paddingHorizontal: 12,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: getBorderColor(),
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Feather
                      name="map-pin"
                      size={16}
                      color={
                        selectedLocation === "current"
                          ? "white"
                          : getTextColor()
                      }
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      style={{
                        color:
                          selectedLocation === "current"
                            ? "white"
                            : getTextColor(),
                        fontWeight:
                          selectedLocation === "current" ? "500" : "normal",
                      }}
                    >
                      Ma position
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      if (selectedLocation === "city") {
                        setSelectedLocation("none");
                        setSelectedCoordinates(null);
                        setFilters({
                          ...filters,
                          longitude: undefined,
                          latitude: undefined,
                        });
                      } else if (selectedCoordinates) {
                        setSelectedLocation("city");
                        if (onSearchCity)
                          onSearchCity(
                            selectedCoordinates.longitude,
                            selectedCoordinates.latitude
                          );
                      } else {
                        showCityResults();
                      }
                    }}
                    style={{
                      flex: 1,
                      backgroundColor:
                        selectedLocation === "city"
                          ? getAccentColor()
                          : getInputBgColor(),
                      paddingVertical: 10,
                      paddingHorizontal: 12,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: getBorderColor(),
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Feather
                      name="map"
                      size={16}
                      color={
                        selectedLocation === "city" ? "white" : getTextColor()
                      }
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      style={{
                        color:
                          selectedLocation === "city"
                            ? "white"
                            : getTextColor(),
                        fontWeight:
                          selectedLocation === "city" ? "500" : "normal",
                      }}
                    >
                      {city || "Choisir une ville"}
                    </Text>
                  </Pressable>
                </View>
              </View>

              <Slider
                minimumValue={1}
                maximumValue={50}
                step={1}
                value={filters.radius}
                onValueChange={handleDistanceChange}
                minimumTrackTintColor={getAccentColor()}
                maximumTrackTintColor={getBorderColor()}
                thumbTintColor={getAccentColor()}
                style={{ width: "100%" }}
              />
            </View>

            {/* Type d'animal */}
            <View style={{ marginBottom: 16 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  marginBottom: 8,
                  color: getTextColor(),
                }}
              >
                Type d'animal
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {availaibleAnimal.map((animal) => (
                  <Pressable
                    key={animal}
                    onPress={() => toggleAnimalType(animal)}
                    style={{
                      backgroundColor: filters.animal_types?.includes(animal)
                        ? getAccentColor()
                        : getInputBgColor(),
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      borderRadius: 9999,
                      marginRight: 8,
                      marginBottom: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        color: filters.animal_types?.includes(animal)
                          ? "white"
                          : getTextColor(),
                        fontWeight: filters.animal_types?.includes(animal)
                          ? "500"
                          : "normal",
                      }}
                    >
                      {animal}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Prix */}
            <View style={{ marginBottom: 16 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  marginBottom: 8,
                  color: getTextColor(),
                }}
              >
                Prix: {filters.minRate}€ - {filters.maxRate}€
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Slider
                  minimumValue={0}
                  maximumValue={100}
                  step={1}
                  value={filters.minRate}
                  onValueChange={handleMinPriceChange}
                  minimumTrackTintColor={getAccentColor()}
                  thumbTintColor={getAccentColor()}
                  style={{ width: "48%" }}
                />
                <Slider
                  minimumValue={0}
                  maximumValue={100}
                  step={1}
                  value={filters.maxRate}
                  onValueChange={handleMaxPriceChange}
                  minimumTrackTintColor={getAccentColor()}
                  thumbTintColor={getAccentColor()}
                  style={{ width: "48%" }}
                />
              </View>
            </View>

            {/* Services */}
            <View style={{ marginBottom: 16 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  marginBottom: 8,
                  color: getTextColor(),
                }}
              >
                Services
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {availableServices.map((service) => (
                  <Pressable
                    key={service}
                    onPress={() => toggleService(service)}
                    style={{
                      backgroundColor: filters.services?.includes(service)
                        ? getAccentColor()
                        : getInputBgColor(),
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      borderRadius: 9999,
                      marginRight: 8,
                      marginBottom: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        color: filters.services?.includes(service)
                          ? "white"
                          : getTextColor(),
                        fontWeight: filters.services?.includes(service)
                          ? "500"
                          : "normal",
                      }}
                    >
                      {service}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Disponibilités - Jours */}
            <View style={{ marginBottom: 16 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  marginBottom: 8,
                  color: getTextColor(),
                }}
              >
                Jours
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {availableDays.map((day) => (
                  <Pressable
                    key={day}
                    onPress={() => toggleDay(day)}
                    style={{
                      backgroundColor: filters.availability_days?.includes(day)
                        ? getAccentColor()
                        : getInputBgColor(),
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      borderRadius: 9999,
                      marginRight: 8,
                      marginBottom: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        color: filters.availability_days?.includes(day)
                          ? "white"
                          : getTextColor(),
                        fontWeight: filters.availability_days?.includes(day)
                          ? "500"
                          : "normal",
                      }}
                    >
                      {dayMapping[day]}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Disponibilités - Horaires */}
            <View style={{ marginBottom: 16 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  marginBottom: 8,
                  color: getTextColor(),
                }}
              >
                Horaires
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {availableTimeSlots.map((timeSlot) => (
                  <Pressable
                    key={timeSlot}
                    onPress={() => toggleTimeSlot(timeSlot)}
                    style={{
                      backgroundColor: filters.availability_intervals?.includes(
                        timeSlot
                      )
                        ? getAccentColor()
                        : getInputBgColor(),
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      borderRadius: 9999,
                      marginRight: 8,
                      marginBottom: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        color: filters.availability_intervals?.includes(
                          timeSlot
                        )
                          ? "white"
                          : getTextColor(),
                        fontWeight: filters.availability_intervals?.includes(
                          timeSlot
                        )
                          ? "500"
                          : "normal",
                      }}
                    >
                      {timeSlot}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Footer avec les boutons */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 16,
              borderTopWidth: 1,
              borderTopColor: getBorderColor(),
            }}
          >
            <Pressable onPress={resetFilters} style={{ padding: 8 }}>
              <Text
                style={{
                  color: "#6b7280",
                  fontWeight: "500",
                  fontSize: 14,
                }}
              >
                Réinitialiser
              </Text>
            </Pressable>
            <Pressable
              onPress={applyFilters}
              style={{
                backgroundColor: getAccentColor(),
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 9999,
              }}
            >
              <Text style={{ color: "white", fontWeight: "500", fontSize: 14 }}>
                Appliquer
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

export default SearchBarPetSitter;
