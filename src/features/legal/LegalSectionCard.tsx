import { LegalCard } from './LegalCard';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
export function LegalSectionCard({ title, body, icon }: { title: string; body: string; icon: ReactNode }) {
  return (
    <LegalCard>
      <View style={styles.heading}>
        <View style={styles.icon}>{icon}</View>
        <Text accessibilityRole="header" className="font-sans-bold" style={styles.title}>
          {title}
        </Text>
      </View>
      <Text className="font-sans" style={styles.body}>
        {body}
      </Text>
    </LegalCard>
  );
}
const styles = StyleSheet.create({
  heading: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  icon: {
    width: 28,
    height: 28,
    borderRadius: 7.778,
    backgroundColor: '#FF416C1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { flex: 1, fontSize: 13.5, lineHeight: 20.25, color: '#1A1A1A' },
  body: { fontSize: 12, lineHeight: 19.5, color: '#4A4A4A' },
});
