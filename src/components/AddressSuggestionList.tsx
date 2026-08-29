import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

import { colors } from '../constants/design-tokens';
import type { AddressSuggestion } from '../hooks/useAddressSuggestions';

interface AddressSuggestionListProps {
  suggestions: AddressSuggestion[];
  loading: boolean;
  onSelect: (suggestion: AddressSuggestion) => void;
}

const ROW_HEIGHT = 48;
const MAX_VISIBLE_ROWS = 4;

// Dropdown gợi ý địa chỉ (dữ liệu thật từ geocode 2 chiều, xem useAddressSuggestions.ts) —
// ScrollView thường (không FlatList) để tránh lỗi "VirtualizedLists nested inside ScrollView" (đã
// gặp ở NumberDropdown.tsx), danh sách tối đa 5 gợi ý nên không cần ảo hoá.
export function AddressSuggestionList({ suggestions, loading, onSelect }: AddressSuggestionListProps) {
  if (!loading && suggestions.length === 0) return null;

  return (
    <View
      style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        marginTop: 4,
        maxHeight: ROW_HEIGHT * MAX_VISIBLE_ROWS,
        zIndex: 50,
        elevation: 12,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      }}
      className="rounded-2xl border border-border bg-white overflow-hidden"
    >
      {loading ? (
        <View className="h-12 items-center justify-center">
          <ActivityIndicator size="small" />
        </View>
      ) : (
        <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
          {suggestions.map((s) => (
            <Pressable
              key={`${s.lat},${s.lng}`}
              onPress={() => onSelect(s)}
              style={{ height: ROW_HEIGHT }}
              className="flex-row items-center gap-2.5 border-b border-border/60 px-3.5 last:border-b-0"
            >
              <Ionicons name="location-outline" size={15} color={colors.muted.DEFAULT} />
              <Text numberOfLines={1} className="flex-1 text-xs font-sans-medium text-ink">
                {s.description}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
