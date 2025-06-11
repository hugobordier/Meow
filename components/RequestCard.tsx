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
import { User } from "@/types/type";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type RequestCardProps = {
  request: PetsittingRequestResponse;
  requestbool: boolean;
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
  const [loading, setLoading] = useState(true);
  const [showFullMessage, setShowFullMessage] = useState(false);

  const userId = requestbool ? request.user_id : request.petsitter_id;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await getUserById(userId);
        setUser(fetchedUser);
      } catch (error) {
        console.log("Erreur lors du fetch de l'utilisateur :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  if (loading) return <SkeletonCard />;
  if (!user) return null;

  const message = request.message || "Pas de message pour cette demande 🐾";
  const isLong = message.length > 100;

  const handleToggleMessage = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowFullMessage((prev) => !prev);
  };

  return (
    <View className="flex-row items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-3">
      <Image
        source={{
          uri:
            user.profilePicture ||
            "https://randomuser.me/api/portraits/women/22.jpg",
        }}
        className="w-12 h-12 rounded-full"
      />
      <View className="ml-3 flex-1">
        <View className="flex-row items-center">
          <Text className="text-gray-800 dark:text-white font-medium text-base">
            {user.firstName} {user.lastName}
          </Text>
          <View className="ml-2 bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded">
            <Text className="text-xs text-blue-700 dark:text-blue-300">
              Nouveau client
            </Text>
          </View>
        </View>

        <Text
          className="text-gray-500 dark:text-gray-400 text-sm mt-1"
          numberOfLines={showFullMessage ? undefined : 3}
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
          {user.city}
        </Text>
      </View>
      <View className="flex-row items-center bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded-full">
        <View className="w-2 h-2 rounded-full bg-yellow-400 mr-1" />
        <Text className="text-sm text-yellow-700 dark:text-yellow-300">
          À confirmer
        </Text>
      </View>
    </View>
  );
};

export default RequestCard;
