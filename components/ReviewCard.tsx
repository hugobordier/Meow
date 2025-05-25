import React from "react";
import { View, Text, Image, useColorScheme } from "react-native";

type Review = {
  clientName: string;
  clientAvatar: string;
  date: string;
  rating: number;
  comment: string;
};

type ReviewCardProps = {
  review: Review;
  renderStars: (rating: number) => React.ReactNode;
};

const ReviewCard = ({ review, renderStars }: ReviewCardProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

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
          source={{ uri: review.clientAvatar }}
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
              {review.clientName}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: isDark ? "#9ca3af" : "#6b7280",
              }}
            >
              {review.date}
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginBottom: 8 }}>
            {renderStars(review.rating)}
          </View>
          <Text
            style={{
              fontSize: 14,
              lineHeight: 20,
              color: isDark ? "#d1d5db" : "#4b5563",
            }}
          >
            {review.comment}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ReviewCard;
