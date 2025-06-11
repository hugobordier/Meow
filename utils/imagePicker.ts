import * as ImagePicker from "expo-image-picker";

export const pickImageFromLibrary = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    return { error: "L'accès à la galerie est requis." };
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });
  if (result.canceled || !result.assets.length) {
    return { error: "Aucune image sélectionnée." };
  }
  return { uri: result.assets[0].uri };
};