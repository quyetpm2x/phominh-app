import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from '../../components/ui/Avatar';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { GradientText } from '../../components/ui/GradientText';
import { podium } from './reward-ranking-data';
import { styles } from './reward-ranking-styles';

export function HeroCard() {
  return (
    <LinearGradient colors={['#FFFFFF', '#FFFFFF', '#F8F9FA']} style={styles.heroCard}>
      <View style={styles.heroHeader}>
        <View style={styles.heroHeaderLeft}>
          <LinearGradient colors={['#FF416C', '#FF4B2B']} style={styles.medalBadge}>
            <CustomIcon name="rankingMedal" size={14} />
          </LinearGradient>
          <View>
            <Text className="font-sans-bold" style={styles.heroLabel}>TỔNG THƯỞNG THÁNG NÀY</Text>
            <GradientText colors={['#FF416C', '#FF4B2B']} direction="vertical" className="font-sans-black" style={styles.heroAmount}>15.000.000đ</GradientText>
          </View>
        </View>
        <View style={styles.daysPill}><CustomIcon name="rankingTimer" size={14} /><Text className="font-sans-bold" style={styles.daysText}>Còn 12 ngày</Text></View>
      </View>
      <View style={styles.podiumRow}>{podium.map((item) => <PodiumItem key={item.rank} item={item} />)}</View>
    </LinearGradient>
  );
}

function PodiumItem({ item }: { item: (typeof podium)[number] }) {
  const isFirst = item.rank === 1;
  const isSecond = item.rank === 2;
  const imageSize = isFirst ? 80 : isSecond ? 64 : 52;
  return (
    <View style={[styles.podiumItem, isFirst ? styles.podiumFirst : isSecond ? styles.podiumSecond : null]}>
      <View style={[styles.podiumName, { top: imageSize + (isFirst ? 10 : 8) }]}><Text className={isFirst ? "font-sans-black" : "font-sans-bold"} style={styles.podiumNameText}>{item.name}</Text></View>
      <View style={[styles.podiumScore, { top: imageSize + (isFirst ? 28 : 26) }]}><Text className="font-sans-black" style={styles.podiumScoreText}>{item.score}</Text><Text className="font-sans-medium" style={styles.podiumUnit}>đ</Text></View>
      <View style={[styles.podiumReward, item.tone === 'gold' ? styles.goldReward : item.tone === 'bronze' ? styles.bronzeReward : styles.silverReward]}>
        {item.tone !== 'silver' ? <LinearGradient pointerEvents="none" colors={item.tone === 'gold' ? ['#FF416C26', '#FF4B2B26'] : ['#CD7F32', '#B86D29', '#8C4A1A']} style={StyleSheet.absoluteFill} /> : null}
        <Text className="font-sans-bold" style={[styles.rewardLabel, item.tone === 'gold' ? styles.goldRewardLabel : item.tone === 'bronze' ? styles.bronzeRewardLabel : null]}>THƯỞNG{isFirst ? ' TOP 1' : ''}</Text>
        <Text className="font-sans-black" style={[styles.rewardAmount, item.tone === 'gold' ? styles.goldRewardAmount : item.tone === 'bronze' ? styles.bronzeRewardAmount : null]}>{item.reward}</Text>
      </View>
      <View style={[styles.podiumAvatarRing, { width: imageSize, height: imageSize, borderRadius: imageSize / 2 }, item.tone === 'gold' ? styles.goldRing : item.tone === 'bronze' ? styles.bronzeRing : styles.silverRing]}>
        <Avatar initial={item.name.slice(0, 1)} imageSource={item.image} size={imageSize - 4} radius={(imageSize - 4) / 2} />
        <View style={[styles.placeBadge, isFirst ? styles.placeFirst : isSecond ? styles.placeSecond : styles.placeThird]}><Text className="font-sans-black" style={styles.placeText}>{item.rank}</Text></View>
        {isFirst ? <View style={styles.crown}><CustomIcon name="rankingCrown" size={18} /></View> : null}
      </View>
    </View>
  );
}

