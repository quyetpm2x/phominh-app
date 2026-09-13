import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
export function SettingsHeader({ title }: { title: string }) {
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Quay lại"
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/home?tab=profile'))}
        style={styles.back}
      >
        <CustomIcon name="settingsBack" size={20} />
      </Pressable>
      <Text accessibilityRole="header" className="font-sans-black" style={styles.title}>
        {title}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 24,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 11.1,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 1 },
  },
  title: { fontSize: 22, lineHeight: 33, color: '#1A1A1A' },
});
