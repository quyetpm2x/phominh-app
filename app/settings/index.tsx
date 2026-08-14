import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { favoriteNeighbors, mutedNeighbors } from '../../src/mocks/phoMinh';

// on.settings — chung, quyền riêng tư, hỗ trợ, đăng xuất.
export default function SettingsScreen() {
  // "Quyền vị trí" (mục 65) — đọc trạng thái quyền OS thật, không phải chuỗi tĩnh bịa ra.
  const [locationStatus, setLocationStatus] = useState('Đang kiểm tra…');

  useEffect(() => {
    void Location.getForegroundPermissionsAsync().then((r) => {
      if (r.status === 'granted') setLocationStatus('Chỉ khi mở app');
      else if (r.status === 'denied') setLocationStatus('Đã từ chối');
      else setLocationStatus('Chưa hỏi');
    });
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="h-[46px] flex-row items-center gap-1.5 px-3 border-b border-border bg-white">
        <Pressable onPress={() => router.back()} className="w-[34px] h-[34px] items-center justify-center">
          <Text className="text-[21px] text-ink">‹</Text>
        </Pressable>
        <Text className="font-sans-semibold text-[14.5px] text-ink">Cài đặt</Text>
      </View>

      <ScrollView contentContainerClassName="p-4.5">
        <Text className="font-mono-medium text-xs tracking-wide text-muted">CHUNG</Text>
        <View className="mt-2.5 rounded-2xl border border-border bg-white overflow-hidden">
          <Row label="Thông báo" value="Hàng tuần" onPress={() => router.push('/settings/notifications')} />
          {/* Chưa có hệ thống đa ngôn ngữ — chỉ hỗ trợ Tiếng Việt, không phải cài đặt đổi được. */}
          <Row label="Ngôn ngữ" value="Chỉ hỗ trợ Tiếng Việt" />
          <Row label="Quyền vị trí" value={locationStatus} last />
        </View>

        <Text className="mt-4.5 font-mono-medium text-xs tracking-wide text-muted">QUYỀN RIÊNG TƯ</Text>
        <View className="mt-2.5 rounded-2xl border border-border bg-white overflow-hidden">
          <Row label="Người quen ưu tiên" value={`${favoriteNeighbors.length}`} onPress={() => router.push('/profile/favorites')} />
          <Row label="Danh sách không quan tâm" value={`${mutedNeighbors.length}`} onPress={() => router.push('/profile/muted')} />
          <Row label="Chính sách quyền riêng tư" onPress={() => router.push('/settings/privacy')} />
          <Row label="Điều khoản sử dụng" onPress={() => router.push('/settings/terms')} last />
        </View>

        <Text className="mt-4.5 font-mono-medium text-xs tracking-wide text-muted">HỖ TRỢ</Text>
        <View className="mt-2.5 rounded-2xl border border-border bg-white overflow-hidden">
          <Row label="Trung tâm trợ giúp" onPress={() => router.push('/settings/help')} />
          <Row label="Về ứng dụng" onPress={() => router.push('/settings/about')} last />
        </View>

        <Pressable
          onPress={() => router.push('/settings/logout')}
          className="mt-4.5 h-12 rounded-2xl border border-border bg-white items-center justify-center"
        >
          <Text className="font-sans-semibold text-[14.5px] text-danger-text">Đăng xuất</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value, onPress, last }: { label: string; value?: string; onPress?: () => void; last?: boolean }) {
  const chevron = onPress ? ' ›' : '';
  const display = value ? `${value}${chevron}` : chevron.trim();
  return (
    <Pressable onPress={onPress} disabled={!onPress} className={`px-3.5 py-3 flex-row ${last ? '' : 'border-b border-border-soft'}`}>
      <Text className="flex-1 text-sm text-ink">{label}</Text>
      <Text className="text-[12.5px] text-muted">{display}</Text>
    </Pressable>
  );
}
