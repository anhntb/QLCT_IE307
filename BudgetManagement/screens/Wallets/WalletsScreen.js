import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Alert,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Button,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { initializeDatabase, insertWallet, fetchAllWallets, updateWalletAmount, deleteWallet, updateWalletInfo  } from "../../db/db";
import { useFocusEffect } from '@react-navigation/native';

export default function WalletsScreen() {
  const [wallets, setWallets] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newWallet, setNewWallet] = useState({
    name: "",
    amount: "",
    note: "",
  });
  const [isTransferModalVisible, setTransferModalVisible] = useState(false);
  const [transferData, setTransferData] = useState({
    amount: "",
    fromWallet: "",
    toWallet: "",
    note: "",
  });

  useEffect(() => {
    initializeDatabase();
    loadWallets();
  }, []);
  
  useFocusEffect(
    useCallback(() => {
    loadWallets();
    }, [])
  );

  const loadWallets = async () => {
    const allWallets = await fetchAllWallets();
    setWallets(allWallets);
  };

  const toggleModal = () => setModalVisible(!isModalVisible);

  const toggleTransferModal = () => setTransferModalVisible(!isTransferModalVisible);

  const handleAddWallet = async () => {
    const { name, amount, note } = newWallet;
    if (name && amount) {
      insertWallet(name, parseFloat(amount), note || "");
      setNewWallet({ name: "", amount: "", note: "" });
      toggleModal();
      loadWallets();
    }
  };

  const handleTransfer = async () => {
    const { amount, fromWallet, toWallet } = transferData;
    if (amount && fromWallet && toWallet && fromWallet !== toWallet) {
      const transferAmount = parseFloat(amount);
      const fromWalletData = wallets.find(wallet => wallet.id === fromWallet);
      const toWalletData = wallets.find(wallet => wallet.id === toWallet);

      if (fromWalletData && toWalletData && fromWalletData.amount >= transferAmount) {
        updateWalletAmount(fromWallet, (- transferAmount));
        updateWalletAmount(toWallet, transferAmount);
        setTransferData({ amount: "", fromWallet: "", toWallet: "", note: "" });
        toggleTransferModal();
        loadWallets();
      }
    }
  };

  const handleDeleteWallet = (id) => {
    Alert.alert(
        'Xác nhận xóa',
        'Bạn có chắc muốn xóa ví tiền này không??',
        [
            { text: 'Hủy', style: 'cancel' },
            { 
                text: 'Xóa', 
                onPress: async () => {
                    await deleteWallet(id);
                    loadWallets();
                },
                style: 'destructive'
            },
        ]
    );
};
const totalAmount = wallets.reduce((sum, wallet) => sum + wallet.amount, 0);

  return (
    <View style={styles.allWalletscontainer}>
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Tổng tiền: {totalAmount.toLocaleString()} VND</Text>
      </View>

      <FlatList
        data={wallets}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.walletContainer}>
            <View style={styles.walletHeader}>
              <Text style={styles.walletName}>{item.name}</Text>
              <Text style={styles.walletAmount}>
                {item.amount.toLocaleString()} VND
              </Text>
            </View>
            <View style={styles.walletMore}>
              <Text style={styles.walletNote}>{item.note}</Text>
              <View style={styles.walletActions}>
                <TouchableOpacity onPress={() => setTransferData({ ...transferData, fromWallet: item.id }) || toggleTransferModal()}>
                  <FontAwesome name="exchange" size={22} color="gray" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteWallet(item.id) } style={styles.deleteWalletIcon}>
                  <FontAwesome name="trash" size={22} color="gray" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={toggleModal}>
        <FontAwesome name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      <Modal visible={isTransferModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chuyển Tiền</Text>
            <TextInput
              style={styles.input}
              placeholder="Số tiền"
              keyboardType="numeric"
              value={transferData.amount}
              onChangeText={(text) => setTransferData({ ...transferData, amount: text })}
            />
            
              <Text style={styles.label}>Từ:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={transferData.fromWallet}
                style={{color: "white"}}
                onValueChange={(value) => setTransferData({ ...transferData, fromWallet: value })}
              >
                {wallets
                  .filter(wallet => wallet.id === transferData.fromWallet)
                  .map(wallet => (
                    <Picker.Item key={wallet.id} label={wallet.name} value={wallet.id} />
                  ))}
              </Picker>
            </View>
            
            <Text style={styles.label}>Đến:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={transferData.toWallet}
                style={{color: "white"}}
                onValueChange={(value) => setTransferData({ ...transferData, toWallet: value })}
              >
                {wallets
                  .filter(wallet => wallet.id !== transferData.fromWallet)
                  .map(wallet => (
                    <Picker.Item key={wallet.id} label={wallet.name} value={wallet.id} />
                  ))}
              </Picker>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Ghi chú"
              value={transferData.note}
              onChangeText={(text) => setTransferData({ ...transferData, note: text })}
            />
            <View style={styles.modalButtons}>
              <Button title="Hủy" onPress={toggleTransferModal} color="#F7637D" />
              <Button title="Lưu" onPress={handleTransfer} color="#26A071"/>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thêm Ví Mới</Text>
            <TextInput
              style={styles.input}
              placeholder="Tên ví"
              value={newWallet.name}
              onChangeText={(text) => setNewWallet({ ...newWallet, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Số tiền ban đầu"
              keyboardType="numeric"
              value={newWallet.amount}
              onChangeText={(text) => setNewWallet({ ...newWallet, amount: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Ghi chú (không bắt buộc)"
              value={newWallet.note}
              onChangeText={(text) => setNewWallet({ ...newWallet, note: text })}
            />
            <View style={styles.modalButtons}>
              <Button title="Hủy" onPress={toggleModal} color="#F7637D" />
              <Button title="Lưu lại" onPress={handleAddWallet}  color="#26A071"/>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
    allWalletscontainer: {
    marginTop: 10,
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  pickerContainer:{
    backgroundColor: "#4BBF87",
    borderRadius: 10,
    marginVertical: 5,
  },
  totalContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#065A4A",
    borderRadius: 10,
    elevation: 2,
  },
  walletName:{
    backgroundColor: "#007BFF",
    
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  walletContainer: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
  },
  walletHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  deleteWalletIcon: {
    marginLeft: 30,
  },
  walletName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  walletAmount: {
    fontSize: 18,
    color: "#26A071",
    fontWeight: "bold",
  },
  walletMore:{
    flexDirection: "row",
    paddingRight: 5,
    alignItems: "center",
    justifyContent: "space-between",
  },
  walletActions: {
    flexDirection: "row",
    marginTop: 10,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#26A071",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 60,
  },
});
