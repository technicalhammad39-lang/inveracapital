'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = 'USD' | 'PKR' | 'GBP' | 'AED' | 'SAR';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatCurrency: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const EXCHANGE_RATES: Record<Currency, number> = {
  USD: 1,
  PKR: 278.50,
  GBP: 0.79,
  AED: 3.67,
  SAR: 3.75
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('USD');

  useEffect(() => {
    const saved = localStorage.getItem('invera_currency') as Currency;
    if (saved && EXCHANGE_RATES[saved]) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem('invera_currency', c);
  };

  const formatCurrency = (amount: number) => {
    const rate = EXCHANGE_RATES[currency] || 1;
    const converted = amount * rate;
    
    return new Intl.NumberFormat(currency === 'PKR' ? 'en-PK' : 'en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: currency === 'PKR' ? 0 : 2,
    }).format(converted);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
