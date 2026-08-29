import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../../src/constants/design-tokens';
import { AddressSuggestionList } from '../../src/components/AddressSuggestionList';
import { MapAreaPicker } from '../../src/components/ui/MapAreaPicker';
import { RadiusSlider } from '../../src/components/ui/RadiusSlider';
import { useAddressSuggestions, type AddressSuggestion } from '../../src/hooks/useAddressSuggestions';
import { useEditAreaLocation } from '../../src/hooks/useEditAreaLocation';

const LABEL_TEXT: Record<'home' | 'work', string> = { home: 'Nhà', work: 'Chỗ làm' };

// isAreas — sửa khu vực cố định đã lưu, mở từ hồ sơ. Giao diện làm lại theo mockup 2026-08-26 —
// mockup thêm hẳn ô tìm địa chỉ + đổi vị trí ngay tại đây (trước đó chỉ cho sửa bán kính, đổi vị
// trí phải qua area-home.tsx/area-work.tsx — đã xác nhận đổi quy tắc với người dùng). Map đổi từ
// MapPlaceholder (tĩnh) sang MapAreaPicker thật (kéo được, đã dùng ở area-home/area-work). Gợi ý
// địa chỉ dùng geocode MIỄN PHÍ của expo-location (useAddressSuggestions.ts) — Google Places
// Autocomplete cho trải nghiệm mượt hơn nhưng cần bật billing, tạm chưa dùng (đổi ý sau này thì
// xem lại lịch sử trò chuyện, đã viết sẵn 1 lần).
export default function AreasScreen() {
  const { label: labelParam } = useLocalSearchParams<{ label?: 'home' | 'work' }>();
  const label = labelParam === 'work' ? 'work' : 'home';

  const {
    loading,
    notFound,
    initialRegion,
    addressText,
    radiusKm,
    setRadiusKm,
    onCenterChange,
    selectSuggestion,
    searchAddress,
    searching,
    saving,
    error,
    save,
  } = useEditAreaLocation(label);

  const [query, setQuery] = useState('');
  const [mapKey, setMapKey] = useState(0);
  const { suggestions, loading: loadingSuggestions } = useAddressSuggestions(query);

  const jumpMap = () => setMapKey((k) => k + 1); // MapView chỉ đọc initialRegion lúc mount — đổi key để remount, nhảy tới vị trí mới.

  const onSelectSuggestion = (suggestion: AddressSuggestion) => {
    selectSuggestion(suggestion);
    setQuery('');
    jumpMap();
  };

  const onSubmitSearch = async () => {
    if (suggestions.length > 0) {
      onSelectSuggestion(suggestions[0]);
      return;
    }
    const ok = await searchAddress(query);
    if (ok) {
      setQuery('');
      jumpMap();
    }
  };

  const onSave = () => {
    void save().then((ok) => {
      if (ok) router.push('/(main)/profile');
      else if (error) Alert.alert('Không lưu được', error);
    });
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-cream items-center justify-center">
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (notFound || !initialRegion) {
    return (
      <SafeAreaView className="flex-1 bg-cream items-center justify-center px-6">
        <Text className="text-center text-sm text-muted">
          Chưa đặt khu vực "{LABEL_TEXT[label]}" — vào onboarding hoặc liên hệ hỗ trợ để đặt lại.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-row items-center justify-between border-b border-border/80 px-4 py-3">
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => router.push('/(main)/profile')}
            className="h-9 w-9 items-center justify-center rounded-xl bg-cream-surface active:scale-95"
          >
            <Ionicons name="arrow-back" size={16} color={colors.ink.DEFAULT} />
          </Pressable>
          <View>
            <Text className="font-sans-black text-[15px] text-ink">Chỉnh sửa vị trí {LABEL_TEXT[label]}</Text>
            <Text className="text-[11px] font-sans-medium text-muted">Bán kính quét tin quanh nơi ở</Text>
          </View>
        </View>
        <Pressable onPress={onSave} disabled={saving} className="active:scale-95">
          <LinearGradient
            colors={[colors.primary.DEFAULT, colors.accent.DEFAULT]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ paddingHorizontal: 14, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center', opacity: saving ? 0.6 : 1 }}
          >
            <Text className="font-sans-bold text-xs text-white">{saving ? 'Đang lưu...' : 'Lưu'}</Text>
          </LinearGradient>
        </Pressable>
      </View>

      <ScrollView contentContainerClassName="gap-4 p-4" keyboardShouldPersistTaps="handled">
        <View style={{ position: 'relative', zIndex: 50 }}>
          <View className="flex-row items-center gap-2 rounded-2xl border border-border bg-white px-3.5">
            <Ionicons name="search" size={16} color={colors.muted.DEFAULT} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={() => void onSubmitSearch()}
              placeholder={addressText || 'Tìm địa chỉ...'}
              placeholderTextColor={colors.muted.light}
              returnKeyType="search"
              className="h-12 flex-1 text-xs font-sans-bold text-ink"
            />
            {searching ? (
              <ActivityIndicator size="small" />
            ) : query.length > 0 ? (
              <Pressable onPress={() => setQuery('')}>
                <Ionicons name="close-circle" size={18} color={colors.muted.DEFAULT} />
              </Pressable>
            ) : null}
          </View>
          <AddressSuggestionList suggestions={suggestions} loading={loadingSuggestions} onSelect={onSelectSuggestion} />
        </View>

        <View className="h-96 overflow-hidden rounded-2xl border border-border shadow-sm">
          <MapAreaPicker
            key={mapKey}
            place={addressText}
            initialRegion={initialRegion}
            radiusKm={radiusKm}
            onCenterChange={onCenterChange}
          />
        </View>

        <View className="gap-3 rounded-2xl border border-border bg-white p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <View className="h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                <Ionicons name="resize" size={14} color={colors.primary.DEFAULT} />
              </View>
              <Text className="font-sans-bold text-xs text-ink">Điều chỉnh bán kính nhận tin</Text>
            </View>
            <Text className="rounded-full bg-primary/10 px-2.5 py-0.5 font-sans-black text-xs text-primary">
              {radiusKm} km
            </Text>
          </View>
          <RadiusSlider valueKm={radiusKm} onChange={setRadiusKm} />
          <View className="flex-row justify-between">
            <Text className="text-[10px] font-sans-bold text-muted-light">0.5 km (Ngõ xóm)</Text>
            <Text className="text-[10px] font-sans-bold text-muted-light">2.5 km (Phường)</Text>
            <Text className="text-[10px] font-sans-bold text-muted-light">5.0 km (Quận)</Text>
          </View>
        </View>

        <View>
          <Text className="font-mono-medium text-[10px] tracking-wide text-muted">THÔNG BÁO</Text>
          <View className="mt-2.5 rounded-2xl border border-border bg-white p-3.5">
            <View className="flex-row items-center gap-2">
              <Ionicons name="megaphone" size={14} color={colors.primary.DEFAULT} />
              <Text className="flex-1 text-sm font-sans-semibold text-ink">Gom tin gửi một lần</Text>
              <Text className="font-mono-semibold text-[12.5px] text-ink">Thứ Ba, 19:00</Text>
            </View>
            <Text className="mt-2 text-xs leading-[19px] text-muted">
              Không báo ngay từng tin. Chỉ tin khẩn cấp đã được nhiều người xác nhận mới gửi ngay.
            </Text>
          </View>
        </View>

        <View className="flex-row items-start gap-2.5 rounded-2xl border border-border bg-cream-surface/60 p-3.5">
          <Ionicons name="information-circle" size={16} color={colors.muted.DEFAULT} />
          <Text className="flex-1 text-[11px] leading-[18px] text-muted">
            Tin sẽ ưu tiên phân phối tới cư dân trong bán kính đã chọn. Nội đô Hà Nội đủ dày dân để
            bán kính nhỏ vẫn có tin — nới rộng quá thì mất cảm giác hàng xóm.
          </Text>
        </View>

        {error ? <Text className="text-xs text-danger">{error}</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
}
