import { Stack } from "expo-router";

const Layout = () => {
    return (

        <Stack>
            <Stack.Screen name="welcome_id_verification" options={{ headerShown: false }} />
            <Stack.Screen name="id_card_verification" options={{ headerShown: false }} />
            <Stack.Screen name="rib_verification" options={{ headerShown: false }} />
            <Stack.Screen name="insurance_verification" options={{ headerShown: false }} />
            <Stack.Screen name="home" options={{ headerShown: false }} />
        </Stack>

    );
};

export default Layout;