import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/layout/Header';

export default function Transactions() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Transactions" />
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg text-gray-600">Transactions Screen</Text>
      </View>
    </SafeAreaView>
  );
}