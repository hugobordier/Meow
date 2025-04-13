import { useEffect, useRef } from "react";
import {
  Text,
  Modal,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getRandomPlaceholderImage } from "@/utils/getRandomPlaceholderImage";

interface ProfilePictureModalProps {
  visible: boolean;
  onClose: () => void;
  profilePicture?: string;
  onChooseFromLibrary: () => void;
  onTakePhoto: () => void;
  isUser?: boolean;
}

const { width } = Dimensions.get("window");

export default function ProfilePictureModal({
  visible,
  onClose,
  profilePicture,
  onChooseFromLibrary,
  onTakePhoto,
  isUser = true,
}: ProfilePictureModalProps) {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;
  const contentOpacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      opacityAnim.setValue(0);
      translateYAnim.setValue(50);
      contentOpacityAnim.setValue(0);

      Animated.parallel([
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(contentOpacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: -50,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(contentOpacityAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, opacityAnim, translateYAnim, contentOpacityAnim]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: -50,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(contentOpacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <Animated.View
          className="flex-1 justify-center items-center"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            opacity: opacityAnim,
          }}
        >
          <TouchableWithoutFeedback>
            <Animated.View
              className="items-center relative"
              style={{
                opacity: contentOpacityAnim,
                transform: [{ translateY: translateYAnim }],
              }}
            >
              <TouchableOpacity
                onPress={handleClose}
                style={{
                  position: "absolute",
                  top: -20,
                  right: -20,
                  backgroundColor: "#e5e7eb",
                  borderRadius: 9999,
                  width: 32,
                  height: 32,
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 10,
                }}
              >
                <Ionicons name="close" size={20} color="#555" />
              </TouchableOpacity>

              {profilePicture ? (
                <Image
                  source={{ uri: profilePicture }}
                  className="rounded-full"
                  style={{
                    width: width * 0.8,
                    height: width * 0.8,
                    borderWidth: 2,
                    borderColor: "#ddd",
                  }}
                  resizeMode="cover"
                />
              ) : (
                <Image
                  source={getRandomPlaceholderImage()}
                  className="rounded-full"
                  style={{
                    width: width * 0.8,
                    height: width * 0.8,
                    borderWidth: 2,
                    borderColor: "#ddd",
                  }}
                  resizeMode="cover"
                />
              )}

              {isUser && (
                <View className="flex justify-center space-x-4 mt-6">
                  <TouchableOpacity
                    className="bg-[#FFB800] py-3 px-5 rounded-full items-center justify-center flex-row"
                    onPress={onChooseFromLibrary}
                  >
                    <Ionicons name="images" size={24} color="white" />
                    <Text className="text-white font-bold text-base ml-2">
                      Choisir une photo
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="bg-[#FFB800] py-3 px-5 rounded-full items-center justify-center flex-row"
                    onPress={onTakePhoto}
                  >
                    <Ionicons name="camera" size={24} color="white" />
                    <Text className="text-white font-bold text-base ml-2">
                      Prendre une photo
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
