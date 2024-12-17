import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Button,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function WalletsScreen() {
  const [wallets, setWallets] = useState([
    { id: "1", name: "Tiền mặt", amount: 5000000, currency: "VND", note: "" },
    { id: "2", name: "Ví Momo", amount: 2000000, currency: "VND", note: "" },
    { id: "3", name: "BIDV", amount: 15000000, currency: "VND", note: "" },
  ]);

  const [isModalVisible, setModalVisible] = useState(false);
  const [newWallet, setNewWallet] = useState({
    name: "",
    currency: "",
    amount: "",
    note: "",
  });

  const totalAmount = wallets.reduce((sum, wallet) => sum + wallet.amount, 0);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleAddWallet = () => {
    if (newWallet.name && newWallet.currency && newWallet.amount) {
      setWallets([
        ...wallets,
        {
          id: (wallets.length + 1).toString(),
          name: newWallet.name,
          currency: newWallet.currency,
          amount: parseFloat(newWallet.amount),
          note: newWallet.note,
        },
      ]);
      setNewWallet({ name: "", currency: "", amount: "", note: "" });
      toggleModal();
    }
  };

  return (
    <View style={styles.allWalletscontainer}>
      {/* Total Amount */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Tổng tiền: {totalAmount.toLocaleString()} VND</Text>
      </View>

      {/* Wallet List */}
      <FlatList
        data={wallets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.walletContainer}>
            <View style={styles.walletHeader}>
              <Text style={styles.walletName}>{item.name}</Text>
              <Text style={styles.walletAmount}>
                {item.amount.toLocaleString()} {item.currency}
              </Text>
            </View>
            <View style={styles.walletActions}>
              <TouchableOpacity>
                <FontAwesome name="exchange" size={24} color="gray" />
              </TouchableOpacity>
              <TouchableOpacity>
                <FontAwesome name="info-circle" size={24} color="gray" />
              </TouchableOpacity>
              <TouchableOpacity>
                <FontAwesome name="ellipsis-h" size={24} color="gray" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={toggleModal}>
        <FontAwesome name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Add Wallet Modal */}
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
              placeholder="Đơn vị tiền tệ"
              value={newWallet.currency}
              onChangeText={(text) =>
                setNewWallet({ ...newWallet, currency: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Số tiền ban đầu"
              keyboardType="numeric"
              value={newWallet.amount}
              onChangeText={(text) =>
                setNewWallet({ ...newWallet, amount: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Ghi chú (không bắt buộc)"
              value={newWallet.note}
              onChangeText={(text) => setNewWallet({ ...newWallet, note: text })}
            />

            <View style={styles.modalButtons}>
              <Button title="Hủy" onPress={toggleModal} color="red" />
              <Button title="Lưu lại" onPress={handleAddWallet} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
    allWalletscontainer: {
    marginTop: 30,
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  totalContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
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
  walletName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  walletAmount: {
    fontSize: 16,
    color: "gray",
  },
  walletActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007bff",
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
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
