import React from "react";
import { View, Text, Button } from "react-native";

const WelcomeScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome</Text>
      <Button title="Go to Sign In" onPress={() => {}} />
      <Button title="Go to Sign Up" onPress={() => {}} />
    </View>
  );
};

export default WelcomeScreen;
