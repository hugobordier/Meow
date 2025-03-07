import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from "react-native";
import { io } from "socket.io-client";

const socket = io("https://meowback-production.up.railway.app");

const ChatScreen = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ user: string; text: string }[]>(
    []
  );
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Connecté au serveur WebSocket");
    });

    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleJoin = () => {
    if (username.trim() !== "") {
      socket.emit("join", username);
      setConnected(true);
    }
  };

  const sendMessage = () => {
    if (message.trim() !== "") {
      socket.emit("message", { user: username, text: message });
      setMessage("");
    }
  };

  return (
    <View style={styles.container}>
      {!connected ? (
        <>
          <Text style={styles.label}>Entrez votre pseudo :</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Pseudo"
          />
          <Button title="Rejoindre" onPress={handleJoin} />
        </>
      ) : (
        <>
          <FlatList
            data={messages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Text style={styles.message}>
                <Text style={{ fontWeight: "bold" }}>{item.user}: </Text>
                {item.text}
              </Text>
            )}
          />
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Message"
          />
          <Button title="Envoyer" onPress={sendMessage} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 18, marginBottom: 10 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
  message: { fontSize: 16, marginVertical: 5 },
});

export default ChatScreen;
