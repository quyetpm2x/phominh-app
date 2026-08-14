import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FilterChip } from '../../src/components/ui/Chip';
import { useMyPosts } from '../../src/hooks/useMyPosts';
import { formatFreshness } from '../../src/utils/formatFreshness';

const TABS = ['Đang hiện', 'Đã hết hạn'];

// on.myPosts — bài của tôi, tách đang hiện / đã hết hạn (mục 35).
export default function MyPostsScreen() {
  const [tab, setTab] = useState(TABS[0]);
  const { data: posts, isLoading } = useMyPosts();
  const shown = posts?.filter((p) => (tab === TABS[0] ? p.status === 'active' : p.status === 'expired'));

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="h-[46px] flex-row items-center gap-1.5 px-3 border-b border-border bg-white">
        <Pressable onPress={() => router.back()} className="w-[34px] h-[34px] items-center justify-center">
          <Text className="text-[21px] text-ink">‹</Text>
        </Pressable>
        <Text className="font-sans-semibold text-sm text-ink">Bài của tôi</Text>
      </View>

      <ScrollView contentContainerClassName="p-3.5">
        <View className="flex-row gap-1.5">
          {TABS.map((t) => (
            <FilterChip key={t} label={t} selected={tab === t} onPress={() => setTab(t)} />
          ))}
        </View>
        <View className="mt-3 gap-2.5">
          {isLoading ? <ActivityIndicator /> : null}
          {!isLoading && shown?.length === 0 ? (
            <Text className="text-sm text-muted py-6 text-center">
              {tab === TABS[0] ? 'Chưa có bài nào đang hiện.' : 'Chưa có bài nào hết hạn.'}
            </Text>
          ) : null}
          {shown?.map((p) => (
            <Pressable
              key={p.id}
              onPress={() => router.push(`/post/${p.id}`)}
              className="rounded-2xl border border-border bg-white p-3.5"
            >
              <Text numberOfLines={2} className="text-[13.5px] leading-[20px] text-ink/85">
                {p.content}
              </Text>
              <View className="mt-1.5 flex-row items-center gap-2.5">
                <Text className="font-mono-medium text-[11px] text-muted">{formatFreshness(p.createdAt)}</Text>
                <Text className="text-[11px] text-muted">{p.voteCount} hữu ích · {p.commentCount} bình luận</Text>
              </View>
            </Pressable>
          ))}
        </View>
        <Text className="mt-3.5 text-xs leading-[19px] text-muted">
          Bài hết hạn chỉ mình bạn xem lại được. Hàng xóm không còn thấy trong feed hay tìm kiếm.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
