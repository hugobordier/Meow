import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { ToastType, useToast } from "@/context/ToastContext";
import { updateUser } from "@/services/user.service";

interface UpdateNameModalProps {
  visible: boolean;
  onClose: () => void;
  initialFirstName: string;
  initialLastName: string;
  onUpdateSuccess?: () => void;
}

const UpdateNameModal = ({
  visible,
  onClose,
  initialFirstName,
  initialLastName,
  onUpdateSuccess,
}: UpdateNameModalProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
  }>({});
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const { showToast } = useToast();

  useEffect(() => {
    if (visible) {
      setFirstName(initialFirstName || "");
      setLastName(initialLastName || "");
      setErrors({});
    }
  }, [visible, initialFirstName, initialLastName]);

  const validateForm = () => {
    const newErrors: { firstName?: string; lastName?: string } = {};

    if (!firstName.trim()) {
      newErrors.firstName = "Le prénom est obligatoire";
    } else if (firstName.trim().length < 2) {
      newErrors.firstName = "Le prénom doit contenir au moins 2 caractères";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Le nom est obligatoire";
    } else if (lastName.trim().length < 2) {
      newErrors.lastName = "Le nom doit contenir au moins 2 caractères";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await updateUser({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      showToast(
        "Vos informations ont été mises à jour avec succès",
        ToastType.SUCCESS
      );

      if (onUpdateSuccess) {
        onUpdateSuccess();
      }

      onClose();
    } catch (error: any) {
      showToast(
        error.message || "Une erreur est survenue lors de la mise à jour",
        ToastType.ERROR
      );
    } finally {
      setIsLoading(false);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <View
            style={[
              styles.modalContent,
              isDarkMode ? styles.modalContentDark : styles.modalContentLight,
            ]}
          >
            <View style={styles.header}>
              <Text
                style={[
                  styles.title,
                  isDarkMode ? styles.textDark : styles.textLight,
                ]}
              >
                Modifier mes informations
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Feather
                  name="x"
                  size={24}
                  color={isDarkMode ? "#fff" : "#000"}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text
                style={[
                  styles.label,
                  isDarkMode ? styles.textDark : styles.textLight,
                ]}
              >
                Prénom
              </Text>
              <TextInput
                style={[
                  styles.input,
                  errors.firstName ? styles.inputError : {},
                  isDarkMode ? styles.inputDark : styles.inputLight,
                ]}
                value={firstName}
                onChangeText={setFirstName}
                placeholder={`Prénom actuel: ${
                  initialFirstName || "Non défini"
                }`}
                placeholderTextColor={isDarkMode ? "#999" : "#777"}
                autoCapitalize="words"
              />
              {errors.firstName && (
                <Text style={styles.errorText}>{errors.firstName}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text
                style={[
                  styles.label,
                  isDarkMode ? styles.textDark : styles.textLight,
                ]}
              >
                Nom
              </Text>
              <TextInput
                style={[
                  styles.input,
                  errors.lastName ? styles.inputError : {},
                  isDarkMode ? styles.inputDark : styles.inputLight,
                ]}
                value={lastName}
                onChangeText={setLastName}
                placeholder={`Nom actuel: ${initialLastName || "Non défini"}`}
                placeholderTextColor={isDarkMode ? "#999" : "#777"}
                autoCapitalize="words"
              />
              {errors.lastName && (
                <Text style={styles.errorText}>{errors.lastName}</Text>
              )}
            </View>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onClose}
                disabled={isLoading}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.updateButton}
                onPress={handleUpdate}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.updateButtonText}>Mettre à jour</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "85%",
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalContentLight: {
    backgroundColor: "#fff",
  },
  modalContentDark: {
    backgroundColor: "#1c1c1e",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  textLight: {
    color: "#000",
  },
  textDark: {
    color: "#fff",
  },
  closeButton: {
    padding: 5,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  inputLight: {
    backgroundColor: "#f9f9f9",
    borderColor: "#ddd",
    color: "#000",
  },
  inputDark: {
    backgroundColor: "#2c2c2e",
    borderColor: "#3a3a3c",
    color: "#fff",
  },
  inputError: {
    borderColor: "#FF3B30",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 4,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#E5E5EA",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 16,
  },
  updateButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: "center",
  },
  updateButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default UpdateNameModal;
