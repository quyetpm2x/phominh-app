import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type TextStyle } from 'react-native';
import { CustomIcon, type CustomIconProps } from '../../components/ui/CustomIcon';

export function SettingsSection({
  title,
  children,
  titleStyle,
}: {
  title: string;
  children: ReactNode;
  titleStyle?: StyleProp<TextStyle>;
}) {
  return (
    <View style={styles.section}>
      <Text accessibilityRole="header" className="font-sans-black" style={[styles.heading, titleStyle]}>
        {title}
      </Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

export function SettingsRow({
  icon,
  title,
  subtitle,
  tone,
  badge,
  last,
  onPress,
}: {
  icon: CustomIconProps['name'];
  title: string;
  subtitle?: string;
  tone?: 'pink' | 'orange';
  badge?: 'default' | 'manage';
  last?: boolean;
  onPress?: () => void;
}) {
  const content = (
    <>
      <View
        style={[
          styles.icon,
          tone && styles.coloredIcon,
          tone && styles[tone],
          badge === 'manage' && styles.permissionsIcon,
        ]}
      >
        <CustomIcon name={icon} size={20} />
      </View>
      <View style={styles.copy}>
        <Text className="font-sans-bold" style={styles.title}>
          {title}
        </Text>
        {subtitle ? (
          <Text className="font-sans" style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {badge ? (
        <View style={badge === 'manage' ? styles.manage : styles.defaultBadge}>
          <Text
            className="font-sans-black"
            style={badge === 'manage' ? styles.manageText : styles.defaultText}
          >
            {badge === 'manage' ? 'Quản\nlý' : 'MẶC ĐỊNH'}
          </Text>
        </View>
      ) : null}
      {onPress ? <CustomIcon name="settingsChevron" size={badge === 'manage' ? 14 : 20} /> : null}
    </>
  );
  const rowStyle = [styles.row, tone && styles.generalRow, badge === 'manage' && styles.permissionsRow];
  return (
    <View>
      {onPress ? (
        <Pressable accessibilityRole="button" accessibilityLabel={title} onPress={onPress} style={rowStyle}>
          {content}
        </Pressable>
      ) : (
        <View style={rowStyle}>{content}</View>
      )}
      {!last ? <View style={styles.divider} /> : null}
    </View>
  );
}
const styles = StyleSheet.create({
  pink: { backgroundColor: '#FF416C1A' },
  orange: { backgroundColor: '#FF8A001A' },
  permissionsIcon: { marginRight: 10 },
  section: { gap: 10 },
  heading: { color: '#A8A29E', fontSize: 10, lineHeight: 17, letterSpacing: 2, paddingLeft: 5 },
  card: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 1,
  },
  row: {
    minHeight: 53,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  generalRow: { minHeight: 72 },
  permissionsRow: { minHeight: 86, gap: 6 },
  icon: { width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  coloredIcon: { width: 40, height: 40, borderRadius: 11, marginRight: 0 },
  copy: { flex: 1, gap: 2 },
  title: { color: '#1A1A1A', fontSize: 14, lineHeight: 21 },
  subtitle: { color: '#79716B', fontSize: 11, lineHeight: 17 },
  divider: { height: 1, marginHorizontal: 16, backgroundColor: '#E9ECEF80' },
  defaultBadge: { backgroundColor: '#F5F5F4', borderRadius: 5.3, paddingHorizontal: 8, paddingVertical: 2 },
  defaultText: { fontSize: 9, lineHeight: 15, color: '#A8A29E' },
  manage: { backgroundColor: '#FF416C1A', borderRadius: 8.4, paddingHorizontal: 16, paddingVertical: 4 },
  manageText: { color: '#FF416C', fontSize: 11, lineHeight: 16.5, textAlign: 'center' },
});
