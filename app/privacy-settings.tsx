import { useState } from 'react';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomIcon } from '../src/components/ui/CustomIcon';
import { Button } from '../src/components/ui/Button';
import { Toggle } from '../src/components/ui/Toggle';
import { SettingsHeader } from '../src/features/settings/SettingsHeader';
import { SettingsSection } from '../src/features/settings/SettingsSection';
import { PrivacyRow } from '../src/features/privacy-settings/PrivacyRow';
import { PrivacyIntro, PrivacyCommitment } from '../src/features/privacy-settings/PrivacyInfo';
import { PrivacySheets } from '../src/features/privacy-settings/PrivacySheets';
import { MESSAGE_AUDIENCES, type PrivacyPreferences } from '../src/features/privacy-settings/preferences';
import { usePrivacyPreferences } from '../src/features/privacy-settings/usePrivacyPreferences';
import { useHiddenItems } from '../src/features/hidden-items/useHiddenItems';
import { usePriorityNeighbors } from '../src/features/priority-neighbors/usePriorityNeighbors';

export default function PrivacySettingsScreen() {
  const { preferences, ready, saving, update, loadError, retry } = usePrivacyPreferences();
  const { items } = useHiddenItems();
  const priority = usePriorityNeighbors();
  const [sheet, setSheet] = useState<'audience' | 'blocked' | null>(null);
  const disabled = !ready || saving;
  const toggle = (key: Exclude<keyof PrivacyPreferences, 'messageAudience'>, label: string) => (
    <Toggle
      variant="privacy"
      value={preferences[key]}
      label={label}
      disabled={disabled}
      onValueChange={(value) => void update({ [key]: value })}
    />
  );
  const audience = MESSAGE_AUDIENCES[preferences.messageAudience];
  return (
    <SafeAreaView style={styles.screen}>
      <SettingsHeader title="Quyền riêng tư" compact whiteBack style={styles.header} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <PrivacyIntro />
        {loadError ? (
          <View style={styles.error}>
            <Text className="font-sans text-sm text-muted">Chưa tải được cài đặt quyền riêng tư.</Text>
            <Button label="Thử lại" variant="outline" onPress={retry} />
          </View>
        ) : null}
        <SettingsSection title="VỊ TRÍ & KHOẢNG CÁCH" gap={12} titleStyle={styles.sectionTitle}>
          <PrivacyRow
            icon="privacyPin"
            iconSize={11}
            title="Hiển thị khoảng cách ước tính"
            subtitle={'Hiển thị "cách bạn ~150m" thay vì toạ độ GPS chính xác'}
          >
            {toggle('approximateDistance', 'Hiển thị khoảng cách ước tính')}
          </PrivacyRow>
          <PrivacyRow
            icon="privacyHouse"
            iconSize={15}
            title="Ẩn vị trí nhà riêng"
            subtitle="Làm mờ bán kính 50m xung quanh vị trí Nhà của bạn"
            last
          >
            {toggle('hideHome', 'Ẩn vị trí nhà riêng')}
          </PrivacyRow>
        </SettingsSection>
        <SettingsSection title="AI CÓ THỂ LIÊN HỆ & TÌM THẤY BẠN" gap={12} titleStyle={styles.sectionTitle}>
          <PrivacyRow
            title="Ai có thể nhắn tin cho bạn"
            subtitle={audience.detail}
            onPress={ready ? () => setSheet('audience') : undefined}
          >
            <View style={styles.audience}>
              <Text className="font-sans-bold" style={styles.audienceText}>
                {audience.label}
              </Text>
              <CustomIcon name="privacyArrow" size={12} />
            </View>
          </PrivacyRow>
          <PrivacyRow
            title={'Hiển thị trong mục "Gợi ý người quen"'}
            subtitle="Cho phép hàng xóm xung quanh tìm thấy hồ sơ của bạn"
          >
            {toggle('discoverable', 'Hiển thị trong mục Gợi ý người quen')}
          </PrivacyRow>
          <PrivacyRow
            title="Hiển thị trạng thái hoạt động (Online)"
            subtitle="Hiển thị dấu chấm xanh khi bạn đang trực tuyến"
            last
          >
            {toggle('online', 'Hiển thị trạng thái hoạt động')}
          </PrivacyRow>
        </SettingsSection>
        <SettingsSection title="DANH SÁCH HẠN CHẾ & BẢO VỆ" gap={12} titleStyle={styles.sectionTitle}>
          <PrivacyRow
            leading
            icon="privacyHidden"
            title="Không quan tâm (Đã ẩn)"
            subtitle={`${items.length} mục đang ẩn`}
            onPress={() => router.push('/hidden-items')}
          />
          <PrivacyRow
            leading
            icon="privacyBlocked"
            title="Danh sách chặn"
            subtitle="0 tài khoản bị chặn"
            onPress={() => setSheet('blocked')}
          />
          <PrivacyRow
            leading
            icon="privacyStar"
            title="Người quen ưu tiên"
            subtitle={
              priority.error
                ? 'Chưa tải được danh sách'
                : priority.ready
                  ? `${priority.ids.length} người trong danh sách`
                  : 'Đang tải danh sách…'
            }
            onPress={() => router.push('/priority-neighbors')}
            last
          />
        </SettingsSection>
        <PrivacyCommitment />
      </ScrollView>
      <PrivacySheets
        sheet={sheet}
        onClose={() => setSheet(null)}
        audience={preferences.messageAudience}
        disabled={disabled}
        onSelect={(messageAudience) => update({ messageAudience })}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { paddingTop: 14, paddingBottom: 14 },
  content: { padding: 16, paddingBottom: 96, gap: 20 },
  sectionTitle: { paddingLeft: 1.5, fontSize: 11, lineHeight: 16.5, letterSpacing: 0.55, color: '#4A4A4A' },
  audience: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  audienceText: { fontSize: 12, lineHeight: 18, color: '#FF416C' },
  error: { gap: 12 },
});
