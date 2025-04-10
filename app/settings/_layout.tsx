import { Stack } from "expo-router";

const SettingsLayout = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomeSettings" />
        </Stack>
    );
};

export default SettingsLayout;

