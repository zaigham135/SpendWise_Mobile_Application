import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/layout/Header';

export default function AddTransaction() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Add Transaction" />
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg text-gray-600">Add Transaction Screen</Text>
      </View>
    </SafeAreaView>
  );
}