import React, { useState, useEffect, useCallback} from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker"; // Thư viện chọn dropdown (npm install @react-native-picker/picker)
import { initializeDatabase, fetchAllWallets, fetchAllTransactions, getWalletName } from "../db/db";
import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';

const FilterTransactionsScreen = () => {
  // State cho bộ lọc
  const [filterType, setFilterType] = useState(""); // "thu" hoặc "chi"
  const [filterCategory, setFilterCategory] = useState(""); // Phân loại
  const [filterYear, setFilterYear] = useState(""); // Năm
  const [filterMonth, setFilterMonth] = useState(""); // Tháng
  const [filterDay, setFilterDay] = useState(""); // Ngày
  const [filterWallet, setFilterWallet] = useState(""); // Ví
  const [minValue, setMinValue] = useState(""); // Giá trị từ
  const [maxValue, setMaxValue] = useState(""); // Giá trị đến
  const [filteredTransactions, setFilteredTransactions] = useState(transactions); // Kết quả lọc

  const [transactions, setTransactions] = useState([]);
  // Danh sách các giá trị có sẵn
  const expenseCategories = [
    "Đồ ăn/Đồ uống",
    "Mua sắm",
    "Chi phí xăng",
    "Tiền nhà",
    "Giải trí",
    "Sức khỏe",
    "Khác",
  ];

  const incomeCategories = [
    "Thu nhập từ tài chính",
    "Lương",
    "Tiền trợ cấp",
    "Tiền từ các việc vặt",
    "Tiết kiệm cá nhân",
    "Khác",
  ];

  const [wallets, setWallets] = useState([]);
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
    
  const currentYear = new Date().getFullYear();

    // Tạo danh sách các năm từ năm hiện tại trở về quá khứ (hoặc có thể thêm năm tới)
  const years = Array.from({ length: 10 }, (_, index) => (currentYear - index).toString());

  const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

  const getWalletName = (walletId) => {
    const wallet = wallets.find(w => w.id === walletId);
    return wallet ? wallet.name : 'Ví đã bị xóa';
  };
  // Hàm lọc giao dịch
  const filterTransactions = () => {

    let results = transactions;

    if (filterType) {
      results = results.filter((t) => (filterType === "thu" ? t.amount > 0 : t.amount < 0));
    }
    if (filterCategory) {
      results = results.filter((t) => t.category === filterCategory);
    }
    if (filterYear) {
      results = results.filter((t) => t.date.startsWith(filterYear));
    }
    if (filterMonth) {
      results = results.filter((t) => t.date.split("-")[1] === filterMonth); 
    }
    if (filterWallet) {
      results = results.filter((t) => t.walletId === filterWallet);
    }
    if (minValue) {
      results = results.filter((t) => Math.abs(t.amount) > Number(minValue));
    }
    if (maxValue) {
      results = results.filter((t) => Math.abs(t.amount) < Number(maxValue));
    }

    setFilteredTransactions(results); // Cập nhật kết quả
  };

  return (
    <View style={styles.container}>
      {/* Bộ lọc Thu/Chi */}
      <View  style={styles.pickerStyle}>
        <Picker selectedValue={filterType} onValueChange={(itemValue) => setFilterType(itemValue)} >
          <Picker.Item label="Chọn loại giao dịch" value="" />
          <Picker.Item label="Thu nhập" value="thu" />
          <Picker.Item label="Chi tiêu" value="chi" />
        </Picker>
      </View>
      {/* Bộ lọc Phân loại */}
      <View  style={styles.pickerStyle}>
      <Picker selectedValue={filterCategory} onValueChange={(itemValue) => setFilterCategory(itemValue)} style={styles.picker}>
        <Picker.Item label="Chọn phân loại" value="" />
        {filterType === "thu" &&
          incomeCategories.map((category) => (
            <Picker.Item key={category} label={category} value={category} />
          ))}
        {filterType === "chi" &&
          expenseCategories.map((category) => (
            <Picker.Item key={category} label={category} value={category} />
          ))}
      </Picker>
      </View>
      {/* Bộ lọc Năm, Tháng*/}
      <View  style={styles.pickerStyle}>
      <Picker selectedValue={filterYear} onValueChange={(itemValue) => setFilterYear(itemValue)} style={styles.picker}>
        <Picker.Item label="Chọn năm" value="" />
        {years.map((year) => (
          <Picker.Item key={year} label={year} value={year} />
        ))}
      </Picker>
      </View>

      <View  style={styles.pickerStyle}>
      <Picker selectedValue={filterMonth} onValueChange={(itemValue) => setFilterMonth(itemValue)} style={styles.picker}>
        <Picker.Item label="Chọn tháng" value="" />
        {months.map((month) => (
          <Picker.Item key={month} label={month} value={month} />
        ))}
      </Picker>

      </View>
      {/* Bộ lọc Ví */}
      <View  style={styles.pickerStyle}>
      <Picker selectedValue={filterWallet} onValueChange={(itemValue) => setFilterWallet(itemValue)} style={styles.picker}>
        <Picker.Item label="Chọn ví" value="" />
        {wallets.map((wallet) => (
          <Picker.Item key={wallet} label={wallet.name} value={wallet.id} />
        ))}
      </Picker>
      </View>
      {/* Bộ lọc Giá trị */}
      <View  style={styles.pickerStyle}>
      <View style={styles.filterAmount}>
        <Text>Số tiền: </Text>
        <TextInput
          style={styles.input}
          value={minValue}
          placeholder="Nhỏ nhất"
          keyboardType="numeric"
      
          onChangeText={(text) => setMinValue(text)}
        />
        <Text> - </Text>
        <TextInput
          style={styles.input}
          value={maxValue}
          placeholder="Lớn nhẩt"
          keyboardType="numeric"
          onChangeText={(text) => setMaxValue(text)}
        />
      </View>
      
      </View>
      {/* Nút Lọc giao dịch */}
      <Button title="Lọc giao dịch" onPress={filterTransactions} color="#26A071"/>

      {/* Hiển thị kết quả */}
      <FlatList
      data={filteredTransactions}
      keyExtractor={(item) => item.id}
      style={styles.transactionsList}
      renderItem={({ item }) => (
        <View
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
        </View>
      )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    marginTop: 5,
    paddingHorizontal: 15,
  },
  title: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginBottom: 10 
  },
  pickerStyle: {
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 10,
  },
  input: { 
    borderBottomWidth: 1, 
    borderColor: "#ccc", 
    padding: 8, 
    width: 100,
    height: 45,
    marginVertical: 5, 
    borderRadius: 5 
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
    marginTop: 5,
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
  filterAmount:{
    flexDirection:"row", 
    alignItems: "center", 
    justifyContent: "space-between",
    paddingHorizontal: 17,
  },


});

export default FilterTransactionsScreen;
