//redirect si auth plus tard mais pour l'instant on redirige vers welcome

import { Redirect } from "expo-router";

const Page = () => {
  return <Redirect href="/(auth)/welcome" />;
};

export default Page;
