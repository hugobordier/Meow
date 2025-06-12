import BottomNavBar from "@/components/BottomNavBar";
import Header from "@/components/header";
import useNoEasyMusic from "@/hooks/useEasyMode";
import useFantinMusic from "@/hooks/useFantinMode";
import { Stack, usePathname } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

const Layout = () => {
  const pathname = usePathname();
  const isOnboarding = pathname?.includes("onBoarding");
  useFantinMusic();
  useNoEasyMusic();

  return (
    <>
      <SafeAreaProvider>
        {!isOnboarding && <Header />}
        <Stack>
          <Stack.Screen
            name="(main)"
            options={{ headerShown: false, animation: "none" }}
          />
          <Stack.Screen
            name="(maps)"
            options={{ headerShown: false, animation: "none" }}
          />
          <Stack.Screen
            name="(onboarding)"
            options={{ headerShown: false, animation: "none" }}
          />
          <Stack.Screen
            name="(petsitter)"
            options={{ headerShown: false, animation: "none" }}
          />
          <Stack.Screen
            name="(profil)"
            options={{ headerShown: false, animation: "none" }}
          />
        </Stack>

        {!isOnboarding && <BottomNavBar />}
      </SafeAreaProvider>
    </>
  );
};

export default Layout;
