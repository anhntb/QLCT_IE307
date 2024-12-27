
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
  SafeAreaView,
} from 'react-native';
import MonthOverview from './Overview/MonthOverview';
import transactions from '../data/transactions';
import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';
import { initializeDatabase, fetchAllWallets, fetchAllTransactions, getWalletName} from '../db/db';

const HomeScreen = ({navigation}) => {

    const [wallets, setWallets] = useState([]);
    const [transactions, setTransactions] = useState([]);

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
    const last7DaysTransactions = useMemo(() => {
      const currentDate = new Date(); // Ngày hiện tại
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(currentDate.getDate() - 7); // Ngày cách đây 7 ngày
  
      return transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date); // Chuyển date của giao dịch thành dạng Date
        return transactionDate >= sevenDaysAgo && transactionDate <= currentDate; // Lọc trong khoảng thời gian
      });
    }, [transactions]);
    // Sắp xếp giao dịch theo thứ tự thời gian (từ sớm đến trễ)
    const sortedTransactions = [...last7DaysTransactions].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
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
    <View style={{flex: 1,}}>
    <View style={styles.homeContainer}> 
    <TouchableOpacity style={styles.componentContainer} onPress={() => navigation.navigate("Overview")}>
      <Text style={styles.title}>Sơ lược</Text>
      <View style={styles.overviewContainer}>
        {overviewData && <MonthOverview data={overviewData} isHideRemainder={false} />}
      </View>
    </TouchableOpacity>

    {/* Các ví */}
    <TouchableOpacity style={styles.componentContainer} onPress={() => navigation.navigate("Wallets")}>
      <Text style={styles.title}>Ví của tôi</Text>
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
    <View style={styles.componentContainer} >
      <Text style={styles.title} onPress={() => navigation.navigate("Transaction")}>Các giao dịch 7 ngày qua</Text>

      {/* Tab */} 
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            filter === "all" && styles.activeTabButton,
          ]}
          onPress={() => setFilter("all")}
        >
          <Text style={[styles.tabText, filter === "all" && styles.activeTabText]}>
            Tất cả
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            filter === "income" && styles.activeTabButton,
          ]}
          onPress={() => setFilter("income")}
        >
          <Text style={[styles.tabText, filter === "income" && styles.activeTabText]}>
            Thu
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            filter === "expense" && styles.activeTabButton,
          ]}
          onPress={() => setFilter("expense")}
        >
          <Text style={[styles.tabText, filter === "expense" && styles.activeTabText]}>
            Chi
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
      data={filteredTransactions}
      keyExtractor={(item) => item.id}
      style={styles.transactionsList}
      renderItem={({ item }) => (
      
        <TouchableOpacity onPress={() => navigation.navigate("Transaction")}
          style={[
            styles.transaction,
            { borderRightColor: item.amount < 0 ? "#F7637D" : "#26A071" },
          ]}
        >
          <FontAwesome name={item.icon} size={22} style={styles.icon}/>
          <View style={styles.details}>
            <Text style={styles.category}>{item.category}</Text>
            <Text style={styles.wallet}>{getWalletName(item.walletId)}</Text>
          </View>
          <View style={styles.rightSection}>
            <Text
              style={[
                styles.amount,
                { color: item.amount < 0 ? "#F7637D" : "#26A071" },
              ]}
            >
              {item.amount.toLocaleString("vi-VN")} đ
            </Text>
            <Text style={styles.date}>{item.date}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
    </View>
      
 
   
    </View>
    <View style={{justifyContent: 'flex-end'}}>
      <View style={styles.optionsContainer}>
        {open &&
          renderOption('Chuyển tiền', 'exchange', '#6B82FE', () =>{
            navigation.navigate("Wallets");
            setOpen(!open);
          }
            
          )}
        {open &&
          renderOption('Thu nhập', 'plus', '#26A071', () =>{
            navigation.navigate("AddIncome");
            setOpen(!open);
          }
          )}
        {open &&
          renderOption('Chi phí', 'minus', '#F7637D', () =>{
            navigation.navigate("AddExpense");
            setOpen(!open);
          }
          )}
      </View>
      
      {/* Floating Action Button */}
      <View style={{flex: 1 }}>
        <TouchableOpacity style={styles.fab} onPress={toggleMenu}>
          <FontAwesome name={open ? 'close' : 'plus'} size={24} color="white" />
        </TouchableOpacity>
      </View>
      </View>

    </View>
        
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
    marginBottom: 8,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 5,
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
    color: "#26A071",
    fontWeight: "bold",
  },
  transaction: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRightWidth: 3,
    borderRadius: 8,
    marginBottom: 5,
    padding: 2,
    paddingHorizontal: 10,
    elevation: 1,
  },
  transactionsList:{
    height: 160,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  tabButton: {
    paddingVertical: 3,
    borderWidth: 1,
    height: 35,
    width: 100,
    alignItems: "center",
    paddingHorizontal: 10,
    borderColor: "#26A071",
    borderRadius: 8,
    backgroundColor: "white",
  },

  activeTabButton: {
    backgroundColor: "#26A071",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "#26A071",
  },
  activeTabText: {
    color: "white",
    fontWeight: "bold",
  },
  icon: {
    width: 40,
    height: 40,
    paddingTop: 8,
  },
  details: {
    flex: 1,
  },
  category: {
    fontSize: 16,
    fontWeight: "bold",
  },
  titleStyle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  linkStyle: {
    fontSize: 16,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#065A4A',
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 100,
    right: 30,
  },
  actionButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 50,
    elevation: 3,
    width: 50,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginLeft: 10,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: "bold",
    fontSize: 16,
    backgroundColor: '#26A071',
    borderRadius: 5,
    padding: 5,
  },

})