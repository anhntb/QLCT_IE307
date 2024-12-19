import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const MonthOverview = ({ data }) => {
  const total = data.income + data.expense;

  const chartData = data.income === 0 && data.expense === 0
    ? [
        {
          name: 'No Data',
          population: 1,
          color: '#C9C9D0',
          legendFontColor: '#7F7F7F',
          legendFontSize: 12,
        },
      ]
    : [
        {
          name: 'Thu nhập',
          population: data.income > 0 ? data.income : 0,
          color: '#00E1A1',
          legendFontColor: '#7F7F7F',
          legendFontSize: 12,
        },
        {
          name: 'Chi phí',
          population: Math.abs(data.expense),
          color: '#e95449',
          legendFontColor: '#7F7F7F',
          legendFontSize: 12,
        },
      ];

  const formatCurrency = (amount) => `${amount.toLocaleString('vi-VN')} đ`;

  const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientTo: '#08130D',
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
  };

  return (
    <View style={styles.itemContainer}>
      <Text style={styles.monthText}>{data.month}</Text>
      <View style={styles.rowContainer}>
        <PieChart
          data={chartData}
          width={screenWidth / 2.5}
          height={100}
          chartConfig={chartConfig}
          accessor={'population'}
          backgroundColor={'transparent'}
          paddingLeft={'15'}
          center={[0, 0]}
          hasLegend={false}
        />
        <View
          style={{
            marginLeft: 30,
            position: 'absolute',
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#fff',
          }}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.incomeText}>Thu nhập: {formatCurrency(data.income)}</Text>
          <Text style={styles.expenseText}>Chi phí: {formatCurrency(data.expense)}</Text>
          <Text style={styles.totalText}>Tổng cộng: {formatCurrency(total)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
  },
  monthText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContainer: {
    marginLeft: 20,
    flex: 1,
  },
  incomeText: {
    fontSize: 14,
    color: 'green',
    marginBottom: 5,
  },
  expenseText: {
    fontSize: 14,
    color: 'red',
    marginBottom: 5,
  },
  totalText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default MonthOverview;
