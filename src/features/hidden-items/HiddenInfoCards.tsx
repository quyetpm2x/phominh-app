import { StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
export function HiddenIntro() {
  return (
    <View style={styles.intro}>
      <View style={styles.icon}>
        <CustomIcon name="hiddenEye" size={18.7} />
      </View>
      <View style={styles.copy}>
        <Text className="font-sans-bold" style={styles.title}>
          Kiểm soát nguồn tin trên Bảng tin
        </Text>
        <Text className="font-sans" style={styles.text}>
          Các bài viết, tác giả hoặc chủ đề này sẽ không còn xuất hiện trên dòng thời gian của bạn. Bạn có thể
          bỏ ẩn bất kỳ lúc nào.
        </Text>
      </View>
    </View>
  );
}
export function HiddenTip() {
  return (
    <View style={styles.tip}>
      <View style={styles.heading}>
        <CustomIcon name="hiddenInfo" size={16} />
        <Text className="font-sans-bold" style={styles.title}>
          Bạn có biết?
        </Text>
      </View>
      <Text className="font-sans" style={styles.text}>
        Khi chọn <Text className="font-sans-bold">&quot;Không quan tâm&quot;</Text> trên bất kỳ bài viết nào
        ngoài bảng tin, hệ thống AI sẽ tự động học sở thích của bạn để hạn chế đề xuất các nội dung tương tự.
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  intro: {
    padding: 14,
    minHeight: 107.56,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 19.56,
    backgroundColor: '#FFFFFF80',
    flexDirection: 'row',
    gap: 12,
  },
  icon: {
    width: 36,
    height: 36,
    marginTop: 2,
    backgroundColor: '#FF416C1A',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  copy: { flex: 1, gap: 2 },
  title: { fontSize: 13, lineHeight: 19.5, color: '#1A1A1A' },
  text: { fontSize: 11.5, lineHeight: 18.688, color: '#4A4A4A' },
  tip: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 19.56,
    backgroundColor: '#FFF',
    gap: 8,
  },
  heading: { flexDirection: 'row', gap: 8, alignItems: 'center' },
});
