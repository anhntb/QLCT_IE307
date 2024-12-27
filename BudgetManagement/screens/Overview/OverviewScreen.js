import React, {useState, useEffect, useCallback} from 'react';
import { FlatList, StyleSheet } from 'react-native';
import MonthOverview from './MonthOverview';
import { useFocusEffect } from '@react-navigation/native';
import { fetchAllTransactions } from '../../db/db';

import { format, subMonths } from "date-fns";

const OverviewScreen = () => {
  const [transactions, setTransactions] = useState([]);
  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );
    
  useEffect(() => {
    loadTransactions();
  }, []);
      
  const loadTransactions = async () => {
    try {
      const result = await fetchAllTransactions();
      setTransactions(result);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };


  // Hàm tính monthlyData
  const calculateMonthlyData = (transactions) => {
    const today = new Date();
    const months = Array.from({ length: 24 }, (_, i) =>
      format(subMonths(today, i), "MM/yyyy")
    );

    // Initialize monthlyData với 4 tháng gần nhất
    const monthlyData = months.map((month) => ({
      month,
      income: 0,
      expense: 0,
    }));

    // Group transactions by month
    transactions.forEach((transaction) => {
      // Chuyển đổi định dạng ngày
      const transactionDate = new Date(transaction.date);
      const transactionMonth = format(transactionDate, "MM/yyyy");

      const monthData = monthlyData.find((data) => data.month === transactionMonth);

      if (monthData) {
        if (transaction.amount > 0) {
          monthData.income += transaction.amount;
        } else {
          monthData.expense += transaction.amount;
        }
      }
    });

    return monthlyData;
  };

  // Tính monthlyData
  const monthlyData = calculateMonthlyData(transactions);


  return (
    <FlatList
      data={monthlyData}
      renderItem={({ item }) => <MonthOverview data={item} isHideRemainder={true} />}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
});

export default OverviewScreen;
