
import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { ethers } from 'ethers';

const WALLET_ADDRESS = '0x9F6ec8A7963F8baF181Bcdaf1A0208fc7EFfD4a9';
const RPC_URL = 'https://rpc.ankr.com/eth'; // 可换成任何公共 RPC

export default function App() {
  const [initialBalance, setInitialBalance] = useState(null);
  const [currentBalance, setCurrentBalance] = useState(null);

  useEffect(() => {
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

    async function fetchBalance() {
      try {
        const balance = await provider.getBalance(WALLET_ADDRESS);
        const ethBalance = parseFloat(ethers.utils.formatEther(balance));
        setCurrentBalance(ethBalance);

        if (initialBalance === null) {
          setInitialBalance(ethBalance);
        } else {
          const changePercent = ((ethBalance - initialBalance) / initialBalance) * 100;
          if (Math.abs(changePercent) >= 10) {
            Alert.alert('Wallet Balance Alert', `Balance changed by ${changePercent.toFixed(2)}%`);
            setInitialBalance(ethBalance); // 重置基准值
          }
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchBalance();
    const interval = setInterval(fetchBalance, 30000); // 每 30 秒检查一次

    return () => clearInterval(interval);
  }, [initialBalance]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Wallet Alarm</Text>
      <Text>Address: {WALLET_ADDRESS}</Text>
      <Text>Current Balance: {currentBalance ?? 'Loading...'} ETH</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'
  },
  header: {
    fontSize: 24, fontWeight: 'bold', marginBottom: 20
  }
});
