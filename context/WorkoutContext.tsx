// test_app/context/WorkoutContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define what a workout and log look like
export interface Exercise {
  name: string;  // e.g., "Push-up"
  sets: number;  // e.g., 3
  reps: number;  // e.g., 10
}

export interface Workout {
  id: string;    // Unique ID
  name: string;  // e.g., "Upper Body"
  exercises: Exercise[];
}

export interface WorkoutLog {
  date: string;  // e.g., "2023-10-01"
  workoutId: string;
}

// Define the context's shape
interface WorkoutContextType {
  workouts: Workout[];
  logs: WorkoutLog[];
  addWorkout: (workout: Workout) => void;
  addLog: (log: WorkoutLog) => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

// Hook to use the context
export const useWorkoutContext = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkoutContext must be used within a WorkoutProvider');
  }
  return context;
};

// Provider component
export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [logs, setLogs] = useState<WorkoutLog[]>([]);

  // Load data from AsyncStorage when the app starts
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedWorkouts = await AsyncStorage.getItem('workouts');
        const storedLogs = await AsyncStorage.getItem('logs');
        if (storedWorkouts) setWorkouts(JSON.parse(storedWorkouts));
        if (storedLogs) setLogs(JSON.parse(storedLogs));
      } catch (error) {
        console.error('Failed to load data', error);
      }
    };
    loadData();
  }, []);

  // Save data to AsyncStorage when it changes
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('workouts', JSON.stringify(workouts));
        await AsyncStorage.setItem('logs', JSON.stringify(logs));
      } catch (error) {
        console.error('Failed to save data', error);
      }
    };
    saveData();
  }, [workouts, logs]);

  const addWorkout = (workout: Workout) => {
    setWorkouts([...workouts, workout]);
  };

  const addLog = (log: WorkoutLog) => {
    setLogs([...logs, log]);
  };

  return (
    <WorkoutContext.Provider value={{ workouts, logs, addWorkout, addLog }}>
      {children}
    </WorkoutContext.Provider>
  );
};