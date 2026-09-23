import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { LegalCard } from '../legal/LegalCard';
import type { Resident } from './resident';

export function ResidentSummary({
  resident,
  known,
  busy,
  onToggle,
  onMessage,
}: {
  resident: Resident;
  known: boolean;
  busy: boolean;
  onToggle: () => void;
  onMessage: () => void;
}) {
  return (
    <LegalCard style={styles.card}>
      <LinearGradient pointerEvents="none" colors={['#FF416C26', '#FF4B2B0D']} style={styles.glow} />
      <BlurView pointerEvents="none" intensity={16} tint="light" style={StyleSheet.absoluteFill} />
      <View style={styles.heading}>
        <View>
          <LinearGradient colors={['#FF416C', '#FF4B2B']} style={styles.avatar}>
            <Avatar initial={resident.name[0]} imageSource={resident.avatar} size={74} radius={18.056} />
          </LinearGradient>
          <LinearGradient colors={['#FF416C', '#FF4B2B']} style={styles.badge}>
            <CustomIcon name="residentVerified" size={10} />
          </LinearGradient>
        </View>
        <View style={styles.copy}>
          <View style={styles.nameRow}>
            <Text className="font-sans-black" style={styles.name}>
              {resident.name}
            </Text>
            <Text className="font-sans-black" style={styles.role}>
              {resident.merchant ? 'CHỦ QUÁN' : 'CƯ DÂN'}
            </Text>
          </View>
          <View style={styles.tags}>
            <View style={styles.rank}>
              <CustomIcon name="residentRank" size={11} />
              <Text className="font-sans-black" style={styles.rankText}>
                {resident.rank}
              </Text>
            </View>
            <View style={styles.distance}>
              <CustomIcon name="residentPin" size={10} />
              <Text className="font-sans-semibold" style={styles.distanceText}>
                {resident.distance}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <Text className="font-sans-medium" style={styles.bio}>
        {resident.bio}
      </Text>
      <View style={styles.stats}>
        {[
          { value: resident.trust, label: 'ĐIỂM TIN CẬY', color: '#1A1A1A' },
          { value: resident.totalPosts, label: 'TIN ĐÃ ĐĂNG', color: '#FF416C' },
          { value: resident.acquaintances, label: 'HÀNG XÓM QUEN', color: '#FF4B2B' },
        ].map((stat) => (
          <View key={stat.label} style={styles.stat}>
            <Text className="font-sans-black" style={[styles.value, { color: stat.color }]}>
              {stat.value}
            </Text>
            <Text className="font-sans-semibold" style={styles.label}>
              {stat.label}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.actions}>
        <Button
          label={known ? 'Đã thêm quen' : 'Thêm người quen'}
          onPress={onToggle}
          disabled={busy}
          className="flex-row gap-1.5"
          style={styles.action}
          labelStyle={styles.actionText}
          leadingIcon={
            <>
              <LinearGradient pointerEvents="none" colors={['#FF416C', '#FF4B2B']} style={styles.fill} />
              <CustomIcon name="residentAdd" size={16} />
            </>
          }
        />
        <Button
          label="Nhắn tin"
          variant="outline"
          onPress={onMessage}
          className="flex-row gap-1.5"
          style={styles.action}
          labelStyle={styles.actionText}
          leadingIcon={<CustomIcon name="residentMessage" size={16} />}
        />
      </View>
    </LegalCard>
  );
}
const styles = StyleSheet.create({
  card: { borderRadius: 30.667, padding: 20, gap: 14, overflow: 'hidden' },
  glow: { position: 'absolute', top: -48, right: -48, width: 144, height: 144, borderRadius: 72, overflow: 'hidden' },
  heading: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  avatar: { padding: 3, borderRadius: 19.556 },
  badge: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: 20,
    height: 20,
    borderRadius: 5.556,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1, gap: 6 },
  nameRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center' },
  name: { fontSize: 18, lineHeight: 27, color: '#1A1A1A' },
  role: {
    fontSize: 9,
    lineHeight: 13.5,
    color: '#FF4B2B',
    backgroundColor: '#FF4B2B1A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2.222,
    overflow: 'hidden',
  },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  rank: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#FF416C33',
    backgroundColor: '#FF416C1A',
  },
  rankText: { fontSize: 10, lineHeight: 15, color: '#FF416C' },
  distance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#00BC7D33',
    backgroundColor: '#00BC7D1A',
  },
  distanceText: { fontSize: 10, lineHeight: 15, color: '#009966' },
  bio: { fontSize: 13, lineHeight: 17.875, color: '#4A4A4A' },
  stats: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 16,
    marginTop: 6,
    borderTopWidth: 1,
    borderColor: '#E9ECEFB3',
  },
  stat: {
    flex: 1,
    height: 84,
    backgroundColor: '#F1F3F566',
    borderWidth: 1,
    borderColor: '#E9ECEF66',
    borderRadius: 19.556,
    paddingTop: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    gap: 2,
  },
  value: { fontSize: 17, lineHeight: 25.5 },
  label: { fontSize: 10, lineHeight: 15, letterSpacing: 0.5, textAlign: 'center', color: '#4A4A4A' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 2 },
  action: {
    flex: 1,
    minHeight: 41.5,
    height: 'auto',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 11.528,
  },
  actionText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: 13, lineHeight: 19.5 },
  fill: { ...StyleSheet.absoluteFill, borderRadius: 11.528 },
});
