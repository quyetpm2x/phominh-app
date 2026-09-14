import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/ui/Button';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { LegalCard } from '../legal/LegalCard';
export function FaqSupport({ onSelect }: { onSelect: (kind: 'chat' | 'hotline') => void }) {
  return (
    <LegalCard style={styles.card}>
      <View style={styles.heading}>
        <View style={styles.icon}>
          <CustomIcon name="faqSupport" size={18} />
        </View>
        <View style={styles.copy}>
          <Text className="font-sans-bold" style={styles.title}>
            Vẫn chưa tìm thấy câu trả lời?
          </Text>
          <Text className="font-sans" style={styles.subtitle}>
            Đội ngũ hỗ trợ trực tuyến 24/7
          </Text>
        </View>
      </View>
      <View style={styles.actions}>
        <Button
          accessibilityRole="button"
          label="Chat với CSKH"
          leadingIcon={<CustomIcon name="faqChat" size={16} />}
          style={styles.button}
          labelStyle={styles.buttonText}
          onPress={() => onSelect('chat')}
        />
        <Button
          accessibilityRole="button"
          label="Hotline 1900 xxxx"
          variant="outline"
          leadingIcon={<CustomIcon name="faqPhone" size={16} />}
          style={[styles.button, styles.hotline]}
          labelStyle={styles.buttonText}
          onPress={() => onSelect('hotline')}
        />
      </View>
    </LegalCard>
  );
}
const styles = StyleSheet.create({
  card: { gap: 12 },
  heading: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FF416C1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1 },
  title: { fontSize: 13, lineHeight: 19.5, color: '#1A1A1A' },
  subtitle: { fontSize: 11, lineHeight: 16.5, color: '#4A4A4A' },
  actions: { flexDirection: 'row', gap: 8, paddingTop: 4 },
  button: {
    flex: 1,
    minHeight: 40,
    height: 'auto',
    paddingHorizontal: 6,
    paddingVertical: 10,
    borderRadius: 11.111,
    flexDirection: 'row',
    gap: 6,
  },
  buttonText: {
    fontFamily: 'BeVietnamPro_700Bold',
    fontSize: 12,
    lineHeight: 18,
    flexShrink: 1,
    textAlign: 'center',
  },
  hotline: { borderWidth: 0 },
});
