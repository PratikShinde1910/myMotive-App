import { Pressable, PressableProps, StyleSheet, Text } from "react-native";

export default function Button({ children, ...props}: PressableProps) {
    return (
        <Pressable>
            {typeof children === "string" ? <Text>{children} </Text>: children }
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "black",
    }
})