import { Stack } from "expo-router"
import { WorkoutProvider } from "../context/WorkoutContext"

export default function RootLayout() {
  return (
    <WorkoutProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="create-workout" options={{ headerShown: false }} />
        <Stack.Screen name="workout-detail" options={{ headerShown: false }} />
        <Stack.Screen name="workout-session" options={{ headerShown: false }} />
        <Stack.Screen name="workout-complete" options={{ headerShown: false }} />
      </Stack>
    </WorkoutProvider>
  )
}

