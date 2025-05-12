import type React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PriceFilterButtonProps {
  onPress: () => void;
  isActive?: boolean;
}

const PriceFilterButton: React.FC<PriceFilterButtonProps> = ({
  onPress,
  isActive = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, isActive && styles.activeButton]}
      onPress={onPress}
    >
      <Ionicons
        name="filter"
        size={18}
        color={isActive ? "white" : "#3b82f6"}
      />
      <Text style={[styles.text, isActive && styles.activeText]}>Filtrer</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activeButton: {
    backgroundColor: "#3b82f6",
  },
  text: {
    color: "#3b82f6",
    fontWeight: "bold",
    marginLeft: 4,
  },
  activeText: {
    color: "white",
  },
});

export default PriceFilterButton;
