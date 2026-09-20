import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { RewardRanking } from '../src/features/wallet/RewardRanking';

export default function RewardRankingScreen() {
  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.safeArea}>
      <RewardRanking />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ safeArea: { flex: 1 } });
