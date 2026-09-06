import { Image, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Button } from '../../components/ui/Button';
import { TextInput } from '../../components/ui/TextInput';
import { HighlightedText } from '../../components/ui/HighlightedText';
import type { HomeFeedController } from './useHomeFeed';
type Props = Pick<
  HomeFeedController,
  'sheet' | 'selectedPost' | 'comments' | 'profile' | 'comment' | 'setComment' | 'setComments'
>;
export function PostSheetContent({
  sheet,
  selectedPost,
  comments,
  profile,
  comment,
  setComment,
  setComments,
}: Props) {
  const { width } = useWindowDimensions();
  return (
    <>
      {sheet === 'gallery' ? (
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator>
          {selectedPost.photos.map((photo, index) => (
            <View key={index}>
              <Image
                source={photo}
                style={[styles.galleryImage, { width: width - 40 }]}
                resizeMode="contain"
              />
              <Text className="mt-2 text-center font-sans text-muted">
                {index + 1} / {selectedPost.photos.length}
              </Text>
            </View>
          ))}
        </ScrollView>
      ) : null}
      {sheet === 'comments' ? (
        <>
          <Text className="font-sans text-sm text-muted">Bình luận mẫu trên thiết bị của bạn.</Text>
          {(comments[selectedPost.id] ?? []).map((message, index) => (
            <View key={index} className="rounded-xl bg-white p-3">
              <Text className="font-sans-semibold text-ink">{profile.fullName || 'Bạn'}</Text>
              <Text className="mt-1 font-sans text-ink">{message}</Text>
            </View>
          ))}
          <TextInput
            accessibilityLabel="Nội dung bình luận"
            placeholder="Viết bình luận…"
            value={comment}
            onChangeText={setComment}
            maxLength={300}
          />
          <Button
            label="Thêm bình luận"
            disabled={!comment.trim()}
            onPress={() => {
              setComments((previous) => ({
                ...previous,
                [selectedPost.id]: [...(previous[selectedPost.id] ?? []), comment.trim()],
              }));
              setComment('');
            }}
          />
        </>
      ) : null}
      {sheet === 'contact' ? (
        <>
          <Text className="font-sans-bold text-base text-ink">{selectedPost.name}</Text>
          <Text className="font-sans text-muted">Thông tin liên hệ của quán chưa được cập nhật.</Text>
        </>
      ) : null}
      {sheet === 'details' ? (
        <>
          <Text className="font-sans-bold text-base text-ink">{selectedPost.name}</Text>
          <HighlightedText text={selectedPost.text} highlightColor={selectedPost.color} />
          <Image source={selectedPost.photos[0]} style={styles.detailImage} resizeMode="cover" />
        </>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  galleryImage: { height: 340 },

  detailImage: { width: '100%', height: 220, borderRadius: 14 },
});
