import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheet } from '../../../components/ui/BottomSheet';
import { CustomIcon } from '../../../components/ui/CustomIcon';

const faqItems = [
  {
    question: 'Tại sao tên chủ tài khoản ngân hàng không thể sửa đổi?',
    answer:
      'Để phòng chống gian lận và đảm bảo an toàn, hệ thống tự động khóa tên tài khoản nhận tiền trùng khớp với tên đã xác minh danh tính (NGUYEN VAN QUYET).',
  },
  {
    question: 'Tôi có thể liên kết tối đa bao nhiêu tài khoản ngân hàng?',
    answer:
      'Bạn có thể liên kết tối đa 3 tài khoản ngân hàng khác nhau. Bạn có thể chọn 1 tài khoản làm “Mặc định” để nhận tiền thưởng.',
  },
  {
    question: 'Thời gian tiền về tài khoản ngân hàng sau khi rút?',
    answer:
      'Hệ thống chuyển khoản liên ngân hàng nhanh qua Napas 247 nên tiền sẽ về tài khoản ngay trong (kể cả ban đêm, thứ 7 và Chủ nhật). Trong trường hợp hệ thống ngân hàng bảo trì, tối đa không quá 24 giờ.',
  },
  {
    question: 'Rút tiền từ ví thưởng có mất phí giao dịch không?',
    answer:
      'Hoàn toàn Miễn phí 100%. Ứng dụng hỗ trợ toàn bộ phí chuyển khoản liên ngân hàng cho người dùng.',
  },
  {
    question: 'Làm thế nào khi nhập sai số tài khoản hoặc ngân hàng bị lỗi?',
    answer:
      'Bạn hãy kiểm tra lại thông tin ngân hàng và số tài khoản trước khi xác nhận. Nếu vẫn gặp lỗi, vui lòng thử lại sau hoặc liên hệ hỗ trợ.',
  },
] as const;

export function BankFaqSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      variant="actions"
      showHandle={false}
      contentStyle={[styles.sheet, { height: Math.min(770.117, height - insets.top) }]}
    >
      <View style={styles.header}>
        <View style={styles.handle} />
        <View style={styles.headerRow}>
          <View style={styles.titleIcon}>
            <CustomIcon name="bankHelp" size={20} forceColor color="#FF416C" />
          </View>
          <View style={styles.titleCopy}>
            <Text accessibilityRole="header" className="font-sans-black" style={styles.title}>
              Hỏi đáp tài khoản ngân hàng
            </Text>
            <Text className="font-sans-medium" style={styles.subtitle}>
              Giải đáp thắc mắc liên kết & rút thưởng
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Đóng câu hỏi thường gặp"
            onPress={onClose}
            hitSlop={8}
            style={styles.close}
          >
            <CustomIcon name="prizeClose" size={16} />
          </Pressable>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {faqItems.map((item, index) => (
          <View key={item.question} style={styles.card}>
            <View style={styles.cardTitle}>
              <View style={styles.number}>
                <Text className="font-sans-bold" style={styles.numberText}>
                  {index + 1}
                </Text>
              </View>
              <Text className="font-sans-bold" style={styles.question}>
                {item.question}
              </Text>
            </View>
            <Text className="font-sans" style={styles.answer}>
              {item.answer}
            </Text>
          </View>
        ))}
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheet: {
    borderTopWidth: 1,
    borderColor: '#E9ECEF99',
    borderTopLeftRadius: 56.556,
    borderTopRightRadius: 56.556,
    backgroundColor: '#F8F9FA',
    overflow: 'hidden',
  },
  header: {
    height: 97.5,
    borderBottomWidth: 1,
    borderColor: '#E9ECEF99',
    paddingTop: 20,
    paddingHorizontal: 24,
  },
  handle: {
    width: 48,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4A4A4A4D',
    alignSelf: 'center',
    marginBottom: 18,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  titleIcon: {
    width: 40,
    height: 40,
    borderRadius: 11.111,
    backgroundColor: '#FF416C1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleCopy: { flex: 1, gap: 1 },
  title: { fontSize: 16, lineHeight: 24, color: '#1A1A1A' },
  subtitle: { fontSize: 11, lineHeight: 16.5, color: '#4A4A4A' },
  close: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F3F599',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 24, gap: 16 },
  card: {
    padding: 16,
    gap: 16,
    borderRadius: 19.556,
    borderWidth: 1,
    borderColor: '#E9ECEFCC',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  cardTitle: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  number: {
    width: 20,
    height: 20,
    borderRadius: 5.556,
    backgroundColor: '#FF416C1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: { fontSize: 11, lineHeight: 16, color: '#FF416C' },
  question: { flex: 1, fontSize: 12, lineHeight: 16, color: '#1A1A1A' },
  answer: { marginLeft: 32, fontSize: 11, lineHeight: 17.875, color: '#4A4A4A' },
});
