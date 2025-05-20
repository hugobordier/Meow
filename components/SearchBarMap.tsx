import type React from "react";
import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  Animated,
  Dimensions,
  ScrollView,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import {
  AnimalType,
  AvailabilityDay,
  AvailabilityInterval,
  PetSitterQueryParams,
  ServiceType,
} from "@/types/type";
import { searchCityByName } from "@/utils/serrchCityByName";

const { width } = Dimensions.get("window");

// Données fictives pour simuler les résultats de recherche de villes
const MOCK_CITIES = [
  "Paris",
  "Marseille",
  "Lyon",
  "Toulouse",
  "Nice",
  "Nantes",
  "Strasbourg",
  "Montpellier",
  "Bordeaux",
  "Lille",
  "Rennes",
  "Reims",
  "Le Havre",
  "Saint-Étienne",
  "Toulon",
  "Grenoble",
  "Dijon",
  "Angers",
  "Nîmes",
  "Villeurbanne",
];

type SearchBarMapProps = {
  onSearch?: (params: PetSitterQueryParams) => void;
  onSearchCity?: (longitude: number, latitude: number) => void;
  initialCity?: string;
  count?: number;
};

const SearchBarMap: React.FC<SearchBarMapProps> = ({
  onSearch,
  onSearchCity,
  initialCity = "Paris",
  count = 0,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [city, setCity] = useState<string>(initialCity);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showCitySuggestions, setShowCitySuggestions] =
    useState<boolean>(false);
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [filters, setFilters] = useState<PetSitterQueryParams>({
    minRate: 0,
    maxRate: 100,
  });

  const animatedValue = useRef(new Animated.Value(0)).current;
  const searchBarWidth = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [56, width - 32],
  });
  const searchBarHeight = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [56, 140],
  });
  const buttonOpacity = animatedValue.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [1, 0, 0],
  });
  const contentOpacity = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  const filterAnim = useRef(new Animated.Value(0)).current;
  const filterHeight = filterAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 500],
  });

  const filterOpacity = filterAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const suggestionAnim = useRef(new Animated.Value(0)).current;
  const suggestionHeight = suggestionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300],
  });

  const suggestionOpacity = suggestionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const toggleFilters = () => {
    if (showCitySuggestions) {
      hideCitySuggestions();
    }

    if (!showFilters) {
      setShowFilters(true);
      Animated.timing(filterAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(filterAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setShowFilters(false);
      });
    }
  };

  const showCityResults = () => {
    if (showFilters) {
      Animated.timing(filterAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setShowFilters(false);
        displayCitySuggestions();
      });
    } else {
      displayCitySuggestions();
    }
  };

  const displayCitySuggestions = () => {
    setShowCitySuggestions(true);
    Animated.timing(suggestionAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const hideCitySuggestions = () => {
    Animated.timing(suggestionAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setShowCitySuggestions(false);
    });
  };

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

  const toggleSearchBar = () => {
    const toValue = isExpanded ? 0 : 1;

    if (isExpanded && (showFilters || showCitySuggestions)) {
      if (showFilters) {
        Animated.timing(filterAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start(() => {
          setShowFilters(false);
          collapseSearchBar();
        });
      } else if (showCitySuggestions) {
        Animated.timing(suggestionAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start(() => {
          setShowCitySuggestions(false);
          collapseSearchBar();
        });
      }
    } else {
      Animated.spring(animatedValue, {
        toValue,
        useNativeDriver: false,
        friction: 8,
      }).start();
      setIsExpanded(!isExpanded);
    }
  };

  const collapseSearchBar = () => {
    Animated.spring(animatedValue, {
      toValue: 0,
      useNativeDriver: false,
      friction: 8,
    }).start();
    setIsExpanded(false);
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch({ ...filters }); //;onSearch({ ...filters, city });
    }
  };

  const searchCities = async (text: string) => {
    setCity(text);

    if (text.length > 1) {
      setIsSearching(true);

      const result = await searchCityByName(text);

      if (result) {
        setCitySuggestions([result.city]);
        console.log(citySuggestions);
        if (!showCitySuggestions && isExpanded) {
          showCityResults();
        }
      } else {
        setCitySuggestions([]);
        if (showCitySuggestions) {
          hideCitySuggestions();
        }
      }

      setIsSearching(false);
    } else {
      setCitySuggestions([]);
      if (showCitySuggestions) {
        hideCitySuggestions();
      }
    }
  };

  const selectCity = (selectedCity: string) => {
    setCity(selectedCity);
    hideCitySuggestions();
  };

  const useCurrentLocation = () => {
    setIsSearching(true);
    setTimeout(() => {
      setCity("Votre position");
      setIsSearching(false);
      hideCitySuggestions();
    }, 1000);
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
    setFilters({ minRate: 0, maxRate: 100 });
  };

  const applyFilters = () => {
    toggleSearchBar();
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

  return (
    <>
      <Animated.View
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          width: searchBarWidth,
          height: searchBarHeight,
          backgroundColor: getBgColor(),
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          borderBottomLeftRadius:
            isExpanded && (showFilters || showCitySuggestions) ? 0 : 16,
          borderBottomRightRadius:
            isExpanded && (showFilters || showCitySuggestions) ? 0 : 16,
          padding: isExpanded ? 16 : 0,
          zIndex: 100,
          overflow: "hidden",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 56,
            height: 56,
            borderRadius: 28,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: getBgColor(),
            opacity: buttonOpacity,
            zIndex: 101,
          }}
        >
          <Pressable
            onPress={toggleSearchBar}
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Feather name="search" size={24} color={getAccentColor()} />
          </Pressable>
        </Animated.View>

        <Animated.View
          style={{
            opacity: contentOpacity,
            flex: 1,
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
                  onChangeText={searchCities}
                  placeholder="Ville"
                  placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
                  style={{
                    fontWeight: "500",
                    color: getTextColor(),
                  }}
                  onFocus={() => {
                    if (city.length > 1) {
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
            <Pressable
              onPress={toggleSearchBar}
              style={{
                padding: 10,
                marginLeft: 8,
                backgroundColor: getInputBgColor(),
                borderRadius: 50,
              }}
            >
              <Feather name="x" size={20} color="#666" />
            </Pressable>
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
                  backgroundColor: getInputBgColor(),
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
                    color: getTextColor(),
                  }}
                >
                  Filtre
                </Text>
                <Feather name="sliders" size={14} color={getTextColor()} />
              </Pressable>
            </View>
            <Text style={{ color: getTextColor(), fontSize: 14 }}>
              {count} résultats
            </Text>
          </View>
        </Animated.View>
      </Animated.View>

      {/* Suggestions de villes */}
      {isExpanded && (
        <Animated.View
          style={{
            position: "absolute",
            top: 140,
            right: 16,
            left: 16,
            backgroundColor: getBgColor(),
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
            padding: 16,
            opacity: suggestionOpacity,
            height: suggestionHeight,
            overflow: "hidden",
            zIndex: 99,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            marginTop: -1,
            display: showCitySuggestions ? "flex" : "none",
          }}
        >
          {showCitySuggestions && (
            <ScrollView style={{ maxHeight: "100%" }}>
              <Pressable
                onPress={useCurrentLocation}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 14,
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
                  key={suggestion}
                  onPress={() => selectCity(suggestion)}
                  style={{
                    paddingVertical: 14,
                    borderBottomWidth: 1,
                    borderBottomColor: getBorderColor(),
                  }}
                >
                  <Text style={{ color: getTextColor() }}>{suggestion}</Text>
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
          )}
        </Animated.View>
      )}

      {/* Panneau des filtres */}
      {isExpanded && (
        <Animated.View
          style={{
            position: "absolute",
            top: 140,
            right: 16,
            left: 16,
            backgroundColor: getBgColor(),
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
            padding: 20,
            opacity: filterOpacity,
            height: filterHeight,
            overflow: "hidden",
            zIndex: 99,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            marginTop: -1,
            display: showFilters ? "flex" : "none",
          }}
        >
          {showFilters && (
            <>
              <ScrollView style={{ maxHeight: "80%" }}>
                <View style={{ marginBottom: 24 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "500",
                      marginBottom: 12,
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
                          backgroundColor: filters.animal_types?.includes(
                            animal
                          )
                            ? getAccentColor()
                            : getInputBgColor(),
                          paddingHorizontal: 16,
                          paddingVertical: 8,
                          borderRadius: 9999,
                          marginRight: 8,
                          marginBottom: 8,
                        }}
                      >
                        <Text
                          style={{
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

                <View style={{ marginBottom: 24 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "500",
                      marginBottom: 12,
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
                      marginBottom: 10,
                    }}
                  >
                    <Text style={{ color: getTextColor() }}>
                      {filters.minRate}€
                    </Text>
                    <Text style={{ color: getTextColor() }}>
                      {filters.maxRate}€
                    </Text>
                  </View>
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

                <View style={{ marginBottom: 24 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "500",
                      marginBottom: 12,
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
                          paddingVertical: 8,
                          borderRadius: 9999,
                          marginRight: 8,
                          marginBottom: 8,
                        }}
                      >
                        <Text
                          style={{
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
                <View style={{ marginBottom: 24 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "500",
                      marginBottom: 12,
                      color: getTextColor(),
                    }}
                  >
                    Disponibilités - Jours
                  </Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {availableDays.map((day) => (
                      <Pressable
                        key={day}
                        onPress={() => toggleDay(day)}
                        style={{
                          backgroundColor: filters.availability_days?.includes(
                            day
                          )
                            ? getAccentColor()
                            : getInputBgColor(),
                          paddingHorizontal: 16,
                          paddingVertical: 8,
                          borderRadius: 9999,
                          marginRight: 8,
                          marginBottom: 8,
                        }}
                      >
                        <Text
                          style={{
                            color: filters.availability_days?.includes(day)
                              ? "white"
                              : getTextColor(),
                            fontWeight: filters.availability_days?.includes(day)
                              ? "500"
                              : "normal",
                          }}
                        >
                          {day}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                {/* Disponibilités - Horaires */}
                <View style={{ marginBottom: 24 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "500",
                      marginBottom: 12,
                      color: getTextColor(),
                    }}
                  >
                    Disponibilités - Horaires
                  </Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {availableTimeSlots.map((timeSlot) => (
                      <Pressable
                        key={timeSlot}
                        onPress={() => toggleTimeSlot(timeSlot)}
                        style={{
                          backgroundColor:
                            filters.availability_intervals?.includes(timeSlot)
                              ? getAccentColor()
                              : getInputBgColor(),
                          paddingHorizontal: 16,
                          paddingVertical: 8,
                          borderRadius: 9999,
                          marginRight: 8,
                          marginBottom: 8,
                        }}
                      >
                        <Text
                          style={{
                            color: filters.availability_intervals?.includes(
                              timeSlot
                            )
                              ? "white"
                              : getTextColor(),
                            fontWeight:
                              filters.availability_intervals?.includes(timeSlot)
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

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 16,
                }}
              >
                <Pressable onPress={resetFilters} style={{ padding: 12 }}>
                  <Text
                    style={{
                      color: "#6b7280",
                      fontWeight: "500",
                    }}
                  >
                    Réinitialiser
                  </Text>
                </Pressable>
                <Pressable
                  onPress={applyFilters}
                  style={{
                    backgroundColor: getAccentColor(),
                    paddingHorizontal: 24,
                    paddingVertical: 12,
                    borderRadius: 9999,
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "500" }}>
                    Appliquer
                  </Text>
                </Pressable>
              </View>
            </>
          )}
        </Animated.View>
      )}
    </>
  );
};

export default SearchBarMap;
