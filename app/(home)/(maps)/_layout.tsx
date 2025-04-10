import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="Maps" options={{ headerShown: false }} />
      <Stack.Screen name="Maps2" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
