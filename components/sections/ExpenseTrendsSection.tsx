import { View, Text, TouchableOpacity, TextInput, Modal, Dimensions } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import expenseData from '../../data/expenseData.json';
import { LineChart } from 'react-native-chart-kit';

const timePeriods = [
  { value: 'weekly', label: 'Weekly', active: true },
  { value: 'monthly', label: 'Monthly', active: false },
  { value: 'custom', label: 'Custom', active: false },
];

const screenWidth = Dimensions.get('window').width;

export default function ExpenseTrendsSection() {
  const [activePeriod, setActivePeriod] = useState('weekly');
  const [showDateModal, setShowDateModal] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const getChartData = () => {
    switch (activePeriod) {
      case 'weekly':
        return expenseData.weeklyData;
      case 'monthly':
        return expenseData.monthlyExpenses;
      case 'custom':
        return generateCustomData();
      default:
        return expenseData.weeklyData;
    }
  };

  const generateCustomData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, index) => ({
      label: day,
      amount: Math.floor(Math.random() * 8000) + 3000
    }));
  };

  // Normalize chart data for chart-kit
  const chartDataRaw = getChartData();
  const chartData = chartDataRaw.map((item: any) => ({
    label: item.day || item.month || item.label || '',
    amount: item.amount
  }));

  const data = {
    labels: chartData.map((item) => item.label),
    datasets: [
      {
        data: chartData.map((item) => item.amount),
        color: (opacity = 1) => `rgba(255, 199, 39, ${opacity})`, // #FFC727
        strokeWidth: 3,
      },
    ],
  };

  const renderDateModal = () => (
    <Modal
      visible={showDateModal}
      transparent={true}
      animationType="slide"
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <View style={{
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 24,
          width: '80%',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 8
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: 20,
            textAlign: 'center'
          }}>
            Select Date Range
          </Text>
          
          <View style={{ marginBottom: 16 }}>
            <Text style={{
              fontSize: 14,
              fontWeight: '500',
              color: '#374151',
              marginBottom: 8
            }}>
              Start Date (YYYY-MM-DD)
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                padding: 12,
                fontSize: 16
              }}
              placeholder="2025-06-01"
              value={customStartDate}
              onChangeText={setCustomStartDate}
            />
          </View>
          
          <View style={{ marginBottom: 24 }}>
            <Text style={{
              fontSize: 14,
              fontWeight: '500',
              color: '#374151',
              marginBottom: 8
            }}>
              End Date (YYYY-MM-DD)
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                padding: 12,
                fontSize: 16
              }}
              placeholder="2025-06-30"
              value={customEndDate}
              onChangeText={setCustomEndDate}
            />
          </View>
          
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}>
            <TouchableOpacity
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 8,
                backgroundColor: '#f3f4f6',
                marginRight: 8
              }}
              onPress={() => setShowDateModal(false)}
            >
              <Text style={{
                textAlign: 'center',
                fontSize: 16,
                fontWeight: '500',
                color: '#6b7280'
              }}>
                Cancel
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 8,
                backgroundColor: '#3b82f6',
                marginLeft: 8
              }}
              onPress={() => {
                setShowDateModal(false);
                setActivePeriod('custom');
              }}
            >
              <Text style={{
                textAlign: 'center',
                fontSize: 16,
                fontWeight: '500',
                color: 'white'
              }}>
                Apply
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
      <Text style={{
        fontSize: 18,
        fontWeight: '500',
        color: '#1f2937',
        marginBottom: 16
      }}>
        Expense Trends
      </Text>
      <View style={{
        backgroundColor: '#37474F',
        borderRadius: 20,
        padding: 10,
        marginBottom: 20,
      }}>
        <LineChart
          data={data}
          width={screenWidth - 52}
          height={220}
          withShadow={true}
          withDots={true}
          withInnerLines={false}
          withOuterLines={false}
          withVerticalLabels={true}
          withHorizontalLabels={false}
          yAxisLabel="$"
          chartConfig={{
            backgroundGradientFrom: '#37474F',
            backgroundGradientTo: '#37474F',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255,255,255,${opacity})`,
            fillShadowGradient: '#FFC727',
            fillShadowGradientOpacity: 0.3,
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#FFC727',
              fill: '#fff',
            },
            propsForBackgroundLines: {
              stroke: 'transparent',
            },
            propsForLabels: {
              fontWeight: 'bold',
            },
          }}
          bezier
          style={{ borderRadius: 20 }}
          renderDotContent={({ x, y, index }) => (
            <Text
              key={index}
              style={{
                position: 'absolute',
                left: x - 18,
                top: y - 28,
                color: '#FFC727',
                fontWeight: 'bold',
                fontSize: 12,
                backgroundColor: 'rgba(55,71,79,0.95)',
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 8,
                overflow: 'hidden',
                textAlign: 'center',
                minWidth: 36,
              }}
            >
              ${chartData[index]?.amount}
            </Text>
          )}
        />
      </View>
      
      {/* Period Selector */}
      <View style={{
        flexDirection: 'row',
        gap: 8,
        marginBottom: 20
      }}>
        {timePeriods.map((period) => (
          <TouchableOpacity
            key={period.value}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 12,
              backgroundColor: period.value === activePeriod ? '#3b82f6' : '#f8fafc',
              borderWidth: 1,
              borderColor: period.value === activePeriod ? '#3b82f6' : '#e2e8f0'
            }}
            activeOpacity={0.8}
            onPress={() => {
              if (period.value === 'custom') {
                setShowDateModal(true);
              } else {
                setActivePeriod(period.value);
              }
            }}
          >
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: period.value === activePeriod ? 'white' : '#64748b'
            }}>
              {period.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {renderDateModal()}
    </View>
  );
}