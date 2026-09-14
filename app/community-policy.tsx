import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SettingsHeader } from '../src/features/settings/SettingsHeader';
import { CommunityIntro } from '../src/features/community-policy/CommunityIntro';
import { CommunityRuleCard } from '../src/features/community-policy/CommunityRuleCard';
import { CommunityEnforcement } from '../src/features/community-policy/CommunityEnforcement';
import { COMMUNITY_RULES } from '../src/features/community-policy/data';
export default function CommunityPolicyScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <SettingsHeader
        title="Chính sách cộng đồng"
        subtitle="Bảo vệ & xây dựng xóm phố an toàn"
        compact
        action={
          <Text className="font-sans-black" style={styles.version}>
            V2.4
          </Text>
        }
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <CommunityIntro />
        {COMMUNITY_RULES.map((rule) => (
          <CommunityRuleCard key={rule.icon} rule={rule} />
        ))}
        <CommunityEnforcement />
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8F9FA' },
  content: { padding: 16, paddingBottom: 96, gap: 16 },
  version: {
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: 0.5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    overflow: 'hidden',
    color: '#FF416C',
    backgroundColor: '#FF416C1A',
  },
});
