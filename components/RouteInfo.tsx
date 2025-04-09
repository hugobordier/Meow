import type React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface RouteInfoProps {
  distance: string;
  duration: string;
  onStartNavigation: () => void;
}

export const RouteInfo: React.FC<RouteInfoProps> = ({
  distance,
  duration,
  onStartNavigation,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Ionicons name="time-outline" size={24} color="#3F51B5" />
          <Text style={styles.infoText}>{duration}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoItem}>
          <Ionicons name="map-outline" size={24} color="#3F51B5" />
          <Text style={styles.infoText}>{distance}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.startButton} onPress={onStartNavigation}>
        <Ionicons name="navigate" size={20} color="white" />
        <Text style={styles.startButtonText}>Start Navigation</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 20,
  },
  infoItem: {
    alignItems: "center",
  },
  infoText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 4,
    color: "#333",
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: "#ddd",
  },
  startButton: {
    backgroundColor: "#3F51B5",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  startButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
