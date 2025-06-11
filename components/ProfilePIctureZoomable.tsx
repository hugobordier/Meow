import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Pressable,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRef, useState, useEffect } from "react";
import { BlurView } from "expo-blur";
import { getRandomPlaceholderImage } from "@/utils/getRandomPlaceholderImage";

const { width, height } = Dimensions.get("window");

export default function ProfilePictureZoomable({
  profilePicture,
  onChooseFromLibrary,
  onTakePhoto,
  onDeletePhoto,
}: {
  profilePicture?: string;
  onChooseFromLibrary?: () => void;
  onTakePhoto?: () => void;
  onDeletePhoto?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const translateY = useRef(new Animated.Value(50)).current;

  const thumbnailScaleAnim = useRef(new Animated.Value(1)).current;
  const thumbnailOpacityAnim = useRef(new Animated.Value(1)).current;

  const largeImageScaleAnim = useRef(new Animated.Value(0.5)).current;
  const largeImageOpacityAnim = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    setExpanded(true);

    opacityAnim.setValue(0);
    scaleAnim.setValue(0.5);
    translateY.setValue(50);
    largeImageScaleAnim.setValue(0.5);
    largeImageOpacityAnim.setValue(0);

    Animated.parallel([
      Animated.timing(thumbnailScaleAnim, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(thumbnailOpacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.spring(largeImageScaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(largeImageOpacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const close = () => {
    Animated.parallel([
      Animated.timing(thumbnailScaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(thumbnailOpacityAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(largeImageScaleAnim, {
        toValue: 0.5,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(largeImageOpacityAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => setExpanded(false));
  };

  // S'assurer que onDeletePhoto est toujours disponible pour le débogage
  useEffect(() => {
    console.log("onDeletePhoto disponible:", !!onDeletePhoto);
  }, [onDeletePhoto]);

  return (
    <>
      <TouchableOpacity onPress={toggleExpand}>
        <Animated.Image
          source={
            profilePicture
              ? { uri: profilePicture }
              : getRandomPlaceholderImage()
          }
          style={{
            width: 52,
            height: 52,
            borderRadius: 24,
            backgroundColor: "#fde047",
            opacity: thumbnailOpacityAnim,
            transform: [{ scale: thumbnailScaleAnim }],
          }}
        />
      </TouchableOpacity>

      {expanded && (
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width,
            height,
            zIndex: 50,
            opacity: opacityAnim,
          }}
        >
          {/* Cette Pressable va permettre de fermer quand on clique sur le fond */}
          <Pressable className="flex-1" onPress={close}>
            <BlurView intensity={50} tint="dark" className="flex-1">
              <View
                style={{
                  flex: 1,
                  justifyContent: "flex-start",
                  alignItems: "center",
                  paddingTop: 80,
                }}
              >
                {/* On transforme cette Pressable en une simple View car maintenant
                    le composant parent (BlurView) gère déjà le onPress pour fermer */}
                <Animated.Image
                  source={
                    profilePicture
                      ? { uri: profilePicture }
                      : getRandomPlaceholderImage()
                  }
                  style={{
                    width: width * 0.7,
                    height: width * 0.7,
                    borderRadius: width * 0.35,
                    opacity: largeImageOpacityAnim,
                    transform: [
                      { scale: largeImageScaleAnim },
                      { translateY: translateY },
                    ],
                  }}
                />

                <Animated.View
                  className="space-y-3 mt-8 w-full px-6"
                  style={{
                    opacity: largeImageOpacityAnim,
                  }}
                >
                  {/* On ajoute stopPropagation à chaque bouton pour éviter que 
                      le clic sur un bouton déclenche la fermeture */}
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      if (onChooseFromLibrary) onChooseFromLibrary();
                    }}
                    className="bg-yellow-500 py-3 px-5 rounded-full flex-row items-center justify-center"
                  >
                    <Ionicons name="images" size={24} color="white" />
                    <Text className="text-white ml-2 font-bold">
                      Choisir une photo
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      if (onTakePhoto) onTakePhoto();
                    }}
                    className="bg-yellow-500 py-3 px-5 rounded-full flex-row items-center justify-center"
                  >
                    <Ionicons name="camera" size={24} color="white" />
                    <Text className="text-white ml-2 font-bold">
                      Prendre une photo
                    </Text>
                  </TouchableOpacity>

                  {(!!profilePicture || !!onDeletePhoto) && (
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        onDeletePhoto && onDeletePhoto();
                      }}
                      className="bg-red-600 py-3 px-5 rounded-full flex-row items-center justify-center"
                    >
                      <MaterialIcons name="delete" size={24} color="white" />
                      <Text className="text-white ml-2 font-bold">
                        Supprimer la photo
                      </Text>
                    </TouchableOpacity>
                  )}
                </Animated.View>

                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    close();
                  }}
                  style={{
                    position: "absolute",
                    top: 40,
                    right: 20,
                    backgroundColor: "#e5e7eb",
                    borderRadius: 9999,
                    width: 36,
                    height: 36,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="close" size={20} color="#555" />
                </TouchableOpacity>
              </View>
            </BlurView>
          </Pressable>
        </Animated.View>
      )}
    </>
  );
}
