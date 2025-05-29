import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, Image, Pressable } from "react-native";
import BottomSheet, {
  BottomSheetView,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { ResponsePetsitter } from "@/types/type";
import { useColorScheme } from "react-native";
import {
  FontAwesome,
  MaterialIcons,
  Ionicons,
  AntDesign,
} from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import SectionCard from "./SectionCard";
import ReviewCard from "./ReviewCard";

interface PetSitterBottomSheetProps {
  petSitter: ResponsePetsitter | null;
  bottomSheetRef: React.RefObject<BottomSheet | null>;
}

const mockReviews = [
  {
    id: 1,
    clientName: "Marie D.",
    clientAvatar: "https://randomuser.me/api/portraits/women/1.jpg",
    rating: 5,
    date: "15 mars 2024",
    comment:
      "Excellente petsitter ! Ma chienne Luna était très bien gardée. Je recommande vivement !",
  },
  {
    id: 2,
    clientName: "Thomas L.",
    clientAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
    rating: 4,
    date: "28 février 2024",
    comment:
      "Très professionnel et attentionné avec mon chat. Quelques photos envoyées pendant la garde, c'est rassurant.",
  },
  {
    id: 3,
    clientName: "Sophie M.",
    clientAvatar: "https://randomuser.me/api/portraits/women/2.jpg",
    rating: 5,
    date: "10 février 2024",
    comment:
      "Parfait ! Mon chien était ravi de passer du temps avec elle. Communication excellente.",
  },
];

const PetSitterBottomSheet: React.FC<PetSitterBottomSheetProps> = ({
  petSitter,
  bottomSheetRef,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const snapPoints = useMemo(() => ["50%", "90%"], []);

  const expandBottomSheet = () => {
    bottomSheetRef.current?.snapToIndex(1);
  };

  if (!petSitter) return null;

  const { petsitter, user } = petSitter;

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesome key={i} name="star" size={16} color="#fbbf24" />);
    }
    if (hasHalfStar) {
      stars.push(
        <FontAwesome
          key="half"
          name="star-half-full"
          size={16}
          color="#fbbf24"
        />
      );
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FontAwesome
          key={`empty-${i}`}
          name="star-o"
          size={16}
          color="#d1d5db"
        />
      );
    }

    return stars;
  };

  const TagChip = ({
    text,
    color = "gray",
  }: {
    text: string;
    color?: string;
  }) => {
    const colors = {
      gray: {
        bg: isDark ? "#4b5563" : "#f3f4f6",
        text: isDark ? "#d1d5db" : "#374151",
      },
      green: {
        bg: isDark ? "#065f46" : "#d1fae5",
        text: isDark ? "#6ee7b7" : "#047857",
      },
      purple: {
        bg: isDark ? "#581c87" : "#e9d5ff",
        text: isDark ? "#c084fc" : "#7c3aed",
      },
      orange: {
        bg: isDark ? "#9a3412" : "#fed7aa",
        text: isDark ? "#fdba74" : "#ea580c",
      },
      blue: {
        bg: isDark ? "#1e3a8a" : "#dbeafe",
        text: isDark ? "#93c5fd" : "#1d4ed8",
      },
    };

    const colorScheme = colors[color as keyof typeof colors] || colors.gray;

    return (
      <View
        style={{
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 20,
          marginRight: 8,
          marginBottom: 8,
          backgroundColor: colorScheme.bg,
        }}
      >
        <Text
          style={{
            fontSize: 13,
            fontWeight: "500",
            color: colorScheme.text,
          }}
        >
          {text}
        </Text>
      </View>
    );
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      enableDynamicSizing={false}
      backgroundStyle={{
        backgroundColor: isDark ? "#1f2937" : "#ffffff",
      }}
      handleIndicatorStyle={{
        backgroundColor: isDark ? "#6b7280" : "#d1d5db",
        width: 40,
        height: 4,
      }}
    >
      <BottomSheetView style={{ flex: 1 }}>
        <View style={{ height: 4 }}></View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          <Pressable style={{ flex: 1 }} onPress={expandBottomSheet}>
            <SectionCard>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ position: "relative" }}>
                  <Image
                    source={{
                      uri:
                        user.profilePicture ||
                        "https://www.canbind.ca/wp-content/uploads/2025/01/placeholder-image-person-jpg.jpg",
                    }}
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 36,
                      marginRight: 16,
                      backgroundColor: "#f3f4f6",
                      borderWidth: 3,
                      borderColor: isDark ? "#4b5563" : "#e5e7eb",
                    }}
                  />
                  <View
                    style={{
                      position: "absolute",
                      bottom: 2,
                      right: 18,
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: "#10b981",
                      borderWidth: 2,
                      borderColor: isDark ? "#1f2937" : "#ffffff",
                    }}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: "700",
                      color: isDark ? "#ffffff" : "#111827",
                      marginBottom: 4,
                    }}
                  >
                    {user.firstName || "Prénom non renseigné"}{" "}
                    {user.lastName || "Nom non renseigné"}
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
                    <View style={{ flexDirection: "row", marginRight: 8 }}>
                      {renderStars(user.rating ?? 0)}
                    </View>
                    <Text
                      style={{
                        fontSize: 14,
                        color: isDark ? "#d1d5db" : "#4b5563",
                      }}
                    >
                      {user.rating ? `${user.rating}/5` : "Non noté"} •{" "}
                      {mockReviews.length} avis
                    </Text>
                  </View>

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons
                      name="location-outline"
                      size={16}
                      color={isDark ? "#9ca3af" : "#6b7280"}
                      style={{ marginRight: 4 }}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        color: isDark ? "#9ca3af" : "#6b7280",
                      }}
                    >
                      {user.city || "Ville non renseignée"},{" "}
                      {user.country || "Pays non renseigné"}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 2,
                    }}
                  >
                    <Ionicons
                      name="person-outline"
                      size={16}
                      color={isDark ? "#9ca3af" : "#6b7280"}
                      style={{ marginRight: 4 }}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        color: isDark ? "#9ca3af" : "#6b7280",
                      }}
                    >
                      {user.age ? `${user.age} ans` : "Âge non renseigné"}
                    </Text>
                  </View>
                </View>
              </View>
            </SectionCard>

            {/* Tarif */}
            <SectionCard
              style={{ backgroundColor: isDark ? "#1e3a8a" : "#dbeafe" }}
            >
              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <MaterialIcons
                    name="euro"
                    size={28}
                    color={isDark ? "#93c5fd" : "#1d4ed8"}
                    style={{ marginRight: 4 }}
                  />
                  <Text
                    style={{
                      fontSize: 28,
                      fontWeight: "800",
                      color: isDark ? "#93c5fd" : "#1d4ed8",
                    }}
                  >
                    {petsitter.hourly_rate != null
                      ? `${petsitter.hourly_rate}/heure`
                      : "Tarif non renseigné"}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <MaterialIcons
                    name="work-outline"
                    size={16}
                    color={isDark ? "#bfdbfe" : "#3b82f6"}
                    style={{ marginRight: 4 }}
                  />
                  <Text
                    style={{
                      textAlign: "center",
                      color: isDark ? "#bfdbfe" : "#3b82f6",
                      fontWeight: "500",
                    }}
                  >
                    {petsitter.experience
                      ? `${petsitter.experience} ${
                          petsitter.experience > 1 ? "années" : "année"
                        } d'expérience`
                      : "Expérience non renseignée"}
                  </Text>
                </View>
              </View>
            </SectionCard>

            {/* Bio */}
            <SectionCard>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <Ionicons
                  name="person-circle-outline"
                  size={24}
                  color={isDark ? "#ffffff" : "#111827"}
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "600",
                    color: isDark ? "#ffffff" : "#111827",
                  }}
                >
                  À propos
                </Text>
              </View>
              <Text
                style={{
                  color: isDark ? "#d1d5db" : "#4b5563",
                  lineHeight: 22,
                  fontSize: 15,
                }}
              >
                {user.bio || petsitter.bio || "Aucune bio disponible."}
              </Text>
            </SectionCard>

            {/* Services */}
            <SectionCard>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <MaterialIcons
                  name="room-service"
                  size={24}
                  color={isDark ? "#ffffff" : "#111827"}
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "600",
                    color: isDark ? "#ffffff" : "#111827",
                  }}
                >
                  Services proposés
                </Text>
              </View>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {petsitter.services && petsitter.services.length > 0 ? (
                  petsitter.services.map((service, index) => (
                    <TagChip key={index} text={service} color="gray" />
                  ))
                ) : (
                  <Text style={{ color: isDark ? "#9ca3af" : "#6b7280" }}>
                    Aucun service renseigné.
                  </Text>
                )}
              </View>
            </SectionCard>

            {/* Types d'animaux */}
            <SectionCard>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <MaterialIcons
                  name="pets"
                  size={24}
                  color={isDark ? "#ffffff" : "#111827"}
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "600",
                    color: isDark ? "#ffffff" : "#111827",
                  }}
                >
                  Animaux acceptés
                </Text>
              </View>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {petsitter.animal_types && petsitter.animal_types.length > 0 ? (
                  petsitter.animal_types.map((animal, index) => (
                    <TagChip key={index} text={animal} color="green" />
                  ))
                ) : (
                  <Text style={{ color: isDark ? "#9ca3af" : "#6b7280" }}>
                    Aucun type d'animal renseigné.
                  </Text>
                )}
              </View>
            </SectionCard>

            {/* Disponibilité */}
            <SectionCard>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <MaterialIcons
                  name="schedule"
                  size={24}
                  color={isDark ? "#ffffff" : "#111827"}
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "600",
                    color: isDark ? "#ffffff" : "#111827",
                  }}
                >
                  Disponibilité
                </Text>
              </View>

              {/* Jours disponibles */}
              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "500",
                    marginBottom: 8,
                    color: isDark ? "#e5e7eb" : "#374151",
                  }}
                >
                  Jours
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {petsitter.available_days &&
                  petsitter.available_days.length > 0 ? (
                    petsitter.available_days.map((day, index) => (
                      <TagChip key={index} text={day} color="purple" />
                    ))
                  ) : (
                    <Text style={{ color: isDark ? "#9ca3af" : "#6b7280" }}>
                      Aucun jour renseigné.
                    </Text>
                  )}
                </View>
              </View>

              {/* Créneaux horaires */}
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "500",
                    marginBottom: 8,
                    color: isDark ? "#e5e7eb" : "#374151",
                  }}
                >
                  Créneaux horaires
                </Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {petsitter.available_slots &&
                  petsitter.available_slots.length > 0 ? (
                    petsitter.available_slots.map((slot, index) => (
                      <TagChip key={index} text={slot} color="orange" />
                    ))
                  ) : (
                    <Text style={{ color: isDark ? "#9ca3af" : "#6b7280" }}>
                      Aucun créneau renseigné.
                    </Text>
                  )}
                </View>
              </View>
            </SectionCard>

            {/* Section Avis Clients */}
            <SectionCard>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <MaterialIcons
                    name="rate-review"
                    size={24}
                    color={isDark ? "#ffffff" : "#111827"}
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      color: isDark ? "#ffffff" : "#111827",
                    }}
                  >
                    Avis clients ({mockReviews.length})
                  </Text>
                </View>
                <TouchableOpacity
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 20,
                    backgroundColor: isDark ? "#1e3a8a" : "#dbeafe",
                  }}
                  onPress={() => console.log("Voir tous les avis")}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "500",
                      color: isDark ? "#93c5fd" : "#1d4ed8",
                    }}
                  >
                    Voir tout
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Boutons d'action pour les avis */}
              <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: "#fbbf24",
                    backgroundColor: isDark ? "#451a03" : "#fef3c7",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => console.log("Laisser une note")}
                >
                  <FontAwesome
                    name="star"
                    size={16}
                    color="#fbbf24"
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={{
                      fontWeight: "600",
                      color: isDark ? "#fbbf24" : "#92400e",
                    }}
                  >
                    Noter
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: "#10b981",
                    backgroundColor: isDark ? "#064e3b" : "#d1fae5",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => console.log("Laisser un message")}
                >
                  <Ionicons
                    name="chatbubble-outline"
                    size={16}
                    color="#10b981"
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={{
                      fontWeight: "600",
                      color: isDark ? "#10b981" : "#047857",
                    }}
                  >
                    Commenter
                  </Text>
                </TouchableOpacity>
              </View>

              {mockReviews.slice(0, 2).map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  renderStars={renderStars}
                />
              ))}
            </SectionCard>
          </Pressable>
        </ScrollView>

        <View
          style={{
            padding: 16,
            borderTopWidth: 1,
            borderTopColor: isDark ? "#374151" : "#e5e7eb",
            backgroundColor: isDark ? "#1f2937" : "#ffffff",
          }}
        >
          <View style={{ flexDirection: "row", gap: 12 }}>
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
              onPress={() => console.log("Contacter le petsitter")}
            >
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={20}
                color={isDark ? "#ffffff" : "#111827"}
                style={{ marginRight: 8 }}
              />
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 16,
                  color: isDark ? "#ffffff" : "#111827",
                }}
              >
                Contacter
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
              onPress={() => console.log("Faire une demande de réservation")}
            >
              <MaterialIcons
                name="event-available"
                size={20}
                color="#ffffff"
                style={{ marginRight: 8 }}
              />
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 16,
                  color: "#ffffff",
                }}
              >
                Réserver
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default PetSitterBottomSheet;
