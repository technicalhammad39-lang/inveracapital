import React from 'react';
import { getWalletData, getPaymentMethods } from '@/app/actions/walletActions';
import { getBankAccounts, getCryptoWallets } from '@/app/actions/profileActions';
import { getRecentLedgers } from '@/app/actions/dashboardActions';
import WalletClient from '@/components/dashboard/WalletClient';

export default async function WalletPage() {
  const [resWallet, resMethods, resBanks, resCryptos, ledgers] = await Promise.all([
    getWalletData(),
    getPaymentMethods(),
    getBankAccounts(),
    getCryptoWallets(),
    getRecentLedgers()
  ]);
  const dbWalletData = resWallet.success && resWallet.data ? resWallet.data : null;
  const paymentMethods = resMethods.success && resMethods.methods ? resMethods.methods : [];
  const banks = resBanks.success && resBanks.banks ? resBanks.banks : [];
  const cryptos = resCryptos.success && resCryptos.wallets ? resCryptos.wallets : [];

  return <WalletClient 
    dbWalletData={dbWalletData ? JSON.parse(JSON.stringify(dbWalletData)) : null} 
    paymentMethods={paymentMethods ? JSON.parse(JSON.stringify(paymentMethods)) : []} 
    banks={banks ? JSON.parse(JSON.stringify(banks)) : []} 
    cryptos={cryptos ? JSON.parse(JSON.stringify(cryptos)) : []} 
    recentLedgers={ledgers ? JSON.parse(JSON.stringify(ledgers)) : []}
  />;
}
