import { Ionicons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, AppState, Easing, Linking, Platform, Pressable, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { registerPushToken } from '../../src/api/client';
import { colors } from '../../src/constants/design-tokens';
import { AuthDecorativeBlobs } from '../../src/components/ui/AuthDecorativeBlobs';
import { GradientSubmitButton } from '../../src/components/ui/GradientSubmitButton';
import { GradientText } from '../../src/components/ui/GradientText';
import { PermissionRow } from '../../src/components/PermissionRow';

type PermKey = 'location' | 'notif' | 'camera';
// blocked = đã từ chối và hệ điều hành không cho hỏi lại nữa (canAskAgain=false) — chỉ còn cách
// dẫn user qua Settings, gọi request lại lúc này sẽ không hiện popup gì cả.
type PermState = 'granted' | 'deniable' | 'blocked' | 'undetermined';

// Giao diện + text làm lại theo mockup 2026-08-26 — mô tả từng quyền rút gọn hơn bản trước (chi
// tiết "chỉ lấy khi app đang mở"/"không cho chọn ảnh cũ" vẫn còn nhắc ở khối Nghị định 13/2023 phía
// dưới, không mất thông tin, chỉ đổi chỗ).
const PERMS: { key: PermKey; icon: keyof typeof Ionicons.glyphMap; tint: 'primary' | 'accent'; title: string; body: string }[] = [
  { key: 'location', icon: 'location', tint: 'primary', title: 'Vị trí hiện tại', body: 'Quét tin tức quanh Nhà & Chỗ làm' },
  { key: 'notif', icon: 'notifications', tint: 'accent', title: 'Thông báo', body: 'Tin khẩn, sự cố mất điện, nước' },
  { key: 'camera', icon: 'camera', tint: 'primary', title: 'Máy ảnh', body: 'Chụp nhanh ảnh xác thực hiện trường' },
];

function toState(status: string, canAskAgain: boolean): PermState {
  if (status === 'granted') return 'granted';
  if (status === 'undetermined') return 'undetermined';
  return canAskAgain ? 'deniable' : 'blocked';
}

async function getStatus(key: PermKey): Promise<PermState> {
  if (key === 'location') {
    const r = await Location.getForegroundPermissionsAsync();
    return toState(r.status, r.canAskAgain);
  }
  if (key === 'camera') {
    const r = await Camera.getCameraPermissionsAsync();
    return toState(r.status, r.canAskAgain);
  }
  const r = await Notifications.getPermissionsAsync();
  return toState(r.status, r.canAskAgain);
}

async function requestPerm(key: PermKey): Promise<PermState> {
  if (key === 'location') {
    const r = await Location.requestForegroundPermissionsAsync();
    return toState(r.status, r.canAskAgain);
  }
  if (key === 'camera') {
    const r = await Camera.requestCameraPermissionsAsync();
    return toState(r.status, r.canAskAgain);
  }
  if (Platform.OS === 'android') {
    // Android cần khai báo channel trước thì thông báo mới hiển thị đúng, kể cả sau khi có quyền.
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Mặc định',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  const r = await Notifications.requestPermissionsAsync();
  return toState(r.status, r.canAskAgain);
}

// Lấy Expo push token + gửi lên backend — bọc try/catch riêng, không được chặn onboarding nếu lỗi
// (vd chạy trong Expo Go không hỗ trợ đủ, hoặc chưa cấu hình EAS project). Không có cũng không sao,
// app vẫn dùng được, chỉ mất tính năng nhận thông báo đẩy.
async function tryRegisterPushToken(): Promise<void> {
  try {
    const tokenData = await Notifications.getExpoPushTokenAsync();
    await registerPushToken(tokenData.data, Platform.OS === 'ios' ? 'ios' : 'android');
  } catch (error) {
    console.warn('[push] Không lấy/đăng ký được push token (không chặn onboarding):', error);
  }
}

// on.perms — 3 quyền, từ chối quyền nào cũng được, app vẫn chạy. Mỗi quyền có nút bật/tắt riêng,
// gọi API xin quyền thật của hệ điều hành (không phải toggle UI giả).
export default function PermissionsScreen() {
  const [statuses, setStatuses] = useState<Record<PermKey, PermState>>({
    location: 'undetermined',
    notif: 'undetermined',
    camera: 'undetermined',
  });
  const [loadingKey, setLoadingKey] = useState<PermKey | null>(null);
  const dotPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotPulse, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(dotPulse, { toValue: 0, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    ).start();
  }, [dotPulse]);

  useEffect(() => {
    const refresh = async () => {
      const [location, notif, camera] = await Promise.all([
        getStatus('location'),
        getStatus('notif'),
        getStatus('camera'),
      ]);
      setStatuses({ location, notif, camera });
    };

    void refresh(); // lúc vào màn

    // Bấm "Mở Cài đặt" rời sang app Cài đặt rồi quay lại KHÔNG unmount màn này (chỉ là app
    // chuyển background/foreground trong cùng 1 phiên điều hướng) — useEffect rỗng ở trên chỉ chạy
    // đúng 1 lần lúc mount nên không tự biết quyền vừa đổi. Phải tự lắng nghe AppState.
    const sub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') void refresh();
    });
    return () => sub.remove();
  }, []);

  const onPressPerm = async (key: PermKey) => {
    if (loadingKey) return;
    const current = statuses[key];

    if (current === 'granted') return;
    if (current === 'blocked') {
      Linking.openSettings();
      return;
    }

    setLoadingKey(key);
    const next = await requestPerm(key);
    setStatuses((s) => ({ ...s, [key]: next }));
    setLoadingKey(null);

    if (key === 'notif' && next === 'granted') {
      void tryRegisterPushToken();
    }
  };

  const onContinue = () => router.push('/(auth)/area-home');

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <AuthDecorativeBlobs />

      <View className="flex-1 px-6 pt-2">
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => router.back()}
            className="w-11 h-11 items-center justify-center rounded-2xl bg-white border border-border/80 shadow-sm active:scale-95"
          >
            <Ionicons name="arrow-back" size={18} color={colors.ink.DEFAULT} />
          </Pressable>
          <View className="rounded-full overflow-hidden border border-primary/15">
            <LinearGradient colors={['#FF416C1a', '#FF4B2B1a']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <View className="flex-row items-center gap-1.5 px-3 py-1.5">
                <Animated.View
                  className="w-1.5 h-1.5 rounded-full bg-primary"
                  style={{ opacity: dotPulse.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }) }}
                />
                <Text className="text-[11px] font-sans-bold uppercase tracking-wider text-primary">Cài đặt thiết bị</Text>
              </View>
            </LinearGradient>
          </View>
        </View>

        <View className="mt-6 self-start flex-row items-center gap-1.5 px-3 py-1 rounded-xl bg-primary/10">
          <Ionicons name="lock-open" size={14} color={colors.primary.DEFAULT} />
          <Text className="text-xs font-sans-bold text-primary">Quyền hệ điều hành</Text>
        </View>

        <View className="mt-3 flex-row flex-wrap items-baseline">
          <Text className="text-[28px] leading-[32px] font-sans-black tracking-tight text-ink">Cấp quyền </Text>
          <GradientText
            colors={[colors.primary.DEFAULT, colors.accent.DEFAULT]}
            className="text-[28px] leading-[32px] font-sans-black tracking-tight"
          >
            truy cập
          </GradientText>
        </View>
        <Text className="mt-2 text-sm leading-[22px] font-sans-medium text-muted">
          Để dòng tin khu phố luôn chính xác và kịp thời, vui lòng cấp một số quyền cơ bản.
        </Text>

        <View className="mt-6 gap-3.5">
          {PERMS.map((p) => {
            const status = statuses[p.key];
            let rowState: 'granted' | 'actionable' | 'blocked' | 'loading' = 'actionable';
            if (loadingKey === p.key) rowState = 'loading';
            else if (status === 'granted') rowState = 'granted';
            else if (status === 'blocked') rowState = 'blocked';

            return (
              <PermissionRow
                key={p.key}
                icon={p.icon}
                tint={p.tint}
                title={p.title}
                body={p.body}
                state={rowState}
                onPress={() => void onPressPerm(p.key)}
              />
            );
          })}

          <View className="flex-row items-start gap-3 rounded-2xl border border-border/80 bg-white/70 p-3.5">
            <View
              style={{ borderColor: `${colors.primary.DEFAULT}33`, backgroundColor: `${colors.primary.DEFAULT}1a` }}
              className="h-11 w-11 items-center justify-center rounded-2xl border"
            >
              <Ionicons name="shield-checkmark" size={20} color={colors.primary.DEFAULT} />
            </View>
            <Text className="flex-1 text-xs leading-[19px] font-sans-medium text-muted">
              Theo <Text className="font-sans-bold text-ink">Nghị định 13/2023/NĐ-CP</Text>, vị trí là dữ liệu nhạy
              cảm — chỉ được lấy khi bạn mở app, không theo dõi chạy nền. Phố Mình cam kết không bao giờ chia sẻ vị
              trí của bạn cho bất kỳ bên thứ 3 nào.
            </Text>
          </View>
        </View>

        <View className="flex-1" />

        <View className="pt-6 pb-6">
          <GradientSubmitButton label="Tiếp tục" disabled={false} loading={false} onPress={onContinue} />
          <Pressable onPress={onContinue} className="mt-2.5 py-2 items-center">
            <Text className="text-[13px] font-sans-semibold text-muted">Để sau, thiết lập trong Cài đặt</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
