import React, { createContext, useState, useEffect } from "react";
import { fetchAllWallets, initializeDatabase } from "../db/db";
export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [wallets, setWallets] = useState([]);

  useEffect(() => {
    initializeDatabase();
    loadWallets();
  }, []);

  const loadWallets = async () => {
    const allWallets = await fetchAllWallets();
    setWallets(allWallets);
  };

  return (
    <WalletContext.Provider value={{ wallets, loadWallets }}>
      {children}
    </WalletContext.Provider>
  );
};
