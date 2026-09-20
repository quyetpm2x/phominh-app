import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SettingsHeader } from '../src/features/settings/SettingsHeader';
import { CustomIcon } from '../src/components/ui/CustomIcon';
import { MonetizationSettings } from '../src/features/wallet/MonetizationSettings';

export default function MonetizationSettingsScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <SettingsHeader
        title="Cài đặt kiếm tiền"
        compact
        backIcon="monetizationBack"
        whiteBack
        style={styles.header}
        action={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Trợ giúp cài đặt kiếm tiền"
            style={styles.help}
          >
            <CustomIcon name="monetizationHelp" size={18} />
          </Pressable>
        }
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <MonetizationSettings />
      </ScrollView>
      <View style={styles.footer}>
        <LinearGradient colors={['#FF416C', '#FF4B2B']} style={styles.save}>
          <CustomIcon name="monetizationSave" size={16} />
          <Text className="font-sans-bold" style={styles.saveText}>
            Lưu cấu hình kiếm tiền
          </Text>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { paddingTop: 4, paddingBottom: 14, backgroundColor: '#F8F9FAF2', borderBottomColor: '#E9ECEF99' },
  help: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FF416C1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { padding: 20, paddingBottom: 92, gap: 20 },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 9,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF99',
    backgroundColor: '#F8F9FA',
  },
  save: {
    height: 48,
    borderRadius: 13.333,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveText: { color: '#FFF', fontSize: 14, lineHeight: 20 },
});
