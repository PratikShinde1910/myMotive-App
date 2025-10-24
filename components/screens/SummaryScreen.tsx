import { ConversationResponse } from "@/utils/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Gradient } from "../gradient";

export default function SummaryScreen() {
  const { conversationId } = useLocalSearchParams();
  const [conversation, setConversation] = useState<ConversationResponse>();
  const router = useRouter();

  console.log("conv id", conversationId);

  useEffect(() => {
    getSummary();
  }, []);

  async function getSummary() {
    try {
      if (!conversationId) return;

      const url = `${process.env.EXPO_PUBLIC_BASE_URL}/api/conversations?conversation_id=${conversationId}`;
      console.log("📡 Fetching summary from:", url);

      const response = await fetch(url);
      const text = await response.text();
      console.log("🧾 Raw summary response:", text);

      const data: { conversation: ConversationResponse } = JSON.parse(text);
      setConversation(data.conversation);
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  }

  return (
    <>
      <Gradient position="bottom" isSpeaking={false} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {conversation?.status !== "done" && (
          <View style={{ gap: 16, paddingBottom: 16 }}>
            <Text style={styles.title}>We are processing your call...</Text>
            <Text style={styles.subtitle}>This may take a few minutes.</Text>
            <Text style={styles.subtitle}>
              Current status: {conversation?.status}
            </Text>
          </View>
        )}

        {conversation?.status === "done" && (
          <View style={{ gap: 16, paddingBottom: 16 }}>
            <Text style={styles.caption}>{conversationId}</Text>
            <Text style={styles.title}>
              {conversation?.analysis?.call_summary_title}
            </Text>

            <Text style={styles.subtitle}>
              {conversation?.analysis?.transcript_summary.trim()}
            </Text>

            <Text style={styles.title}>Stats</Text>

            <Text style={styles.subtitle}>
              {conversation?.metadata?.call_duration_secs} seconds
            </Text>

            <Text style={styles.subtitle}>
              {conversation?.metadata?.cost} tokens
            </Text>

            <Text style={styles.subtitle}>
              {new Date(
                conversation?.metadata.start_time_unix_secs! * 1000
              ).toLocaleString()}
            </Text>

            <Text style={styles.title}>Transcript</Text>

            <Text style={styles.subtitle}>
              {conversation?.transcript.map((t) => t.message).join("\n")}
            </Text>
          </View>
        )}
        {/* <View style={{ flexDirection: "row", gap: 16, marginTop: 16 }}>
          <TouchableOpacity style={styles.button} onPress={getSummary}>
            <Text style={styles.buttonText}>Refresh</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.dismissAll()}
          >
            <Text style={styles.buttonText}>Save and Continue</Text>
          </TouchableOpacity>
        </View> */}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
  },
  caption: {
    fontSize: 12,
    color: "gray",
  },
  button: {
    flex: 1,
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
