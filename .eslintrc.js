// Cấu hình riêng của Mobile — KHÔNG extends package chung với Web (mục 1, 7 tài liệu FE).
module.exports = {
  root: true,
  extends: ['expo', 'prettier'],
  plugins: ['react-native'],
  rules: {
    'react-native/no-inline-styles': 'warn',
  },
};
