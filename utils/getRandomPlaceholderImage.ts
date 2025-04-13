import { usePlaceholderStore } from "@/store/randomPlaceholdler"; // adapte le chemin si nécessaire

export const getRandomPlaceholderImage = () => {
  const placeholderImages = [
    require("@/assets/images/avatarplaceholder1.png"),
    require("@/assets/images/avatarplaceholder2.png"),
    require("@/assets/images/avatarplaceholder3.png"),
    require("@/assets/images/avatarplaceholder4.png"),
    require("@/assets/images/avatarplaceholder5.png"),
  ];

  const { randomPlaceholder, setRandomPlaceholder } =
    usePlaceholderStore.getState();

  if (randomPlaceholder) {
    const index = parseInt(randomPlaceholder);
    return placeholderImages[index];
  }

  const randomIndex = Math.floor(Math.random() * placeholderImages.length);
  setRandomPlaceholder(randomIndex.toString());
  return placeholderImages[randomIndex];
};
