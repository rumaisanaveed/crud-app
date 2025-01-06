import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        // always name the file index.js
        name="index"
        options={{ title: "Todo App" }}
      />
      <Stack.Screen name="/todos/[id]" options={{ title: "Todo App" }} />
    </Stack>
  );
}
