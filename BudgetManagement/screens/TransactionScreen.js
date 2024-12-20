import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import transactions from '../data/transactions';
import { FontAwesome } from "@expo/vector-icons";

const parseDate = (dateString) => {
  const [day, month, year] = dateString.split('/').map(Number);
  return new Date(year, month - 1, day); // Month is 0-based
};

const TransactionScreen = () => {


  const [currentYear, setCurrentYear] = useState(2024); // Năm hiện tại

  // Lọc giao dịch theo năm
  const filterByYear = (year) => {
    return transactions.filter(
      (transaction) => parseDate(transaction.date).getFullYear() === year
    );
  };

  // Lọc giao dịch theo năm và nhóm theo tháng
  const groupByMonth = (filteredTransactions) => {
    return filteredTransactions.reduce((acc, transaction) => {
      const month = parseDate(transaction.date).getMonth() + 1; // Tháng 1 => 12
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(transaction);
      return acc;
    }, {});
  };

  const transactionsForYear = filterByYear(currentYear);
  const groupedTransactions = groupByMonth(transactionsForYear);

  // Tính tổng tiền theo tháng
  const calculateTotal = (transactions) => {
    return transactions.reduce((total, transaction) => total + transaction.amount, 0);
  };

  // Thay đổi năm
  const changeYear = (direction) => {
    setCurrentYear((prevYear) => prevYear + direction);
  };

  return (
    <View style={styles.container}>
      {/* Thanh chuyển đổi năm */}
      <View style={styles.yearSelector}>
        <TouchableOpacity onPress={() => changeYear(-1)}>
          <Text style={styles.yearButton}>{"<"} </Text>
        </TouchableOpacity>
        <Text style={styles.yearText}>{currentYear}</Text>
        <TouchableOpacity onPress={() => changeYear(1)}>
          <Text style={styles.yearButton}> {">"}</Text>
        </TouchableOpacity>
      </View>

      {/* Hiển thị danh sách giao dịch */}
      {Object.keys(groupedTransactions).length === 0 ? (
        <Text style={styles.noTransactions}>Không tìm thấy giao dịch</Text>
      ) : (
        <FlatList
          data={Object.keys(groupedTransactions).sort((a, b) => b - a)} // Sắp xếp tháng giảm dần
          renderItem={({ item: month }) => (
            <View style={styles.transactionContainer}>
              {/* Tháng và tổng cộng */}
              <View style={styles.monthHeader}>
                <Text style={styles.monthTitle}>Tháng {month}/{currentYear}</Text>
                <Text style={styles.monthTotal}>
                  Tổng cộng:{" "}
                  {calculateTotal(groupedTransactions[month]).toLocaleString('vi-VN')} đ
                </Text>
              </View>

              {/* Các giao dịch trong tháng */}
              {groupedTransactions[month].map((transaction) => (
                <View
                  key={transaction.id} // Hoặc bất kỳ giá trị nào là duy nhất 
                  style={[styles.transaction, {borderColor: transaction.amount < 0 ? 'red' : 'green' }]}  
                >
                {/* <Image source={transaction.icon} style={styles.icon} /> */}
                <FontAwesome name={transaction.icon} size={24} style={styles.icon}/>
                <View style={styles.details}>
                  <Text style={styles.category}>{transaction.category}</Text>
                  <Text style={styles.wallet}>{transaction.wallet}</Text>
                </View>
                <View style={styles.rightSection}>
                  <Text
                    style={[
                      styles.amount,
                      { color: transaction.amount < 0 ? 'red' : 'green' },
                    ]}
                  >
                    {transaction.amount.toLocaleString('vi-VN')} đ
                  </Text>
                  <Text style={styles.date}>{transaction.date}</Text>
                </View>
              </View>
              ))}
            </View>
          )}
          keyExtractor={(item) => item.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  yearSelector: {
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: 'center',
    backgroundColor: "#007BFF",
    padding: 5, 
    paddingHorizontal:20,

  },
  yearButton: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    color: "white",
  },
  transactionContainer: {
    marginBottom: 10,
  },
  yearText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "white",
  },
  noTransactions: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginTop: 50,
  },
  monthHeader: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    elevation: 2,
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    backgroundColor: "#007BFF",
  },
  monthTitle: {
    fontSize: 16 ,
    fontWeight: 'bold',
    color: "white",
  },
  monthTotal: {
    fontSize: 16,
    color: 'white',
  },
  icon: {
    width: 40,
    height: 40,
    paddingTop: 8,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  transaction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRightWidth: 3,
    borderRadius: 8,
    marginBottom: 5,
    padding: 5,
    marginLeft: 10,
    marginRight: 10,
    paddingLeft: 20,
    paddingRight: 20,
    
  },
  details: {
    flex: 1,
  },
  category: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  wallet: {
    fontSize: 14,
    color: '#555',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TransactionScreen;