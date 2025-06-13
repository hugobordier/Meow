import { useEffect, useRef } from "react";
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from "expo-av";
import { usePreferencesStore } from "@/store/preferences";

const useFantinMusic = () => {
  const fantinMode = usePreferencesStore((state) => state.fantinMode);
  const soundRef = useRef<Audio.Sound | null>(null);
  const isPlayingRef = useRef(false); // on garde en mémoire si c’est en cours

  useEffect(() => {
    const playMusic = async () => {
      if (isPlayingRef.current) return; // déjà en cours
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          interruptionModeIOS: InterruptionModeIOS.DoNotMix,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
          playThroughEarpieceAndroid: false,
        });

        const { sound } = await Audio.Sound.createAsync(
          require("@/assets/music/meow.mp3"),
          { isLooping: true }
        );
        soundRef.current = sound;
        isPlayingRef.current = true;
        await sound.playAsync();
      } catch (error) {}
    };

    const stopMusic = async () => {
      try {
        if (soundRef.current && isPlayingRef.current) {
          console.log("ca stop ");
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
          soundRef.current = null;
          isPlayingRef.current = false;
          console.log("🛑 Fantin music stopped");
        }
      } catch (error) {
        console.log("Error stopping Fantin music:", error);
      }
    };

    if (fantinMode) {
      playMusic();
    } else {
      stopMusic();
    }

    return () => {
      if (!fantinMode) stopMusic();
    };
  }, [fantinMode]);
};

export default useFantinMusic;
