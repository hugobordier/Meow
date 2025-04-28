import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { CameraView, Camera, CameraCapturedPicture } from "expo-camera";

import { Feather } from "@expo/vector-icons";
import ImageIdDisplay from "./ImageDocIdDisplay";
import { updateDocId } from "@/services/user.service";
import { ToastType, useToast } from "@/context/ToastContext";
import Loading from "./Loading";
import { router } from "expo-router";
import UpdateNameModal from "@/components/UpdateNameModal";
import { useAuthContext } from "@/context/AuthContext";

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

const DocumentScanCamera = ({ onClose }: DocumentScanCameraProps) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const [photo, setPhoto] = useState<CameraCapturedPicture | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [newInfo, setNewInfo] = useState(false);

  const { showToast } = useToast();
  const { user } = useAuthContext();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleUdateDocId = async (uri: string) => {
    setIsLoading(true);
    try {
      const response = await updateDocId(uri);
      showToast(
        "Document d'identité mis à jour avec succès",
        ToastType.SUCCESS
      );
      console.log("Document ID updated successfully:", response.data.message);
      router.push("/(auth)/(id_verification)/id_card_verification");
    } catch (error: any) {
      console.log("on passe ici et c'est logique", error);
      const message = error.message || "Document invalide ou trop flou";
      showToast(message, ToastType.ERROR);
      setCapturedImage(null);
      setErrorMessage(`${message}\nVeuillez réessayer.`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    setErrorMessage(null); // Réinitialiser le message d'erreur avant chaque nouvelle prise
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          skipProcessing: true,
          quality: 0.8,
          exif: false,
        });
        photo ? setPhoto(photo) : setPhoto(null);

        if (!photo) {
          console.log("Aucune photo capturée.");
          setErrorMessage("Impossible de capturer l'image");
          return;
        }

        setCapturedImage(photo.uri);
      } catch (error) {
        console.error("Erreur lors de la capture de la photo :", error);
        setErrorMessage("Erreur lors de la capture de la photo");
      }
    }
  };

  const toggleTorch = () => {
    setIsTorchOn((prev) => !prev);
  };

  if (hasPermission === null) return <View className="flex-1 bg-black" />;
  if (!hasPermission) {
    return (
      <View className="flex-1 bg-fuchsia-50 dark:bg-gray-900 justify-center items-center p-8">
        <Feather
          name="camera-off"
          size={64}
          color={isDarkMode ? "#fff" : "#000"}
          className="mb-6"
        />
        <Text className="dark:text-white text-xl font-bold mb-4 text-center">
          Accès à la caméra requis
        </Text>
        <Text className="dark:text-gray-400 text-gray-600 text-base text-center mb-8">
          Nous avons besoin d'accéder à votre caméra pour scanner votre
          document.
        </Text>
        <TouchableOpacity
          className="bg-blue-600 py-4 px-8 rounded-xl"
          onPress={() => Camera.requestCameraPermissionsAsync()}
        >
          <Text className="dark:text-white font-bold text-xl">
            Autoriser l'accès
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoading) {
    return <Loading text="Traitement de votre image..." />;
  }

  return (
    <View className="flex-1 w-screen h-screen">
      {capturedImage ? (
        <ImageIdDisplay
          photo={photo}
          imageUri={capturedImage}
          onAccept={(croppedUri) => {
            setCapturedImage(croppedUri);
            console.log("Image acceptée :", croppedUri);
            handleUdateDocId(capturedImage);
          }}
          onReject={() => {
            setCapturedImage(null);
            setErrorMessage(null);
          }}
        />
      ) : (
        <>
          <CameraView
            ref={cameraRef}
            style={[StyleSheet.absoluteFill, { zIndex: 1 }]}
            facing="back"
            enableTorch={isTorchOn}
          />

          <View style={[styles.overlay, { zIndex: 2 }]}>
            <View
              style={{ height: frameTop, backgroundColor: "rgba(0,0,0,0.7)" }}
            />

            <View className="flex-row">
              <View
                style={{
                  width: frameLeft,
                  backgroundColor: "rgba(0,0,0,0.7)",
                }}
              />

              <View
                style={{
                  width: frameWidth,
                  height: frameHeight,
                  backgroundColor: "transparent",
                }}
              />

              <View
                style={{
                  width: frameLeft,
                  backgroundColor: "rgba(0,0,0,0.7)",
                }}
              />
            </View>

            <View
              style={{ height: frameTop, backgroundColor: "rgba(0,0,0,0.7)" }}
            />
          </View>

          <View
            style={{
              position: "absolute",
              top: frameTop - screenHeight * 0.35,
              alignSelf: "center",
              zIndex: 3,
            }}
          >
            <Image
              source={require("@/assets/images/CameraCat.png")}
              style={{ height: screenHeight * 0.35 }}
              resizeMode="contain"
            />
          </View>

          <View
            style={{
              position: "absolute",
              top: frameTop,
              left: frameLeft,
              width: frameWidth,
              height: frameHeight,
              borderWidth: 3,
              borderColor: "white",
              borderRadius: 5,
              backgroundColor: "transparent",
              zIndex: 4,
            }}
          ></View>

          {errorMessage && (
            <View
              style={[
                styles.errorContainer,
                { zIndex: 5 },
                {
                  backgroundColor: newInfo
                    ? "rgba(52, 199, 89, 0.15)"
                    : "rgba(255, 59, 48, 0.15)",
                },
              ]}
            >
              <View className="flex-row items-center">
                <Feather
                  name={newInfo ? "check-circle" : "alert-circle"}
                  size={20}
                  color={newInfo ? "#34C759" : "#FF3B30"}
                  style={styles.errorIcon}
                />
                <Text
                  style={[
                    styles.errorText,
                    { color: newInfo ? "#34C759" : "#FF3B30" },
                  ]}
                >
                  {errorMessage}
                </Text>
              </View>
              {newInfo ? (
                <></>
              ) : (
                <View className="flex-1 items-center justify-center mt-2">
                  <TouchableOpacity
                    onPress={handleOpenModal}
                    style={{
                      backgroundColor: "#501f31",
                      paddingHorizontal: 20,
                      paddingVertical: 8,
                      borderRadius: 10,
                      paddingBottom: 5,
                    }}
                  >
                    <Text className="text-white font-bold text-lg">
                      Modifier mes infos
                    </Text>
                  </TouchableOpacity>

                  <UpdateNameModal
                    visible={isModalVisible}
                    onClose={handleCloseModal}
                    initialFirstName={user?.firstName || ""}
                    initialLastName={user?.lastName || ""}
                    onUpdateSuccess={() => {
                      console.log("Infos mises à jour !");
                      setNewInfo(true);
                    }}
                  />
                </View>
              )}
            </View>
          )}

          <TouchableOpacity
            onPress={toggleTorch}
            style={[styles.torchButtonRight, { zIndex: 5 }]}
          >
            <Feather
              name={isTorchOn ? "zap" : "zap-off"}
              size={24}
              color="white"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              takePicture();
              setNewInfo(false);
            }}
            style={[styles.bottomButton, { zIndex: 5 }]}
          >
            <Text className="font-bold text-xl">Prendre la photo</Text>
          </TouchableOpacity>
        </>
      )}
      {onClose && (
        <TouchableOpacity
          onPress={onClose}
          style={[styles.closeButton, { zIndex: 5 }]}
        >
          <Text className="text-xl font-bold text-white underline">Fermer</Text>
        </TouchableOpacity>
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
    top: screenHeight * 0.07,
    left: 20,
    padding: 10,
    borderRadius: 20,
    backgroundColor: "rgba(128, 128, 128, 0.5)",
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
  errorContainer: {
    position: "absolute",
    top: frameTop + frameHeight + 40,
    alignSelf: "center",

    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    gap: 8,
    maxWidth: frameWidth,
  },
  errorIcon: {
    marginRight: 8,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    fontWeight: "600",
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
  overlayImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    resizeMode: "contain",
    zIndex: 500,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: 3 / 4,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    overflow: "hidden",
  },
  overlayImageResponsive: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "30%",
    zIndex: 10,
  },
  previewImageResponsive: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textDecorationLine: "underline",
  },
});

export default DocumentScanCamera;
