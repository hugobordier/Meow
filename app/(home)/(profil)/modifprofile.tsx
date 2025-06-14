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
  useColorScheme,
  StatusBar,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useAuthContext } from "@/context/AuthContext";
import axios from "axios";
import { updateUser } from "@/services/user.service";
import { ToastType, useToast } from "@/context/ToastContext";
import { updatePetsitter } from "@/services/petsitter.service"; // Assurez-vous que cette fonction existe et est importée
import { User } from "@/types/type";

import ProfilePictureZoomable from "@/components/ProfilePIctureZoomable";
import {
  deleteProfilePicture,
  updateProfilePicture,
} from "@/services/user.service";

import DateTimePicker from '@react-native-community/datetimepicker';


const GENDER_OPTIONS = [
  { label: "Sélectionnez votre genre", value: "" },
  { label: "Homme", value: "Male" },
  { label: "Femme", value: "Female" },
  { label: "Hélicoptère", value: "Helicopter" },
  { label: "Autre", value: "Other" },
];

const DAYS_OPTIONS = [
  { label: 'Monday', value: 'Monday' },
  { label: 'Tuesday', value: 'Tuesday' },
  { label: 'Wednesday', value: 'Wednesday' },
  { label: 'Thursday', value: 'Thursday' },
  { label: 'Friday', value: 'Friday' },
  { label: 'Saturday', value: 'Saturday' },
  { label: 'Sunday', value: 'Sunday' }
];

const TIME_SLOTS_OPTIONS = [
  { label: 'Matin (6h-12h)', value: 'Matin' },
  { label: 'Après-midi (12h-18h)', value: 'Après-midi' },
  { label: 'Soir (18h-00h)', value: 'Soir' },
  { label: 'Nuit (00h-6h)', value: 'Nuit' }
];
const ANIMAL_TYPES_OPTIONS = [
  { label: 'Chat', value: 'Chat' },
  { label: 'Chien', value: 'Chien' },
  { label: 'Oiseau', value: 'Oiseau' },
  { label: 'Rongeur', value: 'Rongeur' },
  { label: 'Reptile', value: 'Reptile' },
  { label: 'Poisson', value: 'Poisson' },
  { label: 'Furet', value: 'Furet' },
  { label: 'Cheval', value: 'Cheval' },
  { label: 'Autre', value: 'Autre' }
];

const SERVICES_OPTIONS = [
  { label: 'Promenade', value: 'Promenade' },
  { label: 'Alimentation', value: 'Alimentation' },
  { label: 'Jeux', value: 'Jeux' },
  { label: 'Soins', value: 'Soins' },
  { label: 'Toilettage', value: 'Toilettage' },
  { label: 'Dressage', value: 'Dressage' },
  { label: 'Garderie', value: 'Garderie' },
  { label: 'Médication', value: 'Médication' },
  { label: 'Nettoyage', value: 'Nettoyage' },
  { label: 'Transport', value: 'Transport' }
];


const ModifProfile: React.FC = () => {
  const router = useRouter();

  const { user, setUser, petsitter, setPetsitter } = useAuthContext();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";


  const [username, setUsername] = useState<string>(user?.username || "");
  const [lastName, setLastName] = useState<string>(user?.lastName || "");
  const [firstName, setFirstName] = useState<string>(user?.firstName || "");
  const [email, setEmail] = useState<string>(user?.email || "");
  const [birthDate, setBirthDate] = useState<string>(user?.birthDate || "");
  const [phone, setPhone] = useState<string>(user?.phoneNumber || "");
  const [profilePic, setProfilePic] = useState<string | null>(
    user?.profilePicture || null
  );
  const [identityDoc, setIdentityDoc] = useState<string | null>(
    user?.identityDocument || null
  );
  const [insuranceCertificate, setInsuranceCertificate] = useState<
    string | null
  >(user?.insuranceCertificate || null);
  const [age, setAge] = useState<string>(user?.age?.toString() || "");
  const [gender, setGender] = useState<string>(user?.gender || "");
  const [city, setCity] = useState<string>(user?.city || "");
  const [country, setCountry] = useState<string>(user?.country || "");
  const [bio, setBio] = useState<string>(user?.bio || "");
  const [bankInfo, setBankInfo] = useState<string>(user?.bankInfo || "");
  const [address, setAddress] = useState<string>(user?.address || "");
  const [isLoading, setIsLoading] = useState(false);

  
  const petsitterInfo = petsitter?.data?.petsitter;

  const [hourly_rate, setHourly_rate] = useState<string>(
    petsitterInfo?.hourly_rate?.toString() || ""
  );

  const [experience, setExperience] = useState<string>(
    petsitterInfo?.experience?.toString() || ""
  );

  const [animal_types, setAnimal_types] = useState<string[]>(
    Array.isArray(petsitterInfo?.animal_types) ? petsitterInfo.animal_types : []
  );

  const [services, setServices] = useState<string[]>(
    Array.isArray(petsitterInfo?.services) ? petsitterInfo.services : []
  );

  const [available_days, setAvailable_days] = useState<string[]>(
    Array.isArray(petsitterInfo?.available_days) ? petsitterInfo.available_days : []
  );

  const [available_slots, setAvailable_slots] = useState<string[]>(
    Array.isArray(petsitterInfo?.available_slots) ? petsitterInfo.available_slots : []
  );

  const [latitude, setLatitude] = useState<string>(
    petsitterInfo?.latitude?.toString() || ""
  );

  const [longitude, setLongitude] = useState<string>(
    petsitterInfo?.longitude?.toString() || ""
  );



  const [showDatePicker, setShowDatePicker] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (petsitter && typeof (petsitterInfo as any).hourly_rate === 'number') {
      setHourly_rate(String((petsitterInfo as any).hourly_rate));
    }
  }, [user, petsitter]);


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
      Alert.alert(
        "Erreur",
        `Les champs suivants sont requis : ${emptyFields.join(", ")}`
      );
      return false;
    }

    const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegexp.test(email)) {
      Alert.alert("Erreur", "Format d'email invalide");
      return false;
    }


    // Validation des champs numériques pour petsitter
    if (petsitter) {
      if (isNaN(parseFloat(hourly_rate)) || parseFloat(hourly_rate) <= 0) {
        Alert.alert("Erreur", "Le tarif horaire doit être un nombre positif.");
        return false;
      }
      if (latitude && isNaN(parseFloat(latitude))) {
        Alert.alert("Erreur", "La latitude doit être un nombre valide.");
        return false;
      }
      if (longitude && isNaN(parseFloat(longitude))) {
        Alert.alert("Erreur", "La longitude doit être un nombre valide.");

        return false;
      }
    }


    return true;
  };

  const isIdentityVerified = Boolean(identityDoc && insuranceCertificate);


  // MODIFICATION ICI: selectedDate sera un objet Date ou undefined.
  const onChangeDate = (event: any, selectedDate?: Date) => {
    // const currentDate = selectedDate || birthDate; // birthDate est une string, pas un objet Date ici
    // Sur Android, le sélecteur se ferme automatiquement. Sur iOS, il faut le fermer manuellement.
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setBirthDate(selectedDate.toISOString().split('T')[0]); // Convertir en string ISO (YYYY-MM-DD)
    }
  };


  const handleSubmit = async () => {
    if (!validateForm() || !user?.id) return;

    try {
      setIsLoading(true);


      // Données pour la mise à jour de l'utilisateur
      const userDataToUpdate: any = {

        id: user.id,
        username: username.trim(),
        lastName: lastName.trim(),
        firstName: firstName.trim(),
        email: email.trim(),
        ...(age && { age: parseInt(age) }),
        ...(birthDate && { birthDate: birthDate }),
        ...(gender && { gender }),
        ...(city && { city: city.trim() }),
        ...(country && { country: country.trim() }),
        ...(bio && { bio: bio.trim() }),
        ...(bankInfo && { bankInfo: bankInfo.trim() }),
        ...(address && { address: address.trim() }),
        ...(phone && { phoneNumber: phone.trim() }),
        ...(identityDoc && { identityDocument: identityDoc }),
        ...(insuranceCertificate && { insuranceCertificate }),
      };

      console.log("Données utilisateur envoyées:", userDataToUpdate);
      const userResponse = await updateUser(userDataToUpdate);
      console.log("Réponse du serveur utilisateur:", userResponse);

      if (!userResponse || userResponse.success === false) {
        throw new Error(userResponse.message || "Échec de la mise à jour de l'utilisateur");
      }

      // Mettre à jour l'état de l'utilisateur dans le contexte
      setUser({
        ...user,

        ...userDataToUpdate,
        profilePicture: user.profilePicture // Garder la photo de profil car elle est gérée séparément
      });

      // Si l'utilisateur est un petsitter, mettre à jour les informations du petsitter
      if (petsitter) {
        const petsitterDataToUpdate: any = {
          // Assurez-vous d'avoir l'ID du petsitter pour la mise à jour, si nécessaire
          // Cela dépend de votre endpoint updatePetsitter
          // Par exemple: petsitterId: petsitter.data.petsitter.id,
          hourly_rate: parseFloat(hourly_rate), // CONVERSION ICI
          experience: parseFloat(experience),
          animal_types: animal_types,
          services: services,
          available_days: available_days,
          available_slots: available_slots,
          // CONVERSION ICI pour latitude et longitude
          ...(latitude && { latitude: parseFloat(latitude) }),
          ...(longitude && { longitude: parseFloat(longitude) }),
        };

        console.log("Données petsitter envoyées:", petsitterDataToUpdate);
        const petsitterResponse = await updatePetsitter(petsitterDataToUpdate); // Assurez-vous que updatePetsitter accepte ces données
        console.log("Réponse du serveur petsitter:", petsitterResponse);

        if (!petsitterResponse || petsitterResponse.success === false) {
          throw new Error(petsitterResponse.message || "Échec de la mise à jour des informations du petsitter");
        }

        // Mettre à jour l'objet petsitter dans le contexte
        setPetsitter({
          ...petsitter,
          data: {
            petsitter: {
              ...petsitter.data.petsitter,
              ...petsitterDataToUpdate,
            },
          },
        });
      }



      Alert.alert(
        "Succès",
        "Profil mis à jour avec succès !",
        [{ text: "OK", onPress: () => router.back() }]
      );

    } catch (error: any) {
      console.log("Erreur complète:", error);
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
      console.log("Erreur lors de la sélection du document:", error);
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
            option.value ? ( // Exclure l'option "Sélectionnez votre genre"
              <Pressable
                key={option.value}
                style={[
                  styles.genderButton,
                  gender === option.value && styles.genderButtonSelected,
                  isDark && styles.genderButtonDark,
                  isDark && gender === option.value && styles.genderButtonSelectedDark
                ]}
                onPress={() => setGender(option.value)}
              >
                <Text style={[
                  styles.genderButtonText,
                  gender === option.value && styles.genderButtonTextSelected,
                  isDark && styles.genderButtonTextDark,
                  isDark && gender === option.value && styles.genderButtonTextSelectedDark
                ]}>
                  {option.label}
                </Text>
              </Pressable>
            ) : null
          ))}
        </View>
      )
    },
    {
      label: "Date de naissance",
      value: birthDate, // birthDate est déjà une chaîne
      customInput: (
        <View>
          <Pressable onPress={() => setShowDatePicker(true)}
            style={[
              styles.textInput,
              isDark ? styles.textInputDark : styles.textInputLight
            ]}
          >
            <Text
              style={[
                { fontSize: 16 },
                isDark ? styles.textDark : styles.textLight,
                !birthDate && { color: isDark ? "#9CA3AF" : "#6B7280" }
              ]}
            >
              {birthDate ? new Date(birthDate).toLocaleDateString('fr-FR') : 'JJ/MM/AAAA'}
            </Text>
          </Pressable>
          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={birthDate ? new Date(birthDate) : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selectedDate) {
                  setBirthDate(selectedDate.toISOString().split('T')[0]);
                }
              }}
            />
          )}
        </View>
      )
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

  const petsitterFields: FormField[] = [
    {
      label: "Tarif horaire",
      value: hourly_rate,
      setter: setHourly_rate,
      keyboardType: "numeric",
      required: true
    },
    {
      label: "Expérience",
      value: experience || "",
      setter: setExperience as (value: string) => void,
      multiline: true,
      numberOfLines: 3
    },
    {
      label: "Types d'animaux",
      value: animal_types.join(", "),
      customInput: (
        <View style={styles.optionsContainer}>
          {ANIMAL_TYPES_OPTIONS.map((option) => (
            <Pressable
              key={option.value}
              style={[
                styles.optionButton,
                animal_types.includes(option.value) && styles.optionButtonSelected,
                isDark ? styles.optionButtonDark : styles.optionButtonLight,
                isDark && animal_types.includes(option.value) && styles.optionButtonSelectedDark
              ]}
              onPress={() => {
                setAnimal_types(prev =>
                  prev.includes(option.value)
                    ? prev.filter(type => type !== option.value)
                    : [...prev, option.value]
                );
              }}
            >
              <Text style={[
                styles.optionButtonText,
                animal_types.includes(option.value) && styles.optionButtonTextSelected,
                isDark ? styles.optionButtonTextDark : styles.optionButtonTextLight,
                isDark && animal_types.includes(option.value) && styles.optionButtonTextSelectedDark
              ]}>
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )
    },
    {
      label: "Services proposés",
      value: services.join(", "),
      customInput: (
        <View style={styles.optionsContainer}>
          {SERVICES_OPTIONS.map((option) => (
            <Pressable
              key={option.value}
              style={[
                styles.optionButton,
                services.includes(option.value) && styles.optionButtonSelected,
                isDark ? styles.optionButtonDark : styles.optionButtonLight,
                isDark && services.includes(option.value) && styles.optionButtonSelectedDark
              ]}
              onPress={() => {
                setServices(prev =>
                  prev.includes(option.value)
                    ? prev.filter(service => service !== option.value)
                    : [...prev, option.value]
                );
              }}
            >
              <Text style={[
                styles.optionButtonText,
                services.includes(option.value) && styles.optionButtonTextSelected,
                isDark ? styles.optionButtonTextDark : styles.optionButtonTextLight,
                isDark && services.includes(option.value) && styles.optionButtonTextSelectedDark
              ]}>
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )
    },
    {
      label: "Jours disponibles",
      value: available_days.join(", "), // Changed to join for display
      customInput: (
        <View style={styles.optionsContainer}>
          {DAYS_OPTIONS.map((option) => (
            <Pressable
              key={option.value}
              style={[
                styles.optionButton,
                available_days.includes(option.value) && styles.optionButtonSelected,
                isDark ? styles.optionButtonDark : styles.optionButtonLight,
                isDark && available_days.includes(option.value) && styles.optionButtonSelectedDark
              ]}
              onPress={() => {
                setAvailable_days(prev =>
                  prev.includes(option.value)
                    ? prev.filter(day => day !== option.value)
                    : [...prev, option.value]
                );
              }}
            >
              <Text style={[
                styles.optionButtonText,
                available_days.includes(option.value) && styles.optionButtonTextSelected,
                isDark ? styles.optionButtonTextDark : styles.optionButtonTextLight,
                isDark && available_days.includes(option.value) && styles.optionButtonTextSelectedDark
              ]}>
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )
    },
    {
      label: "Créneaux horaires",
      value: available_slots.join(", "), // Changed to join for display
      customInput: (
        <View style={styles.optionsContainer}>
          {TIME_SLOTS_OPTIONS.map((option) => (
            <Pressable
              key={option.value}
              style={[
                styles.optionButton,
                available_slots.includes(option.value) && styles.optionButtonSelected,
                isDark ? styles.optionButtonDark : styles.optionButtonLight,
                isDark && available_slots.includes(option.value) && styles.optionButtonSelectedDark
              ]}
              onPress={() => {
                setAvailable_slots(prev =>
                  prev.includes(option.value)
                    ? prev.filter(slot => slot !== option.value)
                    : [...prev, option.value]
                );
              }}
            >
              <Text style={[
                styles.optionButtonText,
                available_slots.includes(option.value) && styles.optionButtonTextSelected,
                isDark ? styles.optionButtonTextDark : styles.optionButtonTextLight,
                isDark && available_slots.includes(option.value) && styles.optionButtonTextSelectedDark
              ]}>
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )
    },
    {
      label: "Latitude",
      value: latitude,
      setter: setLatitude,
      keyboardType: "numeric",
    },
    {
      label: "Longitude",
      value: longitude,
      setter: setLongitude,
      keyboardType: "numeric",
    }
  ];

  return (
    <SafeAreaView style={[styles.container, isDark ? styles.containerDark : styles.containerLight]}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />
      <ScrollView style={styles.scrollView}>
        <Text style={[styles.sectionTitle, isDark ? styles.textDark : styles.textLight]}>Modifier le profil</Text>

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
              <Text style={[styles.inputLabel, isDark ? styles.textDark : styles.textLight]}>
                {field.label} {field.required && <Text style={styles.required}>*</Text>}
              </Text>
              {field.customInput ? (
                field.customInput
              ) : (
                <TextInput
                  placeholder={field.label}
                  placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                  value={field.value}
                  onChangeText={field.setter}
                  secureTextEntry={field.secureTextEntry}
                  keyboardType={field.keyboardType}
                  multiline={field.multiline}
                  numberOfLines={field.numberOfLines}
                  autoCapitalize={field.autoCapitalize}
                  style={[
                    styles.textInput,
                    field.multiline && { height: 100, textAlignVertical: 'top' },
                    isDark ? styles.textInputDark : styles.textInputLight
                  ]}
                />
              )}
            </View>
            {field.hint && field.hint}
          </View>
        ))}

        <View style={[styles.verificationContainer, isDark ? styles.borderDark : styles.borderLight]}>
          <Text style={[styles.verificationLabel, isDark ? styles.textDark : styles.textLight]}>
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
          style={[styles.fileUploadButton, isDark ? styles.fileUploadButtonDark : styles.fileUploadButtonLight]}
        >

          <AntDesign name="upload" size={20} color={isDark ? "#D1D5DB" : "#374151"} />
          <Text style={[styles.fileUploadText, isDark ? styles.textDark : styles.textLight]}>
            {identityDoc ? "Pièce d'identité sélectionnée ✓" : "Télécharger une pièce d'identité"}

          </Text>
        </Pressable>

        <Pressable
          onPress={() => handleDocumentPicker(setInsuranceCertificate)}
          style={[styles.fileUploadButton, isDark ? styles.fileUploadButtonDark : styles.fileUploadButtonLight]}
        >

          <AntDesign name="upload" size={20} color={isDark ? "#D1D5DB" : "#374151"} />
          <Text style={[styles.fileUploadText, isDark ? styles.textDark : styles.textLight]}>
            {insuranceCertificate ? "Attestation d'assurance sélectionnée ✓" : "Télécharger une attestation d'assurance"}

          </Text>
        </Pressable>

        {/* --- CONSERVATION DE LA LOGIQUE DE LA PROPRIÉTÉ 'role' SANS MODIFIER LE TYPE GLOBAL --- */}
        {Boolean(petsitter) && (
          <>
            <Text style={[styles.sectionTitle, isDark ? styles.textDark : styles.textLight]}>
              Informations Petsitter
            </Text>

            {petsitterFields.map((field: FormField, idx: number) => (
              <View key={`petsitter-${idx}`}>
                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, isDark ? styles.textDark : styles.textLight]}>
                    {field.label} {field.required && <Text style={styles.required}>*</Text>}
                  </Text>
                  {field.customInput ? (
                    field.customInput
                  ) : (
                    <TextInput
                      placeholder={field.label}
                      placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                      value={field.value}
                      onChangeText={field.setter}
                      secureTextEntry={field.secureTextEntry}
                      keyboardType={field.keyboardType}
                      multiline={field.multiline}
                      numberOfLines={field.numberOfLines}
                      autoCapitalize={field.autoCapitalize}
                      style={[
                        styles.textInput,
                        field.multiline && { height: 100, textAlignVertical: 'top' },
                        isDark ? styles.textInputDark : styles.textInputLight
                      ]}
                    />
                  )}
                </View>
                {field.hint && field.hint}
              </View>
            ))}
          </>
        )}

        <View style={styles.buttonContainer}>
          <Pressable
            onPress={() => router.back()}
            style={[styles.button, styles.cancelButton, isDark ? styles.cancelButtonDark : styles.cancelButtonLight]}
          >
            <Text style={[styles.cancelButtonText, isDark ? styles.cancelButtonTextDark : styles.cancelButtonTextLight]}>Annuler</Text>
          </Pressable>

          <Pressable
            onPress={handleSubmit}
            disabled={isLoading}

            style={[styles.button, styles.submitButton, isLoading && { opacity: 0.7 }, isDark ? styles.submitButtonDark : styles.submitButtonLight]}

          >
            <Text style={[styles.submitButtonText, isDark ? styles.submitButtonTextDark : styles.submitButtonTextLight]}>
              {isLoading ? "Mise à jour..." : "Valider"}
            </Text>
          </Pressable>
        </View>


        <Text style={[styles.footerText, isDark ? styles.textDark : styles.textLight]}>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  },
  textLight: {
    color: '#111827',

  },
  textDark: {
    color: 'white',
  },
  headerSpacer: {
    width: 24,
  },
  profilePicContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 8,
    backgroundColor: "#F3F4F6",
  },
  profilePicText: {
    fontSize: 14,
    color: "#6B7280",
    textDecorationLine: "underline",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 24,

  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,

  },
  required: {
    color: "#EF4444",
  },
  textInput: {

    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,

  },
  textInputLight: {
    backgroundColor: 'white',
    borderColor: '#D1D5DB',
    color: '#111827',
  },
  textInputDark: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
    color: 'white',

  },
  passwordHint: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 20,
    lineHeight: 16,
    paddingHorizontal: 4,
  },
  verificationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 4,
    marginBottom: 16,
    borderBottomWidth: 1,

  },
  verificationLabel: {
    fontSize: 16,
    fontWeight: '500',

  },
  verificationStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  verificationStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  verifiedText: {
    color: "#059669",
    fontSize: 14,
    fontWeight: "500",
  },
  unverifiedText: {
    color: "#DC2626",
    fontSize: 14,
    fontWeight: "500",
  },
  fileUploadButton: {

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    borderWidth: 1,

  },
  fileUploadButtonLight: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',

  },
  fileUploadButtonDark: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
  },
  fileUploadText: {
    marginLeft: 8,

    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {

    borderWidth: 1,
  },
  cancelButtonLight: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',

  },
  cancelButtonDark: {
    backgroundColor: '#4B5563',
    borderColor: '#6B7280',
  },
  submitButton: {

  },
  submitButtonLight: {
    backgroundColor: '#111827',

  },
  submitButtonDark: {
    backgroundColor: '#6D28D9',
  },
  cancelButtonText: {

    fontSize: 16,
    fontWeight: "600",
  },

  cancelButtonTextLight: {
    color: '#374151',
  },
  cancelButtonTextDark: {
    color: 'white',
  },
  submitButtonText: {

    fontSize: 16,
    fontWeight: "600",
  },
  submitButtonTextLight: {
    color: 'white',
  },
  submitButtonTextDark: {
    color: 'white',
  },
  footerText: {
    fontSize: 12,

    textAlign: 'center',

    lineHeight: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    backgroundColor: "white",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  genderContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  genderButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,

  },
  genderButtonLight: {
    borderColor: '#D1D5DB',
    backgroundColor: 'white',

  },
  genderButtonDark: {
    borderColor: '#4B5563',
    backgroundColor: '#374151',
  },
  genderButtonSelected: {

  },
  genderButtonSelectedLight: {
    backgroundColor: '#111827',
    borderColor: '#111827',

  },
  genderButtonSelectedDark: {
    backgroundColor: '#6D28D9',
    borderColor: '#6D28D9',
  },
  genderButtonText: {

    fontSize: 14,
  },
  genderButtonTextLight: {
    color: '#374151',
  },
  genderButtonTextDark: {
    color: 'white',
  },
  genderButtonTextSelected: {

  },
  genderButtonTextSelectedLight: {
    color: 'white',
  },
  genderButtonTextSelectedDark: {
    color: 'white',
  },
  datePickerButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  datePickerButtonLight: {
    backgroundColor: 'white',
    borderColor: '#D1D5DB',
  },
  datePickerButtonDark: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
  },
  hint: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
    marginLeft: 4,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 8,
  },
  optionButtonLight: {
    borderColor: '#D1D5DB',
    backgroundColor: 'white',
  },
  optionButtonDark: {
    borderColor: '#4B5563',
    backgroundColor: '#374151',
  },
  optionButtonSelected: {
  },
  optionButtonSelectedLight: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  optionButtonSelectedDark: {
    backgroundColor: '#6D28D9',
    borderColor: '#6D28D9',
  },
  optionButtonText: {
    fontSize: 14,
  },
  optionButtonTextLight: {
    color: '#374151',
  },
  optionButtonTextDark: {
    color: 'white',
  },
  optionButtonTextSelected: {
  },
  optionButtonTextSelectedLight: {
    color: 'white',
  },
  optionButtonTextSelectedDark: {
    color: 'white',
  },
});

export default ModifProfile;

