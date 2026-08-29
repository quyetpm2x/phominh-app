import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';

import { colors } from '../constants/design-tokens';

type GpsStatus = 'checking' | 'on' | 'off';

interface GpsStatusRowProps {
  status: GpsStatus;
  place: string;
  radiusKm: number;
}

// Hàng "Vị trí hiện tại GPS" — kiểm tra quyền + toạ độ THẬT (Location.getForegroundPermissionsAsync
// + getCurrentPositionAsync + reverseGeocodeAsync, cùng cách feed.tsx làm cho tab "Quanh đây"), khác
// với 2 hàng Nhà/Chỗ làm bên cạnh (chỉ đọc FixedArea đã lưu) — không hiện cứng "Đang bật" nếu user
// chưa cấp quyền vị trí (đã có thể xảy ra vì permissions.tsx không bắt buộc cấp quyền nào).
export function GpsStatusRow({ status, place, radiusKm }: GpsStatusRowProps) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (status !== 'on') return undefined;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 900, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [status, pulse]);

  const tint = status === 'on' ? colors.success.DEFAULT : colors.muted.light;
  const iconOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] });

  let metaText = 'Đang kiểm tra...';
  if (status === 'on') metaText = `${place} (Bán kính ${radiusKm}km)`;
  else if (status === 'off') metaText = 'Chưa bật quyền vị trí';

  return (
    <View className="flex-row items-center gap-3">
      <View
        style={{ backgroundColor: `${tint}1a` }}
        className="relative h-11 w-11 items-center justify-center rounded-xl"
      >
        {status === 'on' ? (
          <Animated.View style={{ opacity: iconOpacity }}>
            <Ionicons name="navigate" size={19} color={tint} />
          </Animated.View>
        ) : (
          <Ionicons name="navigate-outline" size={19} color={tint} />
        )}
        {status === 'on' ? (
          <View
            style={{ backgroundColor: tint }}
            className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white"
          />
        ) : null}
      </View>
      <View className="flex-1">
        <View className="flex-row items-center gap-1.5">
          <Text className="font-sans-bold text-sm text-ink">Vị trí hiện tại</Text>
          {status === 'on' ? (
            <View style={{ backgroundColor: `${tint}1a` }} className="rounded-md px-1.5 py-0.5">
              <Text style={{ color: tint }} className="text-[9px] font-sans-black uppercase">
                Đang bật
              </Text>
            </View>
          ) : null}
        </View>
        <Text numberOfLines={1} className="text-xs font-sans-medium text-muted">
          {metaText}
        </Text>
      </View>
      {status === 'on' ? <Ionicons name="checkmark-circle" size={18} color={tint} /> : null}
    </View>
  );
}
