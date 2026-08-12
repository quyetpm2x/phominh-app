import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PostCard } from '../../src/components/PostCard';
import { FilterChip } from '../../src/components/ui/Chip';
import { currentUser, posts } from '../../src/mocks/phoMinh';

const TABS = ['Đang hiện', 'Đã hết hạn'];

// on.myPosts — bài của tôi, tách đang hiện / đã hết hạn.
export default function MyPostsScreen() {
  const [tab, setTab] = useState(TABS[0]);
  const mine = posts.filter((p) => p.author === currentUser.displayName || p.id === 'p3');

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
          {tab === TABS[0] ? (
            mine.map((p) => <PostCard key={p.id} post={p} />)
          ) : (
            <Text className="text-sm text-muted py-6 text-center">Chưa có bài nào hết hạn.</Text>
          )}
        </View>
        <Text className="mt-3.5 text-xs leading-[19px] text-muted">
          Bài hết hạn chỉ mình bạn xem lại được. Hàng xóm không còn thấy trong feed hay tìm kiếm.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
