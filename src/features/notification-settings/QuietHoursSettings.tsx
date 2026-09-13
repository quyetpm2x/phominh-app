import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { Toggle } from '../../components/ui/Toggle';
import { SettingsSection } from '../settings/SettingsSection';
import { CustomQuietHours } from './CustomQuietHours';
import { formatTime, quietRange, type NotificationPreferences, type QuietPreset } from './preferences';
const PRESETS = [
  ['night', 'Tối (22h - 7h)'],
  ['nap', 'Nghỉ trưa'],
  ['custom', 'Tuỳ chỉnh'],
] as const;
export function QuietHoursSettings({
  preferences,
  saving,
  update,
}: {
  preferences: NotificationPreferences;
  saving: boolean;
  update: (patch: Partial<NotificationPreferences>) => Promise<boolean>;
}) {
  // The reference opens the custom editor while the night schedule is still active.
  const [selected, setSelected] = useState<QuietPreset>('custom');
  const [start, end] = quietRange(preferences);
  const name =
    preferences.preset === 'night' ? 'Tối & Đêm' : preferences.preset === 'nap' ? 'Nghỉ trưa' : 'Tuỳ chỉnh';
  return (
    <SettingsSection title="GIỜ YÊN TĨNH" titleStyle={styles.heading}>
      <View style={styles.body}>
        <View style={styles.header}>
          <View style={styles.icon}>
            <CustomIcon name="quietMoon" size={20} />
          </View>
          <View style={styles.copy}>
            <Text className="font-sans-bold" style={styles.title}>
              Chế độ không làm phiền
            </Text>
            <Text className="font-sans-bold" style={styles.status}>
              {preferences.quietEnabled
                ? `Đang bật: ${name} (${formatTime(start)} - ${formatTime(end)})`
                : 'Đang tắt'}
            </Text>
          </View>
          <Toggle
            variant="settings"
            value={preferences.quietEnabled}
            disabled={saving}
            label="Chế độ không làm phiền"
            onValueChange={(quietEnabled) => void update({ quietEnabled })}
          />
        </View>
        <View style={styles.presets}>
          {PRESETS.map(([key, label]) => (
            <Pressable
              key={key}
              accessibilityRole="radio"
              accessibilityLabel={label}
              accessibilityState={{
                selected: selected === key,
                disabled: saving || !preferences.quietEnabled,
              }}
              disabled={saving || !preferences.quietEnabled}
              style={[styles.preset, selected === key && styles.active]}
              onPress={() => {
                if (key === 'custom') setSelected(key);
                else
                  void update({ preset: key }).then((ok) => {
                    if (ok) setSelected(key);
                  });
              }}
            >
              <Text
                className="font-sans-bold"
                style={[styles.presetText, selected === key && styles.activeText]}
              >
                {label}
              </Text>
            </Pressable>
          ))}
        </View>
        {selected === 'custom' ? (
          <CustomQuietHours
            initialStart={preferences.customStart}
            initialEnd={preferences.customEnd}
            disabled={saving || !preferences.quietEnabled}
            saving={saving}
            onSave={(customStart, customEnd) => update({ preset: 'custom', customStart, customEnd })}
          />
        ) : null}
      </View>
    </SettingsSection>
  );
}
const styles = StyleSheet.create({
  heading: { color: '#4A4A4A' },
  body: { padding: 16, gap: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 11.1,
    backgroundColor: '#FF416C1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1 },
  title: { fontSize: 14, lineHeight: 21, color: '#1A1A1A' },
  status: { fontSize: 10.5, lineHeight: 16, color: '#FF416C' },
  presets: { flexDirection: 'row', gap: 8 },
  preset: {
    flex: 1,
    minHeight: 40,
    borderRadius: 11.1,
    borderWidth: 1,
    borderColor: '#E9ECEFCC',
    backgroundColor: '#F5F5F4',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  active: { backgroundColor: '#FF416C', borderColor: '#FF416C' },
  presetText: { fontSize: 12, lineHeight: 18, color: '#79716B' },
  activeText: { color: '#FFF' },
});
