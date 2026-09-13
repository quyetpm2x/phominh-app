import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { HomeFeedController } from '../home/useHomeFeed';
import { MY_POSTS, type MyPost } from '../my-posts/data';
import { MyPostsTab } from '../my-posts/MyPostsTab';
import { ActiveShopPostCard } from './ActiveShopPostCard';
import { type ShopAction } from './data';
import { ShopActionSheet } from './ShopActionSheet';
import { ShopDateRangeSelect, type ShopDateRange } from './ShopDateRangeSelect';
import { ShopHeader } from './ShopHeader';
import { ShopManagementCards } from './ShopManagementCards';
import { ShopMetrics } from './ShopMetrics';
import { ShopPostList } from './ShopPostList';
import { ShopViewsChart } from './ShopViewsChart';

export function ShopTab({
  onCompose,
  controller,
  posts = MY_POSTS,
  showPosts,
  onSelectPosts,
}: {
  onCompose: () => void;
  controller: HomeFeedController;
  posts?: MyPost[];
  showPosts: boolean;
  onSelectPosts: (show: boolean) => void;
}) {
  const { profile } = controller;
  const scroll = useRef<ScrollView>(null);
  const [dateRange, setDateRange] = useState<ShopDateRange>(7);
  const [action, setAction] = useState<ShopAction | null>(null);
  const registered = profile.isShopRegistered === true;
  const myPosts = posts.filter((item) => registered || item.id !== 'my-clearance');
  const selectTab = (posts: boolean) => {
    onSelectPosts(posts);
    scroll.current?.scrollTo({ y: 0, animated: false });
  };
  return (
    <>
      <ShopHeader
        profile={profile}
        showPosts={showPosts}
        onSelect={selectTab}
        showRegistrationBanner={myPosts.length > 0}
      />
      {!registered || showPosts ? (
        <MyPostsTab
          key={registered ? 'shop' : 'personal'}
          personal={!registered}
          onCompose={onCompose}
          controller={controller}
          posts={myPosts}
        />
      ) : (
        <ScrollView
          ref={scroll}
          className="flex-1 bg-[#F8F9FA]"
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row items-center justify-between gap-2">
            <View className="flex-1 flex-row items-center gap-1">
              <Ionicons name="stats-chart-outline" size={14} color="#FF416C" />
              <Text accessibilityRole="header" className="font-sans-bold text-[13px] text-[#1A1A1A]">
                Hiệu quả bán hàng & tiếp cận
              </Text>
            </View>
            <ShopDateRangeSelect value={dateRange} onChange={setDateRange} />
          </View>
          {dateRange === 7 ? (
            <>
              <ShopMetrics />
              <ShopViewsChart />
            </>
          ) : (
            <View className="gap-1 rounded-[20px] border border-[#E9ECEF] bg-white p-4">
              <Text className="font-sans-bold text-sm text-[#1A1A1A]">
                Chưa có dữ liệu cho {dateRange} ngày qua
              </Text>
              <Text className="font-sans text-xs text-[#4A4A4A]">
                Dữ liệu mẫu hiện chỉ có cho 7 ngày qua.
              </Text>
            </View>
          )}
          <ActiveShopPostCard />
          <ShopPostList
            onSelect={(post) => router.push({ pathname: '/shop/post/[id]', params: { id: post.id } })}
            onViewAll={() => selectTab(true)}
          />
          <ShopManagementCards onAction={setAction} />
        </ScrollView>
      )}
      <ShopActionSheet
        action={action}
        onClose={() => {
          setAction(null);
        }}
      />
    </>
  );
}
const styles = StyleSheet.create({ content: { padding: 16, gap: 16, paddingBottom: 56 } });
