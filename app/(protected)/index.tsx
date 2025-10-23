import { sessions } from "@/utils/sessions";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text } from "react-native";

export default function Index() {
  const router = useRouter();
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      {sessions.map((session) => (
        <Pressable
          key={session.id}
          style={{ borderWidth: 1, padding: 16, marginVertical: 6 }}
          onPress={() =>
            router.navigate({
              pathname: "/session",
              params: { sessionId: session.id },
            })
          }
        >
          <Text>{session.title}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
