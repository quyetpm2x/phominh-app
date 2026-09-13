import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomIcon } from '../src/components/ui/CustomIcon';
import { GradientSubmitButton } from '../src/components/ui/GradientSubmitButton';
import { ProfileAreaEditor } from '../src/features/profile/ProfileAreaEditor';
import { ProfileAvatarEditor } from '../src/features/profile/ProfileAvatarEditor';
import { ProfileBasicFields } from '../src/features/profile/ProfileBasicFields';
import { ProfileFixedAreas } from '../src/features/profile/ProfileFixedAreas';
import { useProfileEditor } from '../src/features/profile/useProfileEditor';

export default function ProfileScreen() {
  const editor = useProfileEditor();
  const [area, setArea] = useState<'home' | 'work' | null>(null);
  const disabled = editor.loading || editor.loadError || editor.saving || editor.picking;
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between border-b border-[#E9ECEF]/80 px-5 pb-4 pt-2">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
          disabled={editor.saving || editor.picking}
          onPress={editor.back}
          className="h-9 w-9 items-center justify-center rounded-full bg-[#F1F3F5]/60"
        >
          <CustomIcon name="editProfileBack" size={16} />
        </Pressable>
        <Text accessibilityRole="header" className="font-sans-black text-base text-ink">
          Chỉnh sửa hồ sơ
        </Text>
        <GradientSubmitButton
          label="Lưu"
          disabled={disabled}
          loading={editor.saving}
          onPress={() => void editor.save()}
          compact
          rounded
          hideIcon
          gradientStyle={styles.save}
        />
      </View>
      {editor.loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#FF416C" />
        </View>
      ) : editor.loadError ? (
        <View className="flex-1 items-center justify-center px-5">
          <Text className="font-sans text-sm text-ink">
            Chưa tải được hồ sơ. Vui lòng quay lại và thử lại.
          </Text>
        </View>
      ) : (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
          <ScrollView
            className="bg-[#F1F3F5]/20"
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <ProfileAvatarEditor
              profile={editor.profile}
              disabled={disabled}
              picking={editor.picking}
              onPress={() => void editor.choosePhoto()}
            />
            <ProfileBasicFields
              profile={editor.profile}
              onChange={editor.update}
              disabled={disabled}
              error={editor.error}
            />
            <ProfileFixedAreas
              home={editor.home}
              work={editor.work}
              onEdit={(next) => {
                if (!disabled) setArea(next);
              }}
            />
            <View className="flex-row items-start gap-3 rounded-[20px] border border-[#FE9A00]/20 bg-[#FE9A00]/10 p-3.5">
              <CustomIcon name="editProfileInfo" size={16} />
              <Text className="flex-1 font-sans-medium text-[11.5px] leading-[19px] text-[#1A1A1A]/80">
                Tên hiển thị và khu vực được hiển thị công khai trên các bản tin bạn đăng trong phạm vi xóm.
                Vui lòng sử dụng thông tin chính xác.
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
      {area ? (
        <ProfileAreaEditor
          area={area === 'home' ? editor.home : (editor.work ?? { ...editor.home, radiusKm: 0.8 })}
          place={area === 'home' ? 'Nhà' : 'Chỗ làm'}
          onApply={area === 'home' ? editor.setHome : editor.setWork}
          onClose={() => setArea(null)}
        />
      ) : null}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 20, paddingTop: 24, paddingBottom: 48, gap: 24 },
  save: {
    width: 56,
    height: 32,
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
});
