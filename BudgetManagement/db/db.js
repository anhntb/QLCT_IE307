import * as SQLite from 'expo-sqlite';

let db;

// Mở hoặc tạo cơ sở dữ liệu SQLite
export const openDatabase = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('BudgetManager.db');
    console.log('Database opened successfully');
  }
  return db;
};

// Khởi tạo bảng "wallets" nếu chưa tồn tại
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
    console.log('Database initialized: wallets table created');
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
