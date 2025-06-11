import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { PetsittingRequestResponse } from "@/services/requestPetsitter.service";
import { getUserById } from "@/services/user.service";
import { getUserByPetSitterId } from "@/services/petsitter.service";
import { PetSitter, User } from "@/types/type";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type RequestCardProps = {
  request: PetsittingRequestResponse;
  requestbool: boolean; // true = user a envoyé la demande, false = le petsitter l’a reçue
};

const SkeletonCard = () => (
  <View className="flex-row items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-3 animate-pulse">
    <View className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700" />
    <View className="ml-3 flex-1">
      <View className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mb-2" />
      <View className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-1" />
      <View className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
    </View>
    <View className="w-16 h-5 rounded-full bg-yellow-200 dark:bg-yellow-800" />
  </View>
);

const RequestCard = ({ request, requestbool }: RequestCardProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [petsitter, setPetsitter] = useState<PetSitter | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFullMessage, setShowFullMessage] = useState(false);

  const userId = requestbool ? request.user_id : request.petsitter_id;

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        let fetched;

        if (requestbool) {
          fetched = await getUserById(userId);
        } else {
          const result = await getUserByPetSitterId(userId);
          setPetsitter(result.petSitter);
          fetched = result.user;
        }
        setUser(fetched);
      } catch (error) {
        console.error("Erreur lors du fetch de l'utilisateur :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, requestbool]);

  if (loading) return <SkeletonCard />;
  if (!user) return null;

  const message = request.message || "Pas de message pour cette demande 🐾";
  const isLong = message.length > 100;

  const handleToggleMessage = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowFullMessage((prev) => !prev);
  };

  const getStatusStyles = (status: "pending" | "accepted" | "rejected") => {
    switch (status) {
      case "accepted":
        return {
          container: "bg-green-100 dark:bg-green-900",
          dot: "bg-green-500",
          text: "text-green-700 dark:text-green-300",
          label: "Acceptée",
        };
      case "rejected":
        return {
          container: "bg-red-100 dark:bg-red-900",
          dot: "bg-red-500",
          text: "text-red-700 dark:text-red-300",
          label: "Refusée",
        };
      default: // "pending"
        return {
          container: "bg-yellow-100 dark:bg-yellow-900",
          dot: "bg-yellow-400",
          text: "text-yellow-700 dark:text-yellow-300",
          label: "À confirmer",
        };
    }
  };

  const statusStyles = getStatusStyles(request.statusdemande);

  const getAccountAgeLabel = () => {
    const createdAt = requestbool
      ? new Date(user.createdAt)
      : petsitter?.createdAt
      ? new Date(petsitter.createdAt)
      : null;

    if (!createdAt) return "Ancienneté inconnue";

    const now = new Date();
    const diffInMs = now.getTime() - createdAt.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays < 1) return "Inscrit aujourd'hui";
    if (diffInDays === 1) return "Inscrit depuis 1 jour";
    if (diffInDays < 30) return `Inscrit depuis ${diffInDays} jours`;

    const diffInMonths = Math.floor(diffInDays / 30);
    const remainingDays = diffInDays % 30;

    if (diffInMonths < 12) {
      return `Inscrit depuis ${diffInMonths} mois${
        remainingDays > 0 ? ` et ${remainingDays} jours` : ""
      }`;
    }

    const diffInYears = Math.floor(diffInMonths / 12);
    const remainingMonths = diffInMonths % 12;

    return `Inscrit depuis ${diffInYears} an${diffInYears > 1 ? "s" : ""}${
      remainingMonths > 0 ? ` et ${remainingMonths} mois` : ""
    }`;
  };
  return (
    <View className="flex-row items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-3">
      <Image
        source={{
          uri:
            user.profilePicture ||
            "https://www.canbind.ca/wp-content/uploads/2025/01/placeholder-image-person-jpg.jpg",
        }}
        className="w-12 h-12 rounded-full"
      />
      <View className="ml-3  flex-1 mb-2 ">
        <View style={{ width: "100%" }} className="flex-row items-center ">
          <View>
            <Text className="text-gray-800 dark:text-white font-medium text-base">
              {user.firstName} {user.lastName}
            </Text>
          </View>

          <View className="bg-blue-100  dark:bg-blue-900 px-2 py-0.5 rounded ml-2">
            <Text className="text-xs text-blue-700 dark:text-blue-300">
              {getAccountAgeLabel()}
            </Text>
          </View>
        </View>

        <Text
          className="text-gray-500 dark:text-gray-400 text-sm mt-1"
          numberOfLines={showFullMessage ? undefined : 2}
        >
          {message}
        </Text>

        {isLong && (
          <TouchableOpacity onPress={handleToggleMessage}>
            <Text className="text-blue-500 dark:text-blue-300 text-xs mt-1">
              {showFullMessage ? "Voir moins ▲" : "Voir plus ▼"}
            </Text>
          </TouchableOpacity>
        )}

        <Text className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          {petsitter?.hourly_rate ? `${petsitter.hourly_rate} €/h - ` : ""}
          {user.city && user.country
            ? `${user.city}, ${user.country}`
            : "Localisation inconnue"}
        </Text>
      </View>
      <View
        className={`flex-row items-center px-2 py-1 rounded-full ${statusStyles.container}`}
      >
        <View className={`w-2 h-2 rounded-full mr-1 ${statusStyles.dot}`} />
        <Text className={`text-sm ${statusStyles.text}`}>
          {statusStyles.label}
        </Text>
      </View>
    </View>
  );
};

export default RequestCard;
