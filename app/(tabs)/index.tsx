// test_app/app/(tabs)/index.tsx
import { View, Button, FlatList, Text } from 'react-native';
import { useWorkoutContext } from '@/context/WorkoutContext';
import { useRouter} from 'expo-router';

export default function WorkoutScreen() {
  const router = useRouter();
  const { workouts, addLog } = useWorkoutContext();

  // Log a workout for today
  const logWorkout = (workoutId: string) => {
    const today = new Date().toISOString().split('T')[0];
    addLog({ date: today, workoutId });
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button
        title="Create New Workout"
        onPress={() => router.push('/create-workout')}
      />
      <Text style={{ fontSize: 18, marginVertical: 10 }}>Existing Workouts:</Text>
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
            <Text>{item.name}</Text>
            <Button title="Log Today" onPress={() => logWorkout(item.id)} />
          </View>
        )}
        ListEmptyComponent={<Text>No workouts yet. Create one!</Text>}
      />
    </View>
  );
}
