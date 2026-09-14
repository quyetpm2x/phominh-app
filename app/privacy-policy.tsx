import { Alert, Pressable, ScrollView, Share, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomIcon } from '../src/components/ui/CustomIcon';
import { SettingsHeader } from '../src/features/settings/SettingsHeader';
import { LegalSectionCard } from '../src/features/legal/LegalSectionCard';
import { PolicyIntro } from '../src/features/privacy-policy/PolicyIntro';
import { PolicyContact } from '../src/features/privacy-policy/PolicyContact';
import {
  POLICY_DATE,
  POLICY_INTRO,
  POLICY_SECTIONS,
  PRIVACY_EMAIL,
} from '../src/features/privacy-policy/data';
export default function PrivacyPolicyScreen() {
  const share = () =>
    void Share.share({
      title: 'Chính sách bảo mật',
      message: [
        'Chính sách bảo mật — Bản Tin Bán Kính',
        `Áp dụng: ${POLICY_DATE}`,
        POLICY_INTRO,
        ...POLICY_SECTIONS.map(({ title, body }) => `${title}\n${body}`),
        `Liên hệ Ban Phụ trách Bảo mật: ${PRIVACY_EMAIL}`,
      ].join('\n\n'),
    }).catch(() => Alert.alert('Chưa mở được bảng chia sẻ', 'Vui lòng thử lại.'));
  return (
    <SafeAreaView style={styles.screen}>
      <SettingsHeader
        title="Chính sách bảo mật"
        compact
        whiteBack
        style={styles.header}
        action={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Chia sẻ chính sách bảo mật"
            style={styles.share}
            onPress={share}
          >
            <CustomIcon name="aboutShare" size={18} />
          </Pressable>
        }
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <PolicyIntro />
        <View style={styles.sections}>
          {POLICY_SECTIONS.map((section) => (
            <LegalSectionCard
              key={section.icon}
              title={section.title}
              body={section.body}
              icon={<CustomIcon name={section.icon} size={16} />}
            />
          ))}
        </View>
        <PolicyContact />
      </ScrollView>
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
  content: { padding: 16, paddingBottom: 96, gap: 16 },
  sections: { gap: 12 },
});
