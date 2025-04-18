import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import Feather from "react-native-vector-icons/Feather";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";
import DocumentScanCamera from "@/components/DocumentScanCamera";

const idCardVerif = () => {
  const snapPoints = useMemo(() => ["27%"], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const imageSize = Dimensions.get("window").width * 0.6;
  const imageHeight = imageSize * 0.66;

  const [showCamera, setShowCamera] = useState(false);

  const handleOpenBottomSheet = () => bottomSheetRef.current?.expand();

  const renderBackDrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    []
  );

  const handleTakePhoto = () => {
    bottomSheetRef.current?.close();
    setShowCamera(true);
  };

  return (
    <SafeAreaView
      className={`flex-1 justify-center relative px-4 ${
        isDarkMode ? "bg-gray-900" : "bg-fuchsia-50"
      }`}
    >
      {showCamera ? (
        <DocumentScanCamera
          onClose={() => {
            setShowCamera(false);
          }}
        />
      ) : (
        <View className="justify-center items-center my-6">
          <Text
            className={`text-2xl font-bold ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            Vérification de la carte d'identité
          </Text>

          <View className="relative items-center justify-center my-6">
            <Image
              source={require("@/assets/images/gradient.png")}
              style={{
                width: Dimensions.get("window").width,
                position: "absolute",
                top: -imageHeight,
                zIndex: -10,
                opacity: 0.9,
              }}
            />
            <Image
              source={require("@/assets/images/id_card_example.jpg")}
              style={{ width: imageSize, height: imageHeight }}
              className="rounded-lg"
            />
          </View>

          <Text
            className={`mt-6 mb-6 text-center ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Veuillez joindre votre carte d'identité recto-verso au format .pdf,
            .jpeg ou .png comme ci-dessus.
          </Text>

          <TouchableOpacity
            onPress={handleOpenBottomSheet}
            className={`w-full border-2 border-dashed p-6 rounded-lg my-6 items-center justify-center ${
              isDarkMode ? "border-gray-500" : "border-black"
            }`}
          >
            <Icon
              name="download"
              size={80}
              color={isDarkMode ? "#d1d5db" : "black"}
            />
          </TouchableOpacity>

          <Text className="text-xs text-center mt-10 text-gray-500 dark:text-gray-400">
            La vérification de l'identité peut prendre jusqu'à 7 jours ouvrés.
          </Text>

          <TouchableOpacity
            className={`px-6 py-3 rounded-lg mb-1 mt-6 w-full ${
              isDarkMode ? "bg-fuchsia-700" : "bg-black"
            }`}
            onPress={() =>
              router.push("/(auth)/(id_verification)/insurance_verification")
            }
          >
            <Text className="text-white text-center">Continuer</Text>
          </TouchableOpacity>

          <Text className="text-xs text-center mt-6 text-gray-500 dark:text-gray-400">
            En cliquant sur continuer, vous acceptez la politique privée et les
            conditions générales.
          </Text>
        </View>
      )}

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackDrop}
        backgroundStyle={{ backgroundColor: isDarkMode ? "#1f2937" : "white" }}
        handleIndicatorStyle={{
          backgroundColor: isDarkMode ? "#9ca3af" : "#9ca3af",
        }}
      >
        <BottomSheetView className="items-center justify-start rounded-xl flex-1">
          <View className="h-2/3 w-full justify-between pt-2 ">
            <TouchableOpacity className="flex-row items-center space-x-4 w-full justify-center  p-4">
              <Feather name="upload" size={32} color="#ffffff" />
              <Text className="text-xl font-medium text-white ml-2">
                Upload un fichier
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center space-x-4 w-full justify-center p-4"
              onPress={handleTakePhoto}
            >
              <MaterialCommunityIcons
                name="camera-outline"
                size={32}
                color="#ffffff"
              />
              <Text className="text-xl font-medium text-white ml-2">
                Prendre une photo
              </Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default idCardVerif;
