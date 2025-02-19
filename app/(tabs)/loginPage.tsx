import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';

const LoginPage = () => {
  const [email, setEmail] = useState('test@mail.fr');
  const [mdp, setMdp] = useState('motdepasses');
  const [response, setResponse] = useState<any>(null);

  const handleLogin = async () => {
    const url = 'https://meowback-production.up.railway.app/authRoutes/login'; // API de test

    const data = {
      email: email,
      mdp: mdp,
    };
    console.log(data);
    

    try {
      const res = await fetch(url, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body:JSON.stringify(data),
      });

      const result = await res.json();
      console.log(result)
      setResponse(result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={mdp}
        onChangeText={(text) => setMdp(text)}
        secureTextEntry
      />
      <Button title="Se connecter" onPress={handleLogin} />
      {response && (
        <Text style={styles.responseText}>
          {JSON.stringify(response, null, 2)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000', // Fond noir pour le texte blanc
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#fff', // Texte blanc
  },
  input: {
    width: '100%',
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: '#fff', // Bordure blanche
    borderRadius: 5,
    color: '#fff', // Texte d'entrée blanc
  },
  responseText: {
    marginTop: 20,
    fontSize: 14,
    color: '#fff', // Texte de la réponse en blanc
  },
});

export default LoginPage;
