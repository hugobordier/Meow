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
  const [loadingReceived, setLoadingReceived] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);
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
        setLoadingSend(true);
        const data = await getUserPetsittingRequests();
        setUserRequests(data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des demandes utilisateur :",
          error
        );
      } finally {
        setLoadingSend(false);
      }
    };

    fetchUserRequests();
  }, []);

  useEffect(() => {
    const fetchReceivedRequests = async () => {
      try {
        setLoadingReceived(true);
        const data = await getPetsitterReceivedRequests();
        console.log("Received Requests:", data);
        setReceivedRequests(data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des demandes petsitter :",
          error
        );
      } finally {
        setLoadingReceived(false);
      }
    };

    if (petsitter) {
      fetchReceivedRequests();
    } else {
      setLoadingReceived(false);
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
            {loadingReceived ? (
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
                {loadingSend ? (
                  <View className="py-4 items-center justify-center">
                    <ActivityIndicator
                      size="large"
                      color={isDark ? "#9333ea" : "#7c3aed"}
                    />
                    <Text className=" text-gray-500 dark:text-gray-400">
                      Chargement des demandes...
                    </Text>
                  </View>
                ) : (
                  <View className="mt-2 px-4">
                    {userRequests.length === 0 ? (
                      <Text className="text-gray-500 dark:text-gray-400 text-base">
                        Aucune demande envoyée pour le moment.
                      </Text>
                    ) : (
                      userRequests.map((request) => (
                        <RequestCard
                          key={request.id}
                          request={request}
                          requestbool={false}
                        />
                      ))
                    )}
                  </View>
                )}
              </>
            )}
          </View>
        </View>

        {loadingSend ? (
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
          <View className="mt-6 px-4">
            <Text className="text-lg font-semibold text-black dark:text-white">
              Vos Demandes en cours
            </Text>
            <View className="mt-3 bg-white dark:bg-slate-800 rounded-lg p-3 shadow-sm">
              {userRequests.length === 0 ? (
                <Text className="text-gray-500 dark:text-gray-400 text-base">
                  Aucune demande envoyée pour le moment.
                </Text>
              ) : (
                userRequests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    requestbool={false}
                  />
                ))
              )}
            </View>
          </View>
        ) : null}

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
