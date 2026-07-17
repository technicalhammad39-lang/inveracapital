'use client';

import React from 'react';
import { useCurrency } from './CurrencyProvider';

export function FormattedCurrency({ amount, className }: { amount: number, className?: string }) {
  const { formatCurrency } = useCurrency();
  return <span className={className}>{formatCurrency(amount)}</span>;
}
