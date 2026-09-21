import { Image, ScrollView, StyleSheet, Text } from 'react-native';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { Button } from '../../components/ui/Button';
import { LegalCard } from '../legal/LegalCard';
import { topics, type PostDraft } from './draft';

export function CompletedPostPreview({
  draft,
  visible,
  onClose,
}: {
  draft: PostDraft;
  visible: boolean;
  onClose: () => void;
}) {
  const place = draft.photos.find((photo) => photo.place)?.place ?? draft.location;
  return (
    <BottomSheet visible={visible} onClose={onClose} variant="actions">
      <ScrollView contentContainerStyle={styles.content}>
        <Text accessibilityRole="header" className="font-sans-black text-lg text-ink">
          Bài của tôi · Xem thử
        </Text>
        <LegalCard>
          <Text className="font-sans-bold text-primary">
            {topics.find((topic) => topic.id === draft.topic)?.title} · {draft.category}
          </Text>
          <Text className="font-sans text-xs text-muted">
            {draft.anonymous ? 'Bí danh ẩn danh' : 'Tên thật'} ·{' '}
            {draft.autoHide ? 'Tự ẩn sau 48 giờ' : 'Không tự động ẩn'}
          </Text>
          {!!draft.text && <Text className="font-sans text-[15px] leading-6 text-ink">{draft.text}</Text>}
          {draft.photos.map((photo, index) => (
            <Image
              key={`${photo.uri}-${index}`}
              accessibilityLabel={`Ảnh bài viết ${index + 1}`}
              source={{ uri: photo.uri }}
              resizeMode="cover"
              style={styles.image}
            />
          ))}
          {place && (
            <Text className="font-sans text-xs text-muted">
              {draft.precise ? `${place.street}, ${place.area}` : place.area || 'Khu vực chụp ảnh'}
            </Text>
          )}
        </LegalCard>
        <Text className="font-sans text-xs text-muted">Bài viết chưa được phát hành lên cộng đồng.</Text>
        <Button label="Đóng" variant="outline" onPress={onClose} />
      </ScrollView>
    </BottomSheet>
  );
}
const styles = StyleSheet.create({
  content: { padding: 20, gap: 16 },
  image: { width: '100%', aspectRatio: 1, borderRadius: 14 },
});
