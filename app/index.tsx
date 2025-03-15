import { Redirect } from "expo-router";
import { View } from "react-native";
import { useAuthContext } from "@/context/AuthContext";

const Page = () => {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) return null;

  const redirect = isAuthenticated ? "/(home)/home" : "/(auth)/homePage";

  return (
    <View className=" flex-1 bg-white dark:bg-gray-700">
      <Redirect href={redirect} />
    </View>
  );
};

export default Page;
