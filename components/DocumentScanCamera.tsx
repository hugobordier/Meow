import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
  Animated,
} from "react-native";
import { CameraView, Camera } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import { Feather } from "@expo/vector-icons";
import { DeviceMotion } from "expo-sensors";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const aspectRatio = 16 / 9;
const frameWidth = screenWidth * 0.9;
const frameHeight = frameWidth / aspectRatio;
const frameTop = (screenHeight - frameHeight) / 2;
const frameLeft = (screenWidth - frameWidth) / 2;

interface DocumentScanCameraProps {
  onClose?: () => void;
  onImageCaptured?: (uri: string) => void;
}

const DocumentScanCamera = ({
  onClose,
  onImageCaptured,
}: DocumentScanCameraProps) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const imageRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();

    const subscription = DeviceMotion.addListener(({ rotation }) => {
      const degrees = rotation?.gamma ? (rotation.gamma * 180) / Math.PI : 0;
      const limitedDegrees = Math.max(-45, Math.min(45, degrees));
      Animated.timing(imageRotation, {
        toValue: limitedDegrees,
        duration: 50,
        useNativeDriver: true,
      }).start();
    });

    DeviceMotion.setUpdateInterval(100);

    return () => {
      subscription.remove();
    };
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        skipProcessing: true,
      });

      if (!photo) return;

      const cropWidth = photo.width * 0.9;
      const cropHeight = cropWidth / aspectRatio;
      const originX = (photo.width - cropWidth) / 2;
      const originY = (photo.height - cropHeight) / 2;

      const manipulated = await ImageManipulator.manipulateAsync(
        photo.uri,
        [
          {
            crop: {
              originX,
              originY,
              width: cropWidth,
              height: cropHeight,
            },
          },
        ],
        { compress: 1, format: ImageManipulator.SaveFormat.PNG }
      );

      setCapturedImage(manipulated.uri);
    }
  };

  const toggleTorch = () => {
    setIsTorchOn((prev) => !prev);
  };

  const handleAccept = () => {
    if (capturedImage && onImageCaptured) {
      onImageCaptured(capturedImage);
    }
    onClose && onClose();
  };

  if (hasPermission === null) return <View className="flex-1 bg-black" />;
  if (!hasPermission) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <Text className="text-white">Permission caméra refusée.</Text>
      </View>
    );
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      {capturedImage ? (
        <View className="flex-1 bg-black justify-center items-center p-6">
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: capturedImage }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              onPress={() => setCapturedImage(null)}
              style={[styles.actionButton, styles.rejectButton]}
            >
              <Text style={styles.rejectButtonText}>Reprendre</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleAccept}
              style={[styles.actionButton, styles.acceptButton]}
            >
              <Text style={styles.acceptButtonText}>Accepter</Text>
            </TouchableOpacity>
          </View>
          {onClose && (
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text className="text-xl font-bold text-white underline">
                Fermer
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <>
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            facing="back"
            enableTorch={isTorchOn}
          >
            <View style={styles.overlay}>
              <View
                style={{ height: frameTop, backgroundColor: "rgba(0,0,0,0.9)" }}
              />
              <View className="flex-row">
                <View
                  style={{
                    width: frameLeft,
                    backgroundColor: "rgba(0,0,0,0.9)",
                  }}
                />
                <View
                  style={{
                    position: "relative",
                    width: frameWidth,
                    height: frameHeight,
                    borderWidth: 3,
                    borderColor: "white",
                    borderRadius: 5,
                    zIndex: 20,
                  }}
                />
                <View
                  style={{
                    width: frameLeft,
                    backgroundColor: "rgba(0,0,0,0.9)",
                  }}
                />
              </View>
              <View
                style={{ height: frameTop, backgroundColor: "rgba(0,0,0,0.9)" }}
              />
            </View>
          </CameraView>

          <Animated.View
            style={[
              styles.staticImageContainer,
              {
                transform: [
                  {
                    rotate: imageRotation.interpolate({
                      inputRange: [-45, 0, 45],
                      outputRange: ["-45deg", "0deg", "45deg"],
                    }),
                  },
                ],
              },
            ]}
          >
            <Image
              source={require("@/assets/images/CameraCat.png")}
              style={styles.staticImage}
              resizeMode="contain"
            />
          </Animated.View>

          <TouchableOpacity
            onPress={toggleTorch}
            style={styles.torchButtonRight}
          >
            <Feather
              name={isTorchOn ? "zap" : "zap-off"}
              size={24}
              color="white"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={takePicture} style={styles.bottomButton}>
            <Text className="font-bold text-xl">Prendre la photo</Text>
          </TouchableOpacity>

          {onClose && (
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text className="text-xl font-bold text-white underline">
                Fermer
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "relative",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomButton: {
    position: "absolute",
    bottom: 60,
    alignSelf: "center",
    backgroundColor: "white",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  buttonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    top: 60,
    left: 20,
    padding: 10,
    borderRadius: 20,
    backgroundColor: "rgba(128, 128, 128, 0.5)",
  },
  previewContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  torchButtonRight: {
    position: "absolute",
    right: frameLeft,
    top: frameTop + frameHeight + 2,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 13,
  },
  imageContainer: {
    width: "100%",
    height: "70%",
    borderRadius: 13,
    overflow: "hidden",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    marginTop: 30,
    width: "80%",
    justifyContent: "space-between",
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    minWidth: 120,
    alignItems: "center",
  },
  rejectButton: {
    backgroundColor: "#f44336",
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
  },
  rejectButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  acceptButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  staticImageContainer: {
    position: "absolute",
    top: frameTop - screenHeight * 0.4,
    alignSelf: "center",
    zIndex: 0,
  },
  staticImage: {
    height: screenHeight * 0.7,
  },
});

export default DocumentScanCamera;
