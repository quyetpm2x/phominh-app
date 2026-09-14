import { useState } from 'react';
import { Alert, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomIcon } from '../src/components/ui/CustomIcon';
import { BottomSheet } from '../src/components/ui/BottomSheet';
import { Button } from '../src/components/ui/Button';
import { SettingsHeader } from '../src/features/settings/SettingsHeader';
import { AboutIdentity } from '../src/features/about/AboutIdentity';
import { AboutFeatures } from '../src/features/about/AboutFeatures';
import { AboutLegal } from '../src/features/about/AboutLegal';
import { AboutContact, ABOUT_WEBSITE } from '../src/features/about/AboutContact';
export default function AboutScreen() {
  const [unavailable, setUnavailable] = useState<string | null>(null);
  const share = () =>
    void Share.share({
      message: `Phố Mình — Mạng xã hội tin tức & đời sống khu phố\n${ABOUT_WEBSITE}`,
    }).catch(() => Alert.alert('Chưa mở được bảng chia sẻ', 'Vui lòng thử lại.'));
  return (
    <SafeAreaView style={styles.screen}>
      <SettingsHeader
        title="Về ứng dụng"
        compact
        whiteBack
        style={styles.header}
        action={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Chia sẻ ứng dụng"
            onPress={share}
            style={styles.share}
          >
            <CustomIcon name="aboutShare" size={18} />
          </Pressable>
        }
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <AboutIdentity />
        <AboutFeatures />
        <AboutLegal onUnavailable={setUnavailable} />
        <AboutContact onUnavailable={setUnavailable} />
        <Text className="font-sans" style={styles.copyright}>
          © 2025 Bản Tin Bán Kính. All rights reserved.
        </Text>
      </ScrollView>
      <BottomSheet visible={unavailable !== null} onClose={() => setUnavailable(null)} variant="actions">
        <View style={styles.sheet}>
          <Text className="font-sans-bold text-lg text-ink">{unavailable}</Text>
          <Text className="font-sans text-sm text-muted">
            {unavailable === 'Nhật ký cập nhật phiên bản'
              ? 'Nội dung này chưa được cung cấp trong phiên bản hiện tại.'
              : 'Liên kết chính thức chưa được cung cấp trong phiên bản hiện tại.'}
          </Text>
          <Button label="Đóng" variant="outline" onPress={() => setUnavailable(null)} />
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { paddingTop: 14, paddingBottom: 14 },
  share: {
    width: 40,
    height: 40,
    borderRadius: 11.111,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 96, gap: 24 },
  copyright: { color: '#4A4A4A', fontSize: 11, lineHeight: 16.5, textAlign: 'center', paddingBottom: 8 },
  sheet: { paddingVertical: 16, gap: 16 },
});
