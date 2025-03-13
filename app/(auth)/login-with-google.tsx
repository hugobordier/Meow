import { View, Text, TouchableNativeFeedback, StyleSheet, Button } from 'react-native';
import React, { useEffect } from 'react';
import * as Google from 'expo-auth-session/providers/google';

const webClientId = process.env.EXPO_PUBLIC_WEB_CLIENT_ID;
const androidClientId = process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID;
const iosClientId = process.env.EXPO_PUBLIC_IOS_CLIENT_ID;

const LoginWithGoogle = () => {
  console.log('user on Google login page');
  
  const config = {
    webClientId,
    iosClientId,
    androidClientId,
  };

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest(config);

  const handleTokenResponse = () => {
    if (response?.type === 'success') {
      const { authentication } = response;
      const token = authentication?.accessToken;
      console.log('Token:', token);
    }
  }

  useEffect(() => {
    handleTokenResponse();
  }, [response]);

  return (
    <View style={ styles.container }>
      <TouchableNativeFeedback style={ styles.wrapper } >
        <Button title='Se connecter avec Google' onPress={() => promptAsync()}/>
      </TouchableNativeFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    backgroundColor: 'white',
  },
});

export default LoginWithGoogle;