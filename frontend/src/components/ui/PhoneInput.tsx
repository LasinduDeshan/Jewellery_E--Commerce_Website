'use client';

import React, { useState, useEffect } from 'react';
import { Phone, ChevronDown } from 'lucide-react';

export interface CountryCodeOption {
  code: string;
  dialCode: string;
  name: string;
  flag: string;
}

export const COUNTRY_CODES: CountryCodeOption[] = [
  { code: 'AU', dialCode: '+61', name: 'Australia', flag: '🇦🇺' },
  { code: 'LK', dialCode: '+94', name: 'Sri Lanka', flag: '🇱🇰' },
  { code: 'NZ', dialCode: '+64', name: 'New Zealand', flag: '🇳🇿' },
  { code: 'GB', dialCode: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'US', dialCode: '+1', name: 'United States', flag: '🇺🇸' },
  { code: 'CA', dialCode: '+1', name: 'Canada', flag: '🇨🇦' },
  { code: 'SG', dialCode: '+65', name: 'Singapore', flag: '🇸🇬' },
  { code: 'AE', dialCode: '+971', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'DE', dialCode: '+49', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', dialCode: '+33', name: 'France', flag: '🇫🇷' },
  { code: 'CH', dialCode: '+41', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'IN', dialCode: '+91', name: 'India', flag: '🇮🇳' },
  { code: 'JP', dialCode: '+81', name: 'Japan', flag: '🇯🇵' },
  { code: 'MY', dialCode: '+60', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'ZA', dialCode: '+27', name: 'South Africa', flag: '🇿🇦' },
];

interface PhoneInputProps {
  value: string;
  onChange: (fullPhoneNumber: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  placeholder = '400 000 000',
  required = false,
  className = '',
}) => {
  const [selectedDialCode, setSelectedDialCode] = useState<string>('+61');
  const [localNumber, setLocalNumber] = useState<string>('');

  // Synchronize incoming value with dial code + local number
  useEffect(() => {
    if (!value) {
      setLocalNumber('');
      return;
    }

    // Try matching an existing dial code
    const matched = COUNTRY_CODES.find((c) => value.startsWith(c.dialCode));
    if (matched) {
      setSelectedDialCode(matched.dialCode);
      const rest = value.slice(matched.dialCode.length).trim();
      setLocalNumber(rest);
    } else {
      setLocalNumber(value);
    }
  }, [value]);

  const handleCountryChange = (newDialCode: string) => {
    setSelectedDialCode(newDialCode);
    const full = localNumber ? `${newDialCode} ${localNumber}` : newDialCode;
    onChange(full);
  };

  const handleNumberChange = (raw: string) => {
    setLocalNumber(raw);
    const clean = raw.trim();
    const full = clean ? `${selectedDialCode} ${clean}` : '';
    onChange(full);
  };

  const selectedCountry =
    COUNTRY_CODES.find((c) => c.dialCode === selectedDialCode) || COUNTRY_CODES[0];

  return (
    <div className={`relative flex items-center rounded-lg border border-stone-300 bg-white focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-amber-500 transition-all ${className}`}>
      {/* Country Code Dropdown Container */}
      <div className="relative flex items-center bg-stone-50/80 border-r border-stone-200 rounded-l-lg hover:bg-stone-100 transition-colors">
        <select
          value={selectedDialCode}
          onChange={(e) => handleCountryChange(e.target.value)}
          className="appearance-none bg-transparent pl-3 pr-7 py-2.5 text-xs text-stone-800 font-medium focus:outline-none cursor-pointer"
          title="Select country code"
        >
          {COUNTRY_CODES.map((c) => (
            <option key={c.code} value={c.dialCode} className="text-stone-900 bg-white">
              {c.flag} {c.code} ({c.dialCode})
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2 pointer-events-none" />
      </div>

      {/* Local Phone Number Input */}
      <div className="relative flex-1 flex items-center">
        <input
          type="tel"
          required={required}
          value={localNumber}
          onChange={(e) => handleNumberChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2.5 text-stone-900 text-xs bg-transparent focus:outline-none rounded-r-lg font-mono placeholder:text-stone-400"
        />
      </div>
    </div>
  );
};
