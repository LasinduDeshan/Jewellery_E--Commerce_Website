'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type CurrencyCode = 'AUD' | 'USD' | 'EUR' | 'GBP' | 'LKR' | 'SGD' | 'CAD' | 'AED';

export interface CurrencyInfo {
  code: CurrencyCode;
  label: string;
  symbol: string;
  flag: string;
  rate: number; // Conversion rate against base AUD
}

// Initial baseline rates while live ExchangeRate-API loads
const DEFAULT_RATES: Record<CurrencyCode, number> = {
  AUD: 1.0,
  USD: 0.697,
  EUR: 0.623,
  GBP: 0.519,
  LKR: 232.11,
  SGD: 0.893,
  CAD: 0.976,
  AED: 2.56,
};

export const BASE_CURRENCIES: Record<CurrencyCode, Omit<CurrencyInfo, 'rate'>> = {
  AUD: { code: 'AUD', label: 'Australian Dollar', symbol: '$', flag: '🇦🇺' },
  USD: { code: 'USD', label: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  EUR: { code: 'EUR', label: 'Euro', symbol: '€', flag: '🇪🇺' },
  GBP: { code: 'GBP', label: 'British Pound', symbol: '£', flag: '🇬🇧' },
  LKR: { code: 'LKR', label: 'Sri Lankan Rupee', symbol: 'Rs ', flag: '🇱🇰' },
  SGD: { code: 'SGD', label: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  CAD: { code: 'CAD', label: 'Canadian Dollar', symbol: 'CA$', flag: '🇨🇦' },
  AED: { code: 'AED', label: 'UAE Dirham', symbol: 'AED ', flag: '🇦🇪' },
};

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  currencyInfo: CurrencyInfo;
  availableCurrencies: CurrencyInfo[];
  rates: Record<CurrencyCode, number>;
  ratesLoading: boolean;
  ratesSource: string;
  lastUpdatedTime: string | null;
  refreshRates: () => Promise<void>;
  convertPrice: (amountInAud: number) => number;
  formatPrice: (amountInAud: number, showCode?: boolean) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const STORAGE_CURRENCY_KEY = 'zeyloraa_currency';
const STORAGE_RATES_KEY = 'zeyloraa_rates_cache';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour live cache

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>('AUD');
  const [rates, setRates] = useState<Record<CurrencyCode, number>>(DEFAULT_RATES);
  const [ratesLoading, setRatesLoading] = useState<boolean>(true);
  const [ratesSource, setRatesSource] = useState<string>('ExchangeRate-API');
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string | null>(null);

  // 1. Fetch live rates from ExchangeRate-API
  const fetchLiveRates = async (force = false) => {
    try {
      setRatesLoading(true);

      // Check localStorage cache if not forced
      if (!force) {
        try {
          const cached = localStorage.getItem(STORAGE_RATES_KEY);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed && parsed.rates && parsed.timestamp && Date.now() - parsed.timestamp < CACHE_TTL_MS) {
              setRates(parsed.rates);
              setLastUpdatedTime(parsed.lastUpdatedTime || null);
              setRatesLoading(false);
              return;
            }
          }
        } catch (e) {
          // Ignore cache parse errors
        }
      }

      // Live fetch from ExchangeRate-API
      const apiKey = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY;
      const endpoint = apiKey
        ? `https://v6.exchangerate-api.com/v6/${apiKey}/latest/AUD`
        : 'https://open.er-api.com/v6/latest/AUD';

      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      if (data && data.result === 'success' && data.rates) {
        const liveRates: Record<CurrencyCode, number> = {
          AUD: 1.0,
          USD: Number(data.rates.USD) || DEFAULT_RATES.USD,
          EUR: Number(data.rates.EUR) || DEFAULT_RATES.EUR,
          GBP: Number(data.rates.GBP) || DEFAULT_RATES.GBP,
          LKR: Number(data.rates.LKR) || DEFAULT_RATES.LKR,
          SGD: Number(data.rates.SGD) || DEFAULT_RATES.SGD,
          CAD: Number(data.rates.CAD) || DEFAULT_RATES.CAD,
          AED: Number(data.rates.AED) || DEFAULT_RATES.AED,
        };

        const updateTime = data.time_last_update_utc || new Date().toUTCString();
        setRates(liveRates);
        setLastUpdatedTime(updateTime);
        setRatesSource('ExchangeRate-API (Live)');

        try {
          localStorage.setItem(
            STORAGE_RATES_KEY,
            JSON.stringify({
              rates: liveRates,
              timestamp: Date.now(),
              lastUpdatedTime: updateTime,
            })
          );
        } catch (e) {
          // Ignore localStorage errors
        }
      }
    } catch (err) {
      console.warn('ExchangeRate-API unavailable, utilizing latest certified baseline:', err);
      setRatesSource('Certified Fallback');
    } finally {
      setRatesLoading(false);
    }
  };

  // 2. Load stored currency preference and trigger live rates sync
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CURRENCY_KEY) as CurrencyCode;
      if (saved && BASE_CURRENCIES[saved]) {
        setCurrencyState(saved);
      }
    } catch (e) {
      // Ignore
    }

    fetchLiveRates();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_CURRENCY_KEY && e.newValue && BASE_CURRENCIES[e.newValue as CurrencyCode]) {
        setCurrencyState(e.newValue as CurrencyCode);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    if (!BASE_CURRENCIES[code]) return;
    setCurrencyState(code);
    try {
      localStorage.setItem(STORAGE_CURRENCY_KEY, code);
      window.dispatchEvent(new Event('currencyChange'));
    } catch (e) {
      // Ignore
    }
  };

  const currentRate = rates[currency] || 1.0;
  const baseInfo = BASE_CURRENCIES[currency] || BASE_CURRENCIES.AUD;
  const currencyInfo: CurrencyInfo = {
    ...baseInfo,
    rate: currentRate,
  };

  const availableCurrencies: CurrencyInfo[] = (Object.keys(BASE_CURRENCIES) as CurrencyCode[]).map((code) => ({
    ...BASE_CURRENCIES[code],
    rate: rates[code] || 1.0,
  }));

  const convertPrice = (amountInAud: number): number => {
    if (typeof amountInAud !== 'number' || isNaN(amountInAud)) return 0;
    return Math.round(amountInAud * currentRate);
  };

  const formatPrice = (amountInAud: number, showCode = true): string => {
    if (typeof amountInAud !== 'number' || isNaN(amountInAud)) return '$0';
    const converted = convertPrice(amountInAud);
    const formattedNum = converted.toLocaleString();
    return showCode
      ? `${currencyInfo.symbol}${formattedNum} ${currencyInfo.code}`
      : `${currencyInfo.symbol}${formattedNum}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        currencyInfo,
        availableCurrencies,
        rates,
        ratesLoading,
        ratesSource,
        lastUpdatedTime,
        refreshRates: () => fetchLiveRates(true),
        convertPrice,
        formatPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    const defaultInfo: CurrencyInfo = {
      ...BASE_CURRENCIES.AUD,
      rate: 1.0,
    };
    return {
      currency: 'AUD',
      setCurrency: () => {},
      currencyInfo: defaultInfo,
      availableCurrencies: (Object.keys(BASE_CURRENCIES) as CurrencyCode[]).map((code) => ({
        ...BASE_CURRENCIES[code],
        rate: DEFAULT_RATES[code],
      })),
      rates: DEFAULT_RATES,
      ratesLoading: false,
      ratesSource: 'ExchangeRate-API',
      lastUpdatedTime: null,
      refreshRates: async () => {},
      convertPrice: (p) => p,
      formatPrice: (p, showCode = true) =>
        showCode ? `$${Math.round(p || 0).toLocaleString()} AUD` : `$${Math.round(p || 0).toLocaleString()}`,
    };
  }
  return context;
};
