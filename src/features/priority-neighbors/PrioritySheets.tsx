import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { Button } from '../../components/ui/Button';
import { FilterChip } from '../../components/ui/Chip';
import { IconTextInput } from '../../components/ui/IconTextInput';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { filterNeighbors, NEIGHBORS, type NeighborFilter } from './data';
import { NeighborCard } from './NeighborCard';
export function PrioritySheets({
  sheet,
  onClose,
  ids,
  saving,
  ready,
  toggle,
  filter,
  setFilter,
}: {
  sheet: 'directory' | 'filter' | null;
  onClose: () => void;
  ids: string[];
  saving: boolean;
  ready: boolean;
  toggle: (id: string) => Promise<void>;
  filter: NeighborFilter;
  setFilter: (filter: NeighborFilter) => void;
}) {
  const [query, setQuery] = useState('');
  const items = filterNeighbors(
    NEIGHBORS.filter((n) => !ids.includes(n.id)),
    query,
    'all',
  );
  return (
    <BottomSheet visible={sheet !== null} onClose={onClose} variant="actions">
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
        <Text accessibilityRole="header" className="font-sans-bold text-lg text-ink">
          {sheet === 'filter' ? 'Lọc người quen' : 'Thêm người quen ưu tiên'}
        </Text>
        {sheet === 'filter' ? (
          <View style={styles.filters}>
            {(
              [
                ['all', 'Tất cả'],
                ['shops', 'Chủ quán'],
                ['residents', 'Cư dân'],
              ] as const
            ).map(([key, label]) => (
              <FilterChip
                key={key}
                label={label}
                selected={filter === key}
                onPress={() => {
                  setFilter(key);
                  onClose();
                }}
              />
            ))}
          </View>
        ) : (
          <>
            <IconTextInput
              autoCorrect={false}
              autoCapitalize="none"
              icon="search"
              iconNode={<CustomIcon name="prioritySearch" size={16} />}
              accessibilityLabel="Tìm người để thêm ưu tiên"
              placeholder="Tìm tên, số phòng, quán..."
              value={query}
              onChangeText={setQuery}
            />
            {items.map((neighbor) => (
              <NeighborCard
                key={neighbor.id}
                neighbor={neighbor}
                priority={false}
                disabled={!ready || saving}
                onToggle={() => void toggle(neighbor.id)}
              />
            ))}
            {items.length === 0 ? (
              <Text className="font-sans text-sm text-muted">Không có người phù hợp để thêm.</Text>
            ) : null}
          </>
        )}
        <Button label="Đóng" variant="outline" onPress={onClose} />
      </ScrollView>
    </BottomSheet>
  );
}
const styles = StyleSheet.create({
  content: { gap: 16, paddingVertical: 16 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
