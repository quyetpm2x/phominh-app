import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CustomIcon, type CustomIconProps } from '../../components/ui/CustomIcon';
export function PrivacyRow({
  title,
  subtitle,
  icon,
  iconSize = 16,
  leading = false,
  last = false,
  children,
  onPress,
}: {
  title: string;
  subtitle: string;
  icon?: CustomIconProps['name'];
  iconSize?: number;
  leading?: boolean;
  last?: boolean;
  children?: ReactNode;
  onPress?: () => void;
}) {
  const content = (
    <>
      {leading && icon ? (
        <View style={styles.leading}>
          <CustomIcon name={icon} size={16} />
        </View>
      ) : null}
      <View style={styles.copy}>
        <View style={styles.titleRow}>
          {!leading && icon ? (
            <View style={styles.inlineIcon}>
              <CustomIcon name={icon} size={iconSize} />
            </View>
          ) : null}
          <Text className="font-sans-bold" style={styles.title}>
            {title}
          </Text>
        </View>
        <Text className="font-sans" style={styles.subtitle}>
          {subtitle}
        </Text>
      </View>
      {children}
      {leading ? <CustomIcon name="privacyChevron" size={14} /> : null}
    </>
  );
  const style = [styles.row, !last && styles.divider];
  return onPress ? (
    <Pressable accessibilityRole="button" accessibilityLabel={title} onPress={onPress} style={style}>
      {content}
    </Pressable>
  ) : (
    <View style={style}>{content}</View>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  divider: { borderBottomWidth: 1, borderBottomColor: '#E9ECEF' },
  leading: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  inlineIcon: { width: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, gap: 2 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { flexShrink: 1, fontSize: 13.5, lineHeight: 20.25, color: '#1A1A1A' },
  subtitle: { fontSize: 11, lineHeight: 17.875, color: '#4A4A4A' },
});
