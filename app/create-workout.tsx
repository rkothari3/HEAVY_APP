"use client"

import { useState } from "react"
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"
import { useWorkoutContext, type Workout } from "../context/WorkoutContext"
import { useRouter } from "expo-router"
import uuid from "react-native-uuid"
import { ChevronLeft, Plus, Save, X, Dumbbell, FileText } from "lucide-react-native"

export type Exercise = {
  name: string
  sets: number
  reps: number
  notes?: string // Added optional 'notes' property
}

export default function CreateWorkoutScreen() {
  const [name, setName] = useState("")
  const [exercises, setExercises] = useState<Exercise[]>([])
  const { addWorkout } = useWorkoutContext()
  const router = useRouter()

  // Add a new empty exercise
  const addExercise = () => {
    setExercises([...exercises, { name: "", sets: 0, reps: 0, notes: "" }])
  }

  // Update an exercise field
  const updateExercise = (index: number, field: keyof Exercise, value: string | number) => {
    const newExercises = [...exercises]
    newExercises[index] = { ...newExercises[index], [field]: value }
    setExercises(newExercises)
  }

  // Remove an exercise
  const removeExercise = (index: number) => {
    const newExercises = [...exercises]
    newExercises.splice(index, 1)
    setExercises(newExercises)
  }

  // Save the workout and go back
  const saveWorkout = () => {
    if (name && exercises.length > 0 && exercises.every((ex) => ex.name)) {
      const workout: Workout = {
        id: uuid.v4() as string, // Generate a unique ID
        name,
        exercises,
      }
      addWorkout(workout)
      router.back() // Go back to Workouts screen
    } else {
      alert("Please enter a workout name and at least one exercise.")
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CREATE WORKOUT</Text>
        <TouchableOpacity style={styles.saveButton} onPress={saveWorkout}>
          <Save size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
        keyboardVerticalOffset={100}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.formSection}>
            <Text style={styles.sectionLabel}>WORKOUT NAME</Text>
            <TextInput
              placeholder="e.g., Upper Body, Leg Day"
              placeholderTextColor="#666"
              value={name}
              onChangeText={setName}
              style={styles.nameInput}
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>EXERCISES</Text>
              <Text style={styles.exerciseCount}>{exercises.length} exercises</Text>
            </View>

            {exercises.map((exercise, index) => (
              <View key={index} style={styles.exerciseCard}>
                <View style={styles.exerciseHeader}>
                  <View style={styles.exerciseIconContainer}>
                    <Dumbbell size={16} color="#fff" />
                  </View>
                  <Text style={styles.exerciseNumber}>Exercise {index + 1}</Text>
                  <TouchableOpacity style={styles.removeButton} onPress={() => removeExercise(index)}>
                    <X size={16} color="#ff3a38" />
                  </TouchableOpacity>
                </View>

                <TextInput
                  placeholder="Exercise Name (e.g., Push-up)"
                  placeholderTextColor="#666"
                  value={exercise.name}
                  onChangeText={(text) => updateExercise(index, "name", text)}
                  style={styles.exerciseInput}
                />

                <View style={styles.exerciseDetails}>
                  <View style={styles.detailInput}>
                    <Text style={styles.detailLabel}>SETS</Text>
                    <TextInput
                      placeholder="0"
                      placeholderTextColor="#666"
                      value={exercise.sets > 0 ? exercise.sets.toString() : ""}
                      onChangeText={(text) => updateExercise(index, "sets", Number.parseInt(text) || 0)}
                      keyboardType="numeric"
                      style={styles.numberInput}
                    />
                  </View>

                  <View style={styles.detailInput}>
                    <Text style={styles.detailLabel}>REPS</Text>
                    <TextInput
                      placeholder="0"
                      placeholderTextColor="#666"
                      value={exercise.reps > 0 ? exercise.reps.toString() : ""}
                      onChangeText={(text) => updateExercise(index, "reps", Number.parseInt(text) || 0)}
                      keyboardType="numeric"
                      style={styles.numberInput}
                    />
                  </View>
                </View>

                <View style={styles.notesContainer}>
                  <View style={styles.notesHeader}>
                    <FileText size={14} color="#a0a0a0" />
                    <Text style={styles.notesLabel}>NOTES</Text>
                  </View>
                  <TextInput
                    placeholder="Add notes about this exercise..."
                    placeholderTextColor="#666"
                    value={exercise.notes}
                    onChangeText={(text) => updateExercise(index, "notes", text)}
                    style={styles.notesInput}
                    multiline={true}
                    numberOfLines={3}
                  />
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.addExerciseButton} onPress={addExercise}>
              <Plus size={18} color="#fff" />
              <Text style={styles.addExerciseText}>ADD EXERCISE</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.saveWorkoutButton} onPress={saveWorkout}>
            <Save size={20} color="#fff" />
            <Text style={styles.saveWorkoutText}>SAVE WORKOUT</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 1,
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2a2a2a",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  formSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ff3a38",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  exerciseCount: {
    fontSize: 14,
    color: "#a0a0a0",
  },
  nameInput: {
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 16,
    color: "#ffffff",
    fontSize: 16,
  },
  exerciseCard: {
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  exerciseHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  exerciseIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#ff3a38",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  exerciseNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    flex: 1,
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255, 58, 56, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  exerciseInput: {
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    padding: 12,
    color: "#ffffff",
    fontSize: 15,
    marginBottom: 12,
  },
  exerciseDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  detailInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#a0a0a0",
    marginBottom: 4,
  },
  numberInput: {
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    padding: 12,
    color: "#ffffff",
    fontSize: 15,
    textAlign: "center",
  },
  notesContainer: {
    marginTop: 4,
  },
  notesHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#a0a0a0",
    marginLeft: 4,
  },
  notesInput: {
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    padding: 12,
    color: "#ffffff",
    fontSize: 14,
    textAlignVertical: "top",
    minHeight: 80,
  },
  addExerciseButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 8,
  },
  addExerciseText: {
    color: "#ffffff",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 14,
  },
  saveWorkoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff3a38",
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 16,
  },
  saveWorkoutText: {
    color: "#ffffff",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 15,
  },
})

