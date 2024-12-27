
import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SectionList
} from 'react-native';
import { useContext } from 'react';
import MonthOverview from './Overview/MonthOverview';
import { WalletContext } from '../context/WalletContext';
import transactions from '../data/transactions';
import { FontAwesome } from "@expo/vector-icons";
import { initializeDatabase, fetchAllWallets } from '../db/db';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = ({navigation}) => {
    const [wallets, setWallets] = useState([]);
    useEffect(() => {
        initializeDatabase();
        loadWallets();
      }, []);
    
      const loadWallets = async () => {
        const allWallets = await fetchAllWallets();
        setWallets(allWallets);
      };
    //Floating Button
    const [open, setOpen] = useState(false);
    const [animation] = useState(new Animated.Value(0));

    const toggleMenu = () => {
    const toValue = open ? 0 : 1;

    Animated.timing(animation, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setOpen(!open);
   };

   useFocusEffect(
    useCallback(() => {
      loadWallets();
    }, [])
  );

  // const loadWallets = async () => {
  //   try {
  //     const result = await fetchAllWallets();
  //     setWallets(result);
  //   } catch (error) {
  //     console.error('Error fetching wallets:', error);
  //   }
  // };

    const renderOption = (title, iconName, color, onPress) => {
    return (
      <View style={styles.actionButtonContainer}>
      <Text style={styles.actionButtonText}>{title}</Text>

      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: color }]}
        onPress={onPress}
      >
        <FontAwesome name={iconName} size={20} color="white" />
      </TouchableOpacity>
      </View>
    );
    };

    const buttonStyle = {
    transform: [
      {
        scale: animation,
      },
    ],
    };
  
    // Sắp xếp giao dịch theo thứ tự thời gian (từ sớm đến trễ)
    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    
    const [filter, setFilter] = useState("all"); // Trạng thái mặc định là "Tất cả"

    // Lọc giao dịch dựa trên trạng thái filter
    const filteredTransactions = sortedTransactions.filter((item) => {
      if (filter === "all") return true;
      if (filter === "income") return item.amount > 0;
      if (filter === "expense") return item.amount < 0;
    });

    const calculateTotals = () => {
      let totalIncome = 0;
      let totalExpense = 0;
  
      transactions.forEach((transaction) => {
        if (transaction.amount > 0) {
          totalIncome += transaction.amount;
        } else {
          totalExpense += transaction.amount;
        }
      });
  
      return { totalIncome, totalExpense };
    };
  
    const { totalIncome, totalExpense } = calculateTotals();
    const totalAmount = wallets.reduce((sum, wallet) => sum + wallet.amount, 0);

    const overviewData = {
      month: 'Tổng thu - chi',
      income: totalIncome,
      expense: totalExpense,
      total: totalAmount
    }
    return(
    // Sơ lược

    <ScrollView style={styles.homeContainer}> 
    <TouchableOpacity style={styles.componentContainer} onPress={() => navigation.navigate("Overview")}>
      <Text style={styles.title}>Sơ lược</Text>
      <View style={styles.overviewContainer}>
        {month12Data && <MonthOverview data={month12Data} />}
      </View>
    </TouchableOpacity>

    {/* Các ví */}
    <TouchableOpacity style={styles.componentContainer} onPress={() => navigation.navigate("Wallets")}>
      <Text style={styles.title}>Các tài khoản</Text>
      <View>
         <FlatList
          data={wallets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.walletItem}>
              <Text style={styles.walletName}>{item.name}</Text>
              <Text style={styles.walletAmount}>{item.amount.toLocaleString()} VND</Text>
            </View>
          )}
        />
      </View>
    </TouchableOpacity>
    
    {/* Các giao dịch */}
    <TouchableOpacity style={styles.componentContainer} onPress={() => navigation.navigate("Transaction")}>
      <Text style={styles.title}>Các giao dịch</Text>
      <View>
        <FlatList
        data={sortedTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.transaction,
              { borderRightColor: item.amount < 0 ? "red" : "green" },
            ]}
          >
            <Image source={item.icon} style={styles.icon} />
            <View style={styles.details}>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.wallet}>{item.wallet}</Text>
            </View>
            <View style={styles.rightSection}>
              <Text
                style={[
                  styles.amount,
                  { color: item.amount < 0 ? "red" : "green" },
                ]}
              >
                {item.amount.toLocaleString("vi-VN")} đ
              </Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
          </View>
        )}
      />
      </View>
    </TouchableOpacity>
    </ScrollView>
        
    )
}
export default HomeScreen;

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  componentContainer: {
    marginBottom: 20,

  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 2,
    textAlign: "center",
  },

  walletItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    marginBottom: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
  },
  walletName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  walletAmount: {
    fontSize: 16,
    color: "green",
    fontWeight: "bold",
  },
  transaction: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRightWidth: 3,
    borderRadius: 8,
    marginBottom: 5,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
    elevation: 1,
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
    fontWeight: "bold",
  },
})