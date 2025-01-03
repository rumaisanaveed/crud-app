import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        // always name the file index.js
        name="index"
        options={{ headerShown: false, title: "Todo App" }}
      />
    </Stack>
  );
}
