import { StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { Toggle } from '../../components/ui/Toggle';
import { LegalCard } from '../legal/LegalCard';
import type { PostDraft } from './draft';

export function NewPostSettings({
  draft,
  update,
}: {
  draft: PostDraft;
  update: (patch: Partial<PostDraft>) => void;
}) {
  const place = draft.photos.find((photo) => photo.place)?.place ?? draft.location;
  return (
    <LegalCard style={styles.card}>
      <View style={styles.row}>
        <View style={styles.pin}>
          <CustomIcon name="newPostLocation" size={16} />
        </View>
        <View style={styles.copy}>
          <View style={styles.titleRow}>
            <Text className="font-sans-bold" style={styles.title}>
              {place
                ? draft.precise
                  ? `${place.street}, ${place.area}`
                  : place.area || 'Khu vực chụp ảnh'
                : 'Chưa có vị trí chụp ảnh'}
            </Text>
            {place && (
              <Text className="font-sans-bold" style={styles.local}>
                Tại chỗ
              </Text>
            )}
          </View>
          <Text className="font-sans" style={styles.description}>
            Phạm vi phát sóng quanh vị trí này
          </Text>
        </View>
      </View>
      <View style={[styles.row, styles.divider]}>
        <View style={styles.copy}>
          <View style={styles.titleRow}>
            <Text className="font-sans-bold" style={styles.title}>
              Hiển thị vị trí chính xác
            </Text>
            <Text className="font-sans-bold" style={styles.status}>
              {draft.precise ? 'Bật' : 'Tắt'}
            </Text>
          </View>
          <Text className="font-sans" style={styles.description}>
            Nếu tắt, bài đăng chỉ hiển thị khu vực tương đối
          </Text>
        </View>
        <Toggle
          label="Hiển thị vị trí chính xác"
          value={draft.precise}
          onValueChange={(precise) => update({ precise })}
        />
      </View>
      <View style={[styles.row, styles.divider]}>
        <View style={styles.timer}>
          <CustomIcon name="newPostTimer" size={16} />
        </View>
        <View style={styles.copy}>
          <View style={styles.titleRow}>
            <Text className="font-sans-bold" style={styles.title}>
              Tự ẩn bài sau 48 giờ
            </Text>
            <Text className="font-sans-bold" style={styles.recommended}>
              Khuyên dùng
            </Text>
          </View>
          <Text className="font-sans" style={styles.description}>
            Tắt để giữ hiển thị bài viết vô thời hạn
          </Text>
        </View>
        <Toggle
          label="Tự ẩn bài sau 48 giờ"
          value={draft.autoHide}
          onValueChange={(autoHide) => update({ autoHide })}
        />
      </View>
    </LegalCard>
  );
}
const styles = StyleSheet.create({
  card: { gap: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  copy: { flex: 1, gap: 2 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  title: { fontSize: 12, lineHeight: 18.75, color: '#1A1A1A', flexShrink: 1 },
  description: { fontSize: 10.5, lineHeight: 15.75, color: '#4A4A4A' },
  pin: {
    width: 34,
    height: 34,
    borderRadius: 9.444,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF416C1A',
  },
  timer: {
    width: 30,
    height: 30,
    borderRadius: 8.333,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FE9A001A',
  },
  divider: { borderTopWidth: 1, borderColor: '#E9ECEF99', paddingTop: 12 },
  local: {
    fontSize: 9.5,
    lineHeight: 14.25,
    color: '#009966',
    backgroundColor: '#00BC7D1A',
    paddingHorizontal: 4,
  },
  status: {
    fontSize: 9.5,
    lineHeight: 14.25,
    color: '#FF416C',
    backgroundColor: '#FF416C1A',
    paddingHorizontal: 4,
  },
  recommended: {
    fontSize: 9,
    lineHeight: 13.5,
    color: '#E17100',
    backgroundColor: '#FE9A001A',
    paddingHorizontal: 4,
  },
});
