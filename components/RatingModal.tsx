import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Dimensions,
  useColorScheme,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

const RatingModal = ({
  visible,
  onClose,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (rating: number) => void;
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert("Erreur", "Veuillez sélectionner une note");
      return;
    }
    onSubmit(rating);
    setRating(0);
    setHoveredStar(0);
    onClose();
  };

  const renderModalStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starNumber = index + 1;
      const isSelected = starNumber <= (hoveredStar || rating);

      return (
        <TouchableOpacity
          key={index}
          onPress={() => setRating(starNumber)}
          onPressIn={() => setHoveredStar(starNumber)}
          onPressOut={() => setHoveredStar(0)}
          style={{ padding: 8 }}
        >
          <FontAwesome
            name="star"
            size={40}
            color={isSelected ? "#fbbf24" : isDark ? "#374151" : "#d1d5db"}
          />
        </TouchableOpacity>
      );
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: isDark ? "#1f2937" : "#ffffff",
            borderRadius: 20,
            padding: 24,
            width: Dimensions.get("window").width * 0.85,
            maxWidth: 400,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 24,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: isDark ? "#ffffff" : "#111827",
              }}
            >
              Noter ce pet-sitter
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons
                name="close"
                size={24}
                color={isDark ? "#ffffff" : "#111827"}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: isDark ? "#d1d5db" : "#6b7280",
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              Quelle note donneriez-vous à ce pet-sitter ?
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              {renderModalStars()}
            </View>
            {rating > 0 && (
              <Text
                style={{
                  marginTop: 12,
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#fbbf24",
                }}
              >
                {rating} étoile{rating > 1 ? "s" : ""}
              </Text>
            )}
          </View>

          <View
            style={{
              flexDirection: "row",
              gap: 12,
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: isDark ? "#374151" : "#d1d5db",
                alignItems: "center",
              }}
              onPress={onClose}
            >
              <Text
                style={{
                  fontWeight: "600",
                  color: isDark ? "#d1d5db" : "#6b7280",
                }}
              >
                Annuler
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: "#fbbf24",
                alignItems: "center",
              }}
              onPress={handleSubmit}
            >
              <Text
                style={{
                  fontWeight: "600",
                  color: "#ffffff",
                }}
              >
                Valider
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RatingModal;
