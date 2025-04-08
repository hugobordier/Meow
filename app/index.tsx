import { Redirect } from "expo-router";
import { useAuthContext } from "@/context/AuthContext";

const Page = () => {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) return null;

  const redirect = isAuthenticated ? "/(home)/(main)/home" : "/(auth)/homePage";

  return <Redirect href={redirect} />;
};

export default Page;
