import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  Animated,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
  Modal,
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
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterOptions>({
    animal: "Chat",
    minPrice: 10,
    maxPrice: 50,
    services: [],
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

  const availableServices: string[] = [
    "Promenade",
    "Alimentation",
    "Jeux",
    "Soins",
    "Toilettage",
  ];

  const toggleSearchBar = () => {
    const toValue = isExpanded ? 0 : 1;
    Animated.spring(animatedValue, {
      toValue,
      useNativeDriver: false,
      friction: 8,
    }).start();
    setIsExpanded(!isExpanded);
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

  const toggleFilterModal = () => {
    setShowFilterModal(!showFilterModal);
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

  const applyFilters = () => {
    handleSearch();
    setShowFilterModal(false);
  };

  useEffect(() => {
    if (isExpanded) {
      handleSearch();
    }
  }, [filters.animal]);

  return (
    <>
      <Animated.View
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          width: searchBarWidth,
          height: searchBarHeight,
          backgroundColor: isDark ? "#1f2937" : "rgba(253, 242, 255, 0.95)",
          borderRadius: isExpanded ? 16 : 28,
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
            backgroundColor: isDark ? "#1f2937" : "rgba(253, 242, 255, 0.95)",
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
            <Feather name="search" size={24} color="#d946ef" />
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
                backgroundColor: isDark ? "#374151" : "#f3f4f6",
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
                    color: isDark ? "#f3f4f6" : "#1f2937",
                  }}
                  onSubmitEditing={handleSearch}
                />
                <Text
                  style={{
                    fontSize: 12,
                    color: isDark ? "#f3f4f6" : "#1f2937",
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
                backgroundColor: isDark ? "#374151" : "#f3f4f6",
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
                onPress={toggleFilterModal}
                style={{
                  backgroundColor: isDark ? "#374151" : "#f3f4f6",
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 9999,
                  marginRight: 8,
                  borderWidth: 1,
                  borderColor: isDark ? "#4b5563" : "#e5e7eb",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    marginRight: 4,
                    color: isDark ? "#fff" : "#1f2937",
                  }}
                >
                  Filtre
                </Text>
                <Feather
                  name="sliders"
                  size={14}
                  color={isDark ? "#fff" : "#1f2937"}
                />
              </Pressable>
              <Pressable
                style={{
                  backgroundColor: isDark ? "#374151" : "#f3f4f6",
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 9999,
                  borderWidth: 1,
                  borderColor: isDark ? "#4b5563" : "#e5e7eb",
                }}
              >
                <Text
                  style={{ fontSize: 14, color: isDark ? "#fff" : "#1f2937" }}
                >
                  Trier
                </Text>
              </Pressable>
            </View>
            <Text style={{ color: isDark ? "#fff" : "#1f2937", fontSize: 14 }}>
              6 résultats
            </Text>
          </View>
        </Animated.View>
      </Animated.View>

      {/* MODAL */}
      <Modal visible={showFilterModal} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={toggleFilterModal}>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "flex-end",
            }}
          >
            <TouchableWithoutFeedback>
              <View
                style={{
                  backgroundColor: "white",
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                  padding: 20,
                  maxHeight: "70%",
                }}
              >
                <View style={{ alignItems: "center", marginBottom: 20 }}>
                  <View
                    style={{
                      width: 40,
                      height: 4,
                      backgroundColor: "#d1d5db",
                      borderRadius: 2,
                    }}
                  />
                </View>

                <Text
                  style={{ fontSize: 20, fontWeight: "600", marginBottom: 16 }}
                >
                  Filtres
                </Text>

                <ScrollView style={{ maxHeight: "80%" }}>
                  <View style={{ marginBottom: 24 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "500",
                        marginBottom: 12,
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
                              filters.animal === animal ? "#d946ef" : "#f3f4f6",
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
                                filters.animal === animal ? "white" : "#1f2937",
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
                      }}
                    >
                      Prix: {filters.minPrice}€ - {filters.maxPrice}€
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Slider
                        minimumValue={10}
                        maximumValue={50}
                        step={1}
                        value={filters.minPrice}
                        onValueChange={(val) =>
                          setFilters({ ...filters, minPrice: val })
                        }
                      />
                    </View>
                  </View>

                  <View style={{ marginBottom: 24 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "500",
                        marginBottom: 12,
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
                              ? "#d946ef"
                              : "#f3f4f6",
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
                                : "#1f2937",
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
                </ScrollView>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 16,
                  }}
                >
                  <Pressable
                    onPress={() =>
                      setFilters({
                        animal: "Chat",
                        minPrice: 10,
                        maxPrice: 50,
                        services: [],
                      })
                    }
                    style={{ padding: 12 }}
                  >
                    <Text style={{ color: "#6b7280", fontWeight: "500" }}>
                      Réinitialiser
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={applyFilters}
                    style={{
                      backgroundColor: "#d946ef",
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
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default SearchBarMap;
