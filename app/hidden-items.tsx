import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomSheet } from '../src/components/ui/BottomSheet';
import { Button } from '../src/components/ui/Button';
import { UnderlineTabs } from '../src/components/ui/UnderlineTabs';
import { SettingsHeader } from '../src/features/settings/SettingsHeader';
import { HiddenIntro, HiddenTip } from '../src/features/hidden-items/HiddenInfoCards';
import { HiddenItemCard } from '../src/features/hidden-items/HiddenItemCard';
import { filterHiddenItems, type HiddenFilter } from '../src/features/hidden-items/data';
import { useHiddenItems } from '../src/features/hidden-items/useHiddenItems';
export default function HiddenItemsScreen() {
  const { items, unhide, clear } = useHiddenItems();
  const [filter, setFilter] = useState<HiddenFilter>('all');
  const [confirm, setConfirm] = useState(false);
  const topics = filterHiddenItems(items, 'topics').length;
  const options: { key: HiddenFilter; label: string }[] = [
    { key: 'all', label: `Tất cả (${items.length})` },
    { key: 'users', label: `Người dùng (${filterHiddenItems(items, 'users').length})` },
    { key: 'posts', label: `Bài viết (${filterHiddenItems(items, 'posts').length})` },
    ...(topics || filter === 'topics' ? [{ key: 'topics' as const, label: `Chủ đề (${topics})` }] : []),
  ];
  const visible = filterHiddenItems(items, filter);
  return (
    <SafeAreaView style={styles.screen}>
      <SettingsHeader
        compact
        whiteBack
        title="Không quan tâm"
        action={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Bỏ ẩn tất cả"
            accessibilityState={{ disabled: items.length === 0 }}
            disabled={items.length === 0}
            hitSlop={8}
            onPress={() => setConfirm(true)}
          >
            <Text className="font-sans-bold" style={[styles.clear, items.length === 0 && styles.disabled]}>
              Bỏ ẩn tất cả
            </Text>
          </Pressable>
        }
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <HiddenIntro />
        <UnderlineTabs variant="segmented" options={options} value={filter} onChange={setFilter} />
        <View style={styles.list}>
          <Text accessibilityRole="header" className="font-sans-black" style={styles.heading}>
            DANH SÁCH MỤC ĐÃ ẨN
          </Text>
          {visible.map((item) => (
            <HiddenItemCard key={`${item.kind}-${item.id}`} item={item} onUnhide={() => unhide(item)} />
          ))}
          {visible.length === 0 ? (
            <Text className="font-sans" style={styles.empty}>
              Không có mục nào đang ẩn trong danh sách này.
            </Text>
          ) : null}
        </View>
        <HiddenTip />
      </ScrollView>
      <BottomSheet visible={confirm} onClose={() => setConfirm(false)} variant="dialog">
        <View style={styles.confirm}>
          <Text className="font-sans-bold text-lg text-ink">Bỏ ẩn tất cả?</Text>
          <Text className="font-sans text-sm text-muted">
            Các bài viết, tác giả và chủ đề đã ẩn có thể xuất hiện lại trên bảng tin.
          </Text>
          <Button
            label="Bỏ ẩn tất cả"
            onPress={() => {
              clear();
              setConfirm(false);
            }}
          />
          <Button label="Huỷ" variant="outline" onPress={() => setConfirm(false)} />
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8F9FA' },
  content: { padding: 16, gap: 16, paddingBottom: 64 },
  clear: { fontSize: 12, lineHeight: 18, color: '#E63946' },
  disabled: { opacity: 0.4 },
  list: { gap: 10 },
  heading: { fontSize: 11, lineHeight: 16.5, letterSpacing: 0.55, color: '#4A4A4A', paddingLeft: 1.5 },
  empty: { fontSize: 13, lineHeight: 20, color: '#79716B', textAlign: 'center', paddingVertical: 24 },
  confirm: { gap: 16 },
});
