import React, { use, useEffect, useState } from "react";
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
  Modal,
  Pressable,
} from "react-native";
import {
  deletePetsittingRequest,
  PetsittingRequestResponse,
  respondToPetsittingRequest,
} from "@/services/requestPetsitter.service";
import { getUserById } from "@/services/user.service";
import { getUserByPetSitterId } from "@/services/petsitter.service";
import { PetSitter, User } from "@/types/type";
import { set } from "lodash";
import { ToastType, useToast } from "@/context/ToastContext";
import { Ionicons } from "@expo/vector-icons";

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
  const [modalVisible, setModalVisible] = useState(false);
  const { showToast } = useToast();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
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

  const handleAccept = async () => {
    try {
      await respondToPetsittingRequest(request.user_id, "accepted");
      showToast(
        "Demande acceptée, vous pouvez maintenant discuter !",
        ToastType.SUCCESS
      );
    } catch (error) {
      showToast("Erreur lors de l'acceptation de la demande", ToastType.ERROR);
    } finally {
      setModalVisible(false);
    }
  };

  const handleReject = async () => {
    try {
      await respondToPetsittingRequest(request.user_id, "rejected");
      showToast(
        "Demande acceptée, vous pouvez maintenant discuter !",
        ToastType.SUCCESS
      );
    } catch (error) {
      showToast("Erreur lors de l'acceptation de la demande", ToastType.ERROR);
    } finally {
      setModalVisible(false);
    }
  };

  const handleStartConversation = async () => {
    try {
      await respondToPetsittingRequest(request.user_id, "accepted");
      showToast(
        "Demande acceptée, vous pouvez maintenant discuter !",
        ToastType.SUCCESS
      );
    } catch (error) {
      showToast("Erreur lors de l'acceptation de la demande", ToastType.ERROR);
    } finally {
      setModalVisible(false);
    }
  };

  const handleDeleteRequest = async () => {
    try {
      await deletePetsittingRequest(request.id);
      showToast("Demande supprimée avec succès", ToastType.SUCCESS);
    } catch (error) {
      showToast("Erreur lors de la suppression de la demande", ToastType.ERROR);
    } finally {
      setDeleteModalVisible(false);
    }
  };

  const getStatusStyles = (status: "pending" | "accepted" | "rejected") => {
    switch (status) {
      case "accepted":
        return {
          container: { backgroundColor: isDark ? "#064e3b" : "#dcfce7" },
          dot: { backgroundColor: "#10b981" },
          text: { color: isDark ? "#6ee7b7" : "#047857" },
          label: "Acceptée",
        };
      case "rejected":
        return {
          container: { backgroundColor: isDark ? "#7f1d1d" : "#fee2e2" },
          dot: { backgroundColor: "#ef4444" },
          text: { color: isDark ? "#fca5a5" : "#b91c1c" },
          label: "Refusée",
        };
      case "pending":
        return {
          container: { backgroundColor: isDark ? "#78350f" : "#fef3c7" },
          dot: { backgroundColor: "#f59e0b" },
          text: { color: isDark ? "#fcd34d" : "#a16207" },
          label: "À confirmer",
        };
      default:
        return {
          container: { backgroundColor: isDark ? "#78350f" : "#fef3c7" },
          dot: { backgroundColor: "#f59e0b" },
          text: { color: isDark ? "#fcd34d" : "#a16207" },
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

  const showResponseButton = request.statusdemande === "pending" && requestbool;
  const showDeleteButton = !requestbool;

  return (
    <>
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
              <Text
                style={[styles.toggleText, isDark && styles.toggleTextDark]}
              >
                {showFullMessage ? "Voir moins ▲" : "Voir plus ▼"}
              </Text>
            </TouchableOpacity>
          )}

          <Text
            style={[styles.locationText, isDark && styles.locationTextDark]}
          >
            {petsitter?.hourly_rate ? `${petsitter.hourly_rate} €/h - ` : ""}
            {user.city && user.country
              ? `${user.city}, ${user.country}`
              : "Localisation inconnue"}
          </Text>
        </View>

        <View style={styles.rightColumn}>
          <View style={[styles.statusBadge, statusStyles.container]}>
            <View style={[styles.statusDot, statusStyles.dot]} />
            <Text style={[styles.statusText, statusStyles.text]}>
              {statusStyles.label}
            </Text>
          </View>

          {showResponseButton && (
            <TouchableOpacity
              style={[
                styles.responseButton,
                isDark && styles.responseButtonDark,
              ]}
              onPress={() => setModalVisible(true)}
            >
              <Text
                style={[
                  styles.responseButtonText,
                  isDark && styles.responseButtonTextDark,
                ]}
              >
                Répondre
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {showDeleteButton && (
        <TouchableOpacity
          style={[styles.deleteButton, isDark && styles.deleteButtonDark]}
          onPress={() => setDeleteModalVisible(true)}
        >
          <Ionicons
            name="trash-outline"
            size={20}
            color={isDark ? "#fca5a5" : "#b91c1c"}
          />
        </TouchableOpacity>
      )}

      {/* Modal de réponse */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View
            style={[styles.modalContent, isDark && styles.modalContentDark]}
          >
            <Text style={[styles.modalTitle, isDark && styles.modalTitleDark]}>
              Répondre à la demande
            </Text>
            <Text
              style={[styles.modalSubtitle, isDark && styles.modalSubtitleDark]}
            >
              Comment souhaitez-vous répondre à {user.firstName} ?
            </Text>

            <TouchableOpacity
              style={[styles.modalButton, styles.acceptButton]}
              onPress={handleAccept}
            >
              <Text style={styles.acceptButtonText}>✓ Accepter la demande</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalButton,
                styles.conversationButton,
                isDark && styles.conversationButtonDark,
              ]}
              onPress={handleStartConversation}
            >
              <Text
                style={[
                  styles.conversationButtonText,
                  isDark && styles.conversationButtonTextDark,
                ]}
              >
                💬 Démarrer une conversation
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.rejectButton]}
              onPress={handleReject}
            >
              <Text style={styles.rejectButtonText}>✕ Refuser la demande</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.cancelButton, isDark && styles.cancelButtonDark]}
              onPress={() => setModalVisible(false)}
            >
              <Text
                style={[
                  styles.cancelButtonText,
                  isDark && styles.cancelButtonTextDark,
                ]}
              >
                Annuler
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setDeleteModalVisible(false)}
        >
          <View
            style={[styles.modalContent, isDark && styles.modalContentDark]}
          >
            <Text style={[styles.modalTitle, isDark && styles.modalTitleDark]}>
              Supprimer la demande
            </Text>
            <Text
              style={[styles.modalSubtitle, isDark && styles.modalSubtitleDark]}
            >
              Voulez-vous vraiment supprimer cette demande ?
            </Text>

            <TouchableOpacity
              style={[styles.modalButton, styles.rejectButton]}
              onPress={handleDeleteRequest}
            >
              <Text style={styles.rejectButtonText}>
                Oui, supprimer la demande
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalButton,
                styles.conversationButton,
                isDark && styles.conversationButtonDark,
              ]}
              onPress={() => setDeleteModalVisible(false)}
            >
              <Text
                style={[
                  styles.conversationButtonText,
                  isDark && styles.conversationButtonTextDark,
                ]}
              >
                Non, annuler
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  // Container principal
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 12,
  },
  containerDark: {
    borderBottomColor: "#374151",
  },

  // Bouton de suppression
  deleteButton: {
    position: "absolute",
    bottom: 16,
    right: 8,
    backgroundColor: "#fee2e2",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fca5a5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  deleteButtonDark: {
    backgroundColor: "#7f1d1d",
    borderColor: "#b91c1c",
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

  // Colonne de droite pour le statut et le bouton
  rightColumn: {
    paddingTop: 16,
    gap: 8,
    height: "auto",
    alignItems: "flex-start",
    justifyContent: "center",
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
    color: "#f9fafb",
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
    backgroundColor: "#1e3a8a",
  },

  ageBadgeText: {
    fontSize: 12,
    color: "#1d4ed8",
  },
  ageBadgeTextDark: {
    color: "#93c5fd",
  },

  // Message
  messageText: {
    color: "#6b7280",
    fontSize: 14,
    marginTop: 4,
  },
  messageTextDark: {
    color: "#d1d5db",
  },

  // Bouton toggle
  toggleText: {
    color: "#3b82f6",
    fontSize: 12,
    marginTop: 4,
  },
  toggleTextDark: {
    color: "#93c5fd",
  },

  // Localisation
  locationText: {
    color: "#6b7280",
    fontSize: 14,
    marginTop: 4,
  },
  locationTextDark: {
    color: "#d1d5db",
  },

  // Badge de statut
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 8,
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

  // Bouton répondre
  responseButton: {
    backgroundColor: "#e0e7ff", // Couleur pastel bleu clair
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#c7d2fe",
    width: "100%",
    alignItems: "center",
  },
  responseButtonDark: {
    backgroundColor: "#312e81", // Bleu foncé pastel pour le mode sombre
    borderColor: "#4338ca",
  },

  responseButtonText: {
    color: "#4338ca", // Texte bleu foncé
    fontSize: 12,
    fontWeight: "500",
  },
  responseButtonTextDark: {
    color: "#a5b4fc", // Texte bleu clair pour le mode sombre
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  modalContentDark: {
    backgroundColor: "#1f2937",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 8,
    textAlign: "center",
  },
  modalTitleDark: {
    color: "#f9fafb",
  },

  modalSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 24,
    textAlign: "center",
  },
  modalSubtitleDark: {
    color: "#d1d5db",
  },

  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },

  acceptButton: {
    backgroundColor: "#d1fae5", // Vert pastel
    borderWidth: 1,
    borderColor: "#a7f3d0",
  },

  acceptButtonText: {
    color: "#065f46", // Vert foncé
    fontSize: 16,
    fontWeight: "500",
  },

  conversationButton: {
    backgroundColor: "#f3f4f6", // Gris pastel
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  conversationButtonDark: {
    backgroundColor: "#374151",
    borderColor: "#4b5563",
  },

  conversationButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "500",
  },
  conversationButtonTextDark: {
    color: "#f9fafb",
  },

  rejectButton: {
    backgroundColor: "#fee2e2", // Rouge pastel
    borderWidth: 1,
    borderColor: "#fca5a5",
  },

  rejectButtonText: {
    color: "#991b1b", // Rouge foncé
    fontSize: 16,
    fontWeight: "500",
  },

  cancelButton: {
    marginTop: 8,
    paddingVertical: 8,
  },
  cancelButtonDark: {},

  cancelButtonText: {
    color: "#6b7280",
    fontSize: 14,
    textAlign: "center",
  },
  cancelButtonTextDark: {
    color: "#9ca3af",
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
