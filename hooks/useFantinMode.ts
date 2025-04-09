import { useEffect, useRef } from "react";
import { Audio } from "expo-av";
import { usePreferencesStore } from "@/store/preferences";

const useFantinMusic = () => {
  const fantinMode = usePreferencesStore((state) => state.fantinMode);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    const setupMusic = async () => {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      if (fantinMode) {
        const { sound } = await Audio.Sound.createAsync(
          require("@/assets/music/meow.mp3"),
          {
            shouldPlay: true,
            isLooping: true, // 🔁 relance auto
            volume: 0.5,
          }
        );
        soundRef.current = sound;
      }
    };

    setupMusic();

    return () => {
      if (soundRef.current) {
        soundRef.current.stopAsync();
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    };
  }, [fantinMode]);
};

export default useFantinMusic;
