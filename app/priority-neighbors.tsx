import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../src/components/ui/Button';
import { CustomIcon } from '../src/components/ui/CustomIcon';
import { IconTextInput } from '../src/components/ui/IconTextInput';
import { PriorityHeader } from '../src/features/priority-neighbors/PriorityHeader';
import { PriorityIntro, PriorityPrivacyNote } from '../src/features/priority-neighbors/PriorityIntro';
import { NeighborCard } from '../src/features/priority-neighbors/NeighborCard';
import { PrioritySheets } from '../src/features/priority-neighbors/PrioritySheets';
import { usePriorityNeighbors } from '../src/features/priority-neighbors/usePriorityNeighbors';
import { filterNeighbors, NEIGHBORS } from '../src/features/priority-neighbors/data';
export default function PriorityNeighborsScreen() {
  const controller = usePriorityNeighbors();
  const { ids, query, setQuery, filter, ready, saving, toggle } = controller;
  const [sheet, setSheet] = useState<'directory' | 'filter' | null>(null);
  const visible = filterNeighbors(NEIGHBORS, query, filter);
  const selected = visible.filter((n) => ids.includes(n.id));
  const suggestions = visible.filter((n) => !ids.includes(n.id));
  return (
    <SafeAreaView style={styles.screen}>
      <PriorityHeader count={ids.length} onAdd={() => setSheet('directory')} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <PriorityIntro />
        <View>
          <IconTextInput
            autoCorrect={false}
            autoCapitalize="none"
            icon="search"
            iconNode={<CustomIcon name="prioritySearch" size={16} />}
            accessibilityLabel="Tìm kiếm người quen"
            placeholder="Tìm kiếm người quen theo tên, số phòng, quán..."
            placeholderTextColor="#1A1A1A"
            value={query}
            onChangeText={setQuery}
            style={styles.search}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Lọc người quen"
            accessibilityState={{ selected: filter !== 'all' }}
            style={styles.filter}
            onPress={() => setSheet('filter')}
          >
            <CustomIcon name="priorityFilter" size={16} color={filter === 'all' ? '#4A4A4A' : '#FF416C'} />
          </Pressable>
        </View>
        {!ready ? (
          controller.error ? (
            <Button label="Tải lại danh sách" onPress={controller.retry} />
          ) : (
            <ActivityIndicator color="#FF416C" accessibilityLabel="Đang tải danh sách" />
          )
        ) : (
          <>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.countRow}>
                  <Text accessibilityRole="header" className="font-sans-black" style={styles.sectionTitle}>
                    ĐANG ƯU TIÊN
                  </Text>
                  <Text className="font-sans-bold" style={styles.count}>
                    {ids.length}
                  </Text>
                </View>
                <Text className="font-sans-bold" style={styles.hint}>
                  Chạm ngôi sao để huỷ
                </Text>
              </View>
              {selected.map((neighbor) => (
                <NeighborCard
                  key={neighbor.id}
                  neighbor={neighbor}
                  priority
                  disabled={saving}
                  onToggle={() => void toggle(neighbor.id)}
                />
              ))}
              {selected.length === 0 ? (
                <Text className="font-sans text-sm text-muted">
                  {ids.length === 0
                    ? 'Bạn chưa ưu tiên người quen nào.'
                    : 'Không tìm thấy người quen phù hợp.'}
                </Text>
              ) : null}
            </View>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text accessibilityRole="header" className="font-sans-black" style={styles.sectionTitle}>
                  GỢI Ý GẦN BẠN
                </Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Xem tất cả người quen gợi ý"
                  hitSlop={10}
                  onPress={() => setSheet('directory')}
                >
                  <Text className="font-sans-bold" style={styles.all}>
                    Xem tất cả
                  </Text>
                </Pressable>
              </View>
              {suggestions.map((neighbor) => (
                <NeighborCard
                  key={neighbor.id}
                  neighbor={neighbor}
                  priority={false}
                  disabled={saving}
                  onToggle={() => void toggle(neighbor.id)}
                />
              ))}
              {suggestions.length === 0 ? (
                <Text className="font-sans text-sm text-muted">Chưa có gợi ý phù hợp.</Text>
              ) : null}
            </View>
          </>
        )}
        <PriorityPrivacyNote />
      </ScrollView>
      <PrioritySheets {...controller} sheet={sheet} onClose={() => setSheet(null)} />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8F9FA' },
  content: { padding: 16, paddingBottom: 80, gap: 20 },
  search: {
    height: 44,
    borderRadius: 12.2,
    backgroundColor: '#FFF',
    paddingRight: 38,
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 13,
  },
  filter: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 40,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: { gap: 12 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  countRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionTitle: { fontSize: 12, lineHeight: 18, letterSpacing: 0.6, color: '#4A4A4A' },
  count: {
    minWidth: 20,
    height: 20,
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 10,
    color: '#FF416C',
    backgroundColor: '#FF416C1A',
    borderRadius: 10,
    overflow: 'hidden',
  },
  hint: { fontSize: 11, lineHeight: 16.5, color: '#4A4A4A' },
  all: { fontSize: 11, lineHeight: 16.5, color: '#FF416C' },
});
