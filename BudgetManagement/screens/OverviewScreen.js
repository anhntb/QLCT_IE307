import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const OverviewScreen = () => {
  const data = [
    {
      month: 'Tháng Mười Hai 2024',
      income: 5500000,
      expense: -115000,
    },
    {
      month: 'Tháng Mười Một 2024',
      income: 0,
      expense: 0,
    },
    {
      month: 'Tháng Mười 2024',
      income: 0,
      expense: 0,
    },
    {
      month: 'Tháng Chín 2024',
      income: 0,
      expense: 0,
    },
  ];

  const renderItem = ({ item }) => {
    const total = item.income + item.expense;
    const chartData = item.income === 0 && item.expense === 0
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
            population: item.income > 0 ? item.income : 0,
            color: '#00E1A1',
            legendFontColor: '#7F7F7F',
            legendFontSize: 12,
          },
          {
            name: 'Chi phí',
            population: Math.abs(item.expense),
            color: '#e95449',
            legendFontColor: '#7F7F7F',
            legendFontSize: 12,
          },
        ];

    return (
      <View style={styles.itemContainer}>
        <Text style={styles.monthText}>{item.month}</Text>
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
            width: 40, // Adjust size of the hollow center
            height: 40,
            borderRadius: 20, // Make it circular
            backgroundColor: '#fff', // Match your background color
            }}
        />
          <View style={styles.infoContainer}>
            <Text style={styles.incomeText}>Thu nhập: {formatCurrency(item.income)}</Text>
            <Text style={styles.expenseText}>Chi phí: {formatCurrency(item.expense)}</Text>
            <Text style={styles.totalText}>Tổng cộng: {formatCurrency(total)}</Text>
          </View>
        </View>
        <View style={styles.divider} />
      </View>
    );
  };

  const formatCurrency = (amount) => {
    return `${amount.toLocaleString('vi-VN')} đ`;
  };

  const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientTo: '#08130D',
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    marginTop: 20,
  },
  itemContainer: {
    marginBottom: 5,
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
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginTop: 10,
  },
});

export default OverviewScreen;
