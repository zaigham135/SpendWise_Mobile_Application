import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/layout/Header';
import CategoriesSection from '../../components/sections/CategoriesSection';
import RecentTransactionsSection from '../../components/sections/RecentTransactionsSection';
import ExpenseTrendsSection from '../../components/sections/ExpenseTrendsSection';

export default function Dashboard() {
  console.log('Dashboard component rendering');
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Header title="Dashboard" />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingBottom: 24 }}>
          <CategoriesSection />
          <RecentTransactionsSection />
          <ExpenseTrendsSection />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}