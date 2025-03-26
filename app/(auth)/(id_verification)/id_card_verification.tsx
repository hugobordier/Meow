import { View, Text, Image, Pressable, TouchableOpacity, StyleSheet, Button } from "react-native"
import Header from "@/components/header"
import React, { useCallback, useMemo, useRef } from "react";
import { router } from "expo-router";
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import Feather from "react-native-vector-icons/Feather";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/Feather";

const idCardVerif = () => {
    const snapPoints = useMemo(() => ['27%'], []);

    const bottomSheetRef = useRef<BottomSheet>(null);

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


    return (
        <View className="bg-white flex-1 justify-start bg-fuchsia-50 relative px-4">
            <Header />

            <View className="justify-center items-center my-6">
                <Text className="text-xl font-bold">
                    Vérification de la carte d’identité
                </Text>

                <Image
                    source={require("@/assets/images/id_card_example.jpg")}
                    style={{ width: 225, height: 149 }}
                    className="my-6"
                />

                <Text className="mt-6 mb-6 text-center">
                    Veuillez joindre votre carte d’identité recto-verso au format .pdf, .jpeg ou .pnj comme ci-dessus.
                </Text>

                <Icon name="download" size={100} color="black" title="Open" onPress={handleOpenBottomSheet} />

                <Text className="text-xs text-center mt-10 text-gray-600 dark:text-gray-300">
                    La vérification de l’identité peut prendre jusqu’à 7 jours ouvrés.
                </Text>

                <TouchableOpacity
                    className="bg-black px-6 py-3 rounded-lg mb-1 mt-6 w-full"
                >
                    <Pressable onPress={() => router.push("/(auth)/(id_verification)/insurance_verification")}>
                        <Text className="text-white text-center">
                            Continuer
                        </Text>
                    </Pressable>
                </TouchableOpacity>

                <Text className="text-xs text-center mt-6 text-gray-600 dark:text-gray-300">
                    En cliquant sur continuer, vous acceptez la politique privée et les
                    conditions générales.
                </Text>
            </View>

            <BottomSheet ref={bottomSheetRef} index={-1} snapPoints={snapPoints} enablePanDownToClose backdropComponent={renderBackDrop}>
                <BottomSheetView className="items-center justify-content rounded-xl">
                    <TouchableOpacity className="flex-row items-center space-x-3">
                        <Feather name="upload" size={24} color="black" />
                        <Text className="text-l my-5">
                            Upload un fichier
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row items-center space-x-3">
                        <MaterialCommunityIcons name="camera-outline" size={24} color="black" />
                        <Text className="text-l my-5">
                            Prendre une photo
                        </Text>
                    </TouchableOpacity>

                </BottomSheetView>
            </BottomSheet>

        </View>

    );
};

export default idCardVerif;