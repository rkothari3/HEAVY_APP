"use client"
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Alert } from "react-native"
import { useWorkoutContext } from "@/context/WorkoutContext"
import { useRouter } from "expo-router"
import { Plus, Dumbbell, Calendar, CheckCircle, Trash2 } from "lucide-react-native"

export default function WorkoutScreen() {
  const router = useRouter()
  const { workouts, addLog, removeWorkout } = useWorkoutContext()

  // Log a workout for today
  const logWorkout = (workoutId: string) => {
    const today = new Date().toISOString().split("T")[0]
    addLog({ date: today, workoutId })
  }

  // Update the renderWorkoutItem function to make the card clickable and add a delete button
  const renderWorkoutItem = ({ item }: { item: { id: string; name: string } }) => (
    <View style={styles.workoutCard}>
      <TouchableOpacity 
        style={styles.workoutCardContent}
        onPress={() => router.push({ pathname: "../workout-detail", params: { id: item.id } })}
      >
        <View style={styles.workoutIconContainer}>
          <Dumbbell size={24} color="#fff" />
        </View>
        <View style={styles.workoutInfo}>
          <Text style={styles.workoutName}>{item.name}</Text>
          <Text style={styles.workoutSubtext}>Tap to view details</Text>
        </View>
        <TouchableOpacity 
          style={styles.logButton} 
          onPress={() => logWorkout(item.id)}
        >
          <CheckCircle size={22} color="#fff" />
        </TouchableOpacity>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => {
          Alert.alert(
            "Delete Workout",
            "Are you sure you want to delete this workout?",
            [
              { text: "Cancel", style: "cancel" },
              { 
                text: "Delete", 
                style: "destructive",
                onPress: () => removeWorkout(item.id)
              }
            ]
          )
        }}
      >
        <Trash2 size={18} color="#ff3a38" />
        <Text style={styles.deleteButtonText}>DELETE</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>MY WORKOUTS</Text>
        <TouchableOpacity style={styles.calendarButton} onPress={() => router.push("/calendar")}>
          <Calendar size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.createButton} onPress={() => router.push("/create-workout")}>
          <Plus size={20} color="#fff" />
          <Text style={styles.createButtonText}>CREATE NEW WORKOUT</Text>
        </TouchableOpacity>

        <FlatList
          data={workouts}
          keyExtractor={(item) => item.id}
          renderItem={renderWorkoutItem}
          contentContainerStyle={styles.workoutList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No workouts yet.</Text>
              <Text style={styles.emptySubtext}>Create one to get started!</Text>
            </View>
          }
        />
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
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 1,
  },
  calendarButton: {
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
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff3a38",
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 24,
  },
  createButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 15,
    letterSpacing: 0.5,
  },
  workoutList: {
    paddingBottom: 20,
  },
  workoutCard: {
    backgroundColor: "#1e1e1e",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  workoutCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  workoutIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ff3a38",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
  },
  workoutSubtext: {
    fontSize: 13,
    color: "#a0a0a0",
  },
  logButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2a2a2a",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 15,
    color: "#a0a0a0",
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 58, 56, 0.1)',
    paddingVertical: 8,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  deleteButtonText: {
    color: '#ff3a38',
    fontWeight: '600',
    fontSize: 12,
    marginLeft: 4,
  },
})
