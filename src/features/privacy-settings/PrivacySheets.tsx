import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { Button } from '../../components/ui/Button';
import { MESSAGE_AUDIENCES, type MessageAudience } from './preferences';
export function PrivacySheets({
  sheet,
  onClose,
  audience,
  disabled,
  onSelect,
}: {
  sheet: 'audience' | 'blocked' | null;
  onClose: () => void;
  audience: MessageAudience;
  disabled: boolean;
  onSelect: (value: MessageAudience) => Promise<boolean>;
}) {
  return (
    <BottomSheet visible={sheet !== null} onClose={onClose} variant="actions">
      <View style={styles.content}>
        <Text className="font-sans-bold text-lg text-ink">
          {sheet === 'audience' ? 'Ai có thể nhắn tin cho bạn' : 'Danh sách chặn'}
        </Text>
        {sheet === 'audience' ? (
          <View accessibilityRole="radiogroup">
            {(Object.keys(MESSAGE_AUDIENCES) as MessageAudience[]).map((key) => (
              <Pressable
                key={key}
                accessibilityRole="radio"
                accessibilityState={{ checked: audience === key, disabled }}
                disabled={disabled}
                onPress={async () => {
                  if (await onSelect(key)) onClose();
                }}
                style={styles.option}
              >
                <View style={styles.copy}>
                  <Text className="font-sans-bold text-sm text-ink">{MESSAGE_AUDIENCES[key].label}</Text>
                  <Text className="font-sans text-xs text-muted">{MESSAGE_AUDIENCES[key].detail}</Text>
                </View>
                <View style={[styles.radio, audience === key && styles.selected]} />
              </Pressable>
            ))}
          </View>
        ) : (
          <Text className="font-sans text-sm text-muted">
            Chưa có tài khoản bị chặn. Chức năng chặn tài khoản chưa được kết nối với máy chủ.
          </Text>
        )}
        <Button label="Đóng" variant="outline" onPress={onClose} />
      </View>
    </BottomSheet>
  );
}
const styles = StyleSheet.create({
  content: { paddingVertical: 16, gap: 16 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  copy: { flex: 1, gap: 4 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: '#E9ECEF' },
  selected: { borderWidth: 6, borderColor: '#FF416C' },
});
