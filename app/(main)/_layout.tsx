import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Tabs } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../../src/constants/design-tokens';
import { useAppSessionTracking } from '../../src/hooks/useAppSessionTracking';

// Tab bar dưới cùng đúng theo thiết kế: Dòng tin / Thông báo / [+ mở camera ngay] / Quán / Tôi
// ({{ tabBar }} trong Phố Mình.dc.html — nút giữa là camera trực tiếp, không phải sheet chọn loại
// bài, theo đúng biến thể "B" đã chốt dùng trong 1a). Nhà/Chỗ làm/Quanh đây là tab gạch chân NẰM
// TRONG màn Feed, không phải tab dưới cùng. App KHÔNG có tính năng nhắn tin riêng tư — chỉ tương
// tác qua bình luận công khai/riêng-tư-1-chiều trên bài đăng (mục 26), đã chốt với người dùng.
//
// Dùng tabBarButton tự viết cho MỌI tab (không chỉ nút "+") thay vì tabBarIcon/title mặc định của
// react-navigation — nhãn tiếng Việt có dấu (Dòng tin, Thông báo) bị cắt mất phần dấu/chân chữ khi
// dùng label mặc định vì khối nhãn nội bộ của react-navigation có chiều cao cố định, không co giãn
// theo lineHeight mình đặt trong tabBarLabelStyle. Tự vẽ Text mới kiểm soát được lineHeight thật.
export default function MainTabsLayout() {
  useAppSessionTracking();
  const insets = useSafeAreaInsets();
  const barHeight = 66 + insets.bottom;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.cream.DEFAULT,
          borderTopColor: colors.border.DEFAULT,
          height: barHeight,
          paddingBottom: insets.bottom,
          paddingTop: 0,
          overflow: 'visible',
        },
        tabBarItemStyle: { overflow: 'visible' },
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          tabBarButton: (props) => (
            <TabButton
              icon="home"
              label="Dòng tin"
              focused={!!props.accessibilityState?.selected}
              showLiveDot
              onPress={() => router.push('/(main)/feed')}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          tabBarButton: (props) => (
            <TabButton
              icon="notifications"
              label="Thông báo"
              focused={!!props.accessibilityState?.selected}
              onPress={() => router.push('/(main)/notifications')}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          tabBarButton: () => (
            <Pressable
              onPress={() => router.push('/post/create/camera')}
              style={{ flex: 1, alignItems: 'center', overflow: 'visible' }}
            >
              <View
                style={{
                  position: 'absolute',
                  top: -22,
                  width: 52,
                  height: 52,
                  borderRadius: 26,
                  // backgroundColor bắt buộc phải có (dù bị LinearGradient con phủ kín) — shadow
                  // không render trên iOS nếu View mang shadow là trong suốt (đã gặp ở OtpDigitBox).
                  backgroundColor: colors.cream.DEFAULT,
                  shadowColor: colors.primary.DEFAULT,
                  shadowOpacity: 0.4,
                  shadowRadius: 10,
                  shadowOffset: { width: 0, height: 4 },
                  elevation: 6,
                }}
              >
                <LinearGradient
                  colors={[colors.primary.DEFAULT, colors.accent.DEFAULT]}
                  style={{
                    flex: 1,
                    borderRadius: 26,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 3,
                    borderColor: colors.cream.DEFAULT,
                  }}
                >
                  <Ionicons name="add" size={26} color="#fff" />
                </LinearGradient>
              </View>
            </Pressable>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push('/post/create/camera');
          },
        }}
      />
      <Tabs.Screen
        name="merchant"
        options={{
          tabBarButton: (props) => (
            <TabButton
              icon="storefront"
              label="Quán"
              focused={!!props.accessibilityState?.selected}
              onPress={() => router.push('/(main)/merchant')}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarButton: (props) => (
            <TabButton
              icon="person"
              label="Tôi"
              focused={!!props.accessibilityState?.selected}
              onPress={() => router.push('/(main)/profile')}
            />
          ),
        }}
      />
    </Tabs>
  );
}

interface TabButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  focused: boolean;
  onPress: () => void;
  // Chấm nhỏ báo "đang xem live" — chỉ trang trí, không gắn số liệu chưa đọc thật nào (không có API
  // đếm tin mới), chỉ hiện khi tab đang active.
  showLiveDot?: boolean;
}

function TabButton({ icon, label, focused, onPress, showLiveDot }: TabButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 5, paddingTop: 8 }}
    >
      <View>
        <TabIcon name={icon} focused={focused} />
        {showLiveDot && focused ? (
          <View
            style={{ backgroundColor: colors.primary.DEFAULT }}
            className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full"
          />
        ) : null}
      </View>
      <Text
        numberOfLines={1}
        style={{
          fontFamily: 'BeVietnamPro_600SemiBold',
          fontSize: 10.5,
          lineHeight: 16,
          color: focused ? colors.ink.DEFAULT : colors.muted.light,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function TabIcon({ name, focused }: { name: keyof typeof Ionicons.glyphMap; focused: boolean }) {
  if (focused) {
    return (
      <View className="w-7 h-7 rounded-[9px] bg-ink items-center justify-center">
        <Ionicons name={name} size={16} color="#fff" />
      </View>
    );
  }
  return <Ionicons name={`${name}-outline` as keyof typeof Ionicons.glyphMap} size={20} color={colors.muted.light} />;
}
