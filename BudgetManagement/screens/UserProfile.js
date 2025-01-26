import React, { useState, useContext } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Button, Platform, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "../context/AuthContext";
import { deleteAllData } from '../db/db'; // Import hàm xóa dữ liệu

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState("Senku");
  const [birthDate, setBirthDate] = useState(new Date(2000, 0, 1));
  const [gender, setGender] = useState("male");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthDate;
    setShowDatePicker(Platform.OS === "ios");
    setBirthDate(currentDate);
  };

  const formattedDate = birthDate.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const { logout } = useContext(AuthContext);

  // // Đặt lại dữ liệu
  // const handleResetData = () => {
  //   Alert.alert(
  //     "Đặt lại dữ liệu",
  //     "Bạn có chắc chắn muốn xóa toàn bộ dữ liệu không?",
  //     [
  //       {
  //         text: "Hủy",
  //         style: "cancel"
  //       },
  //       {
  //         text: "Đồng ý",
  //         onPress: async () => {
  //           try {
  //             await deleteAllData();
  //             Alert.alert("Thành công", "Dữ liệu đã được xóa.");
  //           } catch (error) {
  //             console.error('Error resetting data:', error);
  //             Alert.alert("Lỗi", "Không thể xóa dữ liệu.");
  //           }
  //         }
  //       }
  //     ]
  //   );
  // };

  return (
    <View style={styles.userContainer}>
      {/* Avatar */}
      <TouchableOpacity style={styles.avatarContainer} onPress={isEditing ? pickImage : null}>
        <Image
          source={
            avatar ? { uri: avatar } : require("../assets/default-avatar.jpg")
          }
          style={styles.avatar}
        />
        {isEditing && (
          <FontAwesome name="camera" size={24} color="gray" style={styles.cameraIcon} />
        )}
      </TouchableOpacity>

      {/* Name */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Họ và Tên:</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        ) : (
          <Text style={styles.text}>{name}</Text>
        )}
      </View>

      {/* Birth Date */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Ngày Sinh:</Text>
        <View style={styles.datePickerContainer}>
          <Text style={styles.text}>{formattedDate}</Text>
          {isEditing && (
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <FontAwesome name="calendar" size={24} color="gray" />
            </TouchableOpacity>
          )}
        </View>
        {showDatePicker && (
          <DateTimePicker
            value={birthDate}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
      </View>

      {/* Gender */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Giới Tính:</Text>
        {isEditing ? (
          <View style={styles.radioGroup}>
            <TouchableOpacity onPress={() => setGender("male")}>
              <Text style={styles.radioButton}>
                {gender === "male" ? "◉" : "◯"} Nam
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setGender("female")}>
              <Text style={styles.radioButton}>
                {gender === "female" ? "◉" : "◯"} Nữ
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.text}>{gender === "male" ? "Nam" : "Nữ"}</Text>
        )}
      </View>

      {/* Edit/Save Button */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.editButton} onPress={toggleEdit}>
          <Text style={styles.buttonText}>{isEditing ? "Lưu" : "Chỉnh sửa"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.buttonText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      {/* Nút Reset Data */}
      {/* <TouchableOpacity style={styles.resetButton} onPress={handleResetData}>
        <Text style={styles.buttonText}>Đặt lại dữ liệu</Text>
      </TouchableOpacity> */}
    </View>

  );
}

const styles = StyleSheet.create({
   userContainer: {
    marginTop: 10, 
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  avatar: {
    width: 120,
    height: 120,
    objectFit: "cover",
    backgroundColor: "#ddd",
    borderWidth: 2,
    padding: 10,
    borderRadius: 100,
    borderColor: "#26A071"
  },
  avatarContainer:{
    borderWidth: 2,
    borderRadius: 100,
    width: 130,
    height: 130,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderColor: "#26A071",

  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 100,
    padding: 4,
    color: "#26A071",
  },
  inputGroup: {
    width: "100%",
    marginVertical: 10,
    borderBottomWidth: 0.5,
    paddingBottom: 10,
    borderBlockColor: "gray",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 16,
  },
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  radioButton: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  editButton: {
    backgroundColor: "#4BBF87",
    padding: 15,
    margin: 20,
    borderRadius: 5,
  },
  logoutButton: {
    backgroundColor: "#F7637D",
    padding: 15,
    margin: 20,
    borderRadius: 5,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",

  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  // resetButton: {
  //   position: 'absolute',
  //   bottom: 20,
  //   left: 40,
  //   right: 40,
  //   padding: 10,
  //   backgroundColor: 'red',
  //   borderRadius: 5,
  //   alignItems: 'center',
  // },
});
