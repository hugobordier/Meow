import { Redirect } from "expo-router";
import { useAuth } from "@/hooks/useAuth";

const Page = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  const redirect = isAuthenticated ? "/(home)/home" : "/(auth)/welcome";


  return <Redirect href={redirect} />;
};

export default Page;
