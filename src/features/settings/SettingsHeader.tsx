import type { ReactNode } from 'react';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
export function SettingsHeader({
  title,
  compact = false,
  badge,
  action,
  whiteBack = false,
  style,
  subtitle,
}: {
  style?: StyleProp<ViewStyle>;
  subtitle?: string;
  title: string;
  compact?: boolean;
  badge?: string;
  action?: ReactNode;
  whiteBack?: boolean;
}) {
  return (
    <View style={[styles.header, compact && styles.compactHeader, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Quay lại"
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/home?tab=profile'))}
        style={[
          styles.back,
          compact && styles.plainBack,
          whiteBack && styles.whiteBack,
          subtitle && styles.smallBack,
        ]}
      >
        <CustomIcon
          name={
            subtitle
              ? 'communityBack'
              : whiteBack
                ? 'hiddenBack'
                : compact
                  ? 'appPermissionBack'
                  : 'settingsBack'
          }
          size={subtitle ? 16 : whiteBack ? 18 : 20}
        />
      </Pressable>
      {subtitle ? (
        <View style={styles.copy}>
          <Text accessibilityRole="header" className="font-sans-black" style={styles.smallTitle}>
            {title}
          </Text>
          <Text className="font-sans-medium" style={styles.subtitle}>
            {subtitle}
          </Text>
        </View>
      ) : (
        <Text
          accessibilityRole="header"
          className="font-sans-black"
          style={[styles.title, compact && styles.compactTitle]}
        >
          {title}
        </Text>
      )}
      {action}
      {badge ? (
        <Text className="font-sans-bold" style={styles.badge}>
          {badge}
        </Text>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  copy: { flex: 1 },
  smallBack: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F1F3F599',
    borderWidth: 0,
    shadowOpacity: 0,
  },
  smallTitle: { fontSize: 16, lineHeight: 20, letterSpacing: -0.4, color: '#1A1A1A' },
  subtitle: { fontSize: 11, lineHeight: 16.5, color: '#4A4A4A' },
  whiteBack: { backgroundColor: '#FFF' },
  compactHeader: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  plainBack: { backgroundColor: 'transparent', borderWidth: 0, shadowOpacity: 0 },
  compactTitle: { fontSize: 17, lineHeight: 25.5, letterSpacing: -0.425, flex: 1 },
  badge: {
    fontSize: 11,
    lineHeight: 16.5,
    color: '#FF416C',
    backgroundColor: '#FF416C1A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    overflow: 'hidden',
  },
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
