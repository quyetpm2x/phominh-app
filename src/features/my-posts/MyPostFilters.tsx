import { ScrollView, View } from 'react-native';
import { FilterChip } from '../../components/ui/Chip';
import { POST_FILTERS, postStatus, type MyPost, type PostFilter } from './data';

export function MyPostFilters({
  posts,
  value,
  onChange,
  personal = false,
}: {
  posts: MyPost[];
  value: PostFilter;
  onChange: (value: PostFilter) => void;
  personal?: boolean;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className={`flex-row gap-2 ${personal ? '' : 'px-4'}`}>
        {POST_FILTERS.filter(({ key }) => !personal || key !== 'expiring').map(({ key, label }) => (
          <FilterChip
            key={key}
            label={`${label} (${posts.filter((post) => matchesPostFilter(post, key, personal)).length})`}
            selected={value === key}
            tone="dark"
            accessibilityRole="tab"
            accessibilityState={{ selected: value === key }}
            onPress={() => onChange(key)}
          />
        ))}
      </View>
    </ScrollView>
  );
}
export function matchesPostFilter(post: MyPost, filter: PostFilter, personal = false) {
  return (
    filter === 'all' ||
    (personal && filter === 'active'
      ? (post.remainingHours ?? 0) > 0
      : postStatus(post.remainingHours ?? 0) === filter)
  );
}
