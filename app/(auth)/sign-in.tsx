import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Alert,
    TouchableOpacity,
    Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./StyleSheet";

const SignInScreen = () => {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleChange = (name: string, value: string) => {
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = () => {
        const { email, password } = form;

        if (!email || !password) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs.");
            return;
        }

        console.log("Connexion avec :", form);
        Alert.alert("Succès", "Connexion réussie !");
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>MEOW</Text>

            <Text style={styles.subtitle}>Se connecter</Text>
            <Text style={styles.description}>
                Entrez votre email pour vous connecter à votre compte
            </Text>

            <TextInput
                placeholder="email@domain.com"
                value={form.email}
                onChangeText={(value) => handleChange("email", value)}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
            />

            <TextInput
                placeholder="mot_de_passe"
                value={form.password}
                onChangeText={(value) => handleChange("password", value)}
                secureTextEntry
                style={styles.input}
            />

            <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                <Text style={styles.buttonText}>Continuer</Text>
            </TouchableOpacity>

            <Text style={styles.orText}>ou</Text>

            <TouchableOpacity style={styles.socialButton}>

                <Text style={styles.socialButtonText}>Continuer avec Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton}>

                <Text style={styles.socialButtonText}>Continuer avec Apple</Text>
            </TouchableOpacity>

            <Text style={styles.footerText}>
                En cliquant sur continuer, vous acceptez la politique privée et les
                conditions générales.
            </Text>
        </SafeAreaView>
    );
};

export default SignInScreen;



