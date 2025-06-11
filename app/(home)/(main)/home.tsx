import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  useColorScheme,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useAuthContext } from "@/context/AuthContext";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  deleteProfilePicture,
  updateProfilePicture,
} from "@/services/user.service";
import { ToastType, useToast } from "@/context/ToastContext";
import { User } from "@/types/type";
import ProfilePictureZoomable from "@/components/ProfilePIctureZoomable";
import { useRouter } from "expo-router";
import PetAddModale from "@/components/PetAddModale";
import { useEffect } from "react";
import { Pet } from "@/types/pets";
import { getPetsForAUser } from "@/services/pet.service";
import PetDetailModale from "@/components/PetDetailModale";
import {
  getPetsitterReceivedRequests,
  getUserPetsittingRequests,
  PetsittingRequestResponse,
} from "@/services/requestPetsitter.service";
import RequestCard from "@/components/RequestCard";
export default function HomeScreen() {
  const [addPetModalVisible, setAddPetModalVisible] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { user, setUser, petsitter, setPetsitter } = useAuthContext();
  console.log("petsitter", petsitter);
  const { showToast } = useToast();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [userRequests, setUserRequests] = useState<PetsittingRequestResponse[]>(
    []
  );
  const [receivedRequests, setReceivedRequests] = useState<
    PetsittingRequestResponse[]
  >([]);

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

  const handleNavigationListePets = async () => {
    try {
      setLoading(true);

      router.push("/(home)/(main)/ListePets");
    } catch (error) {
      console.error("Erreur de navigation :", error);
    } finally {
      setLoading(false);
    }
  };

  const [listPets, setListPets] = useState<Pet[] | null>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    if (user?.id) {
      getPetsForAUser()
        .then((response) => {
          setListPets(response.data);
        })
        .catch((error) => {
          console.log("Erreur lors du chargement des animaux :", error);
        });
    }
  }, []);

  useEffect(() => {
    const fetchUserRequests = async () => {
      try {
        const data = await getUserPetsittingRequests();
        setUserRequests(data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des demandes utilisateur :",
          error
        );
      }
    };

    fetchUserRequests();
  }, []);

  // 🐶 Récupère les demandes reçues en tant que petsitter (si on en est un)
  useEffect(() => {
    const fetchReceivedRequests = async () => {
      try {
        const data = await getPetsitterReceivedRequests();
        setReceivedRequests(data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des demandes petsitter :",
          error
        );
      }
    };

    if (petsitter) {
      fetchReceivedRequests();
    }
  }, [petsitter]);

  const handlePressPet = (pet: Pet) => {
    setSelectedPet(pet);
    setModalVisible(true);
  };

  const refreshPets = async () => {
    if (user?.id) {
      try {
        const response = await getPetsForAUser();
        setListPets(response.data);
        if (selectedPet) {
          const updatedPet = response.data.find((p) => p.id === selectedPet.id);
          if (updatedPet) setSelectedPet(updatedPet);
        }
      } catch (error) {
        console.error("Erreur lors du rafraîchissement des animaux :", error);
      }
    }
  };

  return (
    <View
      style={{ flex: 1 }}
      className={isDark ? "bg-gray-900" : "bg-fuchsia-50"}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />
      <ScrollView className="flex-1">
        {/* User Profile */}
        <View className="flex-row items-center px-4 mt-4">
          <ProfilePictureZoomable
            onDeletePhoto={onDeletePhoto}
            profilePicture={user?.profilePicture}
            onChooseFromLibrary={handleOpenPhotoLibrary}
            onTakePhoto={handleOpenCamera}
          />

          <View className="ml-3">
            <Text className="text-lg font-semibold text-black dark:text-white">
              Bonjour, {user?.username} !
            </Text>
            {user?.city && user?.country && (
              <Text className="text-gray-500 dark:text-gray-400 text-sm">
                {user?.city}
                {user?.city && user?.country ? ", " : ""} {user?.country}
              </Text>
            )}
          </View>
          <View className="ml-auto">
            <Text className="text-gray-500 dark:text-gray-400 text-sm">
              Localisation
            </Text>
          </View>
        </View>

        {/* Your Pets Section */}
        <View className="mt-6 px-4">
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-semibold text-black dark:text-white">
              Mes animaux
            </Text>
            <TouchableOpacity>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                Voir tout
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-3"
          >
            {/* Add Pet */}
            <TouchableOpacity
              className="items-center mr-4"
              onPress={() => setAddPetModalVisible(true)}
            >
              <View className="w-16 h-16 rounded-full bg-yellow-200 dark:bg-yellow-300 items-center justify-center">
                <Ionicons name="add" size={24} color="black" />
              </View>
              <Text className="text-xs mt-1 w-full text-center text-black dark:text-white">
                Ajouter
              </Text>
            </TouchableOpacity>
            {!listPets ? (
              <View className="flex-row">
                {[0, 1, 2, 3].map((i) => (
                  <View key={i} className="items-center mr-4">
                    <View className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse" />
                    <View className="w-12 h-3 rounded mt-1 bg-gray-300 dark:bg-gray-700 animate-pulse" />
                  </View>
                ))}
              </View>
            ) : listPets.length === 0 ? (
              <View className="flex-1 items-center justify-center">
                <Text className="text-gray-500 dark:text-gray-300 text-base">
                  Aucun animal ajouté 🐾
                </Text>
              </View>
            ) : (
              <View className="flex-row">
                {[0, 1, 2, 3].map((i) =>
                  listPets[i] ? (
                    <TouchableOpacity
                      key={listPets[i].id}
                      className="items-center mr-4"
                      onPress={() => handlePressPet(listPets[i])}
                    >
                      <View
                        className={`w-16 h-16 rounded-full items-center justify-center overflow-hidden ${
                          i === 0
                            ? "bg-blue-200 dark:bg-blue-300"
                            : i === 1
                            ? "bg-yellow-200 dark:bg-yellow-300"
                            : i === 2
                            ? "bg-blue-100 dark:bg-blue-200"
                            : "bg-orange-200 dark:bg-orange-300"
                        }`}
                      >
                        {listPets[i].photo_url ? (
                          <Image
                            source={{ uri: listPets[i].photo_url }}
                            style={{ width: 64, height: 64, borderRadius: 32 }}
                            resizeMode="cover"
                          />
                        ) : (
                          <FontAwesome5
                            name={
                              i === 0
                                ? "dog"
                                : i === 1
                                ? "cat"
                                : i === 2
                                ? "fish"
                                : "cat"
                            }
                            size={24}
                            color={
                              i === 0
                                ? "brown"
                                : i === 1
                                ? "orange"
                                : i === 2
                                ? "blue"
                                : "orange"
                            }
                          />
                        )}
                      </View>
                      <Text className="text-xs mt-1 text-center text-black dark:text-white">
                        {listPets[i].name}
                      </Text>
                    </TouchableOpacity>
                  ) : null
                )}
              </View>
            )}

            <PetAddModale
              visible={addPetModalVisible}
              onClose={() => setAddPetModalVisible(false)}
              onAdd={() => {
                setAddPetModalVisible(false);
                refreshPets();
              }}
            />
            <PetDetailModale
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              pet={selectedPet}
              onUpdate={() => {
                refreshPets();
              }}
            />
          </ScrollView>
        </View>

        {/* Ongoing Requests */}
        <View className="mt-6 px-4">
          <Text className="text-lg font-semibold text-black dark:text-white">
            {petsitter ? "Demandes reçues" : "Mes demandes de garde"}
          </Text>

          <View className="mt-3 bg-white dark:bg-slate-800 rounded-lg p-3 shadow-sm">
            {loading ? (
              <View className="py-8 items-center justify-center">
                <ActivityIndicator
                  size="large"
                  color={isDark ? "#9333ea" : "#7c3aed"}
                />
                <Text className="mt-2 text-gray-500 dark:text-gray-400">
                  Chargement des demandes...
                </Text>
              </View>
            ) : petsitter ? (
              <>
                {receivedRequests.length === 0 ? (
                  <Text className="text-gray-500 dark:text-gray-400 text-base">
                    Aucune demande reçue pour le moment.
                  </Text>
                ) : (
                  receivedRequests.map((request) => (
                    <RequestCard request={request} requestbool={true} />
                  ))
                )}
              </>
            ) : (
              // Demandes envoyées par l'utilisateur
              <>
                {/* Request 1 */}
                <View className="flex-row items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-3">
                  <Image
                    source={{
                      uri: "https://randomuser.me/api/portraits/men/41.jpg",
                    }}
                    className="w-12 h-12 rounded-full"
                  />
                  <View className="ml-3 flex-1">
                    <View className="flex-row items-center">
                      <Text className="text-gray-800 dark:text-white font-medium text-base">
                        Jean-Paul Dupuis
                      </Text>
                      <View className="ml-2 bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded">
                        <Text className="text-xs text-blue-700 dark:text-blue-300">
                          Petsitter certifié
                        </Text>
                      </View>
                    </View>
                    <Text className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                      Garde de Rex • 15-20 Mars 2024
                    </Text>
                    <Text className="text-gray-500 dark:text-gray-400 text-sm">
                      25€/jour • Paris 15ème
                    </Text>
                  </View>
                  <View className="flex-row items-center bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded-full">
                    <View className="w-2 h-2 rounded-full bg-yellow-400 mr-1" />
                    <Text className="text-sm text-yellow-700 dark:text-yellow-300">
                      En attente
                    </Text>
                  </View>
                </View>

                {/* Request 2 */}
                <View className="flex-row items-center">
                  <Image
                    source={{
                      uri: "https://randomuser.me/api/portraits/women/67.jpg",
                    }}
                    className="w-12 h-12 rounded-full"
                  />
                  <View className="ml-3 flex-1">
                    <View className="flex-row items-center">
                      <Text className="text-gray-800 dark:text-white font-medium text-base">
                        Marie Delarue
                      </Text>
                      <View className="ml-2 bg-green-100 dark:bg-green-900 px-2 py-0.5 rounded">
                        <Text className="text-xs text-green-700 dark:text-green-300">
                          4.8 ★ (56 avis)
                        </Text>
                      </View>
                    </View>
                    <Text className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                      Garde de Minou • 10-12 Mars 2024
                    </Text>
                    <Text className="text-gray-500 dark:text-gray-400 text-sm">
                      30€/jour • Bordeaux Centre
                    </Text>
                  </View>
                  <View className="flex-row items-center bg-red-100 dark:bg-red-900 px-2 py-1 rounded-full">
                    <View className="w-2 h-2 rounded-full bg-red-500 mr-1" />
                    <Text className="text-sm text-red-700 dark:text-red-300">
                      Refusé
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>

        {petsitter && (
          <View className="mt-6 px-4">
            <Text className="text-lg font-semibold text-black dark:text-white">
              Vos Demandes en cours
            </Text>

            <View className="mt-3 bg-white dark:bg-slate-800 rounded-lg p-3 shadow-sm">
              {/* Request 3 */}
              <View className="flex-row items-center">
                <Image
                  source={{
                    uri: "https://randomuser.me/api/portraits/men/32.jpg",
                  }}
                  className="w-12 h-12 rounded-full"
                />
                <View className="ml-3 flex-1">
                  <View className="flex-row items-center">
                    <Text className="text-gray-800 dark:text-white font-medium text-base">
                      Lucas Martin
                    </Text>
                    <View className="ml-2 bg-purple-100 dark:bg-purple-900 px-2 py-0.5 rounded">
                      <Text className="text-xs text-purple-700 dark:text-purple-300">
                        Nouveau petsitter
                      </Text>
                    </View>
                  </View>
                  <Text className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    Visite de Bella • 18-25 Mars 2024
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-400 text-sm">
                    15€/visite • Lyon 6ème
                  </Text>
                </View>
                <View className="flex-row items-center bg-green-100 dark:bg-green-900 px-2 py-1 rounded-full">
                  <View className="w-2 h-2 rounded-full bg-green-500 mr-1" />
                  <Text className="text-sm text-green-700 dark:text-green-300">
                    Accepté
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Services */}
        <View className="mt-6 px-1">
          <View className="flex-row flex-wrap justify-start">
            {[
              {
                icon: <FontAwesome5 name="paw" size={20} color="white" />,
                bg: "bg-blue-500",
                label: "Mes animaux",
                navigateTo: "/ListePets",
              },
              {
                icon: (
                  <MaterialIcons name="location-on" size={20} color="white" />
                ),
                bg: "bg-red-500",
                label: "Gardiens",
              },
              {
                icon: (
                  <FontAwesome5 name="user-friends" size={20} color="white" />
                ),
                bg: "bg-gray-300 dark:bg-gray-600",
                label: "Mes gardiens",
              },
              {
                icon: <Ionicons name="notifications" size={20} color="white" />,
                bg: "bg-gray-300 dark:bg-gray-600",
                label: "Notifications",
              },
              {
                icon: <FontAwesome5 name="user-plus" size={20} color="white" />,
                bg: "bg-yellow-400",
                label: "Parrainage",
              },
              {
                icon: <FontAwesome5 name="percent" size={20} color="white" />,
                bg: "bg-gray-300 dark:bg-gray-600",
                label: "Promotions",
              },
              {
                icon: (
                  <MaterialIcons name="support-agent" size={20} color="white" />
                ),
                bg: "bg-gray-300 dark:bg-gray-600",
                label: "Support",
              },
            ].map((item, index) => (
              <TouchableOpacity
                key={index}
                className="items-center mb-6"
                style={{ width: "25%" }} // 4 colonnes = 100 / 4
                onPress={() => handleNavigationListePets()}
              >
                <View
                  className={`w-14 h-14 rounded-full items-center justify-center ${item.bg}`}
                >
                  {item.icon}
                </View>
                <Text className="text-xs mt-1 text-center text-black dark:text-white">
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Promo Banner */}
        <View className="mt-6 mb-4">
          <View className="h-32 bg-orange-500 dark:bg-orange-600 mx-4 rounded-lg p-4 flex-row items-center">
            <View className="flex-1">
              <Text className="text-white text-lg font-bold">pet corner</Text>
              <Text className="text-white text-3xl font-bold mt-1">Gold</Text>
              <Text className="text-white text-xl font-bold mt-1">10%</Text>
              <Text className="text-white font-bold">cashback</Text>
            </View>
            <Image
              source={{
                uri: "https://www.purina.co.uk/sites/default/files/2022-07/Can-Cats-and-Dogs-Live-Together.jpg",
              }}
              className="w-24 h-24"
              style={{ borderRadius: 12 }}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
