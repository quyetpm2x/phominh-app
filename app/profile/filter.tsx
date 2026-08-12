import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FilterChip } from '../../src/components/ui/Chip';
import { RadiusCircle, RadiusSlider } from '../../src/components/ui/RadiusSlider';
import type { PostTypeFilter, SortMode } from '../../src/lib/postListFilters';
import { useFilterStore } from '../../src/stores/filterStore';

// 3 giá trị THẬT khớp Post.postType ở backend (không phải nhãn UI giả như trước) — đúng yêu cầu
// Tầng 2 task 13 "Bộ lọc feed (đời sống/merchant/khẩn cấp)".
const POST_TYPE_OPTIONS: { key: PostTypeFilter; label: string }[] = [
  { key: 'life', label: 'Đời sống' },
  { key: 'merchant', label: 'Cửa hàng' },
  { key: 'emergency', label: 'Khẩn cấp' },
];

const SORT_OPTIONS: { key: SortMode; label: string }[] = [
  { key: 'default', label: 'Mặc định' },
  { key: 'newest', label: 'Mới nhất' },
  { key: 'mostVoted', label: 'Nhiều hữu ích nhất' },
];

// on.filter — bộ lọc dòng tin: loại bài, sắp xếp, bán kính. Áp dụng cho cả 3 tab (radiusOverrideKm
// override cả Nhà/Chỗ làm trong phiên hiện tại — quyết định đã chốt).
export default function FilterScreen() {
  const { postTypes, sortMode, radiusOverrideKm, setPostTypes, setSortMode, setRadiusOverrideKm, reset } =
    useFilterStore();
  const radius = radiusOverrideKm ?? 2;

  const toggleType = (key: PostTypeFilter) =>
    setPostTypes(postTypes.includes(key) ? postTypes.filter((k) => k !== key) : [...postTypes, key]);

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="h-[46px] flex-row items-center gap-1.5 px-3 border-b border-border">
        <Pressable onPress={() => router.back()} className="w-[34px] h-[34px] items-center justify-center">
          <Text className="text-[21px] text-ink">‹</Text>
        </Pressable>
        <Text className="font-sans-semibold text-[14.5px] text-ink">Lọc dòng tin</Text>
        <View className="flex-1" />
        <Pressable onPress={reset}>
          <Text className="text-[13px] text-muted">Đặt lại</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerClassName="p-4.5">
        <Text className="font-mono-medium text-xs tracking-wide text-muted">LOẠI BÀI</Text>
        <View className="mt-2.5 flex-row flex-wrap gap-2">
          {POST_TYPE_OPTIONS.map((t) => (
            <FilterChip key={t.key} label={t.label} selected={postTypes.includes(t.key)} onPress={() => toggleType(t.key)} />
          ))}
        </View>

        <Text className="mt-5.5 font-mono-medium text-xs tracking-wide text-muted">SẮP XẾP</Text>
        <View className="mt-2.5 flex-row flex-wrap gap-2">
          {SORT_OPTIONS.map((s) => (
            <FilterChip key={s.key} label={s.label} selected={sortMode === s.key} onPress={() => setSortMode(s.key)} />
          ))}
        </View>
        <Text className="mt-2.5 text-xs leading-[19px] text-muted">
          Mặc định kết hợp độ mới và mức quan tâm, điểm giảm dần theo giờ.
        </Text>

        <Text className="mt-5.5 font-mono-medium text-xs tracking-wide text-muted">BÁN KÍNH · {radius} km</Text>
        <View className="mt-2.5 h-[130px] rounded-2xl overflow-hidden border border-strong bg-map relative">
          <RadiusCircle valueKm={radius} />
          <View
            style={{ position: 'absolute', left: '50%', top: '50%', width: 12, height: 12, marginLeft: -6, marginTop: -6, borderRadius: 6, backgroundColor: '#1f6f52', borderWidth: 2.5, borderColor: '#fff' }}
          />
        </View>
        <View className="mt-2.5">
          <RadiusSlider valueKm={radius} onChange={setRadiusOverrideKm} />
        </View>
      </ScrollView>

      <View className="px-4.5 pt-3.5 pb-6 border-t border-border">
        <Pressable onPress={() => router.back()} className="h-[52px] rounded-2xl bg-ink items-center justify-center">
          <Text className="font-sans-semibold text-[15.5px] text-white">
            Xem {postTypes.length || 'tất cả'} loại
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
