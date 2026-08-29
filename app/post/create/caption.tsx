import * as Location from 'expo-location';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HighlightToolbar } from '../../../src/components/HighlightToolbar';
import { PostStyleTools } from '../../../src/components/PostStyleTools';
import { FilterChip } from '../../../src/components/ui/Chip';
import { fontSizeToStyle } from '../../../src/constants/post-style-presets';
import { HIGHLIGHT_MARKER, clearHighlight, wrapHighlight } from '../../../src/lib/highlightMarkup';
import { composeTypeChips } from '../../../src/mocks/phoMinh';
import { usePostDraftStore } from '../../../src/stores/postDraftStore';

// isCaption — "Bài mới": chọn loại bài, xem vị trí & hạn hiển thị trước khi qua bước kiểm tra cuối
// (mục 22). composeTypeChips là nhãn UI, KHÔNG có field tương ứng ở backend (postType chỉ có
// life/merchant/emergency) — chọn chip chỉ để user tự phân loại, không gửi lên server riêng.
export default function CaptionScreen() {
  const {
    photoUri,
    lat,
    lng,
    content,
    category,
    textColor,
    backgroundColor,
    fontSize,
    setContent,
    setCategory,
    setTextColor,
    setBackgroundColor,
    setFontSize,
  } = usePostDraftStore();
  const [addressText, setAddressText] = useState('Đang tìm địa chỉ…');
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  useEffect(() => {
    if (lat === null || lng === null) return;
    (async () => {
      try {
        const results = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
        const r = results[0];
        const line = [r?.street, r?.district || r?.subregion || r?.city].filter(Boolean).join(', ');
        setAddressText(line || 'Không xác định được địa chỉ');
      } catch {
        setAddressText('Không xác định được địa chỉ');
      }
    })();
  }, [lat, lng]);

  // useFocusEffect, không phải useEffect thường — xem giải thích trong review.tsx (chống 2 lệnh
  // router.replace đua nhau gây flash màn hình khi confirm.tsx đăng bài xong tự điều hướng đi).
  useFocusEffect(
    useCallback(() => {
      if (!photoUri) {
        router.replace('/post/create/camera');
      }
    }, [photoUri]),
  );

  if (!photoUri) {
    return null;
  }

  const canContinue = content.trim().length > 0;

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="h-[46px] flex-row items-center justify-between px-3.5 border-b border-border">
        <Pressable onPress={() => router.replace('/post/create/camera')}>
          <Text className="text-[15px] text-ink">‹ Chụp lại</Text>
        </Pressable>
        <Text className="font-sans-semibold text-sm text-ink">Bài mới</Text>
        <Pressable
          onPress={() => {
            if (canContinue) router.push('/post/create/confirm');
          }}
          className={`h-8 rounded-lg px-3.5 items-center justify-center ${canContinue ? 'bg-ink' : 'bg-border'}`}
        >
          <Text className={`font-sans-semibold text-xs ${canContinue ? 'text-white' : 'text-muted'}`}>Tiếp</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerClassName="p-3.5">
        <View className="flex-row gap-3">
          <View className="w-[88px] flex-none">
            <Image source={{ uri: photoUri }} style={{ height: 64, borderRadius: 10 }} resizeMode="cover" />
          </View>
          <TextInput
            value={content}
            onChangeText={setContent}
            onSelectionChange={(e) => setSelection(e.nativeEvent.selection)}
            placeholder="Thêm một dòng…"
            placeholderTextColor="#a8a297"
            multiline
            maxLength={2000}
            style={[
              { flex: 1, color: textColor ?? undefined, backgroundColor: backgroundColor ?? undefined },
              fontSizeToStyle(fontSize),
            ]}
            className={backgroundColor ? 'rounded-lg px-2 py-1' : undefined}
          />
        </View>

        <HighlightToolbar
          hasSelection={selection.end > selection.start}
          hasHighlight={content.includes(HIGHLIGHT_MARKER)}
          onHighlight={() => setContent(wrapHighlight(content, selection.start, selection.end))}
          onClear={() => setContent(clearHighlight(content))}
        />

        <PostStyleTools
          textColor={textColor}
          backgroundColor={backgroundColor}
          fontSize={fontSize}
          onTextColorChange={setTextColor}
          onBackgroundColorChange={setBackgroundColor}
          onFontSizeChange={setFontSize}
        />

        <Text className="mt-4 font-mono-medium text-xs tracking-wide text-muted">LOẠI BÀI</Text>
        <View className="mt-2.5 flex-row flex-wrap gap-2">
          {composeTypeChips.map((c) => (
            <FilterChip key={c} label={c} selected={category === c} onPress={() => setCategory(c)} />
          ))}
        </View>

        <View className="mt-5 rounded-2xl border border-border bg-white overflow-hidden">
          <View className="px-3.5 py-3 flex-row gap-2.5 items-center border-b border-border-soft">
            <View className="w-[38px] h-[38px] rounded-[9px] bg-map items-center justify-center">
              <View className="w-2 h-2 rounded-full bg-primary border-2 border-white" />
            </View>
            <View className="flex-1">
              <Text className="font-sans-semibold text-[13.5px] text-ink">{addressText}</Text>
              <Text className="text-[11.5px] text-muted mt-0.5">Chỗ bạn đang đứng — không đổi được</Text>
            </View>
          </View>
          <Text className="px-3.5 py-2.5 text-xs leading-[19px] text-muted">
            Bài sẽ hiện cho người ở gần <Text className="font-sans-bold text-ink">đây</Text>, không phải khu vực bạn
            khai là nhà.
          </Text>
        </View>

        <View className="mt-3.5 flex-row items-center gap-2.5 rounded-2xl border border-border bg-white px-3.5 py-3">
          <Text className="flex-1 text-[13.5px] text-ink/85">Tự ẩn sau</Text>
          <Text className="font-mono-semibold text-[13px] text-ink">48 giờ</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
