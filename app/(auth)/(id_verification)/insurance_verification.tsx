import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetView, TouchableOpacity } from '@gorhom/bottom-sheet';
import Header from '@/components/header';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Feather';

const InsuranceVerif = () => {
    const snapPoints = useMemo(() => ['27%'], []);

    const bottomSheetRef = useRef<BottomSheet>(null);

    const handleOpenBottomSheet = () => bottomSheetRef.current?.expand();

    // renders
    return (
        <View className="bg-white flex-1 justify-start bg-fuchsia-50 relative px-4">
            <Header />
            <Icon name="download" size={100} color="black" title="Open" onPress={handleOpenBottomSheet} />
            <View className="flex-1 p-6">
                <BottomSheet ref={bottomSheetRef} index={-1} snapPoints={snapPoints} enablePanDownToClose>
                    <BottomSheetView className="items-center justify-content">
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: 'grey',
    },
    contentContainer: {
        flex: 1,
        padding: 36,
        alignItems: 'center',
    },
});

export default InsuranceVerif;