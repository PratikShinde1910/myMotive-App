import { sessions } from "@/utils/sessions";
import { useUser } from "@clerk/clerk-expo";
import { useConversation } from "@elevenlabs/react-native";
import { Redirect, useLocalSearchParams } from "expo-router";
import { Button, ScrollView, Text, View } from "react-native";
import { red } from "react-native-reanimated/lib/typescript/Colors";

export default function SessionScreen() {
  const { user } = useUser();

  const { sessionId } = useLocalSearchParams();

  const session =
    sessions.find((s) => s.id === Number(sessionId)) ?? sessions[0];

  const conversation = useConversation({
    onConnect: () => console.log("Connected to conversation"),
    onDisconnect: () => console.log("Disconnected from conversation"),
    onMessage: (message) => console.log("Received message:", message),
    onError: (error) => console.error("Conversation error:", error),
    onModeChange: (mode) => console.log("Conversation mode changed:", mode),
    onStatusChange: (prop) =>
      console.log("Conversation status changed:", prop.status),
    onCanSendFeedbackChange: (prop) =>
      console.log("Can send feedback changed:", prop.canSendFeedback),
    onUnhandledClientToolCall: (params) =>
      console.log("Unhandled client tool call:", params),
  });

  const startConversation = async () => {
    try {
      await conversation.startSession({
        agentId: process.env.EXPO_PUBLIC_AGENT_ID,
        dynamicVariables: {
          user_name: user?.username ?? "Beto",
          session_title: session.title,
          session_description: session.description,
        },
      });
    } catch (e) {
      console.log(e);
    }
  };

  const endCoversation = async () => {
    try {
      await conversation.endSession();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <Text>Session Screen</Text>
      <Text style={{ fontSize: 32 }}>ID: {sessionId}</Text>
      <Button title="Start conversation" onPress={startConversation} />
      <Button title="End conversation" onPress={endCoversation} color={"red"} />
    </ScrollView>
  );
}
