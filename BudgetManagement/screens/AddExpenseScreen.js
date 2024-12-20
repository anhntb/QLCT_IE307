import React, { useState } from 'react';
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
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddExpenseScreen = () => {
  const [checked, setChecked] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Đồ ăn/Đồ uống");

  const categories = [
    "Đồ ăn/Đồ uống",
    "Mua sắm",
    "Chi phí xăng",
    "Tiền nhà",
    "Giải trí",
    "Sức khỏe",
    "Khác",
  ];

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
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
        />

        {/* Category Section */}
        <View style={styles.categoryContainer}>
          <FontAwesome name="shopping-cart" size={24} color="#007aff" />
          <Text style={styles.categoryText}>{selectedCategory}</Text>
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
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => handleCategorySelect(item)}
                  >
                    <Text style={styles.modalItemText}>{item}</Text>
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
          <Text style={styles.fieldText}>Ví</Text>
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
        <TouchableOpacity onPress={handleGoBack} style={styles.saveButton}>
          <Text style={styles.buttonText}>LƯU LẠI</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    marginTop: 20,
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
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  modalItemText: {
    fontSize: 16,
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
