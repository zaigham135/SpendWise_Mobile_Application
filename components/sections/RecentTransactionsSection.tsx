import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import expenseData from '../../data/expenseData.json';

interface Transaction {
  id: string;
  name: string;
  date: string;
  amount: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  type: 'expense' | 'income';
}

export default function RecentTransactionsSection() {
  const transactions: Transaction[] = expenseData.recentTransactions;

  return (
    <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
      <Text style={{
        fontSize: 18,
        fontWeight: '500',
        color: '#1f2937',
        marginBottom: 16
      }}>
        Recent Transactions
      </Text>
      
      <View style={{ gap: 12 }}>
        {transactions.map((transaction) => (
          <TouchableOpacity key={transaction.id} activeOpacity={0.7}>
            <View style={{
              backgroundColor: 'white',
              padding: 16,
              borderRadius: 12,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  flex: 1
                }}>
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: transaction.iconBg,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {(transaction.name.toLowerCase().includes('petrol') || transaction.name.toLowerCase().includes('fuel')) ? (
                      <MaterialCommunityIcons name="gas-station" size={18} color="#374151" />
                    ) : (
                      <Ionicons 
                        name={transaction.icon} 
                        size={18} 
                        color="#374151" 
                      />
                    )}
                  </View>
                  
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={{
                      fontSize: 16,
                      fontWeight: '500',
                      color: '#1f2937'
                    }}>
                      {transaction.name}
                    </Text>
                    <Text style={{
                      fontSize: 14,
                      color: '#6b7280'
                    }}>
                      {transaction.date}
                    </Text>
                  </View>
                </View>
                
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '500',
                    color: transaction.type === 'expense' ? '#dc2626' : '#16a34a'
                  }}>
                    {transaction.type === 'expense' ? '-' : '+'}{transaction.amount}
                  </Text>
                  <View style={{ marginTop: 4 }}>
                    <Ionicons 
                      name={transaction.type === 'expense' ? 'trending-down' : 'trending-up'} 
                      size={12} 
                      color={transaction.type === 'expense' ? '#dc2626' : '#16a34a'} 
                    />
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}