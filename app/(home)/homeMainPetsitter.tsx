import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useAuthContext } from "@/context/AuthContext";
import { api, logout } from "@/services/api"; // Assuming this is the correct path to your API config
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode"; // You may need to install this package
import { AxiosError } from "axios";

const HomePetsitterScreen = () => {
  const { user, setUser } = useAuthContext();
  const [tokenInfo, setTokenInfo] = useState<any>(null);

  const handleLogout = async () => {
    try {
      const success = await logout();
      console.log(success);
      if (success) {
        setUser(null);
      } else {
        Alert.alert("Error", "Failed to logout");
      }
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "An error occurred during logout");
    }
  };

  const getUserDetails = async () => {
    try {
      const response = await api.get("/User/profile");
      Alert.alert("User Details", JSON.stringify(response.data, null, 2));
    } catch (error: any) {
      console.error("Error fetching user details:", error.data);
      Alert.alert(
        "Error",
        "Failed to fetch user details. Token might have been refreshed automatically."
      );
      if (error instanceof AxiosError) {
        console.error("Error fetching user details:");
        Alert.alert(
          "Error",
          "Failed to fetch user details. Token might have been refreshed automatically."
        );
      }
    }
  };
  const refresh = async () => {
    try {
      const response = await api.post("/authRoutes/refresh");
      Alert.alert("User Details", JSON.stringify(response.data, null, 2));
    } catch (error: any) {
      console.error("Error fetching user details:", error.message);
      Alert.alert(
        "Error",
        "Failed to fetch user details. Token might have been refreshed automatically."
      );
    }
  };

  const checkTokenExpiration = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Alert.alert("No Token", "No access token found");
        return;
      }

      // Decode JWT to get expiration time
      const decoded = jwtDecode(token);

      if (decoded && decoded.exp) {
        const expirationDate = new Date(decoded.exp * 1000);
        const now = new Date();
        const timeRemaining = expirationDate.getTime() - now.getTime();
        const minutesRemaining = Math.floor(timeRemaining / (1000 * 60));

        setTokenInfo({
          expires: expirationDate.toLocaleString(),
          timeRemaining: `${minutesRemaining} minutes remaining`,
        });

        Alert.alert(
          "Token Info",
          `Expires: ${expirationDate.toLocaleString()}\n${minutesRemaining} minutes remaining`
        );
      } else {
        Alert.alert("Token Info", "Could not determine token expiration");
      }
    } catch (error) {
      console.error("Error checking token:", error);
      Alert.alert("Error", "Failed to decode token");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Petsitter Screen</Text>

      {user && (
        <Text style={styles.welcomeText}>
          Welcome, {user.username || user.email || "User"}
        </Text>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={getUserDetails}>
          <Text style={styles.buttonText}>View User Details</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={checkTokenExpiration}>
          <Text style={styles.buttonText}>Check Token Expiration</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={refresh}>
          <Text style={styles.buttonText}>refresg</Text>
        </TouchableOpacity>
      </View>

      {tokenInfo && (
        <View style={styles.tokenInfoContainer}>
          <Text style={styles.tokenInfoText}>
            Token Expires: {tokenInfo.expires}
          </Text>
          <Text style={styles.tokenInfoText}>{tokenInfo.timeRemaining}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 30,
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#4e9bde",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  tokenInfoContainer: {
    padding: 15,
    backgroundColor: "#e8e8e8",
    borderRadius: 10,
    width: "100%",
  },
  tokenInfoText: {
    fontSize: 14,
    marginBottom: 5,
  },
});

export default HomePetsitterScreen;
