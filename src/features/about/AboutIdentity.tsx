import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
export function AboutIdentity() {
  const version = Constants.expoConfig?.version ?? '1.0.0';
  const build =
    Platform.OS === 'ios'
      ? Constants.expoConfig?.ios?.buildNumber
      : Constants.expoConfig?.android?.versionCode;
  return (
    <View style={styles.container}>
      <View style={[styles.logoWrap, styles.shadow]}>
        <LinearGradient colors={['#FF416C', '#FF416C', '#FF4B2B']} style={styles.logo}>
          <CustomIcon name="aboutLogo" size={36} />
        </LinearGradient>
        <View style={styles.badge}>
          <View style={styles.check}>
            <CustomIcon name="aboutVerified" size={11} />
          </View>
        </View>
      </View>
      <View style={styles.copy}>
        <Text className="font-sans-black" style={styles.title}>
          Phố Mình
        </Text>
        <Text className="font-sans-medium" style={styles.subtitle}>
          Mạng xã hội tin tức & đời sống khu phố
        </Text>
        <View style={styles.version}>
          <CustomIcon name="aboutVersion" size={11} />
          <Text className="font-sans-bold" style={styles.versionText}>
            Phiên bản v{version}
            {build ? ` (Build ${build})` : ''}
          </Text>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingTop: 8, gap: 12 },
  logoWrap: { width: 80, height: 80 },
  shadow: {
    shadowColor: '#FF416C',
    shadowOpacity: 0.3,
    shadowRadius: 7.5,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
    backgroundColor: '#FF416C',
    borderRadius: 22.222,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 22.222,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF416C',
    shadowOpacity: 0.3,
    shadowRadius: 7.5,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  badge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#00BC7D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { alignItems: 'center', gap: 4 },
  title: { fontSize: 20, lineHeight: 30, color: '#1A1A1A' },
  subtitle: { fontSize: 12, lineHeight: 18, color: '#4A4A4A', textAlign: 'center' },
  version: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 30,
    backgroundColor: '#FF416C1A',
  },
  versionText: { fontSize: 11, lineHeight: 16.5, color: '#FF416C' },
});
