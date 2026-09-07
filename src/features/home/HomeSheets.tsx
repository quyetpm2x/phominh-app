import { Button } from '../../components/ui/Button';
import { PostShareSheet } from '../share/PostShareSheet';
import { router } from 'expo-router';
import { getPostMenuItems } from '../post/postMenu';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ActionSheetMenu } from '../../components/ui/ActionSheetMenu';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { FilterChip } from '../../components/ui/Chip';
import { MapAreaPicker } from '../../components/ui/MapAreaPicker';
import { colors } from '../../constants/design-tokens';
import { POSTS } from './data';
import { PostSheetContent } from './PostSheetContent';
import { AccountSheetContent } from './AccountSheetContent';
import type { HomeFeedController } from './useHomeFeed';
export function HomeSheets({ controller }: { controller: HomeFeedController }) {
  const {
    sheet,
    setSheet,
    selectedPost,
    filter,
    setFilter,
    areaLabel,
    selectedArea,
    setNearby,
    setTab,
    menu,
    setMenu,
    saved,
    setSaved,
    setHidden,
    sharePost,
  } = controller;
  return (
    <>
      <PostShareSheet
        post={controller.sharingPost}
        onClose={() => controller.setSharingPost(null)}
        areaLabel={areaLabel}
      />
      <BottomSheet visible={sheet !== null} onClose={() => setSheet(null)}>
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="font-sans-bold text-lg text-ink">
            {sheet === 'preferences'
              ? 'Quản lý danh sách'
              : sheet === 'filter'
                ? 'Lọc dòng tin'
                : sheet === 'map'
                  ? 'Khu vực đang xem'
                  : sheet === 'gallery'
                    ? selectedPost.name
                    : sheet === 'comments'
                      ? 'Bình luận'
                      : sheet === 'contact'
                        ? 'Liên hệ quán'
                        : sheet === 'details'
                          ? 'Thông tin khu phố'
                          : sheet === 'notifications'
                            ? 'Thông báo'
                            : sheet === 'profile'
                              ? 'Trang cá nhân'
                              : 'Đăng tin'}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Đóng"
            hitSlop={12}
            onPress={() => setSheet(null)}
          >
            <Ionicons name="close" size={24} color={colors.ink.DEFAULT} />
          </Pressable>
        </View>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={styles.sheetScroll}
          contentContainerStyle={styles.sheetContent}
        >
          {sheet === 'preferences' ? (
            <View className="gap-4">
              <Text className="font-sans-bold text-sm text-ink">Tác giả đã ẩn</Text>
              {controller.blockedAuthors.length === 0 ? (
                <Text className="font-sans text-sm text-muted">Chưa ẩn tác giả nào.</Text>
              ) : (
                controller.blockedAuthors.map((authorId) => (
                  <View key={authorId} className="flex-row items-center gap-3">
                    <Text className="flex-1 font-sans text-sm text-ink">
                      {POSTS.find((post) => post.authorId === authorId)?.name ?? 'Tác giả'}
                    </Text>
                    <Button
                      label="Bỏ ẩn"
                      variant="outline"
                      onPress={() => controller.unblockAuthor(authorId)}
                    />
                  </View>
                ))
              )}
              <Text className="font-sans-bold text-sm text-ink">Chủ đề giảm đề xuất</Text>
              {controller.reducedTopics.length === 0 ? (
                <Text className="font-sans text-sm text-muted">Chưa giảm đề xuất chủ đề nào.</Text>
              ) : (
                controller.reducedTopics.map((topic) => (
                  <View key={topic} className="flex-row items-center gap-3">
                    <Text className="flex-1 font-sans text-sm text-ink">
                      {topic === 'shops' ? 'Quán ăn' : 'Khu dân cư'}
                    </Text>
                    <Button
                      label="Khôi phục"
                      variant="outline"
                      onPress={() => controller.restoreTopic(topic)}
                    />
                  </View>
                ))
              )}
            </View>
          ) : null}
          {sheet === 'filter' ? (
            <View className="flex-row flex-wrap gap-2">
              {(
                [
                  { key: 'all', label: 'Tất cả' },
                  { key: 'shops', label: 'Quán quanh đây' },
                  { key: 'neighbors', label: 'Hàng xóm' },
                ] as const
              ).map((option) => (
                <FilterChip
                  key={option.key}
                  label={option.label}
                  selected={filter === option.key}
                  onPress={() => {
                    setFilter(option.key);
                    setSheet(null);
                  }}
                />
              ))}
            </View>
          ) : null}
          {sheet === 'map' ? (
            <View className="h-80 overflow-hidden rounded-2xl">
              <MapAreaPicker
                place={areaLabel}
                initialRegion={{ ...selectedArea, latitudeDelta: 0.035, longitudeDelta: 0.035 }}
                radiusKm={selectedArea.radiusKm}
                onCenterChange={(latitude, longitude) => {
                  setNearby({ latitude, longitude, radiusKm: selectedArea.radiusKm });
                  setTab('nearby');
                }}
              />
            </View>
          ) : null}
          <PostSheetContent {...controller} />
          <AccountSheetContent {...controller} />
        </ScrollView>
      </BottomSheet>
      <ActionSheetMenu
        visible={menu !== null}
        onClose={() => setMenu(null)}
        title="Tuỳ chọn bài viết"
        subtitle={`Bài đăng của ${POSTS[menu ?? 0].name}`}
        items={getPostMenuItems({
          saved: Boolean(saved[POSTS[menu ?? 0].id]),
          onSave: () => {
            const id = POSTS[menu ?? 0].id;
            setSaved((previous) => ({ ...previous, [id]: !previous[id] }));
          },
          onShare: () => void sharePost(menu ?? 0),
          onReport: () => router.push({ pathname: '/report', params: { postId: POSTS[menu ?? 0].id } }),
          onHide: () => setHidden((previous) => [...previous, POSTS[menu ?? 0].id]),
        })}
      />
    </>
  );
}

const styles = StyleSheet.create({
  sheetScroll: { maxHeight: 460 },

  sheetContent: { gap: 16 },
});
