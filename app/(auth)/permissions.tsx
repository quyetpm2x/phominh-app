import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { AppState, Linking, Platform, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { registerPushToken } from '../../src/api/client';
import { GradientButton } from '../../src/components/ui/Button';

type PermKey = 'location' | 'camera' | 'notif';
// blocked = đã từ chối và hệ điều hành không cho hỏi lại nữa (canAskAgain=false) — chỉ còn cách
// dẫn user qua Settings, gọi request lại lúc này sẽ không hiện popup gì cả.
type PermState = 'granted' | 'deniable' | 'blocked' | 'undetermined';

const PERMS: { key: PermKey; title: string; body: string; color: string }[] = [
  {
    key: 'location',
    title: 'Vị trí',
    body: 'Để biết bạn đang ở đâu mà hiện tin quanh đó. Chỉ lấy khi app đang mở.',
    color: '#e4f0e9',
  },
  {
    key: 'camera',
    title: 'Camera',
    body: 'Mọi ảnh phải chụp tại chỗ — không cho chọn ảnh cũ trong máy.',
    color: '#f6ecd4',
  },
  {
    key: 'notif',
    title: 'Thông báo',
    body: 'Gom tin mỗi tuần một lần. Tin khẩn cấp đã xác nhận thì báo ngay.',
    color: '#eeece6',
  },
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
    camera: 'undetermined',
    notif: 'undetermined',
  });
  const [loadingKey, setLoadingKey] = useState<PermKey | null>(null);

  useEffect(() => {
    const refresh = async () => {
      const [location, camera, notif] = await Promise.all([
        getStatus('location'),
        getStatus('camera'),
        getStatus('notif'),
      ]);
      setStatuses({ location, camera, notif });
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

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-1 px-6 pt-3.5">
        <Text className="text-[26px] font-sans-bold tracking-tight text-ink">App cần 3 quyền này</Text>
        <Text className="mt-2 text-sm leading-[22px] text-muted">
          Từ chối quyền nào cũng được — app vẫn chạy, chỉ mất phần tính năng tương ứng.
        </Text>

        <View className="mt-5 gap-2.5">
          {PERMS.map((p) => {
            const state = statuses[p.key];
            const isGranted = state === 'granted';
            const isBlocked = state === 'blocked';
            let buttonLabel = 'Cho phép';
            if (isGranted) buttonLabel = 'Đã cho phép';
            else if (isBlocked) buttonLabel = 'Mở Cài đặt';
            else if (loadingKey === p.key) buttonLabel = '...';

            return (
              <View key={p.key} className="flex-row items-center gap-3 rounded-2xl border border-border bg-white p-3.5">
                <View style={{ backgroundColor: p.color }} className="w-11 h-11 rounded-xl" />
                <View className="flex-1">
                  <Text className="font-sans-bold text-sm text-ink">{p.title}</Text>
                  <Text className="mt-0.5 text-xs leading-[18px] text-muted">{p.body}</Text>
                </View>
                <Pressable
                  onPress={() => onPressPerm(p.key)}
                  disabled={isGranted || loadingKey !== null}
                  className={`h-8 rounded-lg px-3 items-center justify-center ${
                    isGranted ? 'bg-primary' : 'border border-border bg-white'
                  }`}
                >
                  <Text className={`font-sans-semibold text-xs ${isGranted ? 'text-white' : 'text-ink'}`}>
                    {buttonLabel}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>

        <View className="mt-4 rounded-2xl bg-primary-50 border border-primary-100 p-3.5">
          <Text className="text-xs leading-[19px] text-primary">
            Vị trí chỉ được lấy khi bạn mở app. Không có theo dõi chạy nền — theo Nghị định 13/2023, vị trí thời
            gian thực là dữ liệu nhạy cảm.
          </Text>
        </View>

        <View className="flex-1" />
        <View className="pb-6">
          <GradientButton label="Tiếp tục" onPress={() => router.push('/(auth)/area-home')} />
        </View>
      </View>
    </SafeAreaView>
  );
}
