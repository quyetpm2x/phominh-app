import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { CustomIcon, type CustomIconProps } from '../../components/ui/CustomIcon';
import { LegalCard } from '../legal/LegalCard';

type IncomeKey = 'posts' | 'rank' | 'affiliate';
const incomeRows: {
  key: IncomeKey;
  title: string;
  amount: string;
  description: string;
  icon: CustomIconProps['name'];
  tint: string;
  amountColor: string;
}[] = [
  {
    key: 'posts',
    title: 'Thưởng bài viết',
    amount: '25.000đ / bài',
    description: 'Nhận tiền khi bài review đạt tiêu chuẩn & có ảnh Menu rõ nét',
    icon: 'monetizationPosts',
    tint: '#FF416C1A',
    amountColor: '#FF416C',
  },
  {
    key: 'rank',
    title: 'Đua Top bảng xếp hạng',
    amount: 'Tối đa 2.000.000đ / tháng',
    description: 'Thưởng theo tuần và tháng cho Top 10 người đóng góp nhiều nhất',
    icon: 'monetizationRank',
    tint: '#FE9A001A',
    amountColor: '#FFB900',
  },
  {
    key: 'affiliate',
    title: 'Chương trình Affiliate',
    amount: '5000 vnđ / lượt',
    description: 'Nhận hoa hồng trọn đời khi giới thiệu bạn bè hoặc chủ quán tham gia',
    icon: 'monetizationAffiliate',
    tint: '#AD46FF1A',
    amountColor: '#C27AFF',
  },
];

export function MonetizationSettings() {
  const [enabled, setEnabled] = useState<Record<IncomeKey, boolean>>({
    posts: true,
    rank: true,
    affiliate: false,
  });
  return (
    <>
      <LinearGradient colors={['#FE9A0026', '#FF416C1A', '#FE9A0000']} style={styles.plan}>
        <LinearGradient colors={['#FE9A00', '#FF416C']} style={styles.planIcon}>
          <CustomIcon name="monetizationPlan" size={20} />
        </LinearGradient>
        <View style={styles.planCopy}>
          <View style={styles.planTitle}>
            <Text className="font-sans-bold" style={styles.planName}>
              Gói Creator Tích cực
            </Text>
            <Text className="font-sans-black" style={styles.active}>
              ĐANG BẬT
            </Text>
          </View>
          <Text className="font-sans" style={styles.planDescription}>
            Hưởng 100% quyền lợi doanh thu & thưởng
          </Text>
        </View>
        <CustomIcon name="monetizationVerified" size={20} />
      </LinearGradient>
      <View style={styles.section}>
        <Text className="font-sans-bold" style={styles.sectionTitle}>
          CÁC NGUỒN THU NHẬP
        </Text>
        <LegalCard style={styles.incomeCard}>
          {incomeRows.map((row, index) => (
            <View key={row.key} style={[styles.incomeRow, index < incomeRows.length - 1 && styles.divider]}>
              <View style={styles.rowHeader}>
                <View style={[styles.incomeIcon, { backgroundColor: row.tint }]}>
                  <CustomIcon name={row.icon} size={16} />
                </View>
                <View style={styles.rowCopy}>
                  <Text className="font-sans-bold" style={styles.rowTitle}>
                    {row.title}
                  </Text>
                  <Text className="font-sans-bold" style={[styles.amount, { color: row.amountColor }]}>
                    {row.amount}
                  </Text>
                </View>
                <Switch
                  value={enabled[row.key]}
                  onValueChange={(value) => setEnabled((current) => ({ ...current, [row.key]: value }))}
                  trackColor={{ false: '#F1F3F5', true: '#FF416C' }}
                  thumbColor="#FFF"
                  ios_backgroundColor="#F1F3F5"
                />
              </View>
              <Text className="font-sans" style={styles.description}>
                {row.description}
              </Text>
            </View>
          ))}
        </LegalCard>
      </View>
      <View style={styles.section}>
        <Text className="font-sans-bold" style={styles.sectionTitle}>
          PHƯƠNG THỨC NHẬN TIỀN
        </Text>
        <LegalCard style={styles.bank}>
          <View style={styles.bankLogo}>
            <Text className="font-sans-bold" style={styles.mb}>
              MB
            </Text>
          </View>
          <View style={styles.bankCopy}>
            <View style={styles.bankTitle}>
              <Text className="font-sans-bold" style={styles.rowTitle}>
                MB Bank
              </Text>
              <Text className="font-sans-bold" style={styles.verified}>
                Đã xác thực
              </Text>
            </View>
            <Text className="font-mono" style={styles.account}>
              0987••••892 (NGUYEN VAN QUYET)
            </Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Đổi ngân hàng">
            <Text className="font-sans-bold" style={styles.change}>
              Đổi
            </Text>
          </Pressable>
        </LegalCard>
      </View>
      <View style={styles.notice}>
        <View style={styles.noticeTitle}>
          <CustomIcon name="monetizationWarning" size={18} />
          <Text className="font-sans-bold" style={styles.noticeHeading}>
            ĐIỀU KHOẢN & LƯU Ý
          </Text>
        </View>
        <Text className="font-sans" style={styles.noticeText}>
          • Tiền thưởng bài viết sẽ được cộng ngay sau khi bài đăng được hệ thống duyệt tự động (tối đa 15
          phút).
        </Text>
        <Text className="font-sans" style={styles.noticeText}>
          • Nếu tắt chế độ kiếm tiền, số điểm tích luỹ trong kỳ đua Top hiện tại sẽ không được bảo lưu.
        </Text>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  plan: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 17,
    borderRadius: 19.556,
    borderWidth: 1,
    borderColor: '#FE9A0033',
  },
  planIcon: { width: 44, height: 44, borderRadius: 12.222, alignItems: 'center', justifyContent: 'center' },
  planCopy: { flex: 1, gap: 2 },
  planTitle: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  planName: { fontSize: 14, lineHeight: 20, color: '#1A1A1A' },
  active: {
    fontSize: 10,
    lineHeight: 15,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 20,
    overflow: 'hidden',
    color: '#00D492',
    backgroundColor: '#00BC7D26',
  },
  planDescription: { fontSize: 12, lineHeight: 16, color: '#4A4A4A' },
  section: { gap: 12 },
  sectionTitle: { paddingLeft: 2, fontSize: 12, lineHeight: 16, letterSpacing: 0.6, color: '#4A4A4A' },
  incomeCard: { padding: 0, gap: 0, overflow: 'hidden' },
  incomeRow: { padding: 16, gap: 8 },
  divider: { borderBottomWidth: 1, borderBottomColor: '#E9ECEF' },
  rowHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  incomeIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  rowCopy: { flex: 1, gap: 2 },
  rowTitle: { fontSize: 14, lineHeight: 20, color: '#1A1A1A' },
  amount: { fontSize: 10.5, lineHeight: 15.75 },
  description: { marginLeft: 45, fontSize: 12, lineHeight: 16.5, color: '#4A4A4A' },
  bank: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bankLogo: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#155DFC33',
    backgroundColor: '#155DFC1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mb: { color: '#155DFC', fontSize: 12 },
  bankCopy: { flex: 1, gap: 2 },
  bankTitle: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  verified: {
    color: '#00D492',
    backgroundColor: '#00BC7D1A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    fontSize: 10,
  },
  account: { color: '#4A4A4A', fontSize: 12, lineHeight: 16 },
  change: { color: '#FF416C', fontSize: 12 },
  notice: {
    padding: 17,
    gap: 8,
    borderRadius: 19.556,
    borderWidth: 1,
    borderColor: '#FE9A0033',
    backgroundColor: '#FE9A001A',
  },
  noticeTitle: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  noticeHeading: { color: '#FFB900', fontSize: 12, lineHeight: 16, letterSpacing: 0.6 },
  noticeText: { paddingLeft: 4, color: '#4A4A4A', fontSize: 12, lineHeight: 19.5 },
});
