import { Redirect } from "expo-router";
import { useAuthContext } from "@/context/AuthContext";
import Loading from "@/components/Loading";

const Page = () => {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) return <Loading></Loading>;

  const redirect = isAuthenticated ? "/(home)/(main)/home" : "/(auth)/homePage";

  return <Redirect href={redirect} />;
};

export default Page;
