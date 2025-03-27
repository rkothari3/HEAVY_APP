"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Define types
export interface Exercise {
  name: string
  sets: number
  reps: number
  // Added optional notes property to support exercise notes
  notes?: string
}

export interface Workout {
  id: string
  name: string
  exercises: Exercise[]
}

export interface WorkoutLog {
  date: string
  workoutId: string
  // Added optional exerciseData to support logging details
  exerciseData?: {
    exerciseIndex: number
    sets: { reps: number; weight: number }[]
    notes?: string
  }[]
}

interface WorkoutContextType {
  workouts: Workout[]
  logs: WorkoutLog[]
  addWorkout: (workout: Workout) => void
  removeWorkout: (workoutId: string) => void
  addLog: (log: WorkoutLog) => void
  setLogs: (logs: WorkoutLog[] | ((prevLogs: WorkoutLog[]) => WorkoutLog[])) => void // Update type
}

// Create context
const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined)

// Provider component
export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [logs, setLogs] = useState<WorkoutLog[]>([])

  // Load data from storage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const workoutsData = await AsyncStorage.getItem("workouts")
        const logsData = await AsyncStorage.getItem("logs")

        if (workoutsData) {
          setWorkouts(JSON.parse(workoutsData))
        }

        if (logsData) {
          setLogs(JSON.parse(logsData))
        }
      } catch (error) {
        console.error("Error loading data:", error)
      }
    }

    loadData()
  }, [])

  // Save data to storage whenever it changes
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem("workouts", JSON.stringify(workouts))
        await AsyncStorage.setItem("logs", JSON.stringify(logs))
      } catch (error) {
        console.error("Error saving data:", error)
      }
    }

    saveData()
  }, [workouts, logs])

  // Add a new workout
  const addWorkout = (workout: Workout) => {
    setWorkouts([...workouts, workout])
  }

  // Remove a workout
  const removeWorkout = (workoutId: string) => {
    setWorkouts(workouts.filter((workout) => workout.id !== workoutId))
    // Also remove any logs associated with this workout
    setLogs(logs.filter((log) => log.workoutId !== workoutId))
  }

  // Add a workout log
  const addLog = (log: WorkoutLog) => {
    // Check if this workout is already logged for this date
    const exists = logs.some((existingLog) => existingLog.date === log.date && existingLog.workoutId === log.workoutId)

    if (!exists) {
      setLogs([...logs, log])
    }
  }

  // Update the provider return value to include setLogs
  return (
    <WorkoutContext.Provider value={{ workouts, logs, addWorkout, removeWorkout, addLog, setLogs }}>
      {children}
    </WorkoutContext.Provider>
  )
}

// Custom hook to use the workout context
export function useWorkoutContext() {
  const context = useContext(WorkoutContext)
  if (context === undefined) {
    throw new Error("useWorkoutContext must be used within a WorkoutProvider")
  }
  return context
}

