import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { IconTextInput } from '../../components/ui/IconTextInput';
import { ActionSheetMenu } from '../../components/ui/ActionSheetMenu';
import { type MyPost, type PostFilter } from './data';
import { MyPostFilters } from './MyPostFilters';

export function MyPostsToolbar({
  posts,
  filter,
  onFilter,
  query,
  onQuery,
  oldestFirst,
  onSort,
}: {
  posts: MyPost[];
  filter: PostFilter;
  onFilter: (value: PostFilter) => void;
  query: string;
  onQuery: (value: string) => void;
  oldestFirst: boolean;
  onSort: (value: boolean) => void;
}) {
  const [searching, setSearching] = useState(false);
  const [sorting, setSorting] = useState(false);
  return (
    <View className="gap-3 bg-white py-2">
      <View className="flex-row items-center justify-between px-4">
        <Text className="rounded-full bg-primary/10 px-2 py-0.5 font-sans-bold text-[11px] text-primary">
          {posts.length} bài viết
        </Text>
        <View className="flex-row gap-2">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Tìm bài viết"
            accessibilityState={{ expanded: searching }}
            onPress={() => {
              setSearching(!searching);
              if (searching) onQuery('');
            }}
            className="h-9 w-9 items-center justify-center rounded-full bg-[#F8F9FA]"
          >
            <Ionicons name={searching ? 'close' : 'search-outline'} size={19} color="#1A1A1A" />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Sắp xếp bài viết"
            onPress={() => setSorting(true)}
            className="h-9 w-9 items-center justify-center rounded-full bg-[#F8F9FA]"
          >
            <Ionicons name="options-outline" size={18} color="#1A1A1A" />
          </Pressable>
        </View>
      </View>
      {searching ? (
        <View className="px-4">
          <IconTextInput
            icon="search-outline"
            accessibilityLabel="Tìm nội dung bài viết"
            placeholder="Tìm bài viết của tôi"
            value={query}
            onChangeText={onQuery}
            autoFocus
          />
        </View>
      ) : null}
      <MyPostFilters posts={posts} value={filter} onChange={onFilter} />
      <ActionSheetMenu
        visible={sorting}
        onClose={() => setSorting(false)}
        title="Sắp xếp bài viết"
        items={[false, true].map((oldest) => ({
          label: oldest ? 'Cũ nhất trước' : 'Mới nhất trước',
          description: oldestFirst === oldest ? 'Đang chọn' : undefined,
          onPress: () => onSort(oldest),
        }))}
      />
    </View>
  );
}
