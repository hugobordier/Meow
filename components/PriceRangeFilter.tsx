"use client";

import type React from "react";
import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";

interface PriceRangeFilterProps {
  minPrice: number;
  maxPrice: number;
  currentMin: number;
  currentMax: number;
  onApply: (min: number, max: number) => void;
  onClose: () => void;
}

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  minPrice,
  maxPrice,
  currentMin,
  currentMax,
  onApply,
  onClose,
}) => {
  const [min, setMin] = useState(currentMin);
  const [max, setMax] = useState(currentMax);

  const handleApply = () => {
    onApply(min, max);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Filtrer par prix</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.rangeText}>
          {min}€ - {max}€
        </Text>

        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={minPrice}
            maximumValue={maxPrice}
            step={5}
            value={min}
            onValueChange={setMin}
            minimumTrackTintColor="#3b82f6"
            maximumTrackTintColor="#d1d5db"
            thumbTintColor="#3b82f6"
          />
          <Text style={styles.sliderLabel}>Min</Text>
        </View>

        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={minPrice}
            maximumValue={maxPrice}
            step={5}
            value={max}
            onValueChange={setMax}
            minimumTrackTintColor="#3b82f6"
            maximumTrackTintColor="#d1d5db"
            thumbTintColor="#3b82f6"
          />
          <Text style={styles.sliderLabel}>Max</Text>
        </View>

        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
          <Text style={styles.applyButtonText}>Appliquer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    alignItems: "center",
  },
  rangeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3b82f6",
    marginBottom: 20,
  },
  sliderContainer: {
    width: "100%",
    marginBottom: 16,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: -8,
  },
  applyButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 8,
  },
  applyButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default PriceRangeFilter;
