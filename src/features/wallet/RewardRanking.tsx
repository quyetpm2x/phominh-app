import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Avatar } from '../../components/ui/Avatar';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { GradientText } from '../../components/ui/GradientText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PrizeStructureSheet } from './PrizeStructureSheet';
import { communityMembers, type CommunityMember } from './reward-ranking-data';
import { HeroCard } from './RewardRankingHero';
import { styles } from './reward-ranking-styles';

export function RewardRanking() {
  const insets = useSafeAreaInsets();
  const headerTop = Math.max(48, insets.top);
  const [selectedPeriod, setSelectedPeriod] = useState<'current' | 'previous'>('current');
  const [prizeSheetOpen, setPrizeSheetOpen] = useState(false);

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingTop: headerTop + 76.5 }]}>
        <PeriodPicker selected={selectedPeriod} onSelect={setSelectedPeriod} />
        <HeroCard />
        <View style={styles.sectionHeader}>
          <Text className="font-sans-bold" style={styles.sectionTitle}>THỨ HẠNG CỘNG ĐỒNG</Text>
          <Text className="font-sans" style={styles.updated}>Cập nhật 5 phút/lần</Text>
        </View>
        <View style={styles.rows}>
          {communityMembers.map((member) => <CommunityRow key={member.rank} member={member} />)}
        </View>
      </ScrollView>

      <View style={[styles.headerOverlay, { paddingTop: headerTop }]}>
        <View style={styles.headerLeft}>
          <Pressable accessibilityRole="button" accessibilityLabel="Quay lại" style={styles.backButton} onPress={() => (router.canGoBack() ? router.back() : router.replace('/home'))}>
            <CustomIcon name="rankingBack" size={18} />
          </Pressable>
          <View>
            <Text className="font-sans-black" style={styles.headerTitle}>Bảng xếp hạng</Text>
            <Text className="font-sans-medium" style={styles.headerSubtitle}>Đua Top nhận thưởng tiền mặt</Text>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Xem cơ cấu giải"
          style={styles.prizeButton}
          onPress={() => setPrizeSheetOpen(true)}
        >
          <LinearGradient pointerEvents="none" colors={['#FF416C26', '#FF4B2B26']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
          <CustomIcon name="rankingPrize" size={14} />
          <Text className="font-sans-black" style={styles.prizeButtonText}>Cơ cấu giải</Text>
        </Pressable>
      </View>

      <View style={styles.stickyRank}>
        <View style={styles.stickyLeft}>
          <LinearGradient colors={['#FF416C', '#FF4B2B']} style={styles.rankBadge}>
            <Text className="font-sans-black" style={styles.rankBadgeText}>#7</Text>
          </LinearGradient>
          <Image source={require('../../../assets/images/reward-ranking/member-3.png')} style={styles.stickyAvatar} />
          <View style={styles.stickyCopy}>
            <View style={styles.stickyNameRow}>
              <Text className="font-sans-black" style={styles.stickyName}>Bạn (Quyết)</Text>
              <Text className="font-sans-bold" style={styles.topPill}>Trong Top 10</Text>
            </View>
            <Text className="font-sans" style={styles.stickyHint}>Cần thêm +170đ để lên Top 6</Text>
          </View>
        </View>
        <View style={styles.stickyScore}>
          <View style={styles.pointsRow}>
          <GradientText colors={['#FF416C', '#FF4B2B']} direction="vertical" className="font-sans-black" style={styles.scoreText}>1.240</GradientText>
          <GradientText colors={['#FF416C', '#FF4B2B']} direction="vertical" className="font-sans-semibold" style={styles.scoreUnit}>điểm</GradientText>
          </View>
          <Text className="font-sans-bold" style={styles.rewardPill}>+200.000đ</Text>
        </View>
      </View>

      <PrizeStructureSheet visible={prizeSheetOpen} onClose={() => setPrizeSheetOpen(false)} />
    </View>
  );
}

function PeriodPicker({ selected, onSelect }: { selected: 'current' | 'previous'; onSelect: (value: 'current' | 'previous') => void }) {
  return (
    <View style={styles.periodPicker}>
      <Pressable accessibilityRole="tab" accessibilityState={{ selected: selected === 'current' }} onPress={() => onSelect('current')} style={[styles.periodButton, selected === 'current' && styles.periodActive]}>
        {selected === 'current' ? <LinearGradient pointerEvents="none" colors={['#FF416C', '#FF4B2B']} style={StyleSheet.absoluteFill} /> : null}
        <CustomIcon name="rankingMonthActive" size={14} forceColor color={selected === 'current' ? '#FFFFFF' : '#4A4A4A'} />
        <Text className="font-sans-black" style={[styles.periodText, selected !== 'current' && styles.periodInactive]}>Tháng này (T11)</Text>
      </Pressable>
      <Pressable accessibilityRole="tab" accessibilityState={{ selected: selected === 'previous' }} onPress={() => onSelect('previous')} style={[styles.periodButton, selected === 'previous' && styles.periodActive]}>
        {selected === 'previous' ? <LinearGradient pointerEvents="none" colors={['#FF416C', '#FF4B2B']} style={StyleSheet.absoluteFill} /> : null}
        <CustomIcon name="rankingMonthPrevious" size={14} />
        <Text className="font-sans-bold" style={[styles.periodText, selected !== 'previous' && styles.periodInactive]}>Tháng trước (T10)</Text>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="Chọn tháng" style={styles.calendarButton} onPress={() => undefined}>
        <CustomIcon name="rankingCalendar" size={16} />
      </Pressable>
    </View>
  );
}

function CommunityRow({ member }: { member: CommunityMember }) {
  return (
    <View style={[styles.communityRow, member.current && styles.currentRow]}>
      <View style={styles.communityLeft}>
        <Text className="font-sans-black" style={[styles.communityRank, member.current && styles.currentText]}>{member.rank}</Text>
        <Avatar initial={member.name.slice(0, 1)} imageSource={member.image} size={40} radius={20} />
        <View style={styles.communityCopy}>
          <View style={styles.communityNameRow}><Text className="font-sans-bold" style={styles.communityName}>{member.name}</Text>{member.current ? <Text className="font-sans-black" style={styles.youPill}>Bạn</Text> : null}</View>
          <Text className="font-sans-medium" style={styles.communityMeta}>{member.meta}</Text>
        </View>
      </View>
      <View style={styles.communityScore}>
        <View style={styles.pointsRow}><Text className="font-sans-black" style={[styles.points, member.current && styles.currentText]}>{member.score}</Text><Text className="font-sans-medium" style={styles.pointsUnit}>điểm</Text></View>
        <Text className="font-sans-bold" style={styles.communityReward}>{member.reward}</Text>
      </View>
    </View>
  );
}
