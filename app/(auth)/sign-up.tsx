import React from "react";
import { TextInput, View, Text, Button } from "react-native";

const SignUpScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Sign Up</Text>
      <TextInput
        placeholder="Email"
        style={{ borderWidth: 1, width: 200, marginVertical: 10 }}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={{ borderWidth: 1, width: 200, marginVertical: 10 }}
      />
      <TextInput
        placeholder="Confirm Password"
        secureTextEntry
        style={{ borderWidth: 1, width: 200, marginVertical: 10 }}
      />
      <Button title="Sign Up" onPress={() => {}} />
    </View>
  );
};

export default SignUpScreen;
