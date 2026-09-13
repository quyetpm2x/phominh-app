import { Text, View } from 'react-native';
import { Button } from '../../components/ui/Button';
import { POSTS } from './data';
import { usePostInteractions } from './postInteractions';

export function FeedPreferencesContent() {
  const interactions = usePostInteractions();
  return (
    <View className="gap-4">
      <Text className="font-sans-bold text-sm text-ink">Tác giả đã ẩn</Text>
      {interactions.blockedAuthors.length === 0 ? (
        <Text className="font-sans text-sm text-muted">Chưa ẩn tác giả nào.</Text>
      ) : (
        interactions.blockedAuthors.map((authorId) => (
          <View key={authorId} className="flex-row items-center gap-3">
            <Text className="flex-1 font-sans text-sm text-ink">
              {POSTS.find((post) => post.authorId === authorId)?.name ?? 'Tác giả'}
            </Text>
            <Button label="Bỏ ẩn" variant="outline" onPress={() => interactions.unblockAuthor(authorId)} />
          </View>
        ))
      )}
      <Text className="font-sans-bold text-sm text-ink">Chủ đề giảm đề xuất</Text>
      {interactions.reducedTopics.length === 0 ? (
        <Text className="font-sans text-sm text-muted">Chưa giảm đề xuất chủ đề nào.</Text>
      ) : (
        interactions.reducedTopics.map((topic) => (
          <View key={topic} className="flex-row items-center gap-3">
            <Text className="flex-1 font-sans text-sm text-ink">
              {topic === 'shops' ? 'Quán ăn' : 'Khu dân cư'}
            </Text>
            <Button label="Khôi phục" variant="outline" onPress={() => interactions.restoreTopic(topic)} />
          </View>
        ))
      )}
    </View>
  );
}
