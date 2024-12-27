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

// Khởi tạo bảng "wallets", "expenses", "incomes" nếu chưa tồn tại
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
      CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        date TEXT NOT NULL,
        walletId INTEGER NOT NULL,
        note TEXT,
        FOREIGN KEY (walletId) REFERENCES wallets(id)
      );
    `);
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS incomes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        date TEXT NOT NULL,
        walletId INTEGER NOT NULL,
        note TEXT,
        FOREIGN KEY (walletId) REFERENCES wallets(id)
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

// Thêm chi tiêu
export const insertExpense = async (amount, category, date, walletId, note = '') => {
  const db = await openDatabase();
  try {
    const result = await db.runAsync(
      'INSERT INTO expenses (amount, category, date, walletId, note) VALUES (?, ?, ?, ?, ?);',
      amount, category, date, walletId, note
    );
    await updateWalletAmount(walletId, -amount); // Trừ tiền trong ví
    
    console.log('Expense inserted with ID:', result.lastInsertRowId);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Insert expense error:', error);
    throw error;
  }
};

// Xóa chi tiêu
export const deleteExpense = async (id) => {
  const db = await openDatabase();
  try {
    const expense = await db.getFirstAsync('SELECT * FROM expenses WHERE id = ?;', id);
    const result = await db.runAsync(
      'DELETE FROM expenses WHERE id = ?;',
      id
    );
    await updateWalletAmount(expense.walletId, expense.amount); // Cộng lại tiền vào ví
    console.log('Expense deleted with ID:', id);
    return result.changes;
  } catch (error) {
    console.error('Delete expense error:', error);
    throw error;
  }
};

// Sửa chi tiêu
export const updateExpense = async (id, amount, category, date, walletId, note = '') => {
  const db = await openDatabase();
  try {
    const oldExpense = await db.getFirstAsync('SELECT * FROM expenses WHERE id = ?;', id);
    const result = await db.runAsync(
      'UPDATE expenses SET amount = ?, category = ?, date = ?, walletId = ?, note = ? WHERE id = ?;',
      amount, category, date, walletId, note, id
    );
    await updateWalletAmount(oldExpense.walletId, oldExpense.amount); // Cộng lại tiền vào ví cũ
    await updateWalletAmount(walletId, -amount); // Trừ tiền trong ví mới
    console.log('Expense updated with ID:', id);
    return result.changes;
  } catch (error) {
    console.error('Update expense error:', error);
    throw error;
  }
};

// Tương tự cho thu nhập
export const insertIncome = async (amount, category, date, walletId, note = '') => {
  const db = await openDatabase();
  try {
    const result = await db.runAsync(
      'INSERT INTO incomes (amount, category, date, walletId, note) VALUES (?, ?, ?, ?, ?);',
      amount, category, date, walletId, note
    );
    await updateWalletAmount(walletId, amount); // Cộng tiền vào ví
    console.log('Income inserted with ID:', result.lastInsertRowId);
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Insert income error:', error);
    throw error;
  }
};

export const deleteIncome = async (id) => {
  const db = await openDatabase();
  try {
    const income = await db.getFirstAsync('SELECT * FROM incomes WHERE id = ?;', id);
    const result = await db.runAsync(
      'DELETE FROM incomes WHERE id = ?;',
      id
    );
    await updateWalletAmount(income.walletId, -income.amount); // Trừ tiền trong ví
    console.log('Income deleted with ID:', id);
    return result.changes;
  } catch (error) {
    console.error('Delete income error:', error);
    throw error;
  }
};

export const updateIncome = async (id, amount, category, date, walletId, note = '') => {
  const db = await openDatabase();
  try {
    const oldIncome = await db.getFirstAsync('SELECT * FROM incomes WHERE id = ?;', id);
    const result = await db.runAsync(
      'UPDATE incomes SET amount = ?, category = ?, date = ?, walletId = ?, note = ? WHERE id = ?;',
      amount, category, date, walletId, note, id
    );
    await updateWalletAmount(oldIncome.walletId, -oldIncome.amount); // Trừ tiền trong ví cũ
    await updateWalletAmount(walletId, amount); // Cộng tiền vào ví mới
    console.log('Income updated with ID:', id);
    return result.changes;
  } catch (error) {
    console.error('Update income error:', error);
    throw error;
  }
};