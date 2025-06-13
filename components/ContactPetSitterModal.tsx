"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Animated,
  Image,
} from "react-native";
import { useColorScheme } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { ToastType, useToast } from "@/context/ToastContext";
import Slider from "@react-native-community/slider";
import { createPetsittingRequest } from "@/services/requestPetsitter.service";
import type { Pet } from "@/types/type";
import { getPetsForAUser } from "@/services/pet.service";

interface ContactPetSitterModalProps {
  visible: boolean;
  onClose: () => void;
  petSitterName: string;
  hourlyRate: number;
  petSitterId: string;
}

const ContactPetSitterModal: React.FC<ContactPetSitterModalProps> = ({
  visible,
  onClose,
  petSitterName,
  hourlyRate,
  petSitterId,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { showToast } = useToast();

  const [step, setStep] = useState<"message" | "payment">("message");
  const [message, setMessage] = useState("");
  const [minutes, setMinutes] = useState(60); // 2h par défaut
  const [decideLater, setDecideLater] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [listPets, setListPets] = useState<Pet[] | null>([]);
  const [selectedPets, setSelectedPets] = useState<string[]>([]);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        if (petSitterId) {
          const response = await getPetsForAUser();
          console.log("Liste des animaux :", response.data);
          setListPets(response.data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des animaux :", error);
      }
    };

    fetchPets();
  }, []);

  const shakeAnimation = () => {
    const anim = useRef(new Animated.Value(0)).current;

    const shake = () => {
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 6,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: -6,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
    };

    return { anim, shake };
  };

  const fadeAnimation = () => {
    const anim = useRef(new Animated.Value(0)).current;

    const fadeIn = () => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    };

    const fadeOut = (callback: () => void) => {
      Animated.timing(anim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        if (callback) callback(); // 👈 appelle le callback à la fin
      });
    };

    return { anim, fadeIn, fadeOut };
  };

  const defaultMessage = `Bonjour ${petSitterName},\nJe souhaiterais faire appel à vos services de pet-sitting.\nPouvons-nous discuter des détails ?\n\nCordialement`;

  const cardAnim = shakeAnimation();
  const expiryAnim = shakeAnimation();
  const cvvAnim = shakeAnimation();
  const tooltipAnim = fadeAnimation();

  const handleNext = async () => {
    if (step === "message") {
      if (minutes <= 0 && !decideLater) {
        showToast("Veuillez sélectionner une durée valide", ToastType.ERROR);
        return;
      }
      setStep("payment");
    } else {
      // Simuler le paiement
      if (!cardNumber || !expiryDate || !cvv) {
        setShowTooltip(true);
        tooltipAnim.fadeIn();
        cardAnim.shake();
        expiryAnim.shake();
        cvvAnim.shake();

        setTimeout(() => {
          tooltipAnim.fadeOut(() => {
            setShowTooltip(false);
          });
        }, 1500);
        showToast("Veuillez remplir tous les champs", ToastType.ERROR);
        return;
      }
      try {
        await createPetsittingRequest({
          petsitter_id: petSitterId,
          message: message || defaultMessage,
          petidtable: selectedPets,
        });
        showToast("Paiement effectué avec succès !", ToastType.SUCCESS);
      } catch (error) {
        console.log("Erreur lors du paiement :", error);
        showToast("Échec du paiement, veuillez réessayer", ToastType.ERROR);
        return;
      } finally {
        setMessage("");
        setCardNumber("");
        setExpiryDate("");
        setCvv("");
        setMinutes(120);
        setDecideLater(false);
        setSelectedPets([]);
        setStep("message");
        onClose();
      }
    }
  };

  const handleBack = () => {
    if (step === "payment") {
      setStep("message");
    } else {
      onClose();
    }
  };

  const formatMinutes = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const remainingMinutes = mins % 60;
    if (hours === 0) {
      return `${remainingMinutes} minutes`;
    } else if (remainingMinutes === 0) {
      return `${hours} heure${hours > 1 ? "s" : ""}`;
    } else {
      return `${hours}h${remainingMinutes.toString().padStart(2, "0")}`;
    }
  };

  const baseAmount = (minutes / 60) * hourlyRate;
  const serviceFee = decideLater ? 2 : Math.max(2, baseAmount * 0.1); // Minimum 2€ de frais de service
  const totalAmount = baseAmount + serviceFee;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleBack}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
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
              {step === "message" ? "Contacter le pet-sitter" : "Paiement"}
            </Text>
            <TouchableOpacity onPress={handleBack}>
              <Ionicons
                name="close"
                size={24}
                color={isDark ? "#ffffff" : "#111827"}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={{ maxHeight: Dimensions.get("window").height * 0.6 }}
          >
            {step === "message" ? (
              <View>
                <Text
                  style={{
                    marginBottom: 8,
                    color: isDark ? "#d1d5db" : "#4b5563",
                    fontSize: 16,
                  }}
                >
                  Message à {petSitterName} (optionnel)
                </Text>
                <TextInput
                  multiline
                  numberOfLines={6}
                  value={message}
                  onFocus={() => {
                    if (!message) {
                      setMessage(defaultMessage);
                    }
                  }}
                  onChangeText={(text) => {
                    if (!message && text) {
                      setMessage(defaultMessage);
                    } else {
                      setMessage(text);
                    }
                  }}
                  placeholder={defaultMessage}
                  placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
                  style={{
                    backgroundColor: isDark ? "#374151" : "#f3f4f6",
                    borderRadius: 12,
                    padding: 16,
                    color: isDark ? "#ffffff" : "#111827",
                    marginBottom: 16,
                    textAlignVertical: "top",
                  }}
                />
                <Text
                  style={{
                    marginBottom: 8,
                    color: isDark ? "#d1d5db" : "#4b5563",
                    fontSize: 16,
                  }}
                >
                  Sélectionnez vos animaux
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingVertical: 8,
                    paddingHorizontal: 4,
                    gap: 12,
                  }}
                  style={{
                    marginBottom: 16,
                  }}
                >
                  {listPets && listPets.length > 0 ? (
                    listPets.map((pet) => (
                      <TouchableOpacity
                        key={pet.id}
                        onPress={() => {
                          setSelectedPets((prev) =>
                            prev.includes(pet.id)
                              ? prev.filter((id) => id !== pet.id)
                              : [...prev, pet.id]
                          );
                        }}
                        style={{
                          width: 80,
                          alignItems: "center",
                          backgroundColor: selectedPets.includes(pet.id)
                            ? isDark
                              ? "rgba(59, 130, 246, 0.3)"
                              : "rgba(59, 130, 246, 0.1)"
                            : "transparent",
                          borderRadius: 12,
                          padding: 8,
                          borderWidth: selectedPets.includes(pet.id) ? 2 : 0,
                          borderColor: isDark ? "#60a5fa" : "#3b82f6",
                        }}
                      >
                        <View
                          style={{
                            width: 60,
                            height: 60,
                            borderRadius: 30,
                            backgroundColor: isDark ? "#4b5563" : "#e5e7eb",
                            marginBottom: 4,
                            overflow: "hidden",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {pet.photo_url ? (
                            <Image
                              source={{ uri: pet.photo_url }}
                              style={{ width: 60, height: 60 }}
                              resizeMode="cover"
                            />
                          ) : (
                            <MaterialIcons
                              name="pets"
                              size={30}
                              color={isDark ? "#9ca3af" : "#6b7280"}
                            />
                          )}
                        </View>
                        <Text
                          style={{
                            color: isDark ? "#ffffff" : "#111827",
                            fontSize: 12,
                            fontWeight: selectedPets.includes(pet.id)
                              ? "600"
                              : "400",
                            textAlign: "center",
                          }}
                          numberOfLines={1}
                        >
                          {pet.name}
                        </Text>
                      </TouchableOpacity>
                    ))
                  ) : (
                    <View
                      style={{
                        padding: 16,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={{ color: isDark ? "#9ca3af" : "#6b7280" }}>
                        Aucun animal trouvé
                      </Text>
                    </View>
                  )}
                </ScrollView>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setDecideLater(!decideLater)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: decideLater
                        ? isDark
                          ? "#374151"
                          : "#f3f4f6"
                        : "transparent",
                      padding: 8,
                      borderRadius: 8,
                      flex: 1,
                    }}
                  >
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 4,
                        borderWidth: 2,
                        borderColor: isDark ? "#60a5fa" : "#3b82f6",
                        backgroundColor: decideLater
                          ? isDark
                            ? "#60a5fa"
                            : "#3b82f6"
                          : "transparent",
                        marginRight: 8,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {decideLater && (
                        <Ionicons name="checkmark" size={16} color="#ffffff" />
                      )}
                    </View>
                    <Text
                      style={{
                        color: isDark ? "#d1d5db" : "#4b5563",
                        fontSize: 14,
                        flexShrink: 1,
                      }}
                      numberOfLines={2}
                    >
                      Décider de l'heure plus tard avec {petSitterName}
                    </Text>
                  </TouchableOpacity>
                </View>

                {!decideLater && (
                  <View
                    style={{
                      backgroundColor: isDark ? "#374151" : "#f3f4f6",
                      borderRadius: 12,
                      padding: 16,
                      marginBottom: 16,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 24,
                          fontWeight: "700",
                          color: isDark ? "#ffffff" : "#111827",
                        }}
                      >
                        {formatMinutes(minutes)}
                      </Text>
                      <View
                        style={{
                          backgroundColor: isDark ? "#4b5563" : "#e5e7eb",
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          borderRadius: 20,
                        }}
                      >
                        <Text
                          style={{
                            color: isDark ? "#d1d5db" : "#4b5563",
                            fontWeight: "500",
                          }}
                        >
                          {((minutes / 60) * hourlyRate).toFixed(2)}€
                        </Text>
                      </View>
                    </View>
                    <Slider
                      minimumValue={15}
                      maximumValue={720}
                      step={15}
                      value={minutes}
                      onValueChange={(value) => setMinutes(value)}
                      minimumTrackTintColor={isDark ? "#3b82f6" : "#2563eb"}
                      maximumTrackTintColor={isDark ? "#4b5563" : "#e5e7eb"}
                      thumbTintColor={isDark ? "#60a5fa" : "#3b82f6"}
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: 4,
                      }}
                    >
                      <Text style={{ color: isDark ? "#9ca3af" : "#6b7280" }}>
                        15min
                      </Text>
                      <Text style={{ color: isDark ? "#9ca3af" : "#6b7280" }}>
                        12h
                      </Text>
                    </View>
                  </View>
                )}

                <View
                  style={{
                    backgroundColor: isDark ? "#374151" : "#f3f4f6",
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 16,
                  }}
                >
                  <Text
                    style={{
                      color: isDark ? "#d1d5db" : "#4b5563",
                      marginBottom: 8,
                      fontWeight: "600",
                    }}
                  >
                    Récapitulatif
                  </Text>
                  {!decideLater && (
                    <>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginBottom: 4,
                        }}
                      >
                        <Text style={{ color: isDark ? "#9ca3af" : "#6b7280" }}>
                          Tarif horaire
                        </Text>
                        <Text style={{ color: isDark ? "#ffffff" : "#111827" }}>
                          {hourlyRate}€
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginBottom: 4,
                        }}
                      >
                        <Text style={{ color: isDark ? "#9ca3af" : "#6b7280" }}>
                          Durée
                        </Text>
                        <Text style={{ color: isDark ? "#ffffff" : "#111827" }}>
                          {formatMinutes(minutes)}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginBottom: 4,
                        }}
                      >
                        <Text style={{ color: isDark ? "#9ca3af" : "#6b7280" }}>
                          Sous-total
                        </Text>
                        <Text style={{ color: isDark ? "#ffffff" : "#111827" }}>
                          {baseAmount.toFixed(2)}€
                        </Text>
                      </View>
                    </>
                  )}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <Text style={{ color: isDark ? "#9ca3af" : "#6b7280" }}>
                      {decideLater
                        ? "Frais de service"
                        : "Frais de service (min. 2€)"}
                    </Text>
                    <Text style={{ color: isDark ? "#ffffff" : "#111827" }}>
                      {serviceFee.toFixed(2)}€
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 8,
                      paddingTop: 8,
                      borderTopWidth: 1,
                      borderTopColor: isDark ? "#4b5563" : "#d1d5db",
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "600",
                        color: isDark ? "#ffffff" : "#111827",
                      }}
                    >
                      Total
                    </Text>
                    <Text
                      style={{
                        fontWeight: "600",
                        color: isDark ? "#ffffff" : "#111827",
                      }}
                    >
                      {decideLater ? "2.00€" : totalAmount.toFixed(2) + "€"}
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <View className="relative">
                <Text
                  style={{
                    marginBottom: 16,
                    color: isDark ? "#d1d5db" : "#4b5563",
                    fontSize: 16,
                  }}
                >
                  Montant à payer :{" "}
                  {decideLater ? "2.00€" : totalAmount.toFixed(2) + "€"}
                </Text>
                {showTooltip && (
                  <Animated.Text
                    style={{
                      position: "absolute",

                      color: "red",
                      marginBottom: 12,
                      textAlign: "center",
                      top: "50%",
                      left: "50%",
                      transform: [{ translateX: -100 }],
                      backgroundColor: isDark
                        ? "rgba(220, 38, 38, 0.1)"
                        : "rgba(248, 113, 113, 0.1)",

                      padding: 8,
                      borderRadius: 8,
                      zIndex: 1000,
                      opacity: tooltipAnim.anim,
                    }}
                  >
                    🚨 Remplissez tous les champs !
                  </Animated.Text>
                )}
                <Text
                  style={{
                    marginBottom: 8,
                    color: isDark ? "#d1d5db" : "#4b5563",
                  }}
                >
                  Numéro de carte
                </Text>
                <Animated.View
                  style={{ transform: [{ translateX: cardAnim.anim }] }}
                >
                  <TextInput
                    value={cardNumber}
                    onChangeText={setCardNumber}
                    placeholder="1234 5678 9012 3456"
                    placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
                    keyboardType="numeric"
                    maxLength={19}
                    style={{
                      backgroundColor: isDark ? "#374151" : "#f3f4f6",
                      borderRadius: 12,
                      padding: 16,
                      color: isDark ? "#ffffff" : "#111827",
                      marginBottom: 16,
                    }}
                  />
                </Animated.View>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 12,
                    marginBottom: 16,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        marginBottom: 8,
                        color: isDark ? "#d1d5db" : "#4b5563",
                      }}
                    >
                      Date d'expiration
                    </Text>
                    <Animated.View
                      style={{
                        flex: 1,
                        transform: [{ translateX: expiryAnim.anim }],
                      }}
                    >
                      <TextInput
                        value={expiryDate}
                        onChangeText={setExpiryDate}
                        placeholder="MM/YY"
                        placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
                        maxLength={5}
                        style={{
                          backgroundColor: isDark ? "#374151" : "#f3f4f6",
                          borderRadius: 12,
                          padding: 16,
                          color: isDark ? "#ffffff" : "#111827",
                        }}
                      />
                    </Animated.View>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        marginBottom: 8,
                        color: isDark ? "#d1d5db" : "#4b5563",
                      }}
                    >
                      CVV
                    </Text>
                    <Animated.View
                      style={{
                        flex: 1,
                        transform: [{ translateX: cvvAnim.anim }],
                      }}
                    >
                      <TextInput
                        value={cvv}
                        onChangeText={setCvv}
                        placeholder="123"
                        placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
                        keyboardType="numeric"
                        maxLength={3}
                        style={{
                          backgroundColor: isDark ? "#374151" : "#f3f4f6",
                          borderRadius: 12,
                          padding: 16,
                          color: isDark ? "#ffffff" : "#111827",
                        }}
                      />
                    </Animated.View>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          <View
            style={{
              flexDirection: "row",
              gap: 12,
              marginTop: 24,
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: 14,
                paddingHorizontal: 16,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: isDark ? "#4b5563" : "#d1d5db",
                backgroundColor: isDark ? "#374151" : "#ffffff",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={handleBack}
            >
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 16,
                  color: isDark ? "#ffffff" : "#111827",
                }}
              >
                Retour
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: 14,
                paddingHorizontal: 16,
                borderRadius: 12,
                backgroundColor: "#3b82f6",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#3b82f6",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6,
              }}
              onPress={handleNext}
            >
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 16,
                  color: "#ffffff",
                }}
              >
                {step === "message" ? "Suivant" : "Payer"}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default ContactPetSitterModal;
