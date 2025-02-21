import React from "react";
import { View, Text, TextInput, Button } from "react-native";

const SignInScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Sign In</Text>
      <TextInput
        placeholder="Email"
        style={{ borderWidth: 1, width: 200, marginVertical: 10 }}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={{ borderWidth: 1, width: 200, marginVertical: 10 }}
      />
      <Button title="Sign In" onPress={() => {}} />
    </View>
  );
};

export default SignInScreen;
