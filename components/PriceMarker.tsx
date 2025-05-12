import type React from "react";
import { View, Text, StyleSheet } from "react-native";

interface PriceMarkerProps {
  price: number;
  isSelected?: boolean;
}

const PriceMarker: React.FC<PriceMarkerProps> = ({
  price,
  isSelected = false,
}) => {
  return (
    <View style={[styles.container, isSelected && styles.selected]}>
      <Text style={styles.price}>{price}€</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 8,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selected: {
    borderWidth: 2,
    borderColor: "#ef4444",
    transform: [{ scale: 1.1 }],
  },
  price: {
    color: "#3b82f6",
    fontWeight: "bold",
    fontSize: 12,
  },
});

export default PriceMarker;
