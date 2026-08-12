const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// libphonenumber-js có package.json "exports" không hợp lệ theo spec Node.js (target export
// không bắt đầu bằng "./" ở min/metadata) — Metro strict hơn Node nên fail resolve hẳn (không chỉ
// warning), lỗi đã biết: https://gitlab.com/catamphetamine/libphonenumber-js/-/issues/190. Tắt
// package-exports resolution để Metro quay lại kiểu resolve theo file cũ (không ảnh hưởng gì khác
// trong app vì trước khi thêm libphonenumber-js chưa có package nào cần tính năng này).
config.resolver.unstable_enablePackageExports = false;

module.exports = withNativeWind(config, { input: './global.css' });
