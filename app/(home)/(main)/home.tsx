import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useAuthContext } from "@/context/AuthContext";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  deleteProfilePicture,
  updateProfilePicture,
} from "@/services/user.service";
import { getRandomPlaceholderImage } from "@/utils/getRandomPlaceholderImage";
import { ToastType, useToast } from "@/context/ToastContext";
import { User } from "@/types/type";
import ProfilePictureZoomable from "@/components/ProfilePIctureZoomable";

export default function HomeScreen() {
  const { user, setUser } = useAuthContext();
  const { showToast } = useToast();

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

  return (
    <ScrollView className="flex-1 bg-fuchsia-50 dark:bg-gray-900">
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
            Hi, {user?.username}!
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-sm">
            {user?.city}, {user?.country}
          </Text>
        </View>
        <View className="ml-auto">
          <Text className="text-gray-500 dark:text-gray-400 text-sm">
            Localisation
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <View className="mx-4 mt-4">
        <View className="flex-row items-center bg-gray-100 dark:bg-slate-800 rounded-lg px-3 py-2">
          <Ionicons name="search" size={20} color="gray" />
          <TextInput
            placeholder="Localisation"
            className="ml-2 flex-1 text-gray-700 dark:text-gray-300"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Your Pets Section */}
      <View className="mt-6 px-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-lg font-semibold text-black dark:text-white">
            Your Pets
          </Text>
          <TouchableOpacity>
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              See All
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-3"
        >
          {/* Add Pet */}
          <TouchableOpacity className="items-center mr-4">
            <View className="w-16 h-16 rounded-full bg-yellow-200 dark:bg-yellow-300 items-center justify-center">
              <Ionicons name="add" size={24} color="black" />
            </View>
            <Text className="text-xs mt-1 text-center text-black dark:text-white">
              Add Pet
            </Text>
          </TouchableOpacity>

          {/* Pet - River */}
          <TouchableOpacity className="items-center mr-4">
            <View className="w-16 h-16 rounded-full bg-blue-200 dark:bg-blue-300 items-center justify-center">
              <FontAwesome5 name="dog" size={24} color="brown" />
            </View>
            <Text className="text-xs mt-1 text-center text-black dark:text-white">
              River
            </Text>
          </TouchableOpacity>

          {/* Pet - Sky */}
          <TouchableOpacity className="items-center mr-4">
            <View className="w-16 h-16 rounded-full bg-yellow-200 dark:bg-yellow-300 items-center justify-center">
              <FontAwesome5 name="cat" size={24} color="orange" />
            </View>
            <Text className="text-xs mt-1 text-center text-black dark:text-white">
              Sky
            </Text>
          </TouchableOpacity>

          {/* Pet - Blue */}
          <TouchableOpacity className="items-center mr-4">
            <View className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-200 items-center justify-center">
              <FontAwesome5 name="fish" size={24} color="blue" />
            </View>
            <Text className="text-xs mt-1 text-center text-black dark:text-white">
              Blue
            </Text>
          </TouchableOpacity>

          {/* Pet - Ginger */}
          <TouchableOpacity className="items-center mr-4">
            <View className="w-16 h-16 rounded-full bg-orange-200 dark:bg-orange-300 items-center justify-center">
              <FontAwesome5 name="cat" size={24} color="orange" />
            </View>
            <Text className="text-xs mt-1 text-center text-black dark:text-white">
              Ginger
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Ongoing Requests */}
      <View className="mt-6 px-4">
        <Text className="text-lg font-semibold text-black dark:text-white">
          Demandes en cours
        </Text>

        <View className="mt-3 bg-gray-50 dark:bg-slate-800 rounded-lg p-3">
          {/* Request 1 */}
          <View className="flex-row items-center mb-3">
            <Image
              source={{
                uri: "https://randomuser.me/api/portraits/men/41.jpg",
              }}
              className="w-10 h-10 rounded-full"
            />
            <Text className="ml-3 flex-1 text-black dark:text-white">
              Jean-Paul Dupuis
            </Text>
            <View className="flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-yellow-400 mr-1" />
              <Text className="text-sm text-gray-500 dark:text-gray-400">
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
              className="w-10 h-10 rounded-full"
            />
            <Text className="ml-3 flex-1 text-black dark:text-white">
              Marie Delarue
            </Text>
            <View className="flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-red-500 mr-1" />
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                Refusé
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Services */}
      <View className="mt-6 px-1">
        <View className="flex-row flex-wrap justify-start">
          {[
            {
              icon: <FontAwesome5 name="paw" size={20} color="white" />,
              bg: "bg-blue-500",
              label: "Mes animaux",
            },
            {
              icon: (
                <MaterialIcons name="location-on" size={20} color="white" />
              ),
              bg: "bg-red-500",
              label: "Pet-sitters",
            },
            {
              icon: (
                <FontAwesome5 name="user-friends" size={20} color="white" />
              ),
              bg: "bg-gray-300 dark:bg-gray-600",
              label: "Mes pet-sitters",
            },
            {
              icon: <Ionicons name="notifications" size={20} color="white" />,
              bg: "bg-gray-300 dark:bg-gray-600",
              label: "Mes alertes",
            },
            {
              icon: <FontAwesome5 name="user-plus" size={20} color="white" />,
              bg: "bg-yellow-400",
              label: "Parrainer",
            },
            {
              icon: <FontAwesome5 name="percent" size={20} color="white" />,
              bg: "bg-gray-300 dark:bg-gray-600",
              label: "Réductions",
            },
            {
              icon: (
                <MaterialIcons name="support-agent" size={20} color="white" />
              ),
              bg: "bg-gray-300 dark:bg-gray-600",
              label: "Assistance",
            },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              className="items-center mb-6"
              style={{ width: "25%" }} // 4 colonnes = 100 / 4
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
  );
}
