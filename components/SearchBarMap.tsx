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
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";

const { width } = Dimensions.get("window");

type FilterOptions = {
  animal: string;
  minPrice: number;
  maxPrice: number;
  services: string[];
  availability: {
    days: string[];
    timeSlots: string[];
  };
};

type SearchBarMapProps = {
  onSearch?: (params: {
    city: string;
    dates: string;
    filters: FilterOptions;
  }) => void;
  initialCity?: string;
};

const SearchBarMap: React.FC<SearchBarMapProps> = ({
  onSearch,
  initialCity = "Paris",
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [city, setCity] = useState<string>(initialCity);
  const [dates, setDates] = useState<string>("Lundi-Mercredi");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterOptions>({
    animal: "Chat",
    minPrice: 0,
    maxPrice: 100,
    services: [],
    availability: {
      days: [],
      timeSlots: [],
    },
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
    outputRange: [0, 500], // Augmenté pour accommoder les nouveaux filtres
  });

  const filterOpacity = filterAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const toggleFilters = () => {
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

  const availableServices: string[] = [
    "Promenade",
    "Alimentation",
    "Jeux",
    "Soins",
    "Toilettage",
  ];
  const availableDays: string[] = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
  ];
  const availableTimeSlots: string[] = ["Matin", "Après-midi", "Soir", "Nuit"];

  const toggleSearchBar = () => {
    const toValue = isExpanded ? 0 : 1;

    if (isExpanded && showFilters) {
      Animated.timing(filterAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        Animated.spring(animatedValue, {
          toValue,
          useNativeDriver: false,
          friction: 8,
        }).start();
        setIsExpanded(false);
        setShowFilters(false);
      });
    } else {
      Animated.spring(animatedValue, {
        toValue,
        useNativeDriver: false,
        friction: 8,
      }).start();
      setIsExpanded(!isExpanded);
    }
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch({
        city,
        dates,
        filters,
      });
    }
  };

  const toggleService = (service: string) => {
    const updatedServices = [...filters.services];
    if (updatedServices.includes(service)) {
      const index = updatedServices.indexOf(service);
      updatedServices.splice(index, 1);
    } else {
      updatedServices.push(service);
    }
    setFilters({ ...filters, services: updatedServices });
  };

  const toggleDay = (day: string) => {
    const updatedDays = [...filters.availability.days];
    if (updatedDays.includes(day)) {
      const index = updatedDays.indexOf(day);
      updatedDays.splice(index, 1);
    } else {
      updatedDays.push(day);
    }
    setFilters({
      ...filters,
      availability: {
        ...filters.availability,
        days: updatedDays,
      },
    });
  };

  const toggleTimeSlot = (timeSlot: string) => {
    const updatedTimeSlots = [...filters.availability.timeSlots];
    if (updatedTimeSlots.includes(timeSlot)) {
      const index = updatedTimeSlots.indexOf(timeSlot);
      updatedTimeSlots.splice(index, 1);
    } else {
      updatedTimeSlots.push(timeSlot);
    }
    setFilters({
      ...filters,
      availability: {
        ...filters.availability,
        timeSlots: updatedTimeSlots,
      },
    });
  };

  const handleMinPriceChange = (value: number) => {
    // Assurer que minPrice ne dépasse pas maxPrice
    const newMinPrice = Math.min(value, filters.maxPrice);
    setFilters({ ...filters, minPrice: newMinPrice });
  };

  const handleMaxPriceChange = (value: number) => {
    // Assurer que maxPrice n'est pas inférieur à minPrice
    const newMaxPrice = Math.max(value, filters.minPrice);
    setFilters({ ...filters, maxPrice: newMaxPrice });
  };

  const applyFilters = () => {
    handleSearch();
    toggleFilters();
  };

  const resetFilters = () => {
    setFilters({
      animal: "Chat",
      minPrice: 0,
      maxPrice: 100,
      services: [],
      availability: {
        days: [],
        timeSlots: [],
      },
    });
  };

  useEffect(() => {
    if (isExpanded) {
      handleSearch();
    }
  }, [filters.animal]);

  // Determine colors based on filter state and dark mode
  const getBgColor = () => {
    return isDark ? "#1a202c" : "rgba(253, 242, 255, 0.98)";
  };

  const getTextColor = () => {
    return isDark ? "#f8fafc" : "#1a202c";
  };

  const getInputBgColor = () => {
    return isDark ? "#2d3748" : "#f1f5f9";
  };

  const getAccentColor = () => {
    return "#d946ef";
  };

  const getBorderColor = () => {
    return isDark ? "#4a5568" : "#e2e8f0";
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
          borderBottomLeftRadius: isExpanded && showFilters ? 0 : 16,
          borderBottomRightRadius: isExpanded && showFilters ? 0 : 16,
          padding: isExpanded ? 16 : 0,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          zIndex: 100,
          overflow: "hidden",
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
                  onChangeText={setCity}
                  placeholder="Ville"
                  placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
                  style={{
                    fontWeight: "500",
                    color: getTextColor(),
                  }}
                  onSubmitEditing={handleSearch}
                />
                <Text
                  style={{
                    fontSize: 12,
                    color: getTextColor(),
                  }}
                >
                  {dates} · {filters.animal}
                </Text>
              </View>
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
              <Pressable
                style={{
                  backgroundColor: getInputBgColor(),
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 9999,
                  borderWidth: 1,
                  borderColor: getBorderColor(),
                }}
              >
                <Text style={{ fontSize: 14, color: getTextColor() }}>
                  Trier
                </Text>
              </Pressable>
            </View>
            <Text style={{ color: getTextColor(), fontSize: 14 }}>
              6 résultats
            </Text>
          </View>
        </Animated.View>
      </Animated.View>

      {/* Animated Filter Panel */}
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
                    {[
                      "Chat",
                      "Chien",
                      "Oiseau",
                      "Rongeur",
                      "Reptile",
                      "Poisson",
                    ].map((animal) => (
                      <Pressable
                        key={animal}
                        onPress={() => setFilters({ ...filters, animal })}
                        style={{
                          backgroundColor:
                            filters.animal === animal
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
                            color:
                              filters.animal === animal
                                ? "white"
                                : getTextColor(),
                            fontWeight:
                              filters.animal === animal ? "500" : "normal",
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
                    Prix: {filters.minPrice}€ - {filters.maxPrice}€
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <Text style={{ color: getTextColor() }}>0€</Text>
                    <Text style={{ color: getTextColor() }}>100€</Text>
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
                      value={filters.minPrice}
                      onValueChange={handleMinPriceChange}
                      minimumTrackTintColor={getAccentColor()}
                      thumbTintColor={getAccentColor()}
                      style={{ width: "48%" }}
                    />
                    <Slider
                      minimumValue={0}
                      maximumValue={100}
                      step={1}
                      value={filters.maxPrice}
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
                          backgroundColor: filters.services.includes(service)
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
                            color: filters.services.includes(service)
                              ? "white"
                              : getTextColor(),
                            fontWeight: filters.services.includes(service)
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
                          backgroundColor: filters.availability.days.includes(
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
                            color: filters.availability.days.includes(day)
                              ? "white"
                              : getTextColor(),
                            fontWeight: filters.availability.days.includes(day)
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
                            filters.availability.timeSlots.includes(timeSlot)
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
                            color: filters.availability.timeSlots.includes(
                              timeSlot
                            )
                              ? "white"
                              : getTextColor(),
                            fontWeight: filters.availability.timeSlots.includes(
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
