import React from "react";
import { View, Text, Image, useColorScheme } from "react-native";

type PetSitterReviewResponse = {
  id: string;
  pet_sitter_id: string;
  user_id: string;
  user_first_name: string;
  user_last_name: string;
  user_username: string;
  user_picture: string;
  pet_sitter_rating: number;
  message: string;
  createdAt: Date;
  updatedAt: Date;
};

type ReviewCardProps = {
  review: PetSitterReviewResponse;
  renderStars: (rating: number) => React.ReactNode;
};

const ReviewCard = ({ review, renderStars }: ReviewCardProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const formatDate = (date: Date) => {
    const reviewDate = new Date(date);
    const now = new Date();
    const diffInMs = now.getTime() - reviewDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return "Aujourd'hui";
    } else if (diffInDays === 1) {
      return "Hier";
    } else if (diffInDays < 7) {
      return `Il y a ${diffInDays} jours`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `Il y a ${weeks} semaine${weeks > 1 ? "s" : ""}`;
    } else {
      return reviewDate.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
  };

  const fullName =
    `${review.user_first_name} ${review.user_last_name}`.trim() ||
    review.user_username;

  return (
    <View
      style={{
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        backgroundColor: isDark ? "#374151" : "#f9fafb",
        borderWidth: 1,
        borderColor: isDark ? "#4b5563" : "#e5e7eb",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          marginBottom: 8,
        }}
      >
        <Image
          source={{
            uri:
              review.user_picture ||
              "https://www.canbind.ca/wp-content/uploads/2025/01/placeholder-image-person-jpg.jpg",
          }}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            marginRight: 12,
            borderWidth: 2,
            borderColor: isDark ? "#6b7280" : "#e5e7eb",
          }}
        />
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            <Text
              style={{
                fontWeight: "600",
                fontSize: 15,
                color: isDark ? "#ffffff" : "#111827",
              }}
            >
              {fullName}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: isDark ? "#9ca3af" : "#6b7280",
              }}
            >
              {formatDate(review.createdAt)}
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginBottom: 8 }}>
            {renderStars(review.pet_sitter_rating)}
          </View>
          <Text
            style={{
              fontSize: 14,
              lineHeight: 20,
              color: isDark ? "#d1d5db" : "#4b5563",
            }}
          >
            {review.message}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ReviewCard;
