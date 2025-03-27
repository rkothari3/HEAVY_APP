"use client"

import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { useWorkoutContext } from "@/context/WorkoutContext"
import { CheckCircle, Home, Calendar } from "lucide-react-native"

export default function WorkoutCompleteScreen() {
  const router = useRouter()
  const { workoutId } = useLocalSearchParams<{ workoutId: string }>()
  const { workouts } = useWorkoutContext()

  const workout = workouts.find((w) => w.id === workoutId)

  const goToHome = () => {
    router.push("/")
  }

  const goToCalendar = () => {
    router.push("/calendar")
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.content}>
        <View style={styles.successIcon}>
          <CheckCircle size={80} color="#ff3a38" />
        </View>

        <Text style={styles.title}>Workout Complete!</Text>

        <Text style={styles.workoutName}>{workout ? workout.name : "Your workout"} has been logged</Text>

        <Text style={styles.message}>
          Great job! You've completed your workout and it has been added to your calendar.
        </Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{workout ? workout.exercises.length : 0}</Text>
            <Text style={styles.statLabel}>Exercises</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {workout ? workout.exercises.reduce((total, ex) => total + ex.sets, 0) : 0}
            </Text>
            <Text style={styles.statLabel}>Total Sets</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={goToCalendar}>
          <Calendar size={20} color="#fff" />
          <Text style={styles.buttonText}>VIEW CALENDAR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={goToHome}>
          <Home size={20} color="#fff" />
          <Text style={styles.buttonText}>GO TO HOME</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 58, 56, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 12,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ff3a38",
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: "#a0a0a0",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#1e1e1e",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#a0a0a0",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#2a2a2a",
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#2a2a2a",
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 4,
  },
  primaryButton: {
    backgroundColor: "#ff3a38",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 8,
  },
})

