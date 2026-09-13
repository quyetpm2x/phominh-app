import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Pressable, Text, View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { CustomIcon } from '../../components/ui/CustomIcon';
// Preview values from Figma, pending the community reputation API.
export function ProfileReputationCard({ onDetails }: { onDetails: () => void }) {
  return (
    <View style={styles.shadow}>
      <LinearGradient colors={['#1E1035', '#2D1B4E', '#120924']} locations={[0, 0.5, 1]} style={styles.card}>
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Svg width="100%" height="100%">
            <Defs>
              <RadialGradient id="pinkGlow" cx="93%" cy="10%" rx="37%" ry="65%">
                <Stop offset="0" stopColor="#FF416C" stopOpacity={0.25} />
                <Stop offset="1" stopColor="#FF416C" stopOpacity={0} />
              </RadialGradient>
              <RadialGradient id="orangeGlow" cx="85%" cy="70%" rx="28%" ry="45%">
                <Stop offset="0" stopColor="#FF4B2B" stopOpacity={0.3} />
                <Stop offset="1" stopColor="#FF4B2B" stopOpacity={0} />
              </RadialGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#pinkGlow)" />
            <Rect width="100%" height="100%" fill="url(#orangeGlow)" />
          </Svg>
        </View>
        <View style={styles.top}>
          <View style={styles.scoreColumn}>
            <View style={styles.headingRow}>
              <CustomIcon name="meAward" size={14} color="#FF4B2B" />
              <Text numberOfLines={1} adjustsFontSizeToFit className="font-sans-black" style={styles.heading}>
                ĐIỂM UY TÍN CỘNG ĐỒNG
              </Text>
            </View>
            <View style={styles.scoreRow}>
              <Text className="font-sans-black" style={styles.score}>
                842
              </Text>
              <View style={styles.rank}>
                <Text className="font-sans-bold" style={styles.rankText}>
                  Bậc 4/10
                </Text>
              </View>
            </View>
          </View>
          <Pressable accessibilityRole="button" onPress={onDetails} style={styles.details}>
            <Text className="font-sans-bold" style={styles.detailsText}>
              Xem chi tiết
            </Text>
            <CustomIcon name="meChevron" size={12} color="#FF4B2B" />
          </Pressable>
        </View>
        <View style={styles.progressGroup}>
          <View
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 0, max: 1000, now: 842 }}
            style={styles.track}
          >
            <LinearGradient colors={['#FF416C', '#FF4B2B']} style={styles.progress} />
          </View>
          <View style={styles.between}>
            <View style={styles.trust}>
              <CustomIcon name="meShield" size={12} color="#00D492" />
              <Text className="font-sans-bold" style={styles.trustText}>
                Rất tin cậy
              </Text>
            </View>
            <Text className="font-sans-bold" style={styles.nextRank}>
              Còn 158đ lên Bậc 5
            </Text>
          </View>
        </View>
        <View style={styles.footer}>
          <View style={styles.headingRow}>
            <CustomIcon name="meGrowth" size={11.5} color="#FF4B2B" />
            <Text className="font-sans" style={styles.growth}>
              +12 điểm tháng này
            </Text>
          </View>
          <Pressable accessibilityRole="button" onPress={onDetails} style={styles.trust}>
            <Text className="font-sans-bold" style={styles.history}>
              Lịch sử & Quyền lợi
            </Text>
            <CustomIcon name="meArrow" size={10} />
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
}
const styles = StyleSheet.create({
  shadow: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 12 },
    elevation: 5,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FF4B2B4D',
    padding: 20,
    gap: 12,
    overflow: 'hidden',
  },
  top: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 },
  scoreColumn: { flex: 1, gap: 4 },
  headingRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  heading: { flexShrink: 1, fontSize: 10.5, lineHeight: 15.75, letterSpacing: 1.575, color: '#FF4B2B' },
  scoreRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, minHeight: 37 },
  score: { color: 'white', fontSize: 34, lineHeight: 37, letterSpacing: -0.85 },
  rank: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FF4B2B4D',
    backgroundColor: '#FF4B2B33',
  },
  rankText: { color: '#FF4B2B', fontSize: 12, lineHeight: 18 },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#FFFFFF26',
    backgroundColor: '#FFFFFF1A',
    borderRadius: 9,
  },
  detailsText: { fontSize: 11.5, lineHeight: 17.25, color: 'white' },
  progressGroup: { gap: 6 },
  track: {
    height: 10,
    padding: 2,
    borderWidth: 1,
    borderColor: '#FFFFFF1A',
    borderRadius: 99,
    backgroundColor: '#FFFFFF1A',
  },
  progress: { width: '84.2%', height: 4, borderRadius: 99 },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  trust: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  trustText: { color: '#FFFFFFCC', fontSize: 11, lineHeight: 16.5 },
  nextRank: { color: '#FF4B2BE6', fontSize: 11, lineHeight: 16.5 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#FFFFFF1A',
  },
  growth: { color: '#FFFFFFCC', fontSize: 11.5, lineHeight: 17.25 },
  history: { color: '#FF4B2B', fontSize: 11, lineHeight: 16.5 },
});
