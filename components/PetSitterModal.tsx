import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, Modal, Dimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { ResponsePetsitter, PetSitterReviewResponse } from "@/types/type";
import { useColorScheme } from "react-native";
import {
  FontAwesome,
  MaterialIcons,
  Ionicons,
} from "@expo/vector-icons";
import { getReviewsByPetSitterId, postRatingForPetSitter, postReviewForPetSitter } from "@/services/petsitterRating.service";
import ReviewCard from "./ReviewCard";
import RatingModal from "@/components/RatingModal";
import CommentModal from "@/components/CommentModal";
import { ToastType, useToast } from "@/context/ToastContext";

interface PetSitterModalProps {
  petSitter: ResponsePetsitter | null;
  visible: boolean;
  onClose: () => void;
}

const PetSitterModal: React.FC<PetSitterModalProps> = ({
  petSitter,
  visible,
  onClose,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const windowHeight = Dimensions.get('window').height;
  const [petSitterReviews, setPetsitterReviews] = useState<PetSitterReviewResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [TotalReviews, setTotalReviews] = useState(0);
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(2);
  const { showToast } = useToast();

  useEffect(() => {
    if (petSitter) {
      loadReviews();
    }
  }, [petSitter]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await getReviewsByPetSitterId(petSitter!.petsitter.id, {
        page: 1,
        limit: 10,
      });
      setPetsitterReviews(response.reviews);
      setTotalReviews(response.reviews.length);
    } catch (error) {
      console.error("Erreur lors du chargement des avis:", error);
      setPetsitterReviews([]);
      setTotalReviews(0);
    } finally {
      setLoading(false);
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

  const handleRatingSubmit = async (rating: number) => {
    try {
      await postRatingForPetSitter(petSitter!.petsitter.id, rating);
      showToast(
        `Merci, vous avez donné ${rating} étoile${rating > 1 ? "s" : ""}`,
        ToastType.SUCCESS
      );
      loadReviews();
    } catch (error: any) {
      showToast(
        error.message || "Erreur lors de l'envoi de la note",
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
      if (rating > 0) {
        await postRatingForPetSitter(petSitter!.petsitter.id, rating);
      }
      await postReviewForPetSitter(petSitter!.petsitter.id, comment);
      showToast(
        "Merci ! Votre avis a été publié avec succès",
        ToastType.SUCCESS
      );
      loadReviews();
    } catch (error: any) {
      showToast(
        error.message || "Erreur lors de l'envoi du commentaire",
        ToastType.ERROR
      );
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={{ 
          flex: 1, 
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity 
          activeOpacity={1} 
          onPress={(e) => e.stopPropagation()}
          style={{ 
            width: '100%',
            maxHeight: windowHeight * 0.9,
            backgroundColor: isDark ? "#1f2937" : "#ffffff",
            borderRadius: 20,
            overflow: 'hidden',
          }}
        >
          {/* Header avec photo et infos principales */}
          <View style={{ 
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? "#374151" : "#e5e7eb",
          }}>
            {/* Bouton de fermeture */}
            <TouchableOpacity
              onPress={onClose}
              style={{
                position: 'absolute',
                right: 20,
                top: 20,
                zIndex: 1,
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: isDark ? "#374151" : "#f3f4f6",
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Ionicons
                name="close"
                size={24}
                color={isDark ? "#ffffff" : "#111827"}
              />
            </TouchableOpacity>

            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
              <View style={{ position: "relative" }}>
                <Image
                  source={{
                    uri: user.profilePicture ||
                      "https://www.canbind.ca/wp-content/uploads/2025/01/placeholder-image-person-jpg.jpg",
                  }}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
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
                    fontSize: 24,
                    fontWeight: "700",
                    color: isDark ? "#ffffff" : "#111827",
                    marginBottom: 4,
                  }}
                >
                  {user.firstName} {user.lastName}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                  <View style={{ flexDirection: "row", marginRight: 8 }}>
                    {renderStars(user.rating ?? 0)}
                  </View>
                  <Text style={{ color: isDark ? "#d1d5db" : "#4b5563" }}>
                    {user.rating ? `${user.rating}/5` : "Non noté"} • {TotalReviews} avis
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons
                    name="location-outline"
                    size={16}
                    color={isDark ? "#9ca3af" : "#6b7280"}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={{ color: isDark ? "#9ca3af" : "#6b7280" }}>
                    {user.city || "Ville non renseignée"}, {user.country || "Pays non renseigné"}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
                  <Ionicons
                    name="person-outline"
                    size={16}
                    color={isDark ? "#9ca3af" : "#6b7280"}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={{ color: isDark ? "#9ca3af" : "#6b7280" }}>
                    {user.age ? `${user.age} ans` : "Âge non renseigné"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Tarif */}
            <View style={{ 
              marginTop: 16,
              padding: 12,
              backgroundColor: isDark ? "#1e3a8a" : "#dbeafe",
              borderRadius: 12,
              alignItems: "center",
              marginBottom: 8,
            }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
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
                  {petsitter.hourly_rate}/heure
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
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
            <ScrollView style={{ height: windowHeight * 0.33 }}>
              <View className="flex-1 ">
                {/* Bio */}
                <View style={{ marginBottom: 20 }}>
                  <Text 
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      color: isDark ? "#ffffff" : "#111827",
                      marginBottom: 8,
                    }}
                  >
                    À propos
                  </Text>
                  <Text
                    style={{
                      color: isDark ? "#d1d5db" : "#4b5563",
                      lineHeight: 22,
                      fontSize: 15,
                    }}
                  >
                    {user.bio || petsitter.bio || "Aucune bio disponible."}
                  </Text>
                </View>

                {/* Services */}
                <View style={{ marginBottom: 20 }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      color: isDark ? "#ffffff" : "#111827",
                      marginBottom: 8,
                    }}
                  >
                    Services proposés
                  </Text>
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
                </View>

                {/* Animaux acceptés */}
                <View style={{ marginBottom: 20 }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      color: isDark ? "#ffffff" : "#111827",
                      marginBottom: 8,
                    }}
                  >
                    Animaux acceptés
                  </Text>
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
                </View>

                {/* Disponibilité */}
                <View style={{ marginBottom: 20 }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      color: isDark ? "#ffffff" : "#111827",
                      marginBottom: 8,
                    }}
                  >
                    Disponibilité
                  </Text>

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
                      {petsitter.available_days && petsitter.available_days.length > 0 ? (
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
                      {petsitter.available_slots && petsitter.available_slots.length > 0 ? (
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
                </View>

                {/* Avis */}
                <View style={{ marginBottom: 20 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
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
                    <Text style={{ color: isDark ? "#9ca3af" : "#6b7280" }}>
                      Chargement des avis...
                    </Text>
                  ) : petSitterReviews.length > 0 ? (
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
                    <Text style={{ color: isDark ? "#9ca3af" : "#6b7280" }}>
                      Aucun avis pour le moment
                    </Text>
                  )}
                </View>
              </View>
            </ScrollView>
          </View>

         
          {/* Footer avec boutons */}
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
        </TouchableOpacity>
      </TouchableOpacity>

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
    </Modal>
  );
};

export default PetSitterModal; 