import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView
} from 'react-native';
import { useContext } from 'react';
import MonthOverview from './Overview/MonthOverview';
import { monthlyData } from '../data/monthlyData';
import { WalletContext } from '../context/WalletContext';
import transactions from '../data/transactions';

const HomeScreen = ({navigation}) => {
    const month12Data = monthlyData.find((item) => item.month === 'Tháng Mười Hai 2024'); 
    const { wallets } = useContext(WalletContext);
    
  
    // Sắp xếp giao dịch theo thứ tự thời gian (từ sớm đến trễ)
    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );


    return(
    // Sơ lược

    <View style={styles.homeContainer}> 
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
    
    </View>
        
    )
}
export default HomeScreen;

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    padding: 10,
  },
  componentContainer: {
    marginBottom: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 2,
  },
  overview: {
    backgroundColor: "red",
  },
  walletItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    marginBottom: 10,
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
    color: "gray",
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