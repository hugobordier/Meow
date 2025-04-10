import type React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface MarkerButtonProps {
  isActive: boolean;
  onPress: () => void;
}

export const MarkerButton: React.FC<MarkerButtonProps> = ({
  isActive,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, isActive && styles.activeButton]}
      onPress={onPress}
    >
      <Ionicons
        name="location"
        size={24}
        color={isActive ? "white" : "#FF5722"}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
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
  activeButton: {
    backgroundColor: "#FF5722",
  },
});
