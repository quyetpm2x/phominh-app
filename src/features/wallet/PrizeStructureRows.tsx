import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';

const prizes = [
  {
    title: 'Hạng 1 (Quán Quân)',
    detail: 'Huy hiệu Vàng + Vé vinh danh\nứng dụng',
    amount: '1.500.000đ',
    share: '30% quỹ thưởng',
    tone: 'gold',
    badge: 'Top 1',
  },
  {
    title: 'Hạng 2 (Á Quân)',
    detail: 'Huy hiệu Bạc + Khung avatar Á\nQuân',
    amount: '1.000.000đ',
    share: '20% quỹ thưởng',
    tone: 'silver',
    badge: 'TOP 2',
  },
  {
    title: 'Hạng 3 (Quý Quân)',
    detail: 'Huy hiệu Đồng',
    amount: '750.000đ',
    share: '15% quỹ thưởng',
    tone: 'bronze',
    badge: 'Top 3',
  },
  {
    title: 'Top 4 – 6',
    detail: 'Thưởng tích cực đăng tải',
    amount: '400.000đ',
    share: 'Theo từng thứ hạng',
    tone: 'standard',
    badge: '4-6',
  },
  {
    title: 'Top 7 – 10',
    detail: 'Khuyến khích đóng góp bài\nviết',
    amount: '100.000đ',
    share: 'Theo từng thứ hạng',
    tone: 'standard',
    badge: '7-10',
  },
] as const;

const treatments = {
  gold: {
    colors: ['#FE9A0000', '#FE9A000D', '#FE9A001A'],
    border: '#FE9A004D',
    amount: '#FFB900',
    icon: 'prizeCrown',
    size: 24,
    badge: '#FE9A00',
  },
  silver: {
    colors: ['#31415800', '#1D293D33', '#31415866'],
    border: '#45556C99',
    amount: '#F1F5F9',
    icon: 'prizeSilverMedal',
    size: 14,
    badge: '#62748E',
  },
  bronze: {
    colors: ['#D9770600', '#D977060D', '#D977061A'],
    border: '#D977064D',
    amount: '#D97706',
    icon: 'prizeBronzeMedal',
    size: 16,
    badge: '#D97706',
  },
  standard: {
    colors: ['#FFFFFF', '#FFFFFF', '#FFFFFF'],
    border: '#E9ECEF',
    amount: '#00D492',
    icon: 'prizeCrown',
    size: 24,
    badge: '#F1F3F5',
  },
} as const;

export function PrizeStructureRows() {
  return (
    <View style={styles.rows}>
      {prizes.map((prize) => {
        const treatment = treatments[prize.tone];
        const standard = prize.tone === 'standard';
        const silver = prize.tone === 'silver';
        return (
          <LinearGradient
            key={prize.title}
            colors={treatment.colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.row, { borderColor: treatment.border }]}
          >
            <LinearGradient
              colors={silver ? ['#90A1B9', '#62748E', '#45556C'] : [treatment.badge, treatment.badge]}
              style={[
                styles.iconBadge,
                !standard && {
                  shadowColor: treatment.badge,
                  shadowOpacity: 0.3,
                  shadowOffset: { width: 0, height: 4 },
                  shadowRadius: 3,
                },
              ]}
            >
              {standard ? (
                <Text className="font-sans-black" style={styles.range}>
                  {prize.badge}
                </Text>
              ) : (
                <CustomIcon name={treatment.icon} size={treatment.size} />
              )}
            </LinearGradient>
            <View style={styles.copy}>
              <View style={styles.titleLine}>
                <Text className={standard ? 'font-sans-bold' : 'font-sans-black'} style={styles.title}>
                  {prize.title}
                </Text>
                {!standard ? (
                  <Text
                    className={silver ? 'font-sans-black' : 'font-sans-bold'}
                    style={[
                      styles.pill,
                      prize.tone === 'gold'
                        ? styles.goldPill
                        : silver
                          ? styles.silverPill
                          : styles.bronzePill,
                    ]}
                  >
                    {prize.badge}
                  </Text>
                ) : null}
              </View>
              <Text className="font-sans-medium" style={styles.detail}>
                {prize.detail}
              </Text>
            </View>
            <View style={styles.money}>
              <Text className="font-sans-black" style={[styles.amount, { color: treatment.amount }]}>
                {prize.amount}
              </Text>
              <Text
                className={silver ? 'font-sans-bold' : 'font-sans'}
                style={[styles.share, silver && styles.silverShare]}
              >
                {prize.share}
              </Text>
            </View>
          </LinearGradient>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  rows: { gap: 10 },
  row: {
    padding: 15,
    borderRadius: 19.556,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 74,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 12.222,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  range: { fontSize: 14, lineHeight: 20, color: '#1A1A1A' },
  copy: { flex: 1 },
  titleLine: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { fontSize: 13, lineHeight: 19.5, color: '#1A1A1A' },
  pill: { paddingHorizontal: 4, fontSize: 9, lineHeight: 13.5, borderRadius: 2.222 },
  goldPill: { backgroundColor: '#FE9A0033', color: '#FFD230' },
  silverPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: '#314158',
    color: '#E2E8F0',
    letterSpacing: 0.45,
  },
  bronzePill: { backgroundColor: '#D9770633', color: '#D97706' },
  detail: { fontSize: 11, lineHeight: 16.5, color: '#4A4A4A' },
  money: { alignItems: 'flex-end', width: 106 },
  amount: { fontSize: 14, lineHeight: 20 },
  share: { fontSize: 10, lineHeight: 15, color: '#4A4A4A' },
  silverShare: { color: '#90A1B9' },
});
