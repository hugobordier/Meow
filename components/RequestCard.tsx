import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  StyleSheet,
  useColorScheme,
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
  requestbool: boolean; // true = user a envoyé la demande, false = le petsitter l'a reçue
};

const SkeletonCard = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View
      style={[styles.skeletonContainer, isDark && styles.skeletonContainerDark]}
    >
      <View
        style={[styles.skeletonAvatar, isDark && styles.skeletonAvatarDark]}
      />
      <View style={styles.skeletonContent}>
        <View
          style={[styles.skeletonLine1, isDark && styles.skeletonLineDark]}
        />
        <View
          style={[styles.skeletonLine2, isDark && styles.skeletonLineDark]}
        />
        <View
          style={[styles.skeletonLine3, isDark && styles.skeletonLineDark]}
        />
      </View>
      <View style={styles.skeletonBadge} />
    </View>
  );
};

const RequestCard = ({ request, requestbool }: RequestCardProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [petsitter, setPetsitter] = useState<PetSitter | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFullMessage, setShowFullMessage] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

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
          container: { backgroundColor: isDark ? "#064e3b" : "#dcfce7" }, // dark:bg-green-900 : bg-green-100
          dot: { backgroundColor: "#10b981" }, // bg-green-500
          text: { color: isDark ? "#6ee7b7" : "#047857" }, // dark:text-green-300 : text-green-700
          label: "Acceptée",
        };
      case "rejected":
        return {
          container: { backgroundColor: isDark ? "#7f1d1d" : "#fee2e2" }, // dark:bg-red-900 : bg-red-100
          dot: { backgroundColor: "#ef4444" }, // bg-red-500
          text: { color: isDark ? "#fca5a5" : "#b91c1c" }, // dark:text-red-300 : text-red-700
          label: "Refusée",
        };
      case "pending":
        return {
          container: { backgroundColor: isDark ? "#78350f" : "#fef3c7" }, // dark:bg-yellow-900 : bg-yellow-100
          dot: { backgroundColor: "#f59e0b" }, // bg-yellow-400
          text: { color: isDark ? "#fcd34d" : "#a16207" }, // dark:text-yellow-300 : text-yellow-700
          label: "À confirmer",
        };
      default:
        return {
          container: { backgroundColor: isDark ? "#78350f" : "#fef3c7" }, // dark:bg-yellow-900 : bg-yellow-100
          dot: { backgroundColor: "#f59e0b" }, // bg-yellow-400
          text: { color: isDark ? "#fcd34d" : "#a16207" }, // dark:text-yellow-300 : text-yellow-700
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
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Image
        source={{
          uri:
            user.profilePicture ||
            "https://www.canbind.ca/wp-content/uploads/2025/01/placeholder-image-person-jpg.jpg",
        }}
        style={styles.avatar}
      />
      <View style={styles.content}>
        <View style={styles.headerColumn}>
          <Text style={[styles.userName, isDark && styles.userNameDark]}>
            {user.firstName} {user.lastName}
          </Text>
          <View style={[styles.ageBadge, isDark && styles.ageBadgeDark]}>
            <Text
              style={[styles.ageBadgeText, isDark && styles.ageBadgeTextDark]}
            >
              {getAccountAgeLabel()}
            </Text>
          </View>
        </View>

        <Text
          style={[styles.messageText, isDark && styles.messageTextDark]}
          numberOfLines={showFullMessage ? undefined : 2}
        >
          {message}
        </Text>

        {isLong && (
          <TouchableOpacity onPress={handleToggleMessage}>
            <Text style={[styles.toggleText, isDark && styles.toggleTextDark]}>
              {showFullMessage ? "Voir moins ▲" : "Voir plus ▼"}
            </Text>
          </TouchableOpacity>
        )}

        <Text style={[styles.locationText, isDark && styles.locationTextDark]}>
          {petsitter?.hourly_rate ? `${petsitter.hourly_rate} €/h - ` : ""}
          {user.city && user.country
            ? `${user.city}, ${user.country}`
            : "Localisation inconnue"}
        </Text>
      </View>
      <View style={[styles.statusBadge, statusStyles.container]}>
        <View style={[styles.statusDot, statusStyles.dot]} />
        <Text style={[styles.statusText, statusStyles.text]}>
          {statusStyles.label}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Container principal
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 12,
  },
  containerDark: {
    borderBottomColor: "#374151",
  },

  // Avatar
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },

  // Contenu principal
  content: {
    marginLeft: 12,
    flex: 1,
    marginBottom: 8,
  },

  // Colonne avec nom et badge
  headerColumn: {
    flexDirection: "column",
    alignItems: "flex-start",
  },

  // Nom utilisateur
  userName: {
    color: "#1f2937",
    fontWeight: "500",
    fontSize: 16,
    marginBottom: 4,
  },
  userNameDark: {
    color: "#f9fafb", // text-gray-50
  },

  // Badge d'ancienneté
  ageBadge: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  ageBadgeDark: {
    backgroundColor: "#1e3a8a", // bg-blue-900
  },

  ageBadgeText: {
    fontSize: 12,
    color: "#1d4ed8",
  },
  ageBadgeTextDark: {
    color: "#93c5fd", // text-blue-300
  },

  // Message
  messageText: {
    color: "#6b7280",
    fontSize: 14,
    marginTop: 4,
  },
  messageTextDark: {
    color: "#d1d5db", // text-gray-300
  },

  // Bouton toggle
  toggleText: {
    color: "#3b82f6",
    fontSize: 12,
    marginTop: 4,
  },
  toggleTextDark: {
    color: "#93c5fd", // text-blue-300
  },

  // Localisation
  locationText: {
    color: "#6b7280",
    fontSize: 14,
    marginTop: 4,
  },
  locationTextDark: {
    color: "#d1d5db", // text-gray-300
  },

  // Badge de statut
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },

  statusText: {
    fontSize: 14,
  },

  // Skeleton styles
  skeletonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 12,
  },
  skeletonContainerDark: {
    borderBottomColor: "#374151",
  },

  skeletonAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#d1d5db",
  },
  skeletonAvatarDark: {
    backgroundColor: "#4b5563",
  },

  skeletonContent: {
    marginLeft: 12,
    flex: 1,
  },

  skeletonLine1: {
    height: 16,
    backgroundColor: "#d1d5db",
    borderRadius: 4,
    width: "66%",
    marginBottom: 8,
  },
  skeletonLine2: {
    height: 12,
    backgroundColor: "#d1d5db",
    borderRadius: 4,
    width: "50%",
    marginBottom: 4,
  },
  skeletonLine3: {
    height: 12,
    backgroundColor: "#d1d5db",
    borderRadius: 4,
    width: "33%",
  },
  skeletonLineDark: {
    backgroundColor: "#4b5563",
  },

  skeletonBadge: {
    width: 64,
    height: 20,
    borderRadius: 20,
    backgroundColor: "#fef3c7",
  },
});

export default RequestCard;
