export interface PhoneCountry {
  iso2: 'VN' | 'US' | 'SG' | 'TH' | 'JP' | 'KR' | 'AU' | 'GB';
  name: string;
  flag: string;
  callingCode: string;
  minLength: number;
  maxLength: number;
  example: string;
}

export const PHONE_COUNTRIES: PhoneCountry[] = [
  {
    iso2: 'VN',
    name: 'Viet Nam',
    flag: '🇻🇳',
    callingCode: '84',
    minLength: 9,
    maxLength: 10,
    example: '091 234 5678',
  },
  {
    iso2: 'US',
    name: 'United States',
    flag: '🇺🇸',
    callingCode: '1',
    minLength: 10,
    maxLength: 10,
    example: '(201) 555-0123',
  },
  {
    iso2: 'SG',
    name: 'Singapore',
    flag: '🇸🇬',
    callingCode: '65',
    minLength: 8,
    maxLength: 8,
    example: '8123 4567',
  },
  {
    iso2: 'TH',
    name: 'Thailand',
    flag: '🇹🇭',
    callingCode: '66',
    minLength: 9,
    maxLength: 10,
    example: '081 234 5678',
  },
  {
    iso2: 'JP',
    name: 'Japan',
    flag: '🇯🇵',
    callingCode: '81',
    minLength: 9,
    maxLength: 10,
    example: '090 1234 5678',
  },
  {
    iso2: 'KR',
    name: 'South Korea',
    flag: '🇰🇷',
    callingCode: '82',
    minLength: 9,
    maxLength: 10,
    example: '010 1234 5678',
  },
  {
    iso2: 'AU',
    name: 'Australia',
    flag: '🇦🇺',
    callingCode: '61',
    minLength: 9,
    maxLength: 10,
    example: '0412 345 678',
  },
  {
    iso2: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    callingCode: '44',
    minLength: 9,
    maxLength: 10,
    example: '07400 123456',
  },
];
