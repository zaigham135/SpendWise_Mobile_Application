import { View, Text, TouchableOpacity, TextInput, Modal, Dimensions } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import expenseData from '../../data/expenseData.json';
import { LineChart } from 'react-native-chart-kit';

const ORANGE = "#37474F";
const LIGHT_ORANGE = "#FFF3E6";
const GRAY = "#F3F4F6";
const DARK = "#22223b";
const GREEN = "#22c55e";
const screenWidth = Dimensions.get('window').width;

const timePeriods = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

export default function ExpenseTrendsSection() {
  const [activePeriod, setActivePeriod] = useState('monthly');
  const [showDateModal, setShowDateModal] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const mainValue = 7843;
  const percentChange = 2.5;
  const salesGoal = 64843;
  const commission = 1820;
  const avgOrder = 991.42;

  const getChartData = () => {
    switch (activePeriod) {
      case 'weekly':
        return expenseData.weeklyData;
      case 'monthly':
        return expenseData.monthlyExpenses;
      case 'custom':
        return generateCustomData();
      default:
        return expenseData.monthlyExpenses;
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
        color: (opacity = 1) => ORANGE,
        strokeWidth: 3,
      },
    ],
  };

  // Make the chart as wide as possible, minus padding
  const chartWidth = screenWidth - 32;

  return (
    <View style={{ padding: 16 }}>
     
      <Text style={{
        fontSize: 18,
        fontWeight: '500',
        color: '#1f2937',
        marginBottom: 16
      }}>
        Expense Trends
      </Text>
        {/* Period Selector */}
        <View style={{ flexDirection: "row", marginBottom: 18 }}>
          {timePeriods.map((period) => (
            <TouchableOpacity
              key={period.value}
              style={{
                paddingHorizontal: 18,
                paddingVertical: 7,
                borderRadius: 20,
                backgroundColor: activePeriod === period.value ? ORANGE : "#f3f4f6",
                marginRight: 10,
              }}
              onPress={() => setActivePeriod(period.value)}
            >
              <Text style={{
                color: activePeriod === period.value ? "#fff" : "#22223b",
                fontWeight: "700",
                fontSize: 15,
              }}>
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

       

        {/* Chart */}
        <LineChart
          data={data}
          width={chartWidth}
          height={240}
          withShadow={true}
          withDots={true}
          withInnerLines={true}
          withOuterLines={true}
          withVerticalLabels={true}
          withHorizontalLabels={true}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundGradientFrom: "#f6f8fa",
            backgroundGradientTo: "#f6f8fa",
            decimalPlaces: 0,
            color: (opacity = 1) => ORANGE,
            labelColor: (opacity = 1) => "#888",
            fillShadowGradient: ORANGE,
            fillShadowGradientOpacity: 0.13,
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: ORANGE,
              fill: "#fff",
            },
            propsForBackgroundLines: {
              stroke: ORANGE,
            },
            propsForLabels: {
              fontWeight: '500',
            },
          }}
          bezier
          style={{ borderRadius: 18, marginBottom: 10, alignSelf: "center" }}
          // renderDotContent={({ x, y, index }) => (
          //   <Text
          //     key={index}
          //     style={{
          //       position: 'absolute',
          //       left: x - 18,
          //       top: y - 28,
          //       color: ORANGE,
          //       fontWeight: 'bold',
          //       fontSize: 12,
          //       backgroundColor: '#fff',
          //       paddingHorizontal: 6,
          //       paddingVertical: 2,
          //       borderRadius: 8,
          //       overflow: 'hidden',
          //       textAlign: 'center',
          //       minWidth: 36,
          //       borderWidth: 1,
          //       borderColor: "#ffe0c2",
          //     }}
          //   >
          //     ${chartData[index]?.amount}
          //   </Text>
          // )}
        />
     
    </View>
  );
}