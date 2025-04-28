import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
  Animated,
} from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import { CameraCapturedPicture } from "expo-camera";
import { SaveFormat } from "expo-image-manipulator";
import { MaterialIcons } from "@expo/vector-icons";
import Loading from "./Loading";

interface ImageIdDisplayProps {
  photo: CameraCapturedPicture | null;
  imageUri: string;
  onAccept: (croppedUri: string) => void;
  onReject: () => void;
}

const { height, width } = Dimensions.get("window");
const aspectRatio = 16 / 9;

const ImageIdDisplay = ({
  photo,
  imageUri,
  onAccept,
  onReject,
}: ImageIdDisplayProps) => {
  const [croppedUri, setCroppedUri] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const context = ImageManipulator.useImageManipulator(photo!.uri);
  const [isCropped, setIsCropped] = useState(false);

  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  const catFadeAnim = useState(new Animated.Value(0))[0];

  // Animate content when loaded
  useEffect(() => {
    if (!isProcessing && croppedUri) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();

      // Delay the cat animation
      setTimeout(() => {
        Animated.timing(catFadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }, 400);
    }
  }, [isProcessing, croppedUri]);

  useEffect(() => {
    const cropImage = async () => {
      setIsProcessing(true);

      if (photo && photo.width && photo.height) {
        const cropWidth = photo.width * 0.9;

        try {
          context.crop({
            originX: photo.width * 0.05,
            originY: photo.height * 0.39,
            width: cropWidth,
            height: cropWidth / aspectRatio,
          });
          const image = await context.renderAsync();
          const result = await image.saveAsync({
            format: SaveFormat.PNG,
          });
          setIsCropped(true);
          setCroppedUri(result.uri);
        } catch (error) {
          //console.error("Crop error:", error);
          setCroppedUri(imageUri);
        }
      } else {
        setCroppedUri(imageUri);
      }

      setIsProcessing(false);
    };

    cropImage();
  }, [photo, imageUri]);

  // Use the Loading component when processing
  if (isProcessing || !croppedUri) {
    return <Loading text="Traitement de votre image..." />;
  }

  return (
    <>
      <Image
        source={require("@/assets/images/background1.png")}
        style={styles.fullScreenBackground}
        resizeMode="cover"
      />
      <View style={styles.previewContainer}>
        <Animated.View
          style={[
            styles.imageWrapper,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {isCropped && (
            <Animated.Image
              source={require("@/assets/images/LoveCat.png")}
              style={[styles.overlayImageResponsive, { opacity: catFadeAnim }]}
              resizeMode="contain"
            />
          )}

          <Image
            source={{ uri: croppedUri }}
            style={styles.previewImageResponsive}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.Text style={[styles.explanationText, { opacity: fadeAnim }]}>
          Voici votre image. Vous pouvez l'accepter ou la reprendre.
        </Animated.Text>

        <Animated.View
          style={[
            styles.actionButtonsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity
            onPress={onReject}
            style={[styles.actionButton, styles.rejectButton]}
          >
            <MaterialIcons
              name="refresh"
              size={20}
              color="white"
              style={styles.buttonIcon}
            />
            <Text style={styles.rejectButtonText}>Reprendre</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onAccept(croppedUri)}
            style={[styles.actionButton, styles.acceptButton]}
          >
            <MaterialIcons
              name="check"
              size={20}
              color="white"
              style={styles.buttonIcon}
            />
            <Text style={styles.acceptButtonText}>Accepter</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  imageWrapper: {
    width: "95%",
    aspectRatio: 3 / 4,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginTop: 20, // Moved down a bit
    shadowColor: "#6A5ACD",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 10,
  },
  overlayImageResponsive: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "35%",
    zIndex: 4,
  },
  previewImageResponsive: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    zIndex: 5,
  },
  explanationText: {
    color: "#E0FFFF",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
    fontWeight: "500",
    maxWidth: "90%",
    textShadowColor: "#4B0082", // Indigo shadow
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    zIndex: 10,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    marginTop: 10,
    width: "90%",
    justifyContent: "space-between",
    zIndex: 10,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    minWidth: 140,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  buttonIcon: {
    marginRight: 8,
  },
  rejectButton: {
    backgroundColor: "#9370DB",
  },
  acceptButton: {
    backgroundColor: "#4169E1",
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
  fullScreenBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 1,
  },
});

export default ImageIdDisplay;
