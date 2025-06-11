import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Button,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { createSocket, getSocket, waitForSocketConnection } from "@/services/socket";
import { useEffect } from "react";

const ChatDialogue = () => {

  const navigation = useNavigation();
  const { roomID, recipient, recipientId } = useLocalSearchParams<{
    roomID: string;
    recipient: string;
    recipientId: string;
  }>();

  const [messages, setMessages] = useState<
    { id: string; text: string; fromMe: boolean }[]
>([]);

  const [inputText, setInputText] = useState("");

  const sendMessage = async () => {
    const socket = getSocket();
    if (!inputText.trim()) return;

    if (!inputText.trim()) return;
    
    

    if (!socket || !socket.connected) {
      console.warn("Socket pas connecté");
      return;
    }

    socket.emit("private_message", {
      recipientId,
      message: inputText,
    });

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: inputText,
        fromMe: true,
      },
    ]);
    setInputText("");
  };

  useEffect(() => {
    const socket = getSocket();

    if (!socket || !socket.connected) {
      console.warn("Socket pas la");
      return;
    }

    const handler = ({ sender, message }: { sender: string; message: string }) => {
      console.log("Message reçu", sender, message);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: message,
          fromMe: false,
        },
      ]);
    };


    socket.on("receive_message", handler);

    return () => {
      socket.off("receive_message", handler);
    };
  }, []);
  

  const renderItem = ({ item }: any) => (
    <View
      className={`${item.fromMe ? 'self-end bg-black text-white' : 'self-start bg-gray-100 text-black'} px-3 py-2 rounded-2xl my-1 mx-2 max-w-[80%]`}
    >
      <Text className={item.fromMe ? "text-white" : "text-black"}>{item.text}</Text>
    </View>
  );
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <View className="px-9 py-9 border-b border-gray-300 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text>{"←"}</Text> 
        </TouchableOpacity>
        <Text className="font-bold text-base">{recipient}</Text>
        <Text className="text-xs text-gray-500">Active 1min ago</Text>
      </View>

      
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 10 }}
      />

      <View className="flex-row items-center p-2 border-t border-gray-300">
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Message..."
          className="flex-1 bg-gray-100 rounded-2xl px-4 py-2"/>
        <TouchableOpacity onPress={sendMessage} className="ml-8">
          <Text className="text-blue-500 font-bold">Envoyer</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatDialogue;
