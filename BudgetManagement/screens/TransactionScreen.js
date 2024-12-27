import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';

//import transactions from '../data/transactions';
import { FontAwesome } from "@expo/vector-icons";
import { fetchAllTransactions, fetchAllWallets, deleteTran } from '../db/db';
import { useFocusEffect } from '@react-navigation/native';



const parseDate = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day); // Month is 0-based
};

const TransactionScreen = ({navigation}) => {
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear()); // Năm hiện tại
  
  useFocusEffect(
    useCallback(() => {
      loadTransactions();
      loadWallets();
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

  const loadWallets = async () => {
    try {
      const result = await fetchAllWallets();
      setWallets(result);
    } catch (error) {
      console.error('Error fetching wallets:', error);
    }
  };

  // Lấy tên ví theo id
  const getWalletName = (walletId) => {
    const wallet = wallets.find(w => w.id === walletId);
    return wallet ? wallet.name : '';
  };

  // Xóa giao dịch
  const handleDeleteTransaction = (transactionId) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn xóa giao dịch này không?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await deleteTran(transactionId);
              loadTransactions(); // Reload transactions after deletion
            } catch (error) {
              console.error('Error deleting transaction:', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

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
        <View style={styles.notFoundContainer}>
          <Text style={styles.noTransactions}>Không tìm thấy giao dịch</Text>
          <Image style={styles.notFoundImage} source={require('../assets/notfound.webp')}/>
        </View>
      ) : (
        <FlatList
          data={Object.keys(groupedTransactions).sort((a, b) => b - a)} // Sắp xếp tháng giảm dần
          renderItem={({ item: month }) => (
            <View style={styles.transactionContainer}>
              {/* Tháng và tổng cộng */}
              <View style={styles.monthHeader}>
                <Text style={styles.monthTitle}>Tháng {month}/{currentYear}</Text>
                <Text style={styles.monthTotal}>
                  Tổng thu:{" "}
                  {calculateTotal(groupedTransactions[month]).toLocaleString('vi-VN')} đ
                </Text>
              </View>

              {/* Các giao dịch trong tháng */}
              {groupedTransactions[month].map((transaction) => (
                <View
                  key={transaction.id} // Hoặc bất kỳ giá trị nào là duy nhất 
                  style={[styles.transaction, {borderColor: transaction.amount < 0 ? '#F7637D' : '#26A071' }]}  
                >
                {/* <Image source={transaction.icon} style={styles.icon} /> */}
                <FontAwesome name={transaction.icon} size={24} style={styles.icon}/>
                <View style={styles.details}>
                  <Text style={styles.category}>{transaction.category}</Text>
                  <Text style={styles.wallet}>{getWalletName(transaction.walletId)}</Text>
                </View>
                <View style={styles.rightSection}>
                  <Text
                    style={[
                      styles.amount,
                      { color: transaction.amount < 0 ? '#F7637D' : '#26A071' },
                    ]}
                  >
                    {transaction.amount.toLocaleString('vi-VN')} đ
                  </Text>
                  <Text style={styles.date}>{transaction.date}</Text>
                </View>
                <TouchableOpacity style={styles.delIcon} onPress={() => handleDeleteTransaction(transaction.id)}>
                    <FontAwesome name="trash" size={24} color="gray" />
                </TouchableOpacity>
              </View>
              ))}
            </View>
          )}
          keyExtractor={(item) => item.toString()}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("FilterTransaction")}>
        <FontAwesome name='filter' size={24} color="white" />
      </TouchableOpacity>
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
    backgroundColor: "#065A4A",
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
    backgroundColor: "#26A071",
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
    paddingHorizontal: 10,
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
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#26A071',
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  delIcon:{
    marginLeft: 6,
  },
  notFoundContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  notFoundImage:{
    marginTop: 100,
    width: 300,
    height: 300,
  }
});

export default TransactionScreen;