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
import { AntDesign, Feather } from "@expo/vector-icons";
import { useAuthContext } from "@/context/AuthContext";
import axios from "axios";
import {updateUser} from "@/services/user.service";
import { ToastType, useToast } from "@/context/ToastContext";

import { User } from "@/types/type";

import ProfilePictureZoomable from "@/components/ProfilePIctureZoomable";
import {
  deleteProfilePicture,
  updateProfilePicture,
} from "@/services/user.service";

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
  
  const [username, setUsername] = useState<string>(user?.username || "");
  const [lastName, setLastName] = useState<string>(user?.lastName || "");
  const [firstName, setFirstName] = useState<string>(user?.firstName || "");
  const [email, setEmail] = useState<string>(user?.email || "");
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

  const { showToast } = useToast();
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

    const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegexp.test(email)) {
      Alert.alert("Erreur", "Format d'email invalide");
      return false;
    }

    return true;
  };

  const isIdentityVerified = Boolean(identityDoc && insuranceCertificate);

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
        ...(age && { age: parseInt(age) }),
        ...(birthDate && { birthDate: birthDate.trim() }),
        ...(gender && { gender }),
        ...(city && { city: city.trim() }),
        ...(country && { country: country.trim() }),
        ...(bio && { bio: bio.trim() }),
        ...(bankInfo && { bankInfo: bankInfo.trim() }),
        ...(address && { address: address.trim() }),
        ...(phone && { phoneNumber: phone.trim() }),
        ...(identityDoc && { identityDocument: identityDoc }),
        ...(insuranceCertificate && { insuranceCertificate })
      };

      console.log("Données envoyées:", cleanedData);
      const response = await updateUser(cleanedData);
      console.log("Réponse du serveur:", response);

      if (!response || response.success === false) {
        throw new Error(response.message || "Échec de la mise à jour");
      }

      setUser({
        ...user,
        ...cleanedData,
        profilePicture: user.profilePicture
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

  const handleOpenPhotoLibrary = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
      if (status !== "granted") {
        showToast("L'accès à la galerie est requis.", ToastType.ERROR);
        return;
      }
  
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
  
        if (!result.canceled && result.assets.length > 0) {
          const selectedUri = result.assets[0].uri;
          const res = await updateProfilePicture(selectedUri);
          console.log(res);
          setUser({
            ...user,
            profilePicture: res.data.profilePicture,
          } as User);
          showToast(res.message, ToastType.SUCCESS);
        } else {
          showToast(
            "Veuillez d'abord sélectionner une image.",
            ToastType.WARNING
          );
        }
      } catch (error: any) {
        console.error("Erreur lors de la sélection d'image:", error);
        showToast(
          error.message || "Erreur lors de la sélection d'image",
          ToastType.ERROR
        );
      }
    };
  const handleOpenCamera = async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
  
      if (status !== "granted") {
        showToast("L'accès à la caméra est requis.", ToastType.ERROR);
        return;
      }
  
      try {
        const result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
  
        if (!result.canceled && result.assets.length > 0) {
          const selectedUri = result.assets[0].uri;
          const res = await updateProfilePicture(selectedUri);
          setUser({
            ...user,
            profilePicture: res.data.profilePicture,
          } as User);
          showToast(res.message, ToastType.SUCCESS);
        } else {
          showToast("Veuillez d'abord prendre une photo.", ToastType.WARNING);
        }
      } catch (error: any) {
        console.error("Erreur lors de la prise de photo:", error);
        showToast(
          error.message || "Impossible de prendre une photo.",
          ToastType.ERROR
        );
      } finally {
      }
    };
  
    const onDeletePhoto = async () => {
      try {
        const res = await deleteProfilePicture();
        showToast(res.message, ToastType.SUCCESS);
        setUser({
          ...user,
          profilePicture: res.data.profilePicture,
        } as User);
      } catch (error: any) {
        showToast(
          error.message || "Impossible de supprimer une photo.",
          ToastType.ERROR
        );
        console.log(error);
      }
    };

  const handleDocumentPicker = async (setDocument: (uri: string | null) => void) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      showToast("L'accès à la galerie est requis.", ToastType.ERROR);
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        const selectedUri = result.assets[0].uri;
        setDocument(selectedUri);
        showToast("Document sélectionné avec succès", ToastType.SUCCESS);
      } else {
        showToast("Veuillez sélectionner un document", ToastType.WARNING);
      }
    } catch (error: any) {
      console.error("Erreur lors de la sélection du document:", error);
      showToast(
        error.message || "Erreur lors de la sélection du document",
        ToastType.ERROR
      );
    }
  };

  interface FormField {
    label: string;
    value: string;
    setter?: (value: string) => void;
    secureTextEntry?: boolean;
    keyboardType?: import('react-native').KeyboardTypeOptions;
    multiline?: boolean;
    numberOfLines?: number;
    required?: boolean;
    customInput?: React.ReactNode;
    hint?: React.ReactNode;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  }

  const formFields: FormField[] = [
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
  
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.sectionTitle}>Modifier le profil</Text>

        <View style={styles.profilePicContainer}>
          <ProfilePictureZoomable
            onDeletePhoto={onDeletePhoto}
            profilePicture={user?.profilePicture}
            onChooseFromLibrary={handleOpenPhotoLibrary}
            onTakePhoto={handleOpenCamera}
          />
        </View>

        {formFields.map((field: FormField, idx: number) => (
          <View key={idx}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                {field.label} {field.required && <Text style={styles.required}>*</Text>}
              </Text>
              {field.customInput || (
                <TextInput
                  placeholder={field.label}
                  value={field.value}
                  onChangeText={field.setter}
                  secureTextEntry={field.secureTextEntry}
                  keyboardType={field.keyboardType}
                  multiline={field.multiline}
                  numberOfLines={field.numberOfLines}
                  autoCapitalize={field.autoCapitalize}
                  style={[
                    styles.textInput,
                    field.multiline && { height: 100, textAlignVertical: 'top' }
                  ]}
                />
              )}
            </View>
            {field.hint && field.hint}
          </View>
        ))}

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

        <Pressable
          onPress={() => handleDocumentPicker(setIdentityDoc)}
          style={styles.fileUploadButton}
        >
          <AntDesign name="upload" size={20} color="#374151" />
          <Text style={styles.fileUploadText}>
            {identityDoc ? "Pièce d'identité sélectionnée ✓" : "Télécharger une pièce d'identité"}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => handleDocumentPicker(setInsuranceCertificate)}
          style={styles.fileUploadButton}
        >
          <AntDesign name="upload" size={20} color="#374151" />
          <Text style={styles.fileUploadText}>
            {insuranceCertificate ? "Attestation d'assurance sélectionnée ✓" : "Télécharger une attestation d'assurance"}
          </Text>
        </Pressable>

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