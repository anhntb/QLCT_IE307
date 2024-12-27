import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { isDate } from 'date-fns';

const screenWidth = Dimensions.get('window').width;

const MonthOverview = ({ data, isHideRemainder }) => {
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
          color: '#26A071',
          legendFontColor: '#7F7F7F',
          legendFontSize: 12,
        },
        {
          name: 'Chi phí',
          population: Math.abs(data.expense),
          color: '#F7637D',
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
      {data.month === 'Tổng thu - chi' ? (
        <Text style={styles.monthText}>{data.month}</Text>
      ) : (
        <Text style={styles.monthText}>Tháng {data.month}</Text>
      )}
      
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
            marginLeft: 31,
            position: 'absolute',
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#fff',
          }}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.incomeText}>Thu: {formatCurrency(data.income)}</Text>
          <Text style={styles.expenseText}>Chi: {formatCurrency(data.expense)}</Text>
          {!isHideRemainder ? (
          <Text style={styles.totalText}>Số dư ví: {formatCurrency(data.total)}</Text>
          ) : (
          <Text style={styles.totalText}>Tổng thu: {formatCurrency(total)}</Text>
          )}
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
    elevation: 2,
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: "center",
    padding: 5,
  },
  rowContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
  },
  incomeText: {
    fontSize: 14,
    color: '#26A071',
    marginBottom: 5,
  },
  expenseText: {
    fontSize: 14,
    color: '#F7637D',
    marginBottom: 5,
  },
  totalText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: "#26A071",
  },
});

export default MonthOverview;
