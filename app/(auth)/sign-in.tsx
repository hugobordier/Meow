import React, { useState } from "react";
import { View, Text, Button } from "react-native";
import { icons, images } from "@/constants";
import { SafeAreaView } from "react-native-safe-area-context";

const SignInScreen = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  return (
    <SafeAreaView className="flex-1 justify-center items-center">
      <Text>Sign In</Text>

      <Button title="Sign In" onPress={() => {}} />
    </SafeAreaView>
  );
};

export default SignInScreen;
