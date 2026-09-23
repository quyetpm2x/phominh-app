import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheet } from '../../src/components/ui/BottomSheet';
import { Button } from '../../src/components/ui/Button';
import { CustomIcon } from '../../src/components/ui/CustomIcon';
import { usePostInteractions } from '../../src/features/home/postInteractions';
import type { FeedPost } from '../../src/features/home/types';
import { findResident } from '../../src/features/resident-profile/resident';
import { ResidentPostCard } from '../../src/features/resident-profile/ResidentPostCard';
import { ResidentPostMenu } from '../../src/features/resident-profile/ResidentPostMenu';
import { ResidentSummary } from '../../src/features/resident-profile/ResidentSummary';
import { useAcquaintances } from '../../src/features/resident-profile/useAcquaintances';
import { SettingsHeader } from '../../src/features/settings/SettingsHeader';

export default function ResidentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const resident = findResident(id);
  const [all, setAll] = useState(false);
  const [menu, setMenu] = useState(false);
  const [menuPost, setMenuPost] = useState<FeedPost | null>(null);
  const acquaintances = useAcquaintances();
  const insets = useSafeAreaInsets();
  const blocked = usePostInteractions((state) => state.blockedAuthors.includes(id));
  const hidden = usePostInteractions((state) => state.hidden);
  const edits = usePostInteractions((state) => state.edits);
  const posts =
    resident?.posts
      .filter((post) => !hidden.includes(post.id))
      .map((post) => ({ ...post, ...edits[post.id], avatar: resident.avatar })) ?? [];
  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.screen}>
      <SettingsHeader
        title="Hồ sơ cư dân"
        subtitle={resident?.area ?? 'Không tìm thấy cư dân'}
        backIcon="residentBack"
        backIconSize={18}
        backStyle={styles.headerButton}
        titleStyle={styles.title}
        subtitleStyle={styles.subtitle}
        style={[styles.header, { paddingTop: Math.max(48, insets.top) }]}
        action={
          resident ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Tùy chọn cư dân"
              onPress={() => setMenu(true)}
              style={styles.headerButton}
            >
              <CustomIcon name="residentMore" size={18} />
            </Pressable>
          ) : (
            <View style={styles.spacer} />
          )
        }
      />
      {!resident ? (
        <View style={styles.empty}>
          <Text className="font-sans text-muted">Hồ sơ này chưa có dữ liệu.</Text>
          <Button label="Về dòng tin" onPress={() => router.dismissTo('/home')} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <ResidentSummary
            resident={resident}
            known={acquaintances.ids.includes(id)}
            busy={!acquaintances.ready || acquaintances.saving}
            onToggle={() => void acquaintances.toggle(id)}
            onMessage={() => router.push({ pathname: '/chat/[id]', params: { id: resident.id } })}
          />
          <View style={styles.postsHeading}>
            <Text className="font-sans-black" style={styles.postsTitle}>
              Bài đăng trong khu phố
            </Text>
            <Text className="font-sans-bold" style={styles.count}>
              {blocked ? 0 : posts.length} tin hoạt động
            </Text>
            {posts.length > 1 && !all && (
              <Pressable accessibilityRole="button" onPress={() => setAll(true)} style={styles.all}>
                <Text className="font-sans-bold" style={styles.allText}>
                  Xem tất cả
                </Text>
                <CustomIcon name="residentChevron" size={11} />
              </Pressable>
            )}
          </View>
          {blocked ? (
            <Text className="font-sans text-sm text-muted">Bạn đã chặn cư dân này.</Text>
          ) : posts.length ? (
            (all ? posts : posts.slice(0, 1)).map((post) => (
              <ResidentPostCard key={post.id} post={post} onMenu={() => setMenuPost(post)} />
            ))
          ) : (
            <Text className="font-sans text-sm text-muted">Chưa có bài đăng trong khu phố.</Text>
          )}
        </ScrollView>
      )}
      <ResidentPostMenu post={menuPost} onClose={() => setMenuPost(null)} />
      <BottomSheet visible={menu} onClose={() => setMenu(false)} variant="actions">
        <View style={styles.menu}>
          <Text className="font-sans-black text-lg text-ink">{resident?.name}</Text>
          <Button
            label={blocked ? 'Bỏ chặn cư dân' : 'Chặn cư dân'}
            variant="outline"
            onPress={() => {
              const state = usePostInteractions.getState();
              if (blocked) state.unblockAuthor(id);
              else state.blockAuthor(id);
              setMenu(false);
            }}
          />
          <Button label="Đóng" variant="soft" onPress={() => setMenu(false)} />
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: '#FFFFFFF2',
    borderBottomWidth: 1,
    borderColor: '#E9ECEF',
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 0,
    backgroundColor: '#F1F3F5CC',
    shadowOpacity: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { fontSize: 16, lineHeight: 24, textAlign: 'center' },
  subtitle: { fontSize: 11, lineHeight: 16.5, textAlign: 'center', marginTop: 7 },
  spacer: { width: 36 },
  content: { padding: 16, gap: 16, paddingBottom: 32 },
  empty: { padding: 24, gap: 20 },
  postsHeading: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, paddingTop: 4 },
  postsTitle: { fontSize: 15, lineHeight: 22.5, color: '#1A1A1A' },
  count: {
    fontSize: 11,
    lineHeight: 16.5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 100,
    backgroundColor: '#F1F3F5',
    color: '#4A4A4A',
    overflow: 'hidden',
  },
  all: { flexDirection: 'row', alignItems: 'center', gap: 2, marginLeft: 'auto' },
  allText: { fontSize: 12, lineHeight: 18, color: '#FF416C' },
  menu: { padding: 20, gap: 12 },
});
