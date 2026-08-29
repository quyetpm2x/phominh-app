# Phố Mình — Mobile App

## Tech stack

| Việc | Dùng gì |
|---|---|
| Framework | Expo (React Native 0.81) + Expo Router 6 (file-based routing) |
| Ngôn ngữ | TypeScript, `strict: true` |
| Style | NativeWind 4 (Tailwind cho RN) + `StyleSheet`/inline `style` cho animation |
| Data fetching | `ky` (HTTP client) + TanStack React Query |
| State cục bộ (nếu cần) | Zustand — có trong dependencies, hiện chưa có store nào (xem phần "Trạng thái hiện tại") |
| Lưu token | `expo-secure-store` (KHÔNG dùng AsyncStorage — không mã hoá) |
| Font | `@expo-google-fonts/be-vietnam-pro` (sans) + `@expo-google-fonts/jetbrains-mono` (mono) |
| Test | Jest (`jest-expo` preset) |
| Lint | ESLint (`eslint-config-expo` + `eslint-plugin-react-native`) |

Các package đã cài nhưng CHƯA dùng ở 3 màn hiện tại (giữ lại cho màn tương lai, xem
`package.json`): `expo-camera`, `expo-image-picker`, `expo-image-manipulator`, `expo-location`,
`expo-blur`, `expo-notifications`, `react-native-maps`, `@react-native-community/datetimepicker`,
`libphonenumber-js`, `@supabase/supabase-js`.

## Cài đặt & chạy

```bash
pnpm install
pnpm dev          # mở Metro bundler (Expo Go hoặc dev client)
pnpm ios          # build + chạy trên Simulator (cần thư mục ios/, xem bên dưới)
pnpm android      # build + chạy trên Android
pnpm lint         # ESLint
pnpm type-check   # tsc --noEmit
pnpm test         # Jest
```

## Cấu trúc thư mục (đúng thực trạng hiện tại)

```
app/                        # MÀN HÌNH — Expo Router file-based routing, mỗi .tsx = 1 route
├── _layout.tsx               # layout gốc: load font, provider chung (React Query), Stack.Screen
├── index.tsx                 # entry point (route "/"): hiện Splash rồi router.replace sang welcome
└── (auth)/                   # route group — dấu ngoặc = không tạo thêm segment trong URL
    ├── _layout.tsx            # Stack riêng cho nhóm màn đăng nhập
    ├── welcome.tsx
    └── phone-input.tsx

src/
├── api/
│   └── client.ts              # CHỈ base setup gọi API: instance `ky` (prefixUrl =
│                                EXPO_PUBLIC_API_URL), gắn access token từ SecureStore vào mọi
│                                request, tự refresh khi 401, `Envelope<T>` + `extractErrorMessage()`
│                                — không có hàm API cụ thể theo tính năng nào (sendOtp/getMe...),
│                                thêm ở file riêng theo module khi cần (vd `src/api/endpoints/`)
├── components/
│   ├── ui/                     # component tái dùng nhiều màn (Button, TextInput, Avatar, Chip,
│   │                            BottomSheet, MapAreaPicker...) — KHÔNG xoá khi dọn màn hình
│   └── *.tsx                   # component gắn với 1 màn cụ thể (Splash*, WelcomeHero)
├── constants/
│   ├── brand.ts                 # text thương hiệu (tên app, tagline, version)
│   └── design-tokens.ts         # colors/fontFamily/spacing — nguồn DUY NHẤT, tailwind.config.js
│                                  import thẳng từ đây (xem phần Styling bên dưới)
└── lib/                         # hàm THUẦN (không side-effect), luôn kèm *.spec.ts

ios/                          # project Xcode do Expo sinh ra (expo prebuild) — Podfile/Pods KHÔNG
                                
```

## Quy ước

### Routing (Expo Router)

- 1 file `.tsx` trong `app/` = 1 route. Tên file = path (`welcome.tsx` → `/welcome`).
- Thư mục bọc trong `(...)` = **route group**, gộp nhóm màn hình + `_layout.tsx` riêng nhưng
  **không** cộng thêm segment vào URL thật (`(auth)/welcome.tsx` vẫn là `/welcome`, không phải
  `/auth/welcome`).
- Mỗi thư mục con muốn có Stack/Tab điều hướng riêng thì thêm `_layout.tsx` bên trong, và phải
  khai đúng tên các con của nó bằng `<Stack.Screen name="..." />` (không tự động quét).
- File route luôn `export default function` (bắt buộc theo Expo Router) — khác quy ước
  `export function` (named export) dùng cho mọi thứ trong `src/`.
- Điều hướng dùng `router.push(...)` / `router.replace(...)` từ `expo-router`, không dùng
  `navigation.navigate` kiểu React Navigation thuần.

### Styling (NativeWind)

- Style bằng `className` (cú pháp Tailwind) trên mọi component RN cơ bản (`View`, `Text`,
  `Pressable`...). Chỉ dùng `style` inline khi: (1) animation (`Animated.Value`, không thể biểu
  diễn bằng className tĩnh), (2) giá trị tính runtime (vd toạ độ, % động). ESLint rule
  `react-native/no-inline-styles` chỉ `warn`, không chặn.
- **Không sửa màu/font trực tiếp trong `tailwind.config.js`** — nó import thẳng
  `colors`/`fontFamily` từ `src/constants/design-tokens.ts`. Đổi màu chỉ cần sửa 1 chỗ duy nhất
  (`design-tokens.ts`), Tailwind tự đồng bộ theo, không cần sửa 2 nơi.
- `global.css` chỉ có 3 dòng `@tailwind base/components/utilities` — không thêm CSS thuần vào đây.

### Component

- Component trong `src/` luôn `export function TenComponent(...)` (named export), **không** dùng
  `export default` (khác hẳn file route trong `app/`).
- Dùng lại được ở ≥ 2 màn → đặt trong `src/components/ui/`. Chỉ 1 màn dùng → đặt cạnh trực tiếp
  trong `src/components/` (không có thư mục con theo tên màn).
- Props luôn khai `interface XxxProps { ... }` ngay phía trên component, không dùng type inline
  trong tham số khi có > 2 field.

### Data / API

- Mọi response thành công từ backend đều bọc `{ data: ... }` — các hàm trong `src/api/client.ts`
  tự `.json<Envelope<T>>()` rồi trả `res.data`, nơi gọi không phải tự bóc.
- Lỗi hiển thị cho user: luôn đi qua `extractErrorMessage(err)` (đọc message chuẩn hoá từ
  `HttpExceptionFilter` của backend), không tự viết chuỗi lỗi cứng.
- Access token tự đính kèm header `Authorization` qua `ky` hook `beforeRequest`; 401 tự thử refresh
  bằng refresh token (hook `afterResponse`) trước khi trả lỗi thật — màn hình gọi API không cần tự
  xử lý refresh.
- Đọc dữ liệu server (fetch) dùng React Query (`QueryClientProvider` đã bọc sẵn ở
  `app/_layout.tsx`); state cục bộ thuần UI (không cần đồng bộ server) mới cân nhắc Zustand.

### Testing

- `pnpm test` (Jest, preset `jest-expo`).
- **Chỉ viết test cho hàm thuần trong `src/lib/`** (input → output, không side-effect, không
  render). Không test component UI (không có React Testing Library trong project).
- Mỗi hàm thuần mới trong `src/lib/` phải có `*.spec.ts` cùng tên, cùng thư mục.

### Giới hạn file

- Mỗi file `.ts`/`.tsx` không quá 250 dòng — vượt thì tách component/hook/hàm con ra file riêng
  (xem `CLAUDE.md` ở gốc `source-code/` để biết quy tắc đầy đủ áp dụng toàn dự án).

## Một số kỹ thuật xử lý

1. **Shadow (iOS) không hiện nếu view không có `backgroundColor` solid** — dù bên trong có
   `LinearGradient`/child khác che phủ kín, nhìn thấy màu bình thường. iOS chỉ render bóng đổ dựa
   trên chính view có `shadowColor/shadowOpacity/shadowRadius`, không quan tâm nó đang hiện gì bên
   trong. Set `backgroundColor` rõ ràng (kể cả khi bị che) lên đúng view có style shadow.
2. **`overflow: 'hidden'` + `borderRadius` trên View cha KHÔNG đáng tin cậy để bo tròn 1 view con
   mỏng** (vd dải màu 4–5px cạnh 1 nội dung `flex-1`) theo đúng góc cong của cha — đã xác nhận lỗi
   thật trên thiết bị (không phải giả lập), góc vẫn vuông dù cha có `rounded-2xl overflow-hidden`.
   Cách sửa đáng tin cậy: **2 lớp tự bo góc độc lập** — View ngoài nền màu dải, tự bo đủ 4 góc
   bằng đúng bán kính của card; View trong nền trắng thụt vào từ cạnh đúng bằng bề rộng dải, tự bo
   2 góc cùng phía bằng `bán kính card − bề rộng dải`, bo 2 góc còn lại bằng nguyên bán kính card.
   Không phụ thuộc hành vi clip chồng-view.
3. **`FlatList`/`VirtualizedList` lồng trong `ScrollView`** gây warning (và có thể crash) —
   danh sách ngắn, biết trước không dài (dropdown gợi ý địa chỉ, danh sách preset...) thì dùng
   `ScrollView` + `.map()` thường, không dùng `FlatList`.
4. **iOS bỏ qua hit-test cho view có `opacity: 0`** (coi như không tồn tại để nhận touch) — nếu
   cần 1 overlay trong suốt nhưng vẫn phải bấm được (vd đè lên native `DateTimePicker`
   `display="compact"` để mở popover), dùng `opacity: 0.011` thay vì `0`.
5. **Metro cần `config.resolver.unstable_enablePackageExports = false`** (đã set sẵn trong
   `metro.config.js`) để resolve được `libphonenumber-js` — bug biết trước của chính thư viện đó
   (package.json `exports` không đúng spec Node.js), không phải lỗi cấu hình Metro.
6. **RN kế thừa style qua các `<Text>` lồng nhau** (color/fontSize/fontWeight/fontFamily) giống
   web, khác hẳn `<View>` (không kế thừa gì) — hữu ích khi cần tô nổi 1 đoạn trong 1 câu: bọc đoạn
   cần tô trong 1 `<Text>` con có `style` riêng, phần còn lại không cần lặp lại style của `<Text>`
   cha.

