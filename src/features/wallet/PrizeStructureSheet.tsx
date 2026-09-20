import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { Button } from '../../components/ui/Button';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { PrizeStructureRows } from './PrizeStructureRows';

export function PrizeStructureSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(16, insets.bottom);
  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      variant="actions"
      showHandle={false}
      contentStyle={[styles.sheet, { height: Math.min(769.117 + bottomPadding - 16, height - insets.top) }]}
    >
      <View style={styles.header}>
        <View style={styles.handle} />
        <View style={styles.heading}>
          <View style={styles.headingIcon}>
            <CustomIcon name="prizeTrophy" size={15} />
          </View>
          <View style={styles.headingCopy}>
            <Text accessibilityRole="header" className="font-sans-black" style={styles.title}>
              Cơ cấu giải thưởng
            </Text>
            <Text className="font-sans" style={styles.subtitle}>
              Chu kỳ xếp hạng: Tháng 10/2024
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Đóng cơ cấu giải thưởng"
            hitSlop={8}
            style={styles.close}
            onPress={onClose}
          >
            <CustomIcon name="prizeClose" size={16} />
          </Pressable>
        </View>
      </View>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <LinearGradient colors={['#FF416C', '#FF4B2B']} style={styles.totalCard}>
          <View pointerEvents="none" style={styles.totalGift}>
            <CustomIcon name="prizeGift" size={80} />
          </View>
          <View style={styles.totalCopy}>
            <View style={styles.totalLabelPill}>
              <CustomIcon name="prizeFlame" size={10} />
              <Text className="font-sans-bold" style={styles.totalLabel}>
                TỔNG GIÁ TRỊ QUỸ THƯỞNG
              </Text>
            </View>
            <Text className="font-sans-black" style={styles.totalAmount}>
              {'15.000.000 VNĐ'}
            </Text>
            <Text className="font-sans" style={styles.totalHint}>
              Trao thưởng tự động vào ngày 01 mỗi tháng
            </Text>
          </View>
        </LinearGradient>
        <Text className="font-sans-bold" style={styles.sectionTitle}>
          CHI TIẾT PHÂN BỔ GIẢI THƯỞNG
        </Text>
        <PrizeStructureRows />
        <View style={styles.rules}>
          <View style={styles.rulesTitle}>
            <CustomIcon name="prizeRules" size={12} />
            <Text className="font-sans-bold" style={styles.rulesHeading}>
              Quy tắc xếp hạng
            </Text>
          </View>
          <Text className="font-sans" style={styles.rule}>
            Mỗi bài viết hợp lệ có ảnh/menu được cộng{' '}
            <Text className="font-sans-bold" style={styles.ruleStrong}>
              100 điểm
            </Text>
            .
          </Text>
          <Text className="font-sans" style={styles.rule}>
            Tương tác thực tế (tim, bình luận) cộng{' '}
            <Text className="font-sans-bold" style={styles.ruleStrong}>
              5 - 10 điểm
            </Text>
            .
          </Text>
          <Text className="font-sans" style={styles.rule}>
            Tiền thưởng sẽ tự động cộng vào Ví thưởng vào 00:00 ngày đầu tháng kế tiếp.
          </Text>
        </View>
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: bottomPadding }]}>
        <LinearGradient colors={['#FF416C', '#FF4B2B']} style={styles.footerButton}>
          <Button
            accessibilityRole="button"
            label="Đã hiểu"
            style={styles.understoodButton}
            labelStyle={styles.understoodLabel}
            onPress={onClose}
          />
        </LinearGradient>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheet: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
    borderTopLeftRadius: 30.667,
    borderTopRightRadius: 30.667,
    overflow: 'hidden',
  },
  header: {
    paddingTop: 12,
    paddingBottom: 9,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF80',
    gap: 12,
  },
  handle: { alignSelf: 'center', width: 40, height: 6, borderRadius: 999, backgroundColor: '#F1F3F5' },
  heading: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headingIcon: {
    width: 32,
    height: 32,
    borderRadius: 8.889,
    backgroundColor: '#FF416C1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingCopy: { flex: 1 },
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
  scroll: { flex: 1 },
  content: { padding: 20 },
  totalCard: { height: 110.5, borderRadius: 19.556, padding: 16, overflow: 'hidden', marginBottom: 16 },
  totalCopy: { height: 78.5, width: 234 },
  totalLabelPill: {
    position: 'absolute',
    top: 3.5,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: '#FFFFFF33',
  },
  totalLabel: { fontSize: 10, lineHeight: 15, letterSpacing: 0.5, color: '#FFF' },
  totalAmount: { position: 'absolute', top: 30, left: -2.5, fontSize: 24, lineHeight: 32, color: '#FFF' },
  totalHint: { position: 'absolute', top: 62, left: -1, fontSize: 11, lineHeight: 16.5, color: '#FFFFFFCC' },
  totalGift: { position: 'absolute', right: -8, bottom: -8 },
  sectionTitle: { marginBottom: 10, fontSize: 12, lineHeight: 16, letterSpacing: 0.6, color: '#4A4A4A' },
  rules: {
    marginTop: 20,
    padding: 15,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 19.556,
    backgroundColor: '#F1F3F566',
  },
  rulesTitle: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  rulesHeading: { fontSize: 12, lineHeight: 16, color: '#1A1A1A' },
  rule: { fontSize: 11, lineHeight: 16.5, color: '#4A4A4A' },
  ruleStrong: { color: '#1A1A1A' },
  footer: {
    paddingTop: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    backgroundColor: '#FFF',
  },
  footerButton: {
    borderRadius: 12.222,
    shadowColor: '#FF416C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  understoodButton: { height: 44, backgroundColor: 'transparent', paddingHorizontal: 0 },
  understoodLabel: { fontSize: 14, lineHeight: 20, fontFamily: 'BeVietnamPro_700Bold', color: '#FFF' },
});
