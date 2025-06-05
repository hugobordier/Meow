import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  useColorScheme,
} from "react-native";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

interface CommentModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { comment: string; rating: number }) => void;
}

const CommentModal: React.FC<CommentModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleSubmit = () => {
    if (comment.trim().length < 10) {
      Alert.alert(
        "Erreur",
        "Votre commentaire doit contenir au moins 10 caractères"
      );
      return;
    }
    onSubmit({ comment: comment.trim(), rating });
    setComment("");
    setRating(0);
    Keyboard.dismiss();
    onClose();
  };

  const handleClose = () => {
    setComment("");
    setRating(0);
    Keyboard.dismiss();
    onClose();
  };

  const renderModalStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starNumber = index + 1;
      const isSelected = starNumber <= rating;

      return (
        <TouchableOpacity
          key={index}
          onPress={() => setRating(starNumber)}
          style={{ padding: 8 }}
        >
          <FontAwesome
            name="star"
            size={32}
            color={isSelected ? "#fbbf24" : isDark ? "#374151" : "#d1d5db"}
          />
        </TouchableOpacity>
      );
    });
  };

  const isValid = comment.trim().length >= 10;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: isDark ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.5)",
            justifyContent: keyboardVisible ? "flex-start" : "flex-end",
            paddingTop: keyboardVisible ? 60 : 0,
          }}
          activeOpacity={1}
          onPress={handleClose}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}}
            style={{
              backgroundColor: isDark ? "#1f2937" : "#ffffff",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 24,
              maxHeight: keyboardVisible ? height * 0.8 : "85%",
            }}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Header */}
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
                  Laisser un avis
                </Text>
                <TouchableOpacity onPress={handleClose}>
                  <Ionicons
                    name="close"
                    size={24}
                    color={isDark ? "#ffffff" : "#111827"}
                  />
                </TouchableOpacity>
              </View>

              {/* Rating Section */}
              <View style={{ marginBottom: 24 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: isDark ? "#ffffff" : "#111827",
                    marginBottom: 12,
                  }}
                >
                  Note générale *
                </Text>
                <View
                  style={{
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
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
                        marginTop: 8,
                        fontSize: 16,
                        color: "#fbbf24",
                        fontWeight: "600",
                      }}
                    >
                      {rating} étoile{rating > 1 ? "s" : ""} sur 5
                    </Text>
                  )}
                </View>
              </View>

              {/* Comment Section */}
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: isDark ? "#ffffff" : "#111827",
                    marginBottom: 8,
                  }}
                >
                  Votre commentaire *
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: isDark ? "#d1d5db" : "#6b7280",
                    marginBottom: 12,
                    lineHeight: 20,
                  }}
                >
                  Partagez votre expérience pour aider les autres propriétaires
                  d'animaux
                </Text>
                <View
                  style={{
                    borderWidth: 2,
                    borderColor: isDark ? "#374151" : "#e5e7eb",
                    borderRadius: 12,
                    padding: 16,
                    backgroundColor: isDark ? "#374151" : "#f9fafb",
                  }}
                >
                  <TextInput
                    style={{
                      height: 100,
                      textAlignVertical: "top",
                      fontSize: 16,
                      color: isDark ? "#ffffff" : "#111827",
                      lineHeight: 22,
                    }}
                    placeholder="Décrivez votre expérience avec ce pet-sitter..."
                    placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
                    multiline
                    value={comment}
                    onChangeText={setComment}
                    maxLength={500}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color:
                        comment.trim().length >= 10 ? "#10b981" : "#ef4444",
                      fontWeight: "500",
                    }}
                  >
                    {comment.trim().length >= 10
                      ? "✓ Commentaire valide"
                      : "Minimum 10 caractères"}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: isDark ? "#9ca3af" : "#6b7280",
                    }}
                  >
                    {comment.length}/500
                  </Text>
                </View>
              </View>

              {/* Guidelines */}
              <View
                style={{
                  backgroundColor: isDark ? "#111827" : "#f3f4f6",
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 24,
                  borderWidth: isDark ? 1 : 0,
                  borderColor: isDark ? "#374151" : "transparent",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: isDark ? "#f3f4f6" : "#6b7280",
                    fontWeight: "600",
                    marginBottom: 6,
                  }}
                >
                  💡 Conseils pour un bon avis :
                </Text>
                <Text
                  style={{
                    fontSize: 11,
                    color: isDark ? "#e5e7eb" : "#6b7280",
                    lineHeight: 16,
                  }}
                >
                  • Décrivez votre expérience de manière constructive{"\n"}•
                  Mentionnez les points positifs et négatifs{"\n"}• Restez
                  respectueux et objectif
                </Text>
              </View>

              {/* Buttons */}
              <View
                style={{
                  flexDirection: "row",
                  gap: 12,
                }}
              >
                <TouchableOpacity
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: isDark ? "#374151" : "#d1d5db",
                    alignItems: "center",
                  }}
                  onPress={handleClose}
                >
                  <Text
                    style={{
                      fontWeight: "600",
                      color: isDark ? "#d1d5db" : "#6b7280",
                      fontSize: 16,
                    }}
                  >
                    Annuler
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: 12,
                    backgroundColor: isValid ? "#10b981" : "#9ca3af",
                    alignItems: "center",
                    opacity: isValid ? 1 : 0.6,
                  }}
                  onPress={handleSubmit}
                  disabled={!isValid}
                >
                  <Text
                    style={{
                      fontWeight: "600",
                      color: "#ffffff",
                      fontSize: 16,
                    }}
                  >
                    Publier l'avis
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CommentModal;
