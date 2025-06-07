import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  Pressable,
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { AntDesign, Feather } from "@expo/vector-icons"; // Ajouter Feather
import { useAuthContext } from "@/context/AuthContext";
import axios from "axios";
import {updateUser} from "@/services/user.service";


// Import de vos services (à adapter selon votre structure)
// import { updateUser, updateProfilePicture, updateDocId, getCurrentUser } from "@/services/user.service";
// import { User } from "@/types/type";

const GENDER_OPTIONS = [
  { label: 'Sélectionnez votre genre', value: '' },
  { label: 'Homme', value: 'Male' },
  { label: 'Femme', value: 'Female' },
  { label: 'Hélicoptère', value: 'Helicopter' },
  { label: 'Autre', value: 'Other' }
];

const ModifProfile: React.FC = () => {
  const router = useRouter();
  const { user, setUser } = useAuthContext();
  
  // États pour les champs de formulaire
  const [username, setUsername] = useState<string>(user?.username || "");
  const [lastName, setLastName] = useState<string>(user?.lastName || "");
  const [firstName, setFirstName] = useState<string>(user?.firstName || "");
  const [email, setEmail] = useState<string>(user?.email || "");
  const [password, setPassword] = useState<string>("");
  const [birthDate, setBirthDate] = useState<string>(user?.birthDate || "");
  const [phone, setPhone] = useState<string>(user?.phoneNumber || "");
  const [profilePic, setProfilePic] = useState<string | null>(user?.profilePicture || null);
  const [identityDoc, setIdentityDoc] = useState<string | null>(user?.identityDocument || null);
  const [insuranceCertificate, setInsuranceCertificate] = useState<string | null>(user?.insuranceCertificate || null);
  const [age, setAge] = useState<string>(user?.age?.toString() || "");
  const [gender, setGender] = useState<string>(user?.gender || "");
  const [city, setCity] = useState<string>(user?.city || "");
  const [country, setCountry] = useState<string>(user?.country || "");
  const [bio, setBio] = useState<string>(user?.bio || "");
  const [bankInfo, setBankInfo] = useState<string>(user?.bankInfo || "");
  const [address, setAddress] = useState<string>(user?.address || "");
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async (setImage: (uri: string) => void) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          "Permission requise",
          "Nous avons besoin de votre permission pour accéder à la galerie."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Erreur lors de la sélection d'image:", error);
      Alert.alert("Erreur", "Impossible de sélectionner l'image");
    }
  };

  // Modifier la fonction validateForm pour ne vérifier que les champs requis
  const validateForm = (): boolean => {
    const requiredFields = {
      username: username.trim(),
      email: email.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    };

    const emptyFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (emptyFields.length > 0) {
      Alert.alert("Erreur", `Les champs suivants sont requis : ${emptyFields.join(", ")}`);
      return false;
    }

    // Vérifier le format de l'email
    const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegexp.test(email)) {
      Alert.alert("Erreur", "Format d'email invalide");
      return false;
    }

    // Vérifier le mot de passe uniquement s'il est rempli
    if (password) {
      const passwordRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegexp.test(password)) {
        Alert.alert(
          "Erreur",
          "Le mot de passe doit contenir au moins 8 caractères avec une minuscule, une majuscule, un chiffre et un caractère spécial"
        );
        return false;
      }
    }

    return true;
  };

  // Calcul automatique de la vérification
  const isIdentityVerified = Boolean(identityDoc && insuranceCertificate);

  // Modification du handleSubmit
  const handleSubmit = async () => {
    if (!validateForm() || !user?.id) return;

    try {
      setIsLoading(true);
      
      const cleanedData = {
        id: user.id,
        username: username.trim(),
        lastName: lastName.trim(),
        firstName: firstName.trim(),
        email: email.trim(),
        ...(password && { password: password.trim() }),
        ...(age && { age: parseInt(age) }),
        ...(birthDate && { birthDate: birthDate.trim() }),
        ...(gender && { gender : gender}),
        ...(city && { city: city.trim() }),
        ...(country && { country: country.trim() }),
        ...(bio && { bio: bio.trim() }),
        ...(bankInfo && { bankInfo: bankInfo.trim() }),
        ...(address && { address: address.trim() }),
        ...(phone && { phoneNumber: phone.trim() }),
        ...(profilePic && { profilePicture: profilePic }),
        ...(identityDoc && { identityDocument: identityDoc }),
        ...(insuranceCertificate && { insuranceCertificate })
      };

      console.log("Données envoyées:", cleanedData);
      const response = await updateUser(cleanedData);
      console.log("Réponse du serveur:", response);

      if (!response || response.success === false) {
        throw new Error(response.message || "Échec de la mise à jour");
      }

      // Mise à jour du contexte avec les nouvelles données
      setUser({
        ...user,
        ...cleanedData // Assurez-vous que la réponse contient les données dans .data
      });

      Alert.alert(
        "Succès", 
        "Profil mis à jour avec succès !",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error: any) {
      console.error("Erreur complète:", error);
      Alert.alert(
        "Erreur", 
        error.message || "Échec de la mise à jour du profil"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Titre de section */}
        <Text style={styles.sectionTitle}>Modifier le profil</Text>

        {/* Photo de profil */}
        <View style={styles.profilePicContainer}>
          <Image
            source={
              profilePic
                ? { uri: profilePic }
                : require("@/assets/icons/profile.png")
            }
            style={styles.profilePic}
          />
          <Pressable onPress={() => pickImage(setProfilePic)}>
            <Text style={styles.profilePicText}>
              {profilePic ? "Modifier la photo" : "Ajouter une photo"}
            </Text>
          </Pressable>
        </View>

        {/* Champs utilisateur */}
        {[
            { 
              label: "Nom d'utilisateur", 
              value: username, 
              setter: setUsername,
              required: true 
            },
            { 
              label: "Nom", 
              value: lastName, 
              setter: setLastName,
              required: true 
            },
            { 
              label: "Prénom", 
              value: firstName, 
              setter: setFirstName,
              required: true 
            },
            {
              label: "Mot de passe",
              value: password,
              setter: setPassword,
              secureTextEntry: true,
              hint: (
                <Text style={styles.passwordHint}>
                  Le mot de passe doit contenir au minimum :{"\n"}
                  8 caractères{"\n"}
                  1 lettre minuscule{"\n"}
                  1 lettre majuscule{"\n"}
                  1 chiffre{"\n"}
                  1 caractère spécial (@$!%*?&)
                </Text>
              )
            },
            {
              label: "Genre",
              value: gender,
              customInput: (
                <View style={styles.genderContainer}>
                  {GENDER_OPTIONS.map((option) => (
                    option.value && (
                      <Pressable
                        key={option.value}
                        style={[
                          styles.genderButton,
                          gender === option.value && styles.genderButtonSelected
                        ]}
                        onPress={() => setGender(option.value)}
                      >
                        <Text style={[
                          styles.genderButtonText,
                          gender === option.value && styles.genderButtonTextSelected
                        ]}>
                          {option.label}
                        </Text>
                      </Pressable>
                    )
                  ))}
                </View>
              )
            },
            { 
              label: "Date de naissance (JJ/MM/AAAA)", 
              value: birthDate, 
              setter: setBirthDate 
            },
            { 
              label: "Email", 
              value: email, 
              setter: setEmail,
              keyboardType: "email-address",
              autoCapitalize: "none",
              required: true 
            },
            { 
              label: "Numéro de téléphone", 
              value: phone, 
              setter: setPhone,
              keyboardType: "phone-pad" 
            },
            {
              label: "Adresse",
              value: address,
              setter: setAddress
            },
            {
              label: "Ville",
              value: city,
              setter: setCity
            },
            {
              label: "Pays",
              value: country,
              setter: setCountry
            },
            {
              label: "Bio",
              value: bio,
              setter: setBio,
              multiline: true,
              numberOfLines: 4
            },
            {
              label: "Informations bancaires",
              value: bankInfo,
              setter: setBankInfo,
              secureTextEntry: true
            },
          
          ].map(({ label, value, setter, secureTextEntry, keyboardType, multiline, numberOfLines, required, customInput, hint }, idx) => (
            <View key={idx}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  {label} {required && <Text style={styles.required}>*</Text>}
                </Text>
                {customInput || (
                  <TextInput
                    placeholder={label}
                    value={value}
                    onChangeText={setter}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType as import('react-native').KeyboardTypeOptions}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    style={[
                      styles.textInput,
                      multiline && { height: 100, textAlignVertical: 'top' }
                    ]}
                  />
                )}
              </View>
              {hint && hint}
            </View>
          ))}

        {/* Vérification d'identité */}
        <View style={styles.verificationContainer}>
          <Text style={styles.verificationLabel}>
            Vérification d'identité
          </Text>
          <View style={styles.verificationStatus}>
            {isIdentityVerified ? (
              <View style={styles.verificationStatusContainer}>
                <Feather name="check-square" size={20} color="#059669" />
                <Text style={styles.verifiedText}> Documents vérifiés</Text>
              </View>
            ) : (
              <View style={styles.verificationStatusContainer}>
                <Feather name="square" size={20} color="#DC2626" />
                <Text style={styles.unverifiedText}> Documents manquants</Text>
              </View>
            )}
          </View>
        </View>

        {/* Documents */}
        <Pressable
          onPress={() => pickImage(setIdentityDoc)}
          style={styles.fileUploadButton}
        >
          <AntDesign name="upload" size={20} color="#374151" />
          <Text style={styles.fileUploadText}>
            {identityDoc ? "Pièce d'identité sélectionnée ✓" : "Télécharger une pièce d'identité"}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => pickImage(setInsuranceCertificate)}
          style={styles.fileUploadButton}
        >
          <AntDesign name="upload" size={20} color="#374151" />
          <Text style={styles.fileUploadText}>
            {insuranceCertificate ? "Attestation d'assurance sélectionnée ✓" : "Télécharger une attestation d'assurance"}
          </Text>
        </Pressable>

        {/* Boutons d'action */}
        <View style={styles.buttonContainer}>
          <Pressable
            onPress={() => router.back()}
            style={[styles.button, styles.cancelButton]}
          >
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </Pressable>
          
          <Pressable
            onPress={handleSubmit}
            disabled={isLoading}
            style={[styles.button, styles.submitButton, isLoading && { opacity: 0.7 }]}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? "Mise à jour..." : "Valider"}
            </Text>
          </Pressable>
        </View>

        {/* Footer */}
        <Text style={styles.footerText}>
          En cliquant pour valider, vous acceptez la politique privée{"\n"}et les
          conditions générales.
        </Text>
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
  headerSpacer: {
    width: 24,
  },
  profilePicContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 8,
    backgroundColor: '#F3F4F6',
  },
  profilePicText: {
    fontSize: 14,
    color: '#6B7280',
    textDecorationLine: 'underline',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
    color: '#111827',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#374151',
  },
  required: {
    color: '#EF4444',
  },
  textInput: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  passwordHint: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 16,
    paddingHorizontal: 4,
  },
  verificationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  verificationLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  verificationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verificationStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedText: {
    color: '#059669',
    fontSize: 14,
    fontWeight: '500',
  },
  unverifiedText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '500',
  },
  fileUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  fileUploadText: {
    marginLeft: 8,
    color: '#374151',
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  submitButton: {
    backgroundColor: '#111827',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#6B7280',
    lineHeight: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  genderContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genderButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: 'white',
  },
  genderButtonSelected: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  genderButtonText: {
    color: '#374151',
    fontSize: 14,
  },
  genderButtonTextSelected: {
    color: 'white',
  },
});

export default ModifProfile;


