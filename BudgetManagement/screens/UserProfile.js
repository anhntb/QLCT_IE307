import React, { useState, useContext } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Button, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "../context/AuthContext";

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

  const { logout } = useContext(AuthContext);

  return (
    <View style={styles.userContainer}>
      {/* Avatar */}
      <TouchableOpacity onPress={isEditing ? pickImage : null}>
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
          <Text style={styles.text}>{birthDate.toLocaleDateString()}</Text>
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
        <TouchableOpacity style={styles.button} onPress={toggleEdit}>
          <Text style={styles.buttonText}>{isEditing ? "Lưu" : "Chỉnh sửa"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={logout}>
          <Text style={styles.buttonText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
   userContainer: {
    marginTop: 20, 
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  avatar: {
    width: 120,
    height: 120,
    objectFit: "cover",
    borderRadius: 60,
    backgroundColor: "#ddd",
    marginBottom: 20,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 4,
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
  button: {
    backgroundColor: "#007bff",
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
});
