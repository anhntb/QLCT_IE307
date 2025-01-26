import * as SQLite from 'expo-sqlite';
// import transactions from '../data/transactions';

let db;

// Mở hoặc tạo cơ sở dữ liệu SQLite
export const openDatabase = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('BudgetManager.db');
    console.log('Database opened successfully');
  }
  return db;
};

// Khởi tạo bảng "wallets", "transaction" nếu chưa tồn tại
export const initializeDatabase = async () => {
  const db = await openDatabase();
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS wallets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        amount REAL NOT NULL,
        note TEXT
      );
      
    `);
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        date TEXT NOT NULL,
        walletId INTEGER NOT NULL,
        note TEXT,
        icon TEXT,
        FOREIGN KEY (walletId) REFERENCES wallets(id)
      );
    `);
    console.log('Database initialized: Tables created');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

// Thêm ví mới
export const insertWallet = async (name, amount, note = '') => {
  const db = await openDatabase();
  try {
    const result = await db.runAsync(
      'INSERT INTO wallets (name, amount, note) VALUES (?, ?, ?);',
      name, amount, note
    );
    console.log('Wallet inserted with ID:', result.lastInsertRowId);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Insert wallet error:', error);
    throw error;
  }
};

// Xóa ví theo ID
export const deleteWallet = async (id) => {
  const db = await openDatabase();
  try {
    const result = await db.runAsync(
      'DELETE FROM wallets WHERE id = ?;',
      id
    );
    console.log('Wallet deleted with ID:', id);
    return result.changes;
  } catch (error) {
    console.error('Delete wallet error:', error);
    throw error;
  }
};
// Xóa ví theo name
export const deleteWalletByName = async (name) => {
  const db = await openDatabase();
  try {
    const result = await db.runAsync(
      'DELETE FROM wallets WHERE name = ?;',
      id
    );
    console.log('Wallet deleted with name:', name);
    return result.changes;
  } catch (error) {
    console.error('Delete wallet error:', error);
    throw error;
  }
};

// Cộng hoặc trừ tiền trong ví
export const updateWalletAmount = async (id, amountChange) => {
  const db = await openDatabase();
  try {
    const result = await db.runAsync(
      'UPDATE wallets SET amount = amount + ? WHERE id = ?;',
      amountChange, id
    );
    console.log('Wallet amount updated for ID:', id, 'and amount', amountChange);
    return result.changes;
  } catch (error) {
    console.error('Update wallet amount error:', error);
    throw error;
  }
};

// Sửa thông tin ví: tên và ghi chú
export const updateWalletInfo = async (id, name, note = '') => {
  const db = await openDatabase();
  try {
    const result = await db.runAsync(
      'UPDATE wallets SET name = ?, note = ? WHERE id = ?;',
      name, note, id
    );
    console.log('Wallet info updated for ID:', id);
    return result.changes;
  } catch (error) {
    console.error('Update wallet info error:', error);
    throw error;
  }
};

// Lấy danh sách tất cả ví
export const fetchAllWallets = async () => {
  const db = await openDatabase();
  try {
    const result = await db.getAllAsync('SELECT * FROM wallets;');
    console.log('All wallets fetched:', result);
    return result;
  } catch (error) {
    console.error('Fetch wallets error:', error);
    throw error;
  }
};

// Lấy thông tin chi tiết của một ví theo ID
export const fetchWalletById = async (id) => {
  const db = await openDatabase();
  try {
    const result = await db.getFirstAsync('SELECT * FROM wallets WHERE id = ?;', id);
    console.log('Wallet fetched with ID:', id, result);
    return result;
  } catch (error) {
    console.error('Fetch wallet by ID error:', error);
    throw error;
  }
};

// Lấy tất cả giao dịch
export const fetchAllTransactions = async () => {
  const db = await openDatabase();
  try {
    const transactions = await db.getAllAsync('SELECT * FROM transactions;');
    console.log('All wallets fetched:', transactions);
    return transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

// Thêm thu chi
export const insertTran = async (amount, category, date, walletId, note, icon = '') => {
  const db = await openDatabase();
  try {
    const result = await db.runAsync(
      'INSERT INTO transactions (amount, category, date, walletId, note, icon) VALUES (?, ?, ?, ?, ?, ?);',
      amount, category, date, walletId, note, icon
    );
    await updateWalletAmount(walletId, amount); // Cập nhật tiền trong ví
    
    console.log('Transaction inserted with ID:', result.lastInsertRowId);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Insert expense error:', error);
    throw error;
  }
};

// Xóa thu chi
export const deleteTran = async (id) => {
  const db = await openDatabase();
  try {
    const transaction = await db.getFirstAsync('SELECT * FROM transactions WHERE id = ?;', id);
    const result = await db.runAsync(
      'DELETE FROM transactions WHERE id = ?;',
      id
    );
    await updateWalletAmount(transaction.walletId, -transaction.amount); // Cập nhật tiền vào ví
    console.log('Transaction deleted with ID:', id);
    return result.changes;
  } catch (error) {
    console.error('Delete expense error:', error);
    throw error;
  }
};


{/* Xóa tất cả dữ liệu trong DATABASE */}

// // Hàm để đóng cơ sở dữ liệu
// export const closeDatabase = () => {
//   if (db) {
//     db.closeSync();
//     console.log('Database closed successfully');
//   }
// };

// // Hàm xóa tất cả dữ liệu trong cơ sở dữ liệu
// export const deleteAllData = async () => {
//   try {
//     closeDatabase();
//     await SQLite.deleteDatabaseAsync('BudgetManager.db');
//     console.log('Database deleted successfully');
//     // Mở lại cơ sở dữ liệu sau khi xóa
//     openDatabase();
//   } catch (error) {
//     console.error('Error deleting database:', error);
//     throw error;
//   }
// };

// // Sửa thu chi
// export const updateTran = async (id, amount, category, date, walletId, note = '') => {
//   const db = await openDatabase();
//   try {
//     const oldTran = await db.getFirstAsync('SELECT * FROM transactions WHERE id = ?;', id);
//     const result = await db.runAsync(
//       'UPDATE transactions SET amount = ?, category = ?, date = ?, walletId = ?, note = ? WHERE id = ?;',
//       amount, category, date, walletId, note, id
//     );
//     // cần sửa
//     await updateWalletAmount(oldTran.walletId, oldTran.amount); // Cộng lại tiền vào ví cũ
//     await updateWalletAmount(walletId, -amount); // Trừ tiền trong ví mới
//     console.log('Transactions updated with ID:', id);
//     return result.changes;
//   } catch (error) {
//     console.error('Update expense error:', error);
//     throw error;
//   }
// };

