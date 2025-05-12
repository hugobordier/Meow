"use client";

import type React from "react";
import { useRef, useState, useEffect } from "react";
import { View, StyleSheet, Alert, Text } from "react-native";
import * as Location from "expo-location";
import LeafletMap from "@/components/LeafletMap";
import LocationButton from "@/components/LocationButton";
import PriceFilterButton from "@/components/PriceFilterButton";
import PriceRangeFilter from "@/components/PriceRangeFilter";
import BottomSheetMap from "@/components/BottomSheetMap";
import { Ionicons } from "@expo/vector-icons";

// Sample data for markers
const sampleMarkers = [
  {
    id: "1",
    lat: 48.8566,
    lng: 2.3522,
    price: 120,
    title: "Appartement Paris",
  },
  { id: "2", lat: 48.8606, lng: 2.3376, price: 95, title: "Studio Louvre" },
  { id: "3", lat: 48.853, lng: 2.3499, price: 150, title: "Loft Saint-Michel" },
  {
    id: "4",
    lat: 48.8738,
    lng: 2.295,
    price: 200,
    title: "Duplex Champs-Élysées",
  },
  {
    id: "5",
    lat: 48.8417,
    lng: 2.3197,
    price: 180,
    title: "Appartement Montparnasse",
  },
  {
    id: "6",
    lat: 48.8865,
    lng: 2.3431,
    price: 160,
    title: "Studio Montmartre",
  },
  { id: "7", lat: 48.8584, lng: 2.2945, price: 250, title: "Loft Tour Eiffel" },
  {
    id: "8",
    lat: 48.8697,
    lng: 2.3075,
    price: 220,
    title: "Appartement Arc de Triomphe",
  },
];

const Map: React.FC = () => {
  const mapRef = useRef<any>(null);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [routeVisible, setRouteVisible] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 300 });
  const [filteredMarkers, setFilteredMarkers] = useState(sampleMarkers);
  const [heading, setHeading] = useState(0);

  // Request location permissions and get user's location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Location permission is required for this feature"
        );
        return;
      }

      try {
        // Variables pour garder en mémoire la dernière position mise à jour
        let lastLat = 0;
        let lastLng = 0;
        let lastUpdateTime = 0;

        // Seuils de mise à jour
        const MIN_DISTANCE_CHANGE = 15; // en mètres
        const MIN_TIME_INTERVAL = 3000; // 3 secondes minimum entre les mises à jour

        // Fonction pour calculer la distance entre deux points xœ(en mètres)
        const calculateDistance = (
          lat1: number,
          lon1: number,
          lat2: number,
          lon2: number
        ) => {
          const R = 6371e3; // Rayon de la Terre en mètres
          const φ1 = (lat1 * Math.PI) / 180;
          const φ2 = (lat2 * Math.PI) / 180;
          const Δφ = ((lat2 - lat1) * Math.PI) / 180;
          const Δλ = ((lon2 - lon1) * Math.PI) / 180;

          const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

          return R * c;
        };

        // Watch position to get updates
        const locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: MIN_DISTANCE_CHANGE, // Ne se déclenche que si la distance change d'au moins 15m
            timeInterval: 10000,
          },
          (location) => {
            const userLoc = {
              lat: location.coords.latitude,
              lng: location.coords.longitude,
            };

            const currentTime = Date.now();
            const distance = calculateDistance(
              lastLat,
              lastLng,
              userLoc.lat,
              userLoc.lng
            );

            // Mettre à jour uniquement si suffisamment de temps s'est écoulé ET
            // si la distance parcourue est significative (ou si c'est la première mise à jour)
            if (
              lastLat === 0 || // Première mise à jour
              (distance > MIN_DISTANCE_CHANGE &&
                currentTime - lastUpdateTime > MIN_TIME_INTERVAL)
            ) {
              setUserLocation(userLoc);
              setHeading(location.coords.heading || 0);

              // Mettre à jour le marqueur de position de l'utilisateur sur la carte
              if (mapRef.current) {
                // Si la méthode updateUserLocation existe, l'utiliser à la place de centerMap
                if (mapRef.current.updateUserLocation) {
                  mapRef.current.updateUserLocation(
                    userLoc.lat,
                    userLoc.lng,
                    location.coords.accuracy,
                    location.coords.heading || 0
                  );
                } else {
                  // Sinon, utiliser centerMap mais sans changer le zoom
                  mapRef.current.centerMap(
                    userLoc.lat,
                    userLoc.lng,
                    undefined // Garder le même niveau de zoom
                  );
                }
              }

              // Mettre à jour les variables de la dernière position
              lastLat = userLoc.lat;
              lastLng = userLoc.lng;
              lastUpdateTime = currentTime;
            }
          }
        );

        // Initial center on user's location
        const initialLocation = await Location.getCurrentPositionAsync({});
        const initialUserLoc = {
          lat: initialLocation.coords.latitude,
          lng: initialLocation.coords.longitude,
        };
        setUserLocation(initialUserLoc);

        // Initialiser les variables de dernière position
        lastLat = initialUserLoc.lat;
        lastLng = initialUserLoc.lng;
        lastUpdateTime = Date.now();

        if (mapRef.current) {
          mapRef.current.centerMap(initialUserLoc.lat, initialUserLoc.lng, 15);

          // Si disponible, utiliser également updateUserLocation pour l'emplacement initial
          if (mapRef.current.updateUserLocation) {
            mapRef.current.updateUserLocation(
              initialUserLoc.lat,
              initialUserLoc.lng,
              initialLocation.coords.accuracy,
              initialLocation.coords.heading || 0
            );
          }
        }

        return () => {
          if (locationSubscription) {
            locationSubscription.remove();
          }
        };
      } catch (error) {
        console.error("Error getting location:", error);
        Alert.alert("Error", "Could not get your current location");
      }
    })();
  }, []);

  // Filter markers when price range changes
  useEffect(() => {
    const filtered = sampleMarkers.filter(
      (marker) =>
        marker.price >= priceRange.min && marker.price <= priceRange.max
    );
    setFilteredMarkers(filtered);
  }, [priceRange]);

  // Handle marker click
  const handleMarkerPress = (marker: any) => {
    setSelectedMarker(marker);
    setRouteVisible(false);
  };

  // Center map on user's location
  const centerOnUserLocation = async () => {
    if (!userLocation) {
      try {
        const location = await Location.getCurrentPositionAsync({});
        const userLoc = {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        };
        setUserLocation(userLoc);

        if (mapRef.current) {
          mapRef.current.centerMap(userLoc.lat, userLoc.lng, 15);
        }
      } catch (error) {
        console.error("Error getting location:", error);
        Alert.alert("Error", "Could not get your current location");
      }
    } else if (mapRef.current) {
      mapRef.current.centerMap(userLocation.lat, userLocation.lng, 15);
    }
  };

  // Show route from user location to selected marker
  const showRoute = () => {
    if (!userLocation || !selectedMarker) {
      Alert.alert(
        "Error",
        "Both your location and a destination are required to show a route"
      );
      return;
    }

    if (mapRef.current) {
      mapRef.current.showRoute(userLocation, {
        lat: selectedMarker.lat,
        lng: selectedMarker.lng,
      });
      setRouteVisible(true);
    }
  };

  // Clear the current route
  const clearRoute = () => {
    if (mapRef.current) {
      mapRef.current.clearRoute();
      setRouteVisible(false);
    }
  };

  // Apply price filter
  const applyPriceFilter = (min: number, max: number) => {
    setPriceRange({ min, max });
    setShowFilter(false);
  };

  // Close the bottom sheet
  const closeBottomSheetMap = () => {
    setSelectedMarker(null);
    if (routeVisible) {
      clearRoute();
    }
  };

  return (
    <View style={styles.container}>
      <LeafletMap
        ref={mapRef}
        markers={filteredMarkers}
        onMarkerPress={handleMarkerPress}
        initialLocation={userLocation || { lat: 48.8566, lng: 2.3522 }}
      />

      <LocationButton onPress={centerOnUserLocation} />

      <PriceFilterButton
        onPress={() => setShowFilter(!showFilter)}
        isActive={showFilter}
      />

      {showFilter && (
        <View style={styles.filterContainer}>
          <PriceRangeFilter
            minPrice={0}
            maxPrice={300}
            currentMin={priceRange.min}
            currentMax={priceRange.max}
            onApply={applyPriceFilter}
            onClose={() => setShowFilter(false)}
          />
        </View>
      )}

      <BottomSheetMap
        isVisible={!!selectedMarker}
        onClose={closeBottomSheetMap}
        title={selectedMarker?.title || ""}
        price={selectedMarker?.price || 0}
        onShowRoute={showRoute}
        isRouteVisible={routeVisible}
        onHideRoute={clearRoute}
      >
        <Text style={styles.detailText}>
          Découvrez ce magnifique logement situé en plein cœur de Paris.
          Idéalement placé pour explorer la ville.
        </Text>

        {userLocation && selectedMarker && (
          <View style={styles.distanceContainer}>
            <Ionicons name="navigate-outline" size={16} color="#666" />
            <Text style={styles.distanceText}>
              À environ{" "}
              {calculateDistance(userLocation, selectedMarker).toFixed(1)} km de
              votre position
            </Text>
          </View>
        )}
      </BottomSheetMap>
    </View>
  );
};

// Calculate distance between two points in km
function calculateDistance(
  point1: { lat: number; lng: number },
  point2: { lat: number; lng: number }
) {
  const R = 6371; // Earth's radius in km
  const dLat = deg2rad(point2.lat - point1.lat);
  const dLng = deg2rad(point2.lng - point1.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(point1.lat)) *
      Math.cos(deg2rad(point2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    position: "absolute",
    top: 70,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
    lineHeight: 20,
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  distanceText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 5,
  },
});

export default Map;
