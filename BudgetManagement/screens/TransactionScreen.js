import React from 'react';
import { TouchableOpacity } from 'react-native';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';

const TransactionScreen = () => {
  const transactions = [
    {
      id: '1',
      amount: -90000,
      category: 'Mua sắm',
      date: '11/12/2024',
      wallet: 'TIỀN MẶT',
      note: '',
      icon: require('../assets/icon.png'), // Đường dẫn icon
    },
    {
      id: '2',
      amount: 500000,
      category: 'Thu nhập từ tài chính',
      date: '11/12/2024',
      wallet: 'VÍ MOMO',
      note: '',
      icon: require('../assets/icon.png'),
    },
    {
      id: '3',
      amount: -25000,
      category: 'Đồ ăn/Đồ uống',
      date: '10/12/2024',
      wallet: 'TIỀN MẶT',
      note: '',
      icon: require('../assets/icon.png'),
    },
    {
      id: '4',
      amount: 5000000,
      category: 'Lương',
      date: '10/12/2024',
      wallet: 'TIỀN MẶT',
      note: '',
      icon: require('../assets/icon.png'),
    },
  ];

  const renderTransaction = ({ item }) => {
    return (
      <TouchableOpacity style={styles.transaction}>
        <Image source={item.icon} style={styles.icon} />
        <View style={styles.details}>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.wallet}>{item.wallet}</Text>
        </View>
        <View style={styles.rightSection}>
          <Text
            style={[
              styles.amount,
              { color: item.amount < 0 ? 'red' : 'green' },
            ]}
          >
            {item.amount.toLocaleString('vi-VN')} đ
          </Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  transaction: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 10,
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
  rightSection: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: '#555',
  },
});

export default TransactionScreen;
