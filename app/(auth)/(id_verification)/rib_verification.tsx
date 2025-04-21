import {
  TouchableOpacity,
  View,
  Text,
  TextInput,
  ScrollView,
  Dimensions,
  useColorScheme,
  ActivityIndicator,
  Alert,
  Image,
  Animated,
} from "react-native";
import type React from "react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import CountryFlag from "react-native-country-flag";
import { initStripe, createToken } from "@stripe/stripe-react-native";
import { updateUser } from "@/services/user.service";
import { ToastType, useToast } from "@/context/ToastContext";

const STRIPE_PUBLISHABLE_KEY =
  "pk_test_51O5JUvBqJF8hZBPkYOKB2Yx7Ot6Qz3XYRGcLQQIgwmYEEsBFHjhg2FMGQrc4EjwWLTKlzVwKHLCBG2FkfoRmSHvF00CpzKLmkP";

const countries = [
  {
    code: "FR",
    name: "France",
    flagIcon: "fr",
    format: "FR76 XXXX XXXX XXXX XXXX XXXX XXX",
    example: "FR76 3000 1007 9412 3456 7890 185",
    typicalName: "Jean Dupont",
  },
  {
    code: "DE",
    name: "Allemagne",
    flagIcon: "de",
    format: "DE89 XXXX XXXX XXXX XXXX XX",
    example: "DE89 3704 0044 0532 0130 00",
    typicalName: "Johann Duponter",
  },
  {
    code: "ES",
    name: "Espagne",
    flagIcon: "es",
    format: "ES91 XXXX XXXX XXXX XXXX XXXX",
    example: "ES91 2100 0418 4502 0005 1332",
    typicalName: "Juan Duponte",
  },
  {
    code: "IT",
    name: "Italie",
    flagIcon: "it",
    format: "IT60 X XXXXX XXXXX XXXXXXXXXX",
    example: "IT60 X 05428 11101 000000123456",
    typicalName: "Gianni Duponti",
  },
  {
    code: "GB",
    name: "Royaume-Uni",
    flagIcon: "gb",
    format: "GB29 XXXX XXXX XXXX XXXX XX",
    example: "GB29 NWBK 6016 1331 9268 19",
    typicalName: "John D. Pont",
  },
];

const RibVerif = () => {
  const router = useRouter();
  const imageSize = Dimensions.get("window").width / 3;
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [iban, setIban] = useState("");
  const [bic, setBic] = useState("");
  const [accountName, setAccountName] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isValidated, setIsValidated] = useState(false);

  const dropdownHeight = useRef(new Animated.Value(0)).current;
  const rotateAnimation = useRef(new Animated.Value(0)).current;
  const opacityAnimation = useRef(new Animated.Value(0)).current;
  const translateYAnimation = useRef(new Animated.Value(10)).current;
  const { showToast } = useToast();

  // useEffect(() => {
  //   const initializeStripe = async () => {
  //     try {
  //       await initStripe({
  //         publishableKey: STRIPE_PUBLISHABLE_KEY,
  //         merchantIdentifier: "merchant.com.meow",
  //         stripeAccountId: "",
  //       });
  //       setStripeInitialized(true);
  //       console.log("Stripe initialized successfully");
  //     } catch (error) {
  //       console.error("Failed to initialize Stripe", error);
  //     }
  //   };

  //   initializeStripe();
  // }, []);

  useEffect(() => {
    if (showCountryPicker) {
      const calculatedHeight = Math.min(200, countries.length * 50);

      Animated.timing(dropdownHeight, {
        toValue: calculatedHeight,
        duration: 300,
        useNativeDriver: false,
      }).start();

      Animated.parallel([
        Animated.timing(rotateAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnimation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(dropdownHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();

      Animated.parallel([
        Animated.timing(rotateAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnimation, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnimation, {
          toValue: 10,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showCountryPicker, countries.length]);

  // Interpolation pour la rotation de l'icône
  const rotateInterpolation = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const formatIban = (input: string) => {
    const cleanInput = input.replace(/\s/g, "").toUpperCase();
    return cleanInput.replace(/(.{4})/g, "$1 ").trim();
  };

  const handleIbanChange = (text: string) => {
    const formattedIban = formatIban(text);
    setIban(formattedIban);
    if (isValidated) {
      setIsValidated(false);
    }
  };

  const validateRib = async () => {
    if (!iban || !bic || !accountName) {
      showToast("Erreur, veuillez remplir tous les champs", ToastType.ERROR);
      return;
    }

    setIsValidating(true);

    try {
      await updateUser({ bankInfo: iban });

      setIsValidated(true);
      showToast("RIB validé avec succès", ToastType.SUCCESS);
    } catch (error: any) {
      console.error("Erreur lors de la validation du RIB:", error);
      showToast(
        error?.message || "Une erreur est survenue lors de la mise à jour.",
        ToastType.ERROR
      );
    } finally {
      setIsValidating(false);
    }
  };

  const renderFlag = (flagIcon: any) => {
    return (
      <CountryFlag isoCode={flagIcon} size={25} style={{ borderRadius: 50 }} />
    );
  };

  // Mettre à jour la fonction selectCountry pour réinitialiser aussi le nom du titulaire
  const selectCountry = (
    country: React.SetStateAction<{
      code: string;
      name: string;
      flagIcon: string;
      format: string;
      example: string;
      typicalName: string;
    }>
  ) => {
    setSelectedCountry(country);
    setShowCountryPicker(false);
    setIban("");
    setAccountName(""); // Réinitialiser le nom du titulaire
  };

  return (
    <SafeAreaView
      className={`flex-1 px-4 ${isDarkMode ? "bg-gray-900" : "bg-fuchsia-50"}`}
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="items-center mt-6">
          <View className="relative items-center justify-center">
            <Image
              source={require("@/assets/images/person-with-dog.png")}
              style={{ width: imageSize, height: imageSize * 1.2 }}
            />
          </View>

          <Text
            className={`text-2xl font-bold mt-4 ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            Vérification bancaire
          </Text>
          <Text className="text-sm text-gray-400 text-center mb-8">
            Veuillez saisir les informations de votre compte bancaire
          </Text>
        </View>

        {/* Country Selection - Animated */}
        {!isValidated && (
          <>
            <View className="mb-5">
              <Text
                className={`text-base font-semibold mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Pays
              </Text>
              <TouchableOpacity
                className={`flex-row items-center px-4 py-3 rounded-lg ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } border border-gray-300`}
                onPress={() => setShowCountryPicker(!showCountryPicker)}
                activeOpacity={0.7}
              >
                <View className="mr-3 rounded-lg">
                  {renderFlag(selectedCountry.flagIcon)}
                </View>
                <Text
                  className={`flex-1 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  {selectedCountry.name}
                </Text>
                <Animated.View
                  style={{
                    transform: [{ rotate: rotateInterpolation }],
                  }}
                >
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={24}
                    color={isDarkMode ? "#fff" : "#555"}
                  />
                </Animated.View>
              </TouchableOpacity>

              {/* Modifier cette partie pour que le menu soit invisible quand fermé */}
              {showCountryPicker && (
                <Animated.View
                  style={{
                    height: dropdownHeight, // This uses JS driver
                    overflow: "hidden",
                  }}
                  className={`border border-gray-300 rounded-lg mt-1 ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <Animated.View
                    style={{
                      opacity: opacityAnimation, // These use native driver
                      transform: [{ translateY: translateYAnimation }],
                    }}
                  >
                    <ScrollView
                      nestedScrollEnabled={true}
                      style={{ maxHeight: 200 }}
                    >
                      {countries.map((country) => (
                        <TouchableOpacity
                          key={country.code}
                          className={`flex-row items-center px-4 py-3 ${
                            country.code !==
                            countries[countries.length - 1].code
                              ? "border-b border-gray-200"
                              : ""
                          }`}
                          onPress={() => selectCountry(country)}
                          activeOpacity={0.7}
                        >
                          <View className="mr-3 rounded-lg">
                            {renderFlag(country.flagIcon)}
                          </View>
                          <Text
                            className={`${
                              isDarkMode ? "text-white" : "text-gray-800"
                            }`}
                          >
                            {country.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </Animated.View>
                </Animated.View>
              )}
            </View>

            {/* IBAN Input */}
            <View className="mb-5">
              <Text
                className={`text-base font-semibold mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                IBAN
              </Text>
              <TextInput
                className={`px-4 py-3 rounded-lg ${
                  isDarkMode
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-800"
                } border border-gray-300`}
                value={iban}
                onChangeText={handleIbanChange}
                placeholder={selectedCountry.format}
                placeholderTextColor={isDarkMode ? "#9ca3af" : "#9ca3af"}
                autoCapitalize="characters"
              />
              <Text
                className={`text-xs mt-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Format: {selectedCountry.format}
              </Text>
              <Text
                className={`text-xs italic ${
                  isDarkMode ? "text-gray-500" : "text-gray-500"
                }`}
              >
                Exemple: {selectedCountry.example}
              </Text>
            </View>

            {/* BIC/SWIFT Input */}
            <View className="mb-5">
              <Text
                className={`text-base font-semibold mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                BIC / SWIFT
              </Text>
              <TextInput
                className={`px-4 py-3 rounded-lg ${
                  isDarkMode
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-800"
                } border border-gray-300`}
                value={bic}
                onChangeText={setBic}
                placeholder="BNPAFRPPXXX"
                placeholderTextColor={isDarkMode ? "#9ca3af" : "#9ca3af"}
                autoCapitalize="characters"
              />
            </View>

            {/* Account Name Input */}
            <View className="mb-5">
              <Text
                className={`text-base font-semibold mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Nom du titulaire
              </Text>
              {/* Mettre à jour le TextInput du nom du titulaire pour utiliser le nom typique du pays sélectionné */}
              <TextInput
                className={`px-4 py-3 rounded-lg ${
                  isDarkMode
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-800"
                } border border-gray-300`}
                value={accountName}
                onChangeText={setAccountName}
                placeholder={selectedCountry.typicalName}
                placeholderTextColor={isDarkMode ? "#9ca3af" : "#9ca3af"}
              />
            </View>
          </>
        )}

        {/* Validation Success Message */}
        {isValidated && (
          <View
            className={`items-center my-6 rounded-xl p-5 ${
              isDarkMode ? "bg-green-900" : "bg-green-100"
            }`}
          >
            <MaterialIcons
              name="verified-user"
              size={64}
              color={isDarkMode ? "#4ade80" : "#16a34a"}
            />
            <Text
              className={`text-xl font-bold mt-3 mb-2 ${
                isDarkMode ? "text-green-400" : "text-green-700"
              }`}
            >
              Compte vérifié !
            </Text>
            <Text
              className={`text-center ${
                isDarkMode ? "text-green-300" : "text-green-600"
              }`}
            >
              Votre compte bancaire a été vérifié avec succès. Vous pouvez
              maintenant continuer.
            </Text>
          </View>
        )}

        {/* Security Note */}
        <View
          className={`flex-row items-center p-4 rounded-lg mb-6 ${
            isDarkMode ? "bg-gray-800" : "bg-gray-200"
          }`}
        >
          <MaterialIcons
            name="security"
            size={20}
            color={isDarkMode ? "#e5e7eb" : "#555"}
            style={{ marginRight: 10 }}
          />
          <Text
            className={`flex-1 text-sm ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Vos informations bancaires sont sécurisées et cryptées selon les
            normes les plus strictes.
          </Text>
        </View>

        {/* Validation Button */}
        <TouchableOpacity
          className={`px-6 py-3 rounded-lg mb-1 w-full flex-row justify-center items-center ${
            isValidated
              ? isDarkMode
                ? "bg-green-700"
                : "bg-green-600"
              : isDarkMode
              ? "bg-fuchsia-700"
              : "bg-black"
          }`}
          onPress={validateRib}
          disabled={isValidating || isValidated}
        >
          {isValidating ? (
            <ActivityIndicator color="#fff" />
          ) : isValidated ? (
            <>
              <MaterialIcons
                name="check-circle"
                size={24}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text className="text-white font-semibold text-center">
                Vérifié avec succès
              </Text>
            </>
          ) : (
            <Text className="text-white font-semibold text-center">
              Vérifier mon compte
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} className="mt-4 mb-8">
          <Text
            className={`text-center ${
              isDarkMode ? "text-fuchsia-400" : "text-fuchsia-700"
            }`}
          >
            Retour
          </Text>
        </TouchableOpacity>

        <Text
          className={`text-xs text-center mb-6 ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          En validant ces informations, vous autorisez Meow à vérifier votre
          identité bancaire.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RibVerif;
function setStripeInitialized(arg0: boolean) {
  throw new Error("Function not implemented.");
}
