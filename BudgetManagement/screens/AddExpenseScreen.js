import React, { useState, useEffect, useCallback } from 'react';
import {
SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Modal,
  FlatList,
  ScrollView,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { fetchAllWallets, initializeDatabase, insertTran } from '../db/db';
import { useFocusEffect } from '@react-navigation/native';


const AddExpenseScreen = ({navigation}) => {
  const [checked, setChecked] = useState(false);
  const [date, setDate] = useState(new Date());
  const [note, setNote] = useState('');
  const [amount, setAmount] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState("Đồ ăn/Đồ uống");
  const [selectedCategoryIcon, setSelectedCategoryIcon] = useState("cutlery");
  const [selectedWalletId, setSelectedWalletId] = useState(false);
  const [selectedWalletName, setSelectedWalletName] = useState("Ví");
  const [wallets, setWallets] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadWallets();
  }, []);

  const loadWallets = async () => {
    try {
      const result = await fetchAllWallets();
      setWallets(result);
    } catch (error) {
      console.error('Error fetching wallets:', error);
    }
  };


  const handleWalletPress = () => {
    setModalVisible(true);
  };

  const handleWalletSelect = (wallet) => {
    setSelectedWalletId(wallet.id);
    setSelectedWalletName(wallet.name);
    setModalVisible(false);
  };

  const categories = [
    { name: "Đồ ăn/Đồ uống", icon: "cutlery" },
    { name: "Mua sắm", icon: "shopping-cart" },
    { name: "Chi phí xăng", icon: "car"},
    { name: "Tiền nhà", icon: "home"},
    { name: "Giải trí", icon: "gamepad" },
    { name: "Du lịch", icon: "plane" },
    { name: "Sửa chữa", icon: "wrench" },
    { name: "Sức khỏe", icon: "medkit"},
    { name: "Khác", icon: "ellipsis-h" },
  ];

  // Thêm hàm để xử lý lưu chi tiêu
  const handleSaveExpense = async () => {
    try {
      if (!amount || !selectedCategoryName || !date || !selectedWalletId) {
        Alert.alert('Error', 'Vui lòng điền đủ thông tin!');
        return;
      }
      
      const selectedWallet = wallets.find(wallet => wallet.id === selectedWalletId);
      if (selectedWallet && parseFloat(amount) > selectedWallet.amount) {
        Alert.alert('Error', 'Số dư không đủ để thực hiện giao dịch!');
        return;
      }

      await insertTran(-amount, selectedCategoryName, date.toISOString().split('T')[0], selectedWalletId, note, selectedCategoryIcon);
      await loadWallets(); // Reload dữ liệu ví sau khi lưu chi tiêu
      navigation.navigate('Home'); // Điều hướng trở lại màn hình Home
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategoryName(category.name);
    setSelectedCategoryIcon(category.icon);
    setCategoryModalVisible(false);
  };

  const handleSwitchToggle = () => setChecked(!checked);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const formattedDate = date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const handleGoBack = () => {
      if (navigation) {
        navigation.goBack();
      } else {
        Alert.alert('Navigation', 'Returning to home screen...');
      }
    };

  return (
    
    <SafeAreaView style={styles.container}>
      <ScrollView>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
            <FontAwesome name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Chi phí mới</Text>
      </View>

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Giá trị"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        {/* Category Section */}
        <View style={styles.categoryContainer}>
          <FontAwesome name={selectedCategoryIcon} size={24} />
          <Text style={styles.categoryText}>{selectedCategoryName}</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setCategoryModalVisible(true)}
          >
          <FontAwesome name="plus" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Category Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={categoryModalVisible}
          onRequestClose={() => setCategoryModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Chọn danh mục</Text>
              <FlatList
                data={categories}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => handleCategorySelect(item)}
                  >
                    <FontAwesome name={item.icon} size={24} />
                    <Text style={styles.modalItemText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setCategoryModalVisible(false)}
              >
                <Text style={styles.modalCloseButtonText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      <View style={styles.fieldContainer}>
        <FontAwesome name="university" size={24} color="#000" />
        <TouchableOpacity onPress={handleWalletPress}>
        <Text style={styles.fieldText}>{selectedWalletName}</Text>
        </TouchableOpacity>

      {/* Wallet Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Chọn ví</Text>
            <FlatList
              data={wallets}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleWalletSelect(item)} style={styles.modalItem}>
                  <Text style={styles.walletItem}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>

        <View style={styles.fieldContainer}>
          <FontAwesome name="calendar" size={24} color="#000" />
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text style={styles.fieldText}>{formattedDate}</Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
            locale="vi-VN"
          />
        )}

        <View style={styles.fieldContainer}>
          <FontAwesome name="user" size={24} color="#000" />
          <TextInput style={styles.fieldText}
                    placeholder="Đến (Không bắt buộc)"
          ></TextInput>
        </View>

        <View style={styles.fieldContainer}>
          <FontAwesome name="pencil" size={24} color="#000" />
          <TextInput style={styles.fieldText}
                    value={note}
                    onChangeText={setNote}
                    placeholder="Ghi chú (Không bắt buộc)"
          ></TextInput>
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.switchText}>Đã kiểm tra</Text>
          <Switch value={checked} onValueChange={handleSwitchToggle} />
        </View>
      </View>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={handleGoBack} style={styles.cancelButton}>
          <Text style={styles.buttonText}>HỦY</Text>
        </TouchableOpacity>
        {/* Gọi hàm `handleSaveExpense` khi người dùng nhấn nút lưu */}
        <TouchableOpacity onPress={handleSaveExpense} style={styles.saveButton}>
          <Text style={styles.buttonText}>LƯU LẠI</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </SafeAreaView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d32f2f',
    padding: 16,
  },
  headerText: {
    color: '#fff',
    fontSize: 23,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  inputContainer: {
    padding: 16,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 16,
    fontSize: 23,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryText: {
    fontSize: 20,
    marginLeft: 8,
    flex: 1,
  },
  addButton: {
    backgroundColor: '#d32f2f',
    padding: 8,
    borderRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  modalItemText: {
    fontSize: 16,
    marginLeft: 15,
  },
  modalCloseButton: {
    backgroundColor: '#d32f2f',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  fieldText: {
    fontSize: 20,
    marginLeft: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  walletItem: {
    padding: 10,
    fontSize: 18,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchText: {
    fontSize: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#d32f2f',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#d32f2f',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddExpenseScreen;
