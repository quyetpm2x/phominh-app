const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// libphonenumber-js có package.json "exports" không hợp lệ theo spec Node.js (target export
// không bắt đầu bằng "./" ở min/metadata) — Metro strict hơn Node nên fail resolve hẳn (không chỉ
// warning), lỗi đã biết: https://gitlab.com/catamphetamine/libphonenumber-js/-/issues/190. Tắt
// package-exports resolution để Metro quay lại kiểu resolve theo file cũ (không ảnh hưởng gì khác
// trong app vì trước khi thêm libphonenumber-js chưa có package nào cần tính năng này).
config.resolver.unstable_enablePackageExports = false;

const nativeWindConfig = withNativeWind(config, { input: './global.css' });
const originalResolveRequest = nativeWindConfig.resolver?.resolveRequest;

const runtimeAliases = {
  'react-native-css-interop/jsx-runtime': path.resolve(__dirname, 'node_modules/react-native-css-interop/dist/runtime/jsx-runtime.js'),
  'react-native-css-interop/jsx-dev-runtime': path.resolve(__dirname, 'node_modules/react-native-css-interop/dist/runtime/jsx-dev-runtime.js'),
};

nativeWindConfig.resolver = {
  ...nativeWindConfig.resolver,
  resolveRequest(context, moduleName, platform) {
    const aliasedPath = runtimeAliases[moduleName];
    if (aliasedPath) {
      return { type: 'sourceFile', filePath: aliasedPath };
    }

    const resolver = originalResolveRequest ?? context.resolveRequest;
    return resolver(context, moduleName, platform);
  },
};

module.exports = nativeWindConfig;
