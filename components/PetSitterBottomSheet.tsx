"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { View, Text, TouchableOpacity, Image, Pressable } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import type { PetSitterReviewResponse, ResponsePetsitter } from "@/types/type";
import { useColorScheme } from "react-native";
import { FontAwesome, MaterialIcons, Ionicons } from "@expo/vector-icons";
import SectionCard from "./SectionCard";
import ReviewCard from "./ReviewCard";
import {
  getReviewsByPetSitterId,
  postRatingForPetSitter,
  postReviewForPetSitter,
} from "@/services/petsitterRating.service";
import { Alert } from "react-native";
import RatingModal from "@/components/RatingModal";
import CommentModal from "@/components/CommentModal";
import { ToastType, useToast } from "@/context/ToastContext";
import ContactPetSitterModal from "@/components/ContactPetSitterModal";

interface PetSitterBottomSheetProps {
  petSitter: ResponsePetsitter | null;
  bottomSheetRef: React.RefObject<BottomSheet | null>;
}

const PetSitterBottomSheet: React.FC<PetSitterBottomSheetProps> = ({
  petSitter,
  bottomSheetRef,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const snapPoints = useMemo(() => ["50%", "90%"], []);
  const [petSitterReviews, setPetsitterReviews] = useState<
    PetSitterReviewResponse[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [TotalReviews, setTotalReviews] = useState(0);
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(2);
  const [contactModalVisible, setContactModalVisible] = useState(false);

  const { showToast } = useToast();
  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await getReviewsByPetSitterId(petSitter!.petsitter.id, {
        page: 1,
        limit: 10,
      });
      console.log("REVIEW :", response.reviews);
      setPetsitterReviews(response.reviews);
      setTotalReviews(response.reviews.length);
    } catch (error) {
      console.log("Erreur lors du chargement des avis:", error);
      setPetsitterReviews([]);
      setTotalReviews(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (petSitter) {
      loadReviews();
    }
    setVisibleReviewsCount(2);
  }, [petSitter]);

  const expandBottomSheet = () => {
    bottomSheetRef.current?.snapToIndex(1);
  };

  const handleRatingSubmit = async (rating: number) => {
    console.log("Note soumise:", rating);
    Alert.alert(
      "Merci !",
      `Vous avez donné ${rating} étoile${rating > 1 ? "s" : ""}`
    );
    try {
      await postRatingForPetSitter(petSitter!.petsitter.id, rating);
      console.log("Avis soumis:", { rating });
      showToast(
        `Merci ,Vous avez donné ${rating} étoile${rating > 1 ? "s" : ""}`,
        ToastType.SUCCESS
      );
      loadReviews();
    } catch (error: any) {
      console.log(error);
      showToast(
        error.message || "erreur lors de l'envoie du commentaire",
        ToastType.ERROR
      );
    }
  };

  const handleCommentSubmit = async ({
    comment,
    rating,
  }: {
    comment: string;
    rating: number;
  }) => {
    try {
      rating > 0
        ? await postRatingForPetSitter(petSitter!.petsitter.id, rating)
        : null;
      await postReviewForPetSitter(petSitter!.petsitter.id, comment);
      console.log("Avis soumis:", { comment, rating });
      showToast(
        "Merci !  \n Votre avis a été publié avec succès",
        ToastType.SUCCESS
      );
      loadReviews();
    } catch (error: any) {
      console.log(error);
      showToast(
        error.message || "erreur lors de l'envoie du commentaire",
        ToastType.ERROR
      );
    }
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
      <>
        <BottomSheetScrollView
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 100, // Augmenter l'espace en bas pour le bouton
          }}
          showsVerticalScrollIndicator={true}
        >
          <View style={{ height: 4 }}></View>

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
                      {TotalReviews} avis
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
                    Avis clients ({TotalReviews})
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
                  onPress={() => setRatingModalVisible(true)}
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
                  onPress={() => setCommentModalVisible(true)}
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

              {loading ? (
                <View style={{ padding: 20, alignItems: "center" }}>
                  <Text style={{ color: isDark ? "#ffffff" : "#111827" }}>
                    Chargement des avis...
                  </Text>
                </View>
              ) : TotalReviews > 0 ? (
                <>
                  {petSitterReviews
                    .slice(0, visibleReviewsCount)
                    .map((review) => (
                      <ReviewCard
                        key={review.id}
                        review={review}
                        renderStars={renderStars}
                      />
                    ))}

                  {visibleReviewsCount < TotalReviews && (
                    <TouchableOpacity
                      onPress={() => setVisibleReviewsCount((prev) => prev + 3)}
                      style={{
                        alignSelf: "center",
                        marginVertical: 12,
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        backgroundColor: "#fbbf24",
                        borderRadius: 12,
                      }}
                    >
                      <Text style={{ color: "#fff", fontWeight: "600" }}>
                        Voir plus
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              ) : (
                <View style={{ padding: 20, alignItems: "center" }}>
                  <Text style={{ color: isDark ? "#ffffff" : "#111827" }}>
                    Aucun avis pour le moment
                  </Text>
                </View>
              )}
            </SectionCard>
          </Pressable>
        </BottomSheetScrollView>

        {/* Bouton Contacter en bas, à l'intérieur du BottomSheet mais pas en position absolue */}
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
              onPress={() => setContactModalVisible(true)}
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
          </View>
        </View>
      </>

      {/* Modals */}
      <RatingModal
        visible={ratingModalVisible}
        onClose={() => setRatingModalVisible(false)}
        onSubmit={handleRatingSubmit}
      />

      <CommentModal
        visible={commentModalVisible}
        onClose={() => setCommentModalVisible(false)}
        onSubmit={handleCommentSubmit}
      />

      <ContactPetSitterModal
        visible={contactModalVisible}
        onClose={() => setContactModalVisible(false)}
        petSitterName={user.firstName}
        hourlyRate={Number.parseFloat(petsitter.hourly_rate)}
        petSitterId={petsitter.id}
      />
    </BottomSheet>
  );
};

export default PetSitterBottomSheet;
