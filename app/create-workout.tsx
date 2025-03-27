// test_app/app/create-workout.tsx
import { useState } from 'react';
import { View, TextInput, Button, FlatList, Text } from 'react-native';
import { useWorkoutContext, Exercise, Workout } from '../context/WorkoutContext';
import { useRouter } from 'expo-router';
import uuid from 'react-native-uuid';

export default function CreateWorkoutScreen() {
  const [name, setName] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const { addWorkout } = useWorkoutContext();
  const router = useRouter();

  // Add a new empty exercise
  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: 0, reps: 0 }]);
  };

  // Update an exercise field
  const updateExercise = (index: number, field: keyof Exercise, value: string | number) => {
    const newExercises = [...exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    setExercises(newExercises);
  };

  // Save the workout and go back
  const saveWorkout = () => {
    if (name && exercises.length > 0 && exercises.every(ex => ex.name)) {
      const workout: Workout = {
        id: uuid.v4() as string, // Generate a unique ID
        name,
        exercises,
      };
      addWorkout(workout);
      router.back(); // Go back to Workouts screen
    } else {
      alert('Please enter a workout name and at least one exercise.');
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        placeholder="Workout Name (e.g., Upper Body)"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
      />
      <FlatList
        data={exercises}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={{ marginBottom: 10 }}>
            <TextInput
              placeholder="Exercise Name (e.g., Push-up)"
              value={item.name}
              onChangeText={(text) => updateExercise(index, 'name', text)}
              style={{ borderWidth: 1, padding: 10, marginBottom: 5 }}
            />
            <TextInput
              placeholder="Sets (e.g., 3)"
              value={item.sets.toString()}
              onChangeText={(text) => updateExercise(index, 'sets', parseInt(text) || 0)}
              keyboardType="numeric"
              style={{ borderWidth: 1, padding: 10, marginBottom: 5 }}
            />
            <TextInput
              placeholder="Reps (e.g., 10)"
              value={item.reps.toString()}
              onChangeText={(text) => updateExercise(index, 'reps', parseInt(text) || 0)}
              keyboardType="numeric"
              style={{ borderWidth: 1, padding: 10, marginBottom: 5 }}
            />
          </View>
        )}
      />
      <Button title="Add Exercise" onPress={addExercise} />
      <Button title="Save Workout" onPress={saveWorkout} />
    </View>
  );
}