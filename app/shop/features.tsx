import { Alert, Pressable, ScrollView, Share, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SettingsHeader } from '../../src/features/settings/SettingsHeader';
import { CustomIcon } from '../../src/components/ui/CustomIcon';
import { ShopFeatureHero } from '../../src/features/shop-features/ShopFeatureHero';
import { ShopFeatureCards } from '../../src/features/shop-features/ShopFeatureCards';
import { ShopFeatureRegistration } from '../../src/features/shop-features/ShopFeatureRegistration';
export default function ShopFeaturesScreen() {
  const share = () =>
    void Share.share({
      message:
        'Tính năng Quán xá trên Phố Mình: menu trực quan, tiếp cận cư dân lân cận, liên hệ trực tiếp và báo cáo tiếp cận quán.',
    }).catch(() => Alert.alert('Chưa mở được bảng chia sẻ', 'Vui lòng thử lại.'));
  return (
    <SafeAreaView style={styles.screen}>
      <SettingsHeader
        compact
        title="Tính năng Quán xá"
        subtitle="Tiếp cận 100% cư dân quanh bán kính quán"
        style={styles.header}
        titleStyle={styles.title}
        subtitleStyle={styles.subtitle}
        backStyle={styles.headerButton}
        backIcon="shopFeatureBack"
        action={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Chia sẻ tính năng quán"
            onPress={share}
            style={styles.headerButton}
          >
            <CustomIcon name="shopFeatureShare" size={18} />
          </Pressable>
        }
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <ShopFeatureHero />
        <ShopFeatureCards />
        <ShopFeatureRegistration />
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { backgroundColor: '#FFFFFFF2', paddingTop: 0, paddingBottom: 12 },
  title: { fontSize: 18, lineHeight: 23, letterSpacing: -0.45 },
  subtitle: { fontFamily: 'BeVietnamPro_400Regular', fontSize: 11, lineHeight: 16.5 },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 11.111,
    backgroundColor: '#F1F3F599',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { padding: 16, paddingBottom: 96, gap: 16 },
});
