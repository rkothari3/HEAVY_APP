"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  TextInput,
} from "react-native"
import { useWorkoutContext } from "@/context/WorkoutContext"
import { useRouter, useLocalSearchParams } from "expo-router"
import { ChevronLeft, ChevronRight, X, FileText, Edit2, Save, CheckCircle } from "lucide-react-native"

export default function WorkoutSessionScreen() {
  const router = useRouter()
  const { workoutId } = useLocalSearchParams<{ workoutId: string }>()
  const { workouts, addLog } = useWorkoutContext()

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [exerciseData, setExerciseData] = useState<
    {
      exerciseIndex: number
      sets: { reps: number; weight: number }[]
      notes?: string
    }[]
  >([])
  const [editingNotes, setEditingNotes] = useState(false)
  const [notes, setNotes] = useState("")

  // Find the workout by ID
  const workout = workouts.find((w) => w.id === workoutId)

  const [initialData, setInitialData] = useState<
    | {
        exerciseIndex: number
        sets: { reps: number; weight: number }[]
        notes?: string
      }[]
    | null
  >(null)

  useEffect(() => {
    if (workout) {
      const data = workout.exercises.map((exercise, index) => ({
        exerciseIndex: index,
        sets: Array(exercise.sets).fill({ reps: 0, weight: 0 }),
        notes: exercise.notes || "",
      }))
      setInitialData(data)
      setExerciseData(data)
    }
  }, [workout])

  useEffect(() => {
    if (exerciseData[currentExerciseIndex]) {
      setNotes(exerciseData[currentExerciseIndex].notes || "")
    }
  }, [currentExerciseIndex, exerciseData])

  if (!workout) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ChevronLeft size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>WORKOUT SESSION</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Workout not found</Text>
        </View>
      </SafeAreaView>
    )
  }

  const currentExercise = workout.exercises[currentExerciseIndex]
  const isFirstExercise = currentExerciseIndex === 0
  const isLastExercise = currentExerciseIndex === workout.exercises.length - 1

  // Initialize exercise data
  // useEffect(() => {
  //   if (workout) {
  //     const initialData = workout.exercises.map((exercise, index) => ({
  //       exerciseIndex: index,
  //       sets: Array(exercise.sets).fill({ reps: 0, weight: 0 }),
  //       notes: exercise.notes || "",
  //     }))
  //     setExerciseData(initialData)
  //   }
  // }, [workout])

  // useEffect(() => {
  //   if (exerciseData[currentExerciseIndex]) {
  //     setNotes(exerciseData[currentExerciseIndex].notes || "")
  //   }
  // }, [currentExerciseIndex, exerciseData])

  // Update set data
  const updateSetData = (setIndex: number, field: "reps" | "weight", value: string) => {
    const newExerciseData = [...exerciseData]
    const currentData = { ...newExerciseData[currentExerciseIndex] }

    currentData.sets = [...currentData.sets]
    currentData.sets[setIndex] = {
      ...currentData.sets[setIndex],
      [field]: Number(value),
    }

    newExerciseData[currentExerciseIndex] = currentData
    setExerciseData(newExerciseData)
  }

  // Update notes
  const updateNotes = () => {
    const newExerciseData = [...exerciseData]
    newExerciseData[currentExerciseIndex] = {
      ...newExerciseData[currentExerciseIndex],
      notes: notes,
    }
    setExerciseData(newExerciseData)
    setEditingNotes(false)
  }

  // Check if current exercise is complete
  const isExerciseComplete = () => {
    const currentData = exerciseData[currentExerciseIndex]
    if (!currentData) return false

    return currentData.sets.every((set) => set.reps > 0 && set.weight > 0)
  }

  // Navigate to next exercise
  const goToNextExercise = () => {
    if (!isExerciseComplete()) {
      Alert.alert(
        "Incomplete Exercise",
        "You haven't completed all sets for this exercise. Do you want to continue anyway?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Continue",
            onPress: () => {
              if (currentExerciseIndex < workout.exercises.length - 1) {
                setCurrentExerciseIndex(currentExerciseIndex + 1)
              }
            },
          },
        ],
      )
    } else {
      if (currentExerciseIndex < workout.exercises.length - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1)
      }
    }
  }

  // Navigate to previous exercise
  const goToPreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1)
    }
  }

  // Exit workout
  const exitWorkout = () => {
    Alert.alert("Exit Workout", "Are you sure you want to exit? Your progress will be lost.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Exit",
        style: "destructive",
        onPress: () => router.back(),
      },
    ])
  }

  // Complete workout
  const completeWorkout = () => {
    const today = new Date().toISOString().split("T")[0]
    addLog({
      date: today,
      workoutId: workout.id,
      exerciseData: exerciseData,
    })

    router.push({
      pathname: "/workout-complete",
      params: { workoutId: workout.id },
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={exitWorkout}>
          <X size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{workout.name.toUpperCase()}</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.progressBar}>
        <View
          style={[styles.progressFill, { width: `${((currentExerciseIndex + 1) / workout.exercises.length) * 100}%` }]}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.exerciseHeader}>
          <Text style={styles.exerciseCount}>
            EXERCISE {currentExerciseIndex + 1}/{workout.exercises.length}
          </Text>
          <Text style={styles.exerciseName}>{currentExercise.name}</Text>
        </View>

        <View style={styles.setsContainer}>
          <Text style={styles.sectionTitle}>SETS</Text>

          {exerciseData[currentExerciseIndex]?.sets.map((set, index) => (
            <View key={index} style={styles.setRow}>
              <View style={styles.setNumber}>
                <Text style={styles.setNumberText}>{index + 1}</Text>
              </View>

              <View style={styles.setInputContainer}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>REPS</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={set.reps > 0 ? set.reps.toString() : ""}
                    onChangeText={(value) => updateSetData(index, "reps", value)}
                    placeholder="0"
                    placeholderTextColor="#666"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>WEIGHT</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={set.weight > 0 ? set.weight.toString() : ""}
                    onChangeText={(value) => updateSetData(index, "weight", value)}
                    placeholder="0"
                    placeholderTextColor="#666"
                  />
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.notesSection}>
          <View style={styles.notesHeader}>
            <View style={styles.notesHeaderLeft}>
              <FileText size={16} color="#a0a0a0" />
              <Text style={styles.notesTitle}>NOTES</Text>
            </View>

            <TouchableOpacity style={styles.editButton} onPress={() => setEditingNotes(!editingNotes)}>
              {editingNotes ? <Save size={16} color="#ff3a38" /> : <Edit2 size={16} color="#a0a0a0" />}
            </TouchableOpacity>
          </View>

          {editingNotes ? (
            <View style={styles.notesEditContainer}>
              <TextInput
                style={styles.notesInput}
                multiline
                value={notes}
                onChangeText={setNotes}
                placeholder="Add notes about this exercise..."
                placeholderTextColor="#666"
              />
              <TouchableOpacity style={styles.saveNotesButton} onPress={updateNotes}>
                <Text style={styles.saveNotesText}>SAVE NOTES</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.notesText}>{notes || "No notes for this exercise."}</Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {!isFirstExercise && (
          <TouchableOpacity style={styles.navigationButton} onPress={goToPreviousExercise}>
            <ChevronLeft size={20} color="#fff" />
            <Text style={styles.navigationButtonText}>PREVIOUS</Text>
          </TouchableOpacity>
        )}

        {isLastExercise ? (
          <TouchableOpacity style={[styles.navigationButton, styles.completeButton]} onPress={completeWorkout}>
            <CheckCircle size={20} color="#fff" />
            <Text style={styles.navigationButtonText}>FINISH WORKOUT</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.navigationButton, styles.nextButton]} onPress={goToNextExercise}>
            <Text style={styles.navigationButtonText}>NEXT</Text>
            <ChevronRight size={20} color="#fff" />
          </TouchableOpacity>
        )}
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
  progressBar: {
    height: 4,
    backgroundColor: "#2a2a2a",
    width: "100%",
  },
  progressFill: {
    height: 4,
    backgroundColor: "#ff3a38",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  exerciseHeader: {
    marginBottom: 24,
  },
  exerciseCount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ff3a38",
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
  },
  setsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#a0a0a0",
    marginBottom: 16,
  },
  setRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  setNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ff3a38",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  setNumberText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
  setInputContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 12,
  },
  inputGroup: {
    flex: 1,
    alignItems: "center",
  },
  inputLabel: {
    fontSize: 12,
    color: "#a0a0a0",
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    padding: 10,
    width: "80%",
    textAlign: "center",
    color: "#ffffff",
    fontSize: 16,
  },
  notesSection: {
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  notesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  notesHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#a0a0a0",
    marginLeft: 8,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2a2a2a",
    justifyContent: "center",
    alignItems: "center",
  },
  notesText: {
    fontSize: 14,
    color: "#ffffff",
    lineHeight: 20,
  },
  notesEditContainer: {
    marginTop: 8,
  },
  notesInput: {
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    padding: 12,
    color: "#ffffff",
    fontSize: 14,
    textAlignVertical: "top",
    minHeight: 100,
    marginBottom: 12,
  },
  saveNotesButton: {
    backgroundColor: "#ff3a38",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  saveNotesText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#2a2a2a",
  },
  navigationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flex: 1,
    marginHorizontal: 4,
  },
  navigationButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
    marginHorizontal: 4,
  },
  nextButton: {
    backgroundColor: "#ff3a38",
  },
  completeButton: {
    backgroundColor: "#ff3a38",
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

