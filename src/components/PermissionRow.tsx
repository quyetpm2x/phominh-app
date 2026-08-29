import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { colors } from '../constants/design-tokens';

type PermissionRowState = 'granted' | 'actionable' | 'blocked' | 'loading';

interface PermissionRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
  state: PermissionRowState;
  tint?: 'primary' | 'accent';
  onPress: () => void;
}

// Tách khỏi permissions.tsx — 1 hàng quyền, style nút bên phải đổi theo trạng thái THẬT (granted/
// actionable/blocked/loading), không phải 3 kiểu cố định khác nhau như mockup tĩnh (mockup chỉ đang
// minh hoạ 3 trạng thái khác nhau trên 3 quyền, không phải 3 thiết kế cố định riêng biệt).
export function PermissionRow({ icon, title, body, state, tint = 'primary', onPress }: PermissionRowProps) {
  const tintColor = tint === 'accent' ? colors.accent.DEFAULT : colors.primary.DEFAULT;

  return (
    <View className="flex-row items-center gap-3.5 rounded-2xl border border-border/80 bg-white p-4 shadow-sm">
      <View
        style={{ borderColor: `${tintColor}33`, backgroundColor: `${tintColor}1a` }}
        className="h-12 w-12 items-center justify-center rounded-2xl border"
      >
        <Ionicons name={icon} size={22} color={tintColor} />
      </View>
      <View className="flex-1">
        <Text className="font-sans-bold text-[14.5px] text-ink">{title}</Text>
        <Text numberOfLines={1} className="mt-0.5 text-[12.5px] font-sans-medium text-muted">
          {body}
        </Text>
      </View>

      {state === 'granted' ? (
        <View style={{ backgroundColor: `${tintColor}1a` }} className="h-8 w-8 items-center justify-center rounded-xl">
          <Ionicons name="checkmark" size={16} color={tintColor} />
        </View>
      ) : null}

      {state === 'loading' ? (
        <View className="h-8 w-[78px] items-center justify-center rounded-xl border border-border bg-cream-surface">
          <ActivityIndicator size="small" color={tintColor} />
        </View>
      ) : null}

      {state === 'blocked' ? (
        <Pressable
          onPress={onPress}
          className="h-8 items-center justify-center rounded-xl border border-border bg-cream-surface px-3 active:scale-95"
        >
          <Text className="font-sans-bold text-xs text-ink">Mở Cài đặt</Text>
        </Pressable>
      ) : null}

      {state === 'actionable' ? (
        <Pressable onPress={onPress} className="active:scale-95">
          <LinearGradient
            colors={[colors.primary.DEFAULT, colors.accent.DEFAULT]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ height: 32, paddingHorizontal: 14, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text className="font-sans-bold text-xs text-white">Cho phép</Text>
          </LinearGradient>
        </Pressable>
      ) : null}
    </View>
  );
}
