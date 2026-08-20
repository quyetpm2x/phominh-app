import { Ionicons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import * as Location from 'expo-location';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getMe, type UserProfile } from '../../../src/api/client';
import { GradientButton } from '../../../src/components/ui/Button';
import { Avatar } from '../../../src/components/ui/Avatar';
import { colors } from '../../../src/constants/design-tokens';
import { fontSizeToStyle } from '../../../src/constants/post-style-presets';
import { mapCategoryToPostType } from '../../../src/lib/postCategoryMapping';
import { submitPendingPost } from '../../../src/lib/submitPendingPost';
import { usePendingPostStore } from '../../../src/stores/pendingPostStore';
import { usePostDraftStore } from '../../../src/stores/postDraftStore';

// on.confirm — kiểm tra lần cuối trước khi đăng, nhắc trách nhiệm pháp lý (mục 24). Chọn bí
// danh/tên thật (mục 23) đặt ở đây — không có màn nào khác trong flow phù hợp hơn để hỏi việc này.
export default function ConfirmScreen() {
  const queryClient = useQueryClient();
  const {
    photoUri,
    lat,
    lng,
    isMockLocation,
    isLibraryPhoto,
    content,
    category,
    displayMode,
    textColor,
    backgroundColor,
    fontSize,
    setDisplayMode,
    reset,
  } = usePostDraftStore();
  const postType = mapCategoryToPostType(category);
  const addPending = usePendingPostStore((s) => s.addPending);
  const [addressText, setAddressText] = useState('Đang tìm địa chỉ…');
  const [me, setMe] = useState<UserProfile | null>(null);

  useEffect(() => {
    void getMe().then(setMe).catch(() => setMe(null));
  }, []);

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

  // useFocusEffect (chỉ chạy khi màn đang thực sự hiển thị) — xem giải thích trong review.tsx.
  useFocusEffect(
    useCallback(() => {
      if (!photoUri || lat === null || lng === null) {
        router.replace('/post/create/camera');
      }
    }, [photoUri, lat, lng]),
  );

  if (!photoUri || lat === null || lng === null) {
    return null;
  }

  const displayName = (displayMode === 'real_name' ? me?.realName : me?.alias) ?? '...';

  // Kiểu Facebook: điều hướng về Feed NGAY, không đợi upload/tạo bài xong — thẻ "Đang đăng…"
  // (PendingPostCard) hiện ngay đầu Dòng tin, việc upload+tạo bài chạy nền qua submitPendingPost
  // (không await ở đây). Lỗi (nếu có) hiện thẳng trên thẻ đó kèm nút thử lại, không chặn màn hình.
  const onSubmit = () => {
    const pending = {
      localId: `pending-${Date.now()}`,
      photoUri,
      content,
      postType,
      lat,
      lng,
      isMockLocation,
      isLibraryPhoto,
      displayMode,
      authorDisplayName: displayName,
      status: 'uploading' as const,
      textColor,
      backgroundColor,
      fontSize,
    };
    addPending(pending);
    // Điều hướng TRƯỚC, reset() SAU — reset() làm photoUri về null, nếu gọi trước điều hướng thì
    // chính màn này (đang là màn active) sẽ tự redirect sang camera 1 nhịp trước khi kịp chuyển
    // sang Feed, gây flash màn hình. Gọi sau khi đã rời màn thì không còn ai lắng nghe nữa.
    router.replace({ pathname: '/(main)/feed', params: { justPosted: '1' } });
    reset();
    void submitPendingPost(queryClient, pending);
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="h-[46px] flex-row items-center gap-1.5 px-3 border-b border-border">
        <Pressable onPress={() => router.back()} className="w-[34px] h-[34px] items-center justify-center">
          <Text className="text-[21px] text-ink">‹</Text>
        </Pressable>
        <Text className="font-sans-semibold text-sm text-ink">Kiểm tra lần cuối</Text>
      </View>

      <ScrollView contentContainerClassName="p-4.5">
        <Text className="mb-2 font-mono-medium text-xs tracking-wide text-muted">SẼ HIỆN NHƯ THẾ NÀY TRÊN DÒNG TIN</Text>

        <View className="rounded-2xl border border-border bg-white overflow-hidden flex-row">
          <View style={{ width: 3.5, backgroundColor: colors.primary.DEFAULT }} />
          <View className="flex-1">
            <View className="p-3.5 pb-2.5 flex-row items-center gap-2.5">
              <Avatar initial={displayName.charAt(0).toUpperCase()} size={38} radius={12} />
              <View className="flex-1">
                <Text className="font-sans-bold text-[15.5px] text-ink" numberOfLines={1}>
                  {displayName}
                </Text>
                <Text className="mt-0.5 font-mono-medium text-[11px] text-muted">Vừa đăng</Text>
              </View>
            </View>

            <Text
              className="px-3.5 pb-3 text-ink/85"
              style={[{ color: textColor ?? undefined, backgroundColor: backgroundColor ?? undefined }, fontSizeToStyle(fontSize)]}
            >
              {content}
            </Text>

            <Image source={{ uri: photoUri }} style={{ height: 220, width: '100%' }} resizeMode="cover" />
          </View>
        </View>

        <View className="mt-3.5 rounded-2xl border border-border bg-white overflow-hidden">
          <Row label="Hạn hiển thị" value={postType === 'emergency' ? 'Không tự ẩn — cần hàng xóm xác nhận' : '48 giờ'} mono />
          <Row label="Vị trí gắn kèm" value={addressText} last />
        </View>

        {postType === 'emergency' ? (
          <View className="mt-3.5 rounded-[14px] border border-danger-200 bg-danger-50 px-3.5 py-3 flex-row gap-2.5">
            <Ionicons name="warning" size={16} color={colors.danger.text} style={{ marginTop: 1 }} />
            <Text className="flex-1 text-xs leading-[19px] text-danger-text">
              Bài này được đánh dấu <Text className="font-sans-bold">Khẩn cấp</Text> — sẽ hiện nổi bật và không tự
              ẩn sau 48 giờ. Cần đủ hàng xóm ở gần xác nhận mới được xác minh chính thức.
            </Text>
          </View>
        ) : null}

        <Text className="mt-4 font-mono-medium text-xs tracking-wide text-muted">HIỂN THỊ TÊN</Text>
        <View className="mt-2.5 rounded-2xl border border-border bg-white overflow-hidden">
          <Pressable
            onPress={() => setDisplayMode('alias')}
            className={`px-3.5 py-3 flex-row items-center justify-between border-b border-border-soft ${
              displayMode === 'alias' ? 'bg-primary-50' : ''
            }`}
          >
            <View>
              <Text className="font-sans-semibold text-[13.5px] text-ink">Bí danh</Text>
              <Text className="text-[11.5px] text-muted mt-0.5">{me?.alias ?? '...'}</Text>
            </View>
            <RadioDot selected={displayMode === 'alias'} />
          </Pressable>
          <Pressable
            onPress={() => me?.realName && setDisplayMode('real_name')}
            disabled={!me?.realName}
            className={`px-3.5 py-3 flex-row items-center justify-between ${
              displayMode === 'real_name' ? 'bg-primary-50' : ''
            } ${!me?.realName ? 'opacity-50' : ''}`}
          >
            <View>
              <Text className="font-sans-semibold text-[13.5px] text-ink">Tên thật</Text>
              <Text className="text-[11.5px] text-muted mt-0.5">
                {me?.realName ?? 'Chưa đặt tên thật — vào Hồ sơ để đặt'}
              </Text>
            </View>
            <RadioDot selected={displayMode === 'real_name'} />
          </Pressable>
        </View>

        <View className="mt-3.5 rounded-[14px] border border-accent-100 bg-accent-50 px-3.5 py-3 flex-row gap-2.5">
          <Ionicons name="alert-circle" size={16} color={colors.accent.text} style={{ marginTop: 1 }} />
          <Text className="flex-1 text-xs leading-[19px] text-accent-text">
            Đăng tin sai sự thật để bôi nhọ người khác có thể bị xử lý theo Điều 156 Bộ luật Hình sự. Bài đăng gắn
            với số điện thoại đã xác thực của bạn.
          </Text>
        </View>

      </ScrollView>

      <View className="px-4.5 pt-3.5 pb-6 border-t border-border">
        <GradientButton label="Đăng lên xóm" onPress={onSubmit} />
      </View>
    </SafeAreaView>
  );
}

function Row({ label, value, mono, last }: { label: string; value: string; mono?: boolean; last?: boolean }) {
  return (
    <View className={`px-3.5 py-3 flex-row items-center ${last ? '' : 'border-b border-border-soft'}`}>
      <Text className="flex-1 text-[13.5px] text-muted">{label}</Text>
      <Text className={`text-[13.5px] font-sans-semibold text-ink ${mono ? 'font-mono-semibold' : ''}`} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function RadioDot({ selected }: { selected: boolean }) {
  return (
    <View
      className={`w-5 h-5 rounded-full border-2 items-center justify-center ${selected ? 'border-primary' : 'border-border'}`}
    >
      {selected ? <View className="w-2.5 h-2.5 rounded-full bg-primary" /> : null}
    </View>
  );
}
