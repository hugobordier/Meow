import React, { useMemo, useRef } from "react";
import { Pressable, View, Text } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import Icon from "react-native-vector-icons/Feather";
import { styles } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetScrollable/BottomSheetFlashList";



const UploadDocuments = () => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["30%"], []);

    const openBottomSheet = () => {
        console.log("Pressed icon");
        bottomSheetRef.current?.expand();
    };

    return (
        <View style={{ alignItems: "center" }}>
            <Pressable
                onPress={openBottomSheet}
            >
                <Icon name="download" size={100} color="#000" />
            </Pressable>



            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={snapPoints}
                enablePanDownToClose={true}
            >
                <View style={{ padding: 20 }}>
                    <Text style={{ fontSize: 16, fontWeight: "500", marginBottom: 10 }}>
                        📁 Importer un document ou 📷 prendre une photo
                    </Text>
                </View>
            </BottomSheet>

        </View>
    );
};

export default UploadDocuments;
