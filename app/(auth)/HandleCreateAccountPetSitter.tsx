import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Image,
  Dimensions,
  useColorScheme,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Slider from "@react-native-community/slider";
import { createPetSitter } from "@/services/petsitter.service";
import { ToastType, useToast } from "@/context/ToastContext";

const HandleCreateAccountPetSitter = () => {
  const router = useRouter();
  const [hourlyRate, setHourlyRate] = useState("15");
  const [loading, setLoading] = useState(false);
  const imageSize = Dimensions.get("window").width / 2;
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const { showToast } = useToast();

  const minRate = 5;
  const maxRate = 50;

  const handleContinue = async () => {
    try {
      setLoading(true);
      const res = await createPetSitter(parseInt(hourlyRate));
      showToast(res.message || "Compte petsitter créé !", ToastType.SUCCESS);
      router.push("/(home)/(main)/home");
    } catch (error: any) {
      showToast(error || "Erreur lors de la création", ToastType.ERROR);
    } finally {
      setLoading(false);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleHourlyRateChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setHourlyRate(numericValue);
  };

  const handleSliderChange = (value: number) => {
    setHourlyRate(Math.round(value).toString());
  };

  const getSliderValue = () => {
    const numValue = parseInt(hourlyRate || "0");

    if (numValue < minRate) return minRate;
    if (numValue > maxRate) return maxRate;
    return numValue;
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <SafeAreaView
        className={`flex-1 justify-center relative px-4 ${
          isDarkMode ? "bg-gray-900" : "bg-fuchsia-50"
        }`}
      >
        <View className="justify-center items-center">
          <View className="relative items-center justify-center">
            <Image
              source={require("@/assets/images/gradient.png")}
              style={{
                width: Dimensions.get("window").width,
                position: "absolute",
                top: imageSize / 2,
                left: "25%",
                transform: [
                  { translateX: -Dimensions.get("window").width / 2 },
                  { translateY: -Dimensions.get("window").width / 2 },
                ],
                zIndex: -10,
                opacity: isDarkMode ? 0.8 : 1,
              }}
            />
            <Image
              source={require("@/assets/images/coolDog.png")}
              style={{ width: imageSize, height: imageSize }}
            />
          </View>

          <Text
            className={`text-3xl font-bold text-center ${
              isDarkMode ? "text-white" : "text-black"
            } mt-4`}
          >
            Dernier effort !
          </Text>
          <Text className="text-sm text-gray-400 text-center mt-2">
            Plus qu'une info avant de lancer ton aventure 🐾
          </Text>
        </View>

        <View
          className={`w-full rounded-3xl shadow-md mt-10 flex items-center justify-evenly px-6 py-8 ${
            isDarkMode ? "bg-gray-800" : "bg-slate-300"
          }`}
        >
          <Text
            className={`font-bold text-xl text-center mb-4 ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            Fixe ton taux horaire moyen
          </Text>

          <View
            className={`w-full flex-row items-center justify-center px-4 py-3 rounded-lg mb-4 ${
              isDarkMode ? "bg-gray-700" : "bg-white"
            }`}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TextInput
              className={`font-bold text-3xl text-center ${
                isDarkMode ? "text-white" : "text-black"
              }`}
              style={{
                minWidth: 100,
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 30,
              }}
              keyboardType="numeric"
              value={hourlyRate}
              onChangeText={handleHourlyRateChange}
              selectTextOnFocus={true}
            />
            <Text
              className={`font-semibold text-lg ml-1 ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              €/h
            </Text>
          </View>

          {/* Slider pour la sélection du taux */}
          <View className="w-full mt-4 mb-4">
            <Slider
              style={{ width: "100%", height: 40 }}
              minimumValue={minRate}
              maximumValue={maxRate}
              step={1}
              value={getSliderValue()}
              onValueChange={handleSliderChange}
              minimumTrackTintColor={isDarkMode ? "#4ade80" : "#16a34a"}
              maximumTrackTintColor={isDarkMode ? "#374151" : "#e5e7eb"}
              thumbTintColor={isDarkMode ? "#4ade80" : "#16a34a"}
            />
            <View className="flex-row justify-between">
              <Text
                className={`text-xs ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {minRate}€/h
              </Text>
              <Text
                className={`text-xs ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {maxRate}€/h
              </Text>
            </View>
          </View>

          <Text
            className={`text-center text-sm leading-5 ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Ce tarif sera modifiable plus tard dans ton profil.
          </Text>
        </View>

        <TouchableOpacity
          disabled={loading}
          className={`px-6 py-3 rounded-lg mb-1 mt-6 w-full ${
            loading
              ? "bg-green-300"
              : isDarkMode
              ? "bg-green-700"
              : "bg-green-600"
          }`}
          onPress={handleContinue}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white text-center font-semibold">
              Créer mon compte
            </Text>
          )}
        </TouchableOpacity>

        <Pressable onPress={() => router.back()}>
          <Text
            className={`text-center mt-6 ${
              isDarkMode ? "text-fuchsia-400" : "text-fuchsia-700"
            }`}
          >
            Retour
          </Text>
        </Pressable>

        <Text className="text-xs text-center mt-6 text-gray-500 dark:text-gray-400">
          En créant ton compte, tu acceptes nos conditions générales et
          politiques de confidentialité.
        </Text>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default HandleCreateAccountPetSitter;
