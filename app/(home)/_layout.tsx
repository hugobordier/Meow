import BottomNavBar from "@/components/BottomNavBar";
import Header from "@/components/header";
import useFantinMusic from "@/hooks/useFantinMode";
import { Stack, usePathname } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

const Layout = () => {
  const pathname = usePathname();
  const isOnboarding = pathname?.includes("onBoarding");
  useFantinMusic();

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
