import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
  useColorScheme,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useAuthContext } from "@/context/AuthContext";
import { deleteUser } from '@/services/user.service';

const Profil: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, setUser, logout } = useAuthContext();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
        <View style={styles.loadingContainer}>
          <Text style={isDark ? styles.textDark : styles.textLight}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const InfoRow = ({ label, value, required = false }: { label: string, value: string | null, required?: boolean }) => (
    <View style={styles.infoRow}>
      <Text style={[styles.infoLabel, isDark ? styles.textDark : styles.textLight]}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <Text style={value ? [styles.infoValue, isDark ? styles.infoValueDark : styles.infoValueLight] : [styles.infoValueEmpty, isDark ? styles.infoValueEmptyDark : styles.infoValueEmptyLight]}>
        {value || "Non renseigné"}
      </Text>
    </View>
  );

  const handleDeleteAccount = () => {
    Alert.alert(
      "Supprimer le compte",
      "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              setIsLoading(true);
              if (!user?.id) {
                throw new Error('User ID not found');
              }
              await deleteUser(user.id);
              logout();
              router.replace("/");
            } catch (error) {
              console.error('Erreur:', error);
              Alert.alert("Erreur", "Impossible de supprimer le compte");
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />
      <ScrollView style={styles.scrollView}>


        {/* Photo de profil */}
        <View style={styles.profilePicContainer}>
          <Image
            source={
              user.profilePicture
                ? { uri: user.profilePicture }
                : require("@/assets/icons/profile.png")
            }
            style={styles.profilePic}
          />
          <View style={[styles.verificationBadge, isDark ? styles.verificationBadgeDark : styles.verificationBadgeLight]}>
            {user.identityDocument ? (
              <Text style={styles.verifiedText}>✓ Profil vérifié</Text>
            ) : (
              <Text style={styles.unverifiedText}>⚠ Profil non vérifié</Text>
            )}
          </View>
        </View>

        {/* Titre de section */}
        <Text style={[styles.sectionTitle, isDark ? styles.textDark : styles.textLight]}>Mon Profil</Text>

        {/* Informations utilisateur */}
        <View style={[styles.infoSection, isDark ? styles.infoSectionDark : styles.infoSectionLight]}>
          <InfoRow
            label="Nom d'utilisateur"
            value={user.username}
            required
          />
          <InfoRow
            label="Nom"
            value={user.lastName}
            required
          />
          <InfoRow
            label="Prénom"
            value={user.firstName}
            required
          />
          <InfoRow
            label="Email"
            value={user.email}
            required
          />
          <InfoRow
            label="Date de naissance"
            value={user.birthDate}
          />
          <InfoRow
            label="Téléphone"
            value={user.phoneNumber}
          />
          <InfoRow
            label="Ville"
            value={user.city}
          />
          <InfoRow
            label="Pays"
            value={user.country}
          />
          <InfoRow
            label="Adresse"
            value={user.address}
          />
          <InfoRow
            label="Genre"
            value={user.gender}
          />
          <InfoRow
            label="Bio"
            value={user.bio}
          />
          {user.rating && (
            <InfoRow
              label="Note moyenne"
              value={`${user.rating.toFixed(1)}/5`}
            />
          )}
        </View>

        {/* Section vérification */}
        <View style={[styles.verificationSection, isDark ? styles.verificationSectionDark : styles.verificationSectionLight]}>
          <Text style={[styles.verificationTitle, isDark ? styles.verificationTitleDark : styles.verificationTitleLight]}>Vérification de l'identité</Text>
          <View style={styles.verificationStatus}>
            {user.identityDocument ? (
              <Text style={[styles.verificationText, isDark ? styles.verifiedTextDark : styles.verifiedTextLight]}>
                ✓ Document d'identité vérifié
              </Text>
            ) : (
              <Text style={[styles.verificationTextPending, isDark ? styles.unverifiedTextDark : styles.unverifiedTextLight]}>
                ⏳ Vérification en attente
              </Text>
            )}
          </View>
        </View>

        {/* Bouton modifier le profil */}
        <Pressable
          onPress={() => router.push("/modifprofile")}
          style={[styles.editButton, isDark ? styles.editButtonDark : styles.editButtonLight]}
        >
          <AntDesign name="edit" size={20} color="white" />
          <Text style={styles.editButtonText}>Modifier le profil</Text>
        </Pressable>

        {/* Autres actions */}
        <View style={[styles.actionsSection, isDark ? styles.borderDark : styles.borderLight]}>
          <Pressable
            style={[styles.actionButton, styles.dangerButton]}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.dangerButtonText}>Supprimer le compte</Text>
            <AntDesign name="right" size={16} color="#EF4444" />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLight: {
    backgroundColor: 'white',
  },
  containerDark: {
    backgroundColor: '#1F2937',
  },
  scrollView: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    marginBottom: 24,
  },
  borderLight: {
    borderBottomColor: '#E5E7EB',
  },
  borderDark: {
    borderBottomColor: '#4B5563',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  profilePicContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },
  verificationBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  verificationBadgeLight: {
    backgroundColor: '#F3F4F6',
  },
  verificationBadgeDark: {
    backgroundColor: '#374151',
  },
  verifiedText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
  unverifiedText: {
    fontSize: 12,
    color: '#D97706',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  textLight: {
    color: '#111827',
  },
  textDark: {
    color: 'white',
  },
  infoSection: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoSectionLight: {
    backgroundColor: '#F9FAFB',
  },
  infoSectionDark: {
    backgroundColor: '#374151',
  },
  infoValue: {
    fontSize: 16,
    paddingVertical: 4,
    paddingHorizontal: 0,
    borderRadius: 0,
  },
  infoValueLight: {
    color: '#111827',
    backgroundColor: 'transparent',
  },
  infoValueDark: {
    color: 'white',
    backgroundColor: 'transparent',
  },
  infoValueEmpty: {
    fontSize: 16,
    paddingVertical: 4,
    paddingHorizontal: 0,
    borderRadius: 0,
    fontStyle: 'italic',
  },
  infoValueEmptyLight: {
    color: '#9CA3AF',
    backgroundColor: 'transparent',
  },
  infoValueEmptyDark: {
    color: '#9CA3AF',
    backgroundColor: 'transparent',
  },
  infoRow: {
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  verificationSection: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  verificationSectionLight: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  verificationSectionDark: {
    backgroundColor: '#1C3B2F',
    borderColor: '#22C55E',
  },
  verificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  verificationTitleLight: {
    color: '#166534',
  },
  verificationTitleDark: {
    color: '#22C55E',
  },
  verificationStatus: {
    alignItems: 'center',
  },
  verificationText: {
    fontSize: 14,
    fontWeight: '500',
  },
  verifiedTextLight: {
    color: '#059669',
  },
  verifiedTextDark: {
    color: '#4ADE80',
  },
  verificationTextPending: {
    fontSize: 14,
    fontWeight: '500',
  },
  unverifiedTextLight: {
    color: '#D97706',
  },
  unverifiedTextDark: {
    color: '#FACC15',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 24,
  },
  editButtonLight: {
    backgroundColor: '#111827',
  },
  editButtonDark: {
    backgroundColor: '#6D28D9',
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  actionsSection: {
    borderTopWidth: 1,
    paddingTop: 24,
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#374151',
  },
  dangerButton: {
    marginTop: 8,
  },
  dangerButtonText: {
    fontSize: 16,
    color: '#EF4444',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  required: {
    color: '#EF4444',
    marginLeft: 4,
  },
});

export default Profil;