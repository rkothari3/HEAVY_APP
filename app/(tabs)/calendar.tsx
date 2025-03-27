"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Alert } from "react-native"
import { Calendar } from "react-native-calendars"
import { useWorkoutContext } from "@/context/WorkoutContext"
import { ChevronLeft, Dumbbell } from "lucide-react-native"
import { useRouter } from "expo-router"

export default function CalendarScreen() {
  const router = useRouter()
  const { logs, workouts, removeWorkout } = useWorkoutContext()
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState("")
  const [setLogs] = useState<any>([])

  // Set today as the default selected date
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    setSelectedDate(today)
  }, [])

  // Update month name when calendar changes
  const onMonthChange = (month: { dateString: string }) => {
    const date = new Date(month.dateString)
    setCurrentMonth(date.toLocaleString("default", { month: "long", year: "numeric" }))
  }

  // Mark dates with logs
  const markedDates = logs.reduce(
    (acc, log) => {
      acc[log.date] = {
        marked: true,
        dotColor: "#ff3a38",
        selected: log.date === selectedDate,
        selectedColor: log.date === selectedDate ? "rgba(255, 58, 56, 0.2)" : undefined,
      }
      return acc
    },
    {} as { [key: string]: any },
  )

  // Add selected date styling if it's not already in markedDates
  if (selectedDate && !markedDates[selectedDate]) {
    markedDates[selectedDate] = {
      selected: true,
      selectedColor: "rgba(255, 58, 56, 0.2)",
    }
  }

  // Get logs for the selected date
  const selectedLogs = selectedDate ? logs.filter((log) => log.date === selectedDate) : []

  // Format date for display
  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>WORKOUT CALENDAR</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.calendarContainer}>
          <Calendar
            theme={{
              backgroundColor: "#121212",
              calendarBackground: "#121212",
              textSectionTitleColor: "#ffffff",
              selectedDayBackgroundColor: "#ff3a38",
              selectedDayTextColor: "#ffffff",
              todayTextColor: "#ff3a38",
              dayTextColor: "#ffffff",
              textDisabledColor: "#444444",
              dotColor: "#ff3a38",
              selectedDotColor: "#ffffff",
              arrowColor: "#ff3a38",
              monthTextColor: "#ffffff",
              indicatorColor: "#ff3a38",
              textDayFontWeight: "400",
              textMonthFontWeight: "700",
              textDayHeaderFontWeight: "600",
              textDayFontSize: 15,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 13,
            }}
            markedDates={markedDates}
            onDayPress={(day: { dateString: string }) => setSelectedDate(day.dateString)}
            onMonthChange={onMonthChange}
            enableSwipeMonths={true}
            hideExtraDays={true}
          />
        </View>

        {selectedDate && (
          <View style={styles.logsContainer}>
            <Text style={styles.dateHeader}>{formatDisplayDate(selectedDate)}</Text>

            {selectedLogs.length > 0 ? (
              <View style={styles.logsList}>
                {selectedLogs.map((log, index) => {
                  const workout = workouts.find((w) => w.id === log.workoutId)
                  return (
                    <View key={index} style={styles.logItem}>
                      <View style={styles.logIconContainer}>
                        <Dumbbell size={20} color="#fff" />
                      </View>
                      <View style={styles.logInfo}>
                        <Text style={styles.logTitle}>{workout ? workout.name : "Unknown Workout"}</Text>
                        <Text style={styles.logTime}>Completed</Text>
                      </View>
                    </View>
                  )
                })}
              </View>
            ) : (
              <View style={styles.emptyLogsContainer}>
                <Text style={styles.emptyLogsText}>No workouts logged for this day</Text>
                <TouchableOpacity style={styles.addWorkoutButton} onPress={() => router.push("/")}>
                  <Text style={styles.addWorkoutButtonText}>GO TO WORKOUTS</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>
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
  content: {
    flex: 1,
  },
  calendarContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  dateHeader: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 16,
  },
  logsContainer: {
    padding: 20,
  },
  logsList: {
    marginTop: 8,
  },
  logItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  logIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ff3a38",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  logInfo: {
    flex: 1,
  },
  logTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
  },
  logTime: {
    fontSize: 13,
    color: "#a0a0a0",
  },
  emptyLogsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },
  emptyLogsText: {
    fontSize: 16,
    color: "#a0a0a0",
    marginBottom: 16,
  },
  addWorkoutButton: {
    backgroundColor: "#2a2a2a",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addWorkoutButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
})

