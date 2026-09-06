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
  } = controller;
  return (
    <>
      <BottomSheet visible={sheet !== null} onClose={() => setSheet(null)}>
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="font-sans-bold text-lg text-ink">
            {sheet === 'filter'
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
        items={[
          {
            label: saved[POSTS[menu ?? 0].id] ? 'Bỏ lưu bài viết' : 'Lưu bài viết',
            onPress: () => {
              const id = POSTS[menu ?? 0].id;
              setSaved((previous) => ({ ...previous, [id]: !previous[id] }));
            },
          },
          {
            label: 'Ẩn bài viết',
            onPress: () => setHidden((previous) => [...previous, POSTS[menu ?? 0].id]),
          },
        ]}
      />
    </>
  );
}

const styles = StyleSheet.create({
  sheetScroll: { maxHeight: 460 },

  sheetContent: { gap: 16 },
});
