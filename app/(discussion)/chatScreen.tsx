import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from "react-native";
import { getSocket } from "@/services/socket";



const ChatScreen = () => {
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("");
  const [messages, setMessages] = useState<{ user: string; text: string }[]>(
    []
  );

  useEffect(() => {
    const socket = getSocket();
    if (!socket) {
      console.warn("⚠️ Socket non disponible (non connecté)");
      return;
    }

    socket.on("connect", () => { //"on" signifie ecoute un event
      console.log("✅ Connecté au serveur WebSocket");
    });

    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("online-users", (userList)=> {
      console.log("User online:", userList);
    });

    //For private messages
    socket.on("receive_message", ({ sender, message }) => {
      console.log(`Msg received from ${sender}: ${message}`);

      setMessages((prev) => [
        ...prev,
        {user: `[privé] ${sender}`, text: message},
      ]);
    });
  }, []);

  const sendMessage = () => {
    const socket = getSocket();
    if (!socket){
      console.warn("impossible d'envoyer: socket non connecté");
      return;
    }
    if (message.trim() !== "" && recipient.trim() !== "") {
      socket.emit("private_message", { recipientId: recipient, message: message });
      setMessage("");
    }
  };

  return (
    <View className="mt-20">
      <Text>
        Activité
      </Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  label: { fontSize: 18, marginBottom: 10 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
  message: { fontSize: 16, marginVertical: 5 },
});

export default ChatScreen;
