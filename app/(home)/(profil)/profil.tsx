import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
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

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const InfoRow = ({ label, value, required = false }: { label: string, value: string | null, required?: boolean }) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <Text style={value ? styles.infoValue : styles.infoValueEmpty}>
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
    <SafeAreaView style={styles.container}>
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
          <View style={styles.verificationBadge}>
            {user.identityDocument ? (
              <Text style={styles.verifiedText}>✓ Profil vérifié</Text>
            ) : (
              <Text style={styles.unverifiedText}>⚠ Profil non vérifié</Text>
            )}
          </View>
        </View>

        {/* Titre de section */}
        <Text style={styles.sectionTitle}>Mon Profil</Text>

        {/* Informations utilisateur */}
        <View style={styles.infoSection}>
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
        <View style={styles.verificationSection}>
          <Text style={styles.verificationTitle}>Vérification de l'identité</Text>
          <View style={styles.verificationStatus}>
            {user.identityDocument ? (
              <Text style={styles.verificationText}>
                ✓ Document d'identité vérifié
              </Text>
            ) : (
              <Text style={styles.verificationTextPending}>
                ⏳ Vérification en attente
              </Text>
            )}
          </View>
        </View>

        {/* Bouton modifier le profil */}
        <Pressable
          onPress={() => router.push("/modifprofile")}
          style={styles.editButton}
        >
          <AntDesign name="edit" size={20} color="white" />
          <Text style={styles.editButtonText}>Modifier le profil</Text>
        </Pressable>

        {/* Autres actions */}
        <View style={styles.actionsSection}>
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
    backgroundColor: 'white',
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
    borderBottomColor: '#E5E7EB',
    marginBottom: 24,
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
    backgroundColor: '#F3F4F6',
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
    color: '#111827',
  },
  infoSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoRow: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  required: {
    color: '#EF4444',
  },
  infoValue: {
    fontSize: 16,
    color: '#111827',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB', // Couleur de fond plus claire
    borderRadius: 8,
    // Suppression de borderWidth et borderColor pour enlever l'apparence d'input
  },
  infoValueEmpty: {
    fontSize: 16,
    color: '#9CA3AF', // Gris clair pour les valeurs non renseignées
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    fontStyle: 'italic',
  },
  verificationSection: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  verificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 8,
  },
  verificationStatus: {
    alignItems: 'center',
  },
  verificationText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
  },
  verificationTextPending: {
    fontSize: 14,
    color: '#D97706',
    fontWeight: '500',
  },
  editButton: {
    backgroundColor: '#111827',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 24,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  actionsSection: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 24,
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
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
});

export default Profil;