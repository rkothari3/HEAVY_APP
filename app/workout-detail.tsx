"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native"
import { useWorkoutContext } from "@/context/WorkoutContext"
import { useRouter, useLocalSearchParams } from "expo-router"
import { ChevronLeft, Dumbbell, Play, Trash2 } from "lucide-react-native"

export default function WorkoutDetailScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { workouts, addLog, removeWorkout } = useWorkoutContext()
  
  // Find the workout by ID
  const workout = workouts.find((w) => w.id === id)
  
  if (!workout) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ChevronLeft size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>WORKOUT DETAILS</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Workout not found</Text>
        </View>
      </SafeAreaView>
    )
  }

  // Start this workout (log it for today)
  const startWorkout = () => {
    const today = new Date().toISOString().split("T")[0]
    addLog({ date: today, workoutId: workout.id })
    Alert.alert("Workout Started", "This workout has been logged for today!")
  }

  // Delete this workout
  const handleDelete = () => {
    Alert.alert(
      "Delete Workout",
      "Are you sure you want to delete this workout? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            removeWorkout(workout.id)
            router.back()
          }
        }
      ]
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>WORKOUT DETAILS</Text>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Trash2 size={20} color="#ff3a38" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.workoutHeader}>
          <View style={styles.workoutIconContainer}>
            <Dumbbell size={28} color="#fff" />
          </View>
          <Text style={styles.workoutName}>{workout.name}</Text>
          <Text style={styles.exerciseCount}>{workout.exercises.length} exercises</Text>
        </View>

        <View style={styles.exercisesContainer}>
          <Text style={styles.sectionTitle}>EXERCISES</Text>
          
          {workout.exercises.map((exercise, index) => (
            <View key={index} style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <View style={styles.exerciseNumber}>
                  <Text style={styles.exerciseNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
              </View>
              <View style={styles.exerciseDetails}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>SETS</Text>
                  <Text style={styles.detailValue}>{exercise.sets}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>REPS</Text>
                  <Text style={styles.detailValue}>{exercise.reps}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.startButton} onPress={startWorkout}>
          <Play size={20} color="#fff" />
          <Text style={styles.startButtonText}>START WORKOUT</Text>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2a2a2a",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 58, 56, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  workoutHeader: {
    alignItems: "center",
    marginBottom: 30,
  },
  workoutIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#ff3a38",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  workoutName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 8,
  },
  exerciseCount: {
    fontSize: 16,
    color: "#a0a0a0",
  },
  exercisesContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ff3a38",
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  exerciseCard: {
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  exerciseHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  exerciseNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#ff3a38",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  exerciseNumberText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  exerciseDetails: {
    flexDirection: "row",
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    overflow: "hidden",
  },
  detailItem: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: "#1e1e1e",
  },
  detailLabel: {
    fontSize: 12,
    color: "#a0a0a0",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#2a2a2a",
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff3a38",
    borderRadius: 12,
    paddingVertical: 16,
  },
  startButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#ffffff",
  },
})
