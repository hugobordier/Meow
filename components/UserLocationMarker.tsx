import type React from "react";
import { View, StyleSheet } from "react-native";
import { Marker } from "react-native-maps";
import { Cat, Dog } from "lucide-react-native";

interface UserLocationMarkerProps {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  heading: number;
  zoomLevel: number;
  petType?: "cat" | "dog";
}

const UserLocationMarker: React.FC<UserLocationMarkerProps> = ({
  coordinate,
  heading,
  zoomLevel,
  petType = "cat",
}) => {
  const getMarkerSize = () => {
    const baseSize = 40;

    if (zoomLevel <= 0.005) return baseSize * 1; // Very zoomed in
    if (zoomLevel <= 0.01) return baseSize * 1; // Zoomed in
    if (zoomLevel <= 0.05) return baseSize; // Normal zoom
    return baseSize * 0.8; // Zoomed out
  };

  const size = getMarkerSize();

  return (
    <Marker coordinate={coordinate} anchor={{ x: 0.5, y: 0.5 }}>
      <View
        style={[styles.container, { transform: [{ rotate: `${heading}deg` }] }]}
      >
        <View
          style={[
            styles.markerOuter,
            { width: size * 1.2, height: size * 1.2 },
          ]}
        >
          <View style={[styles.markerInner, { width: size, height: size }]}>
            {petType === "cat" ? (
              <Cat size={size * 0.6} color="#ffffff" fill="#2563EB" />
            ) : (
              <Dog size={size * 0.6} color="#ffffff" fill="#2563EB" />
            )}
          </View>
          <View
            style={[styles.direction, { height: size * 0.5, top: -size * 0.4 }]}
          />
        </View>
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: -10,
  },
  markerOuter: {
    backgroundColor: "rgba(37, 99, 235, 0.3)",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(37, 99, 235, 0.5)",
  },
  markerInner: {
    backgroundColor: "#2563EB",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  direction: {
    position: "absolute",
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 16,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#2563EB",
    transform: [{ rotate: "180deg" }],
  },
});

export default UserLocationMarker;
