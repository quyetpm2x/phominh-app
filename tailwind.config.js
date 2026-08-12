/** Dán thẳng design-tokens vào cấu hình NativeWind (mục 2 tài liệu FE) — không có giao diện
 *  mặc định phải ghi đè như thư viện UI trọn gói. Giữ đồng bộ tay với src/constants/design-tokens.ts. */
const { colors, fontFamily } = require('./src/constants/design-tokens');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors,
      fontFamily,
    },
  },
  plugins: [],
};
