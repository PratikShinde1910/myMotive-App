import SignOutButton from "@/components/clerk/SignOutButton";
import { Gradient } from "@/components/gradient";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <>
        <Gradient position="top" isSpeaking={false}/>
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Home Screen</Text>
      <SignOutButton />
    </View>
    </>
  );
}
