import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="pokemon/[id]" options={{ headerShown: false, animation: 'slide_from_right' }} />
    </Stack>
  );
}
