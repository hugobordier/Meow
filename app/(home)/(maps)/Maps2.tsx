"use client";

import { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { mapStyle } from "@/utils/mapStyle";
import { SearchBar } from "@/components/SearchBar";
import { BottomSheet } from "@/components/BottomSheet";
import { RouteInfo } from "@/components/RouteInfo";
import { MarkerButton } from "@/components/MarkerButton";
import { calculateRoute } from "@/utils/routing";
import type { Region, LatLng, MapEvent } from "@/types/type";

const Maps2 = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [region, setRegion] = useState<Region>({
    latitude: 48.8566,
    longitude: 2.3522,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [destination, setDestination] = useState<LatLng | null>(null);
  const [markers, setMarkers] = useState<LatLng[]>([]);
  const [routeCoordinates, setRouteCoordinates] = useState<LatLng[]>([]);
  const [routeInfo, setRouteInfo] = useState<{
    distance: string;
    duration: string;
  } | null>(null);
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  useEffect(() => {
    if (location && destination) {
      calculateRouteToDestination();
    }
  }, [location, destination]);

  const calculateRouteToDestination = async () => {
    if (!location || !destination) return;

    try {
      const result = await calculateRoute(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        destination
      );

      setRouteCoordinates(result.coordinates);
      setRouteInfo({
        distance: result.distance,
        duration: result.duration,
      });
      setIsBottomSheetVisible(true);
    } catch (error) {
      console.error("Error calculating route:", error);
    }
  };

  const handleMapPress = (event: MapEvent) => {
    const { coordinate } = event.nativeEvent;

    if (isAddingMarker) {
      setMarkers([...markers, coordinate]);
      setIsAddingMarker(false);
    } else if (!destination) {
      setDestination(coordinate);
    }
  };

  const handleMarkerPress = (index: number) => {
    // Remove marker when pressed
    const newMarkers = [...markers];
    newMarkers.splice(index, 1);
    setMarkers(newMarkers);
  };

  const clearRoute = () => {
    setDestination(null);
    setRouteCoordinates([]);
    setRouteInfo(null);
    setIsBottomSheetVisible(false);
  };

  const centerOnUserLocation = () => {
    if (location) {
      mapRef.current?.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        customMapStyle={mapStyle}
        region={region}
        onRegionChangeComplete={setRegion}
        onPress={handleMapPress}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={true}
        rotateEnabled={true}
      >
        {/* User's current location marker */}
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="You are here"
          >
            <View style={styles.currentLocationMarker}>
              <View style={styles.currentLocationDot} />
            </View>
          </Marker>
        )}

        {/* Destination marker */}
        {destination && (
          <Marker
            coordinate={destination}
            title="Destination"
            pinColor="#FF5722"
            onPress={() => setDestination(null)}
          />
        )}

        {/* Custom markers */}
        {markers.map((marker, index) => (
          <Marker
            key={`marker-${index}`}
            coordinate={marker}
            title={`Marker ${index + 1}`}
            pinColor="#4CAF50"
            onPress={() => handleMarkerPress(index)}
          />
        ))}

        {/* Route line */}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeWidth={5}
            strokeColor="#3F51B5"
            lineDashPattern={[0]}
          />
        )}
      </MapView>

      {/* Search bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmit={() => {
          /* Handle search */
        }}
        onClear={() => setSearchQuery("")}
      />

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={centerOnUserLocation}
        >
          <Ionicons name="locate" size={24} color="#3F51B5" />
        </TouchableOpacity>

        <MarkerButton
          isActive={isAddingMarker}
          onPress={() => setIsAddingMarker(!isAddingMarker)}
        />

        {routeCoordinates.length > 0 && (
          <TouchableOpacity style={styles.controlButton} onPress={clearRoute}>
            <Ionicons name="close-circle" size={24} color="#E53935" />
          </TouchableOpacity>
        )}
      </View>

      {/* Route information bottom sheet */}
      {routeInfo && (
        <BottomSheet
          visible={isBottomSheetVisible}
          onClose={() => setIsBottomSheetVisible(false)}
        >
          <RouteInfo
            distance={routeInfo.distance}
            duration={routeInfo.duration}
            onStartNavigation={() => {
              /* Start navigation */
            }}
          />
        </BottomSheet>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  controls: {
    position: "absolute",
    right: 16,
    bottom: 100,
    backgroundColor: "transparent",
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  currentLocationMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(63, 81, 181, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  currentLocationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#3F51B5",
  },
});

export default Maps2;
