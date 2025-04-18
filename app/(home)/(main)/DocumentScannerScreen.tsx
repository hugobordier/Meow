import DocumentScanCamera from "@/components/DocumentScanCamera";
import { View } from "react-native";
import { useCameraPermissions } from "expo-camera";
import { useEffect } from "react";

export default function DocumentScanner() {
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);
  return (
    <View className="w-full h-full">
      <DocumentScanCamera />
    </View>
  );
}
