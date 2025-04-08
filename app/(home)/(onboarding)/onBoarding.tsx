import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Animated,
  useColorScheme,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const pages = [
  {
    image: require("@/assets/images/onboarding1.png"),
    text: "Réserve facilement un pet-sitter de confiance pour ton compagnon. 🐾",
    buttonText: "Trop bien, la suite ? 😺",
  },
  {
    image: require("@/assets/images/onboarding2.png"),
    text: "Suis ton animal en temps réel et reçois des nouvelles en photo. 📸",
    buttonText: "J'adore ! 🐱",
  },
  {
    image: require("@/assets/images/onboarding3.png"),
    text: "En résumé : un service aux petits oignons... ou aux petites croquettes ! 🐾",
    buttonText: "Miaou-gnifique, je fonce ! 🚀",
  },
];

export default function Onboarding() {
  const [pageIndex, setPageIndex] = useState(0);
  const scrollRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();

  const bottomControlsHeight = 120 + insets.bottom;

  const nextPage = () => {
    if (pageIndex < pages.length - 1) {
      const nextIndex = pageIndex + 1;
      setPageIndex(nextIndex);
      scrollToPage(nextIndex);
    } else {
      router.replace("/(home)/(main)/home");
    }
  };

  const scrollToPage = (index: number) => {
    //@ts-ignore
    scrollRef.current?.scrollTo({
      x: index * width,
      animated: true,
    });
  };

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    if (index !== pageIndex) {
      setPageIndex(index);
    }
  };

  useEffect(() => {
    // Reset animations
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.9);

    // Start animation sequence
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, [pageIndex]);

  return (
    <View className={`flex-1 ${isDark ? "bg-gray-900" : "bg-white"}`}>
      <SafeAreaView className="absolute top-0 w-full z-10 flex items-end p-4">
        <TouchableOpacity
          className="p-5"
          onPress={() => {
            setPageIndex(pages.length - 1);
            scrollToPage(pages.length - 1);
          }}
        >
          <Text
            className={`underline text-xl font-bold ${
              isDark ? "text-gray-300" : "text-gray-500"
            }`}
          >
            Skip
          </Text>
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
      >
        {pages.map((page, index) => (
          <View key={index} style={{ width }} className="flex-1">
            <View className="w-full">
              <Image
                source={page.image}
                className="w-full "
                style={{
                  height: height - bottomControlsHeight - insets.top - 100,
                }}
              />
            </View>

            <View className="w-full px-8 pt-8 items-center">
              <Text
                className={`text-3xl font-bold text-center mb-6 leading-tight ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                {page.text}
              </Text>

              {index === pageIndex && (
                <Animated.View
                  style={{
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }],
                    width: "100%",
                    zIndex: 10,
                  }}
                >
                  <TouchableOpacity
                    className={`w-full px-6 py-4 rounded-2xl shadow-lg ${
                      isDark ? "bg-indigo-600" : "bg-black"
                    }`}
                    onPress={nextPage}
                    activeOpacity={0.7}
                  >
                    <Text className="text-white text-center text-xl font-semibold">
                      {page.buttonText}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      <View className="flex-row justify-center items-center pb-5 pt-4 ">
        {pages.map((_, index) => (
          <TouchableOpacity
            key={index}
            className={`mx-2 h-3 w-3 rounded-full ${
              index === pageIndex
                ? isDark
                  ? "bg-indigo-500"
                  : "bg-black"
                : isDark
                ? "bg-gray-600"
                : "bg-gray-300"
            }`}
            onPress={() => {
              setPageIndex(index);
              scrollToPage(index);
            }}
          />
        ))}
      </View>
    </View>
  );
}
