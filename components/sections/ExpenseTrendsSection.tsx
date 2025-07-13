import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ActivityIndicator, StyleSheet, Platform, Animated } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import axiosInstance from '../../src/api/axios/axiosInstance';

const ORANGE = "#37474F";
const screenWidth = Dimensions.get('window').width;
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const timePeriods = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

function formatNumber(val) {
  const num = Number(val);
  return Number.isFinite(num) ? num : 0;
}

function getYearOptions() {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => currentYear - i);
}

function getMonthOptions() {
  return monthNames.map((m, i) => ({ label: m, value: i }));
}

function getWeeksInMonth(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const weeks = [];
  let weekStart = new Date(firstDay);
  while (weekStart.getDay() !== 1) {
    weekStart.setDate(weekStart.getDate() - 1);
  }
  while (weekStart <= lastDay) {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weeks.push({
      start: new Date(weekStart),
      end: new Date(Math.min(weekEnd, lastDay)),
    });
    weekStart.setDate(weekStart.getDate() + 7);
  }
  return weeks;
}

export default function ExpenseTrendsSection() {
  const [activePeriod, setActivePeriod] = useState('daily');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedWeekIdx, setSelectedWeekIdx] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [contextLabel, setContextLabel] = useState('');
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, value: 0, label: '' });

  const tooltipAnim = useRef(new Animated.Value(0)).current;
  const isAnimating = useRef(false);

  const weekRanges = useMemo(
    () => getWeeksInMonth(selectedYear, selectedMonth),
    [selectedYear, selectedMonth]
  );

  const fetchDailySummary = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const week = weekRanges[selectedWeekIdx] || weekRanges[0];
      const startDate = new Date(week.start);
      const endDate = new Date(week.end);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      const formattedStartDate = startDate.toISOString().split('T')[0];
      const formattedEndDate = endDate.toISOString().split('T')[0];

      const response = await axiosInstance.get('/items/summary/daily', {
        params: { startDate: formattedStartDate, endDate: formattedEndDate },
      });
      const rawData = response.data;

      const allDays = [];
      const start = new Date(startDate);
      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(start);
        currentDate.setDate(start.getDate() + i);
        const dateStr = currentDate.toISOString().split('T')[0];
        const dayOfWeek = currentDate.getDay();
        const dayLabel = weekdays[dayOfWeek];
        const found = rawData.find(item => {
          const itemDate = new Date(item.date);
          itemDate.setHours(0, 0, 0, 0);
          return itemDate.toISOString().split('T')[0] === dateStr;
        });
        allDays.push({ label: dayLabel, amount: formatNumber(found?.total_expenses), date: dateStr });
      }
      setChartData(allDays);
      setContextLabel(
        `Week of ${startDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} - ${endDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`
      );
    } catch (err) {
      setError("Failed to load daily trends. Please check your connection and try again.");
      setChartData([]);
      setContextLabel('');
    } finally { setLoading(false); }
  }, [selectedMonth, selectedYear, selectedWeekIdx, weekRanges]);

  const fetchWeeklySummary = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);
      const lastDayOfMonth = new Date(selectedYear, selectedMonth + 1, 0);
      firstDayOfMonth.setHours(0, 0, 0, 0);
      lastDayOfMonth.setHours(23, 59, 59, 999);
      const formattedStartDate = firstDayOfMonth.toISOString().split('T')[0];
      const formattedEndDate = lastDayOfMonth.toISOString().split('T')[0];

      const response = await axiosInstance.get('/items/summary/daily', {
        params: { startDate: formattedStartDate, endDate: formattedEndDate },
      });
      const rawData = response.data;

      const weeklyData = weekRanges.map((range, idx) => {
        const weekStart = new Date(range.start);
        const weekEnd = new Date(range.end);
        weekStart.setHours(0, 0, 0, 0);
        weekEnd.setHours(23, 59, 59, 999);
        const weekExpenses = rawData
          .filter(item => {
            const d = new Date(item.date);
            d.setHours(0, 0, 0, 0);
            return d >= weekStart && d <= weekEnd;
          })
          .reduce((sum, item) => sum + formatNumber(item.total_expenses), 0);
        return {
          label: idx % 2 === 0 ? `Wk ${idx + 1} (${monthNames[range.start.getMonth()]})` : `${idx + 1}`,
          amount: weekExpenses,
          rangeLabel: `${range.start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${range.end.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`,
        };
      });

      setChartData(weeklyData);
      setContextLabel(
        `${monthNames[selectedMonth]} ${selectedYear} (${weekRanges[0].start.toLocaleDateString()} - ${weekRanges[weekRanges.length - 1].end.toLocaleDateString()})`
      );
    } catch (err) {
      setError("Failed to load weekly trends. Please check your connection and try again.");
      setChartData([]);
      setContextLabel('');
    } finally { setLoading(false); }
  }, [selectedMonth, selectedYear, weekRanges]);

  const fetchMonthlySummary = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const response = await axiosInstance.get('/items/summary/monthly', { params: { months: 12 } });
      const rawData = response.data;
      const allMonths = [];
      for (let i = 0; i < 12; i++) {
        const label = monthNames[i];
        const found = rawData.find(item => item.month === label && new Date().getFullYear() === selectedYear);
        allMonths.push({ label, amount: formatNumber(found?.total_expenses) });
      }
      setChartData(allMonths);
      setContextLabel(`Year: ${selectedYear}`);
    } catch (err) {
      setError("Failed to load monthly trends. Please check your connection and try again.");
      setChartData([]);
      setContextLabel('');
    } finally { setLoading(false); }
  }, [selectedYear]);

  useFocusEffect(
    useCallback(() => {
      if (activePeriod === 'daily') fetchDailySummary();
      else if (activePeriod === 'weekly') fetchWeeklySummary();
      else fetchMonthlySummary();
    }, [activePeriod, fetchDailySummary, fetchWeeklySummary, fetchMonthlySummary])
  );

  const labels = chartData.map(item => item.label);
  const values = chartData.map(item => item.amount);
  const isAllZero = values.every(v => v === 0);

  const data = {
    labels,
    datasets: [
      {
        data: values,
        color: (opacity = 1) => ORANGE,
        strokeWidth: 3,
      },
    ],
  };

  const chartWidth = screenWidth - 32;

  const yearOptions = useMemo(getYearOptions, []);
  const monthOptions = useMemo(getMonthOptions, []);

  const weekPickerOptions = weekRanges.map((range, idx) => ({
    label: `Week ${idx + 1}: ${range.start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${range.end.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`,
    value: idx,
  }));

  const handleDataPointClick = (data) => {
    console.log('Data Point Clicked:', data); // Debug log
    if (isAnimating.current) return; // Prevent overlapping animations
    const { index, x, y } = data;
    if (index >= 0 && index < values.length) {
      const value = values[index];
      const label = chartData[index].label;
      isAnimating.current = true;
      setTooltip({ visible: true, x, y: y - 40, value, label });
      Animated.timing(tooltipAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        isAnimating.current = false;
      });
    } else {
      console.log('Invalid index:', index); // Debug invalid index
    }
  };

  const hideTooltip = () => {
    if (isAnimating.current) return; // Prevent interrupting animation
    isAnimating.current = true;
    Animated.timing(tooltipAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setTooltip({ ...tooltip, visible: false });
      isAnimating.current = false;
    });
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={styles.header}>Expense Trends</Text>
      <View style={styles.periodSelector}>
        {timePeriods.map((period) => (
          <TouchableOpacity
            key={period.value}
            style={[
              styles.periodButton,
              activePeriod === period.value && styles.periodButtonActive
            ]}
            onPress={() => setActivePeriod(period.value)}
          >
            <Text style={[
              styles.periodButtonText,
              activePeriod === period.value && styles.periodButtonTextActive
            ]}>
              {period.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        <View style={pickerStyles.pickerWrapper}>
          <Picker
            selectedValue={selectedYear}
            onValueChange={year => {
              setSelectedYear(year);
              setSelectedWeekIdx(0);
            }}
            style={pickerStyles.picker}
            dropdownIconColor="#37474F"
          >
            {yearOptions.map(year => (
              <Picker.Item key={year} label={year.toString()} value={year} />
            ))}
          </Picker>
        </View>
        {(activePeriod === 'daily' || activePeriod === 'weekly') && (
          <View style={pickerStyles.pickerWrapper}>
            <Picker
              selectedValue={selectedMonth}
              onValueChange={month => {
                setSelectedMonth(month);
                setSelectedWeekIdx(0);
              }}
              style={pickerStyles.picker}
              dropdownIconColor="#37474F"
            >
              {monthOptions.map(month => (
                <Picker.Item key={month.value} label={month.label} value={month.value} />
              ))}
            </Picker>
          </View>
        )}
      </View>
      {activePeriod === 'daily' && weekPickerOptions.length > 1 && (
        <View style={pickerStyles.pickerWrapper}>
          <Picker
            selectedValue={selectedWeekIdx}
            onValueChange={setSelectedWeekIdx}
            style={pickerStyles.picker}
            dropdownIconColor="#37474F"
          >
            {weekPickerOptions.map(opt => (
              <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
            ))}
          </Picker>
        </View>
      )}
      {contextLabel ? (
        <Text style={{ color: '#888', marginBottom: 6, fontSize: 13, textAlign: 'center' }}>
          {contextLabel}
        </Text>
      ) : null}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={ORANGE} />
          <Text style={styles.loadingText}>Loading trends...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => {
            if (activePeriod === 'daily') fetchDailySummary();
            else if (activePeriod === 'weekly') fetchWeeklySummary();
            else fetchMonthlySummary();
          }} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : isAllZero ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No data available for this period.</Text>
        </View>
      ) : (
        <View onTouchEnd={hideTooltip}>
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
            yAxisLabel="₹"
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
              formatYLabel: (yValue) => `₹${yValue}`,
            }}
            bezier
            style={{ borderRadius: 18, marginBottom: 10, alignSelf: "center" }}
            onDataPointClick={handleDataPointClick}
          />
          {tooltip.visible && (
            <Animated.View
              style={{
                position: 'absolute',
                left: tooltip.x - 40,
                top: tooltip.y,
                backgroundColor: '#fff',
                padding: 8,
                borderRadius: 6,
                borderWidth: 1,
                borderColor: '#e5e7eb',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 5,
                opacity: tooltipAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
                transform: [{
                  scale: tooltipAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  }),
                }],
              }}
            >
              <Text style={{ color: ORANGE, fontWeight: '600', fontSize: 14 }}>
                ₹{tooltip.value.toFixed(2)}
              </Text>
              <Text style={{ color: '#666', fontSize: 12 }}>{tooltip.label}</Text>
            </Animated.View>
          )}
        </View>
      )}
    </View>
  );
}

const pickerStyles = StyleSheet.create({
  pickerWrapper: {
    flex: 1,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    backgroundColor: '#f7fafc',
    justifyContent: 'center',
    height: 44,
    marginBottom: 0,
  },
  picker: {
    color: '#37474F',
    height: Platform.OS === 'ios' ? undefined : 50,
    width: '100%',
    fontSize: 15,
    paddingHorizontal: 8,
  },
});

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 16
  },
  periodSelector: {
    flexDirection: "row",
    marginBottom: 18
  },
  periodButton: {
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    marginRight: 10,
  },
  periodButtonActive: {
    backgroundColor: ORANGE,
  },
  periodButtonText: {
    color: "#22223b",
    fontWeight: "700",
    fontSize: 15,
  },
  periodButtonTextActive: {
    color: "#fff",
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 240,
  },
  loadingText: {
    marginTop: 10,
    color: '#6b7280',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 240,
    paddingHorizontal: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: ORANGE,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});