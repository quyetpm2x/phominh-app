import { StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { IconTextInput } from '../../components/ui/IconTextInput';
import { TextInput } from '../../components/ui/TextInput';
import { fontFamily } from '../../constants/design-tokens';
import { PROFILE_BIO_MAX_LENGTH, type PersonalProfile } from '../../lib/personalProfile';

export function ProfileBasicFields({
  profile,
  onChange,
  disabled,
  error,
}: {
  profile: PersonalProfile;
  onChange: (patch: Partial<PersonalProfile>) => void;
  disabled: boolean;
  error?: string;
}) {
  return (
    <View className="gap-2.5">
      <View className="flex-row items-center justify-between gap-2 px-1">
        <Text accessibilityRole="header" className="font-sans-black text-xs tracking-[0.6px] text-[#4A4A4A]">
          THÔNG TIN CƠ BẢN
        </Text>
        {/* Verification and masked phone are fixtures until account data is connected. */}
        <View className="flex-row items-center gap-1 rounded-full border border-[#D0FAE5] bg-[#ECFDF5] px-2 py-1">
          <CustomIcon name="editProfileVerified" size={12} />
          <Text className="font-sans-bold text-[10px] text-[#009966]">Đã xác minh KYC</Text>
        </View>
      </View>
      <View className="gap-4 rounded-[20px] border border-[#E9ECEF]/80 bg-white p-4">
        <View className="gap-1.5">
          <Text className="font-sans-bold text-xs text-ink">Họ và tên</Text>
          <IconTextInput
            icon="person"
            iconNode={<CustomIcon name="editProfileUser" size={18} />}
            iconPosition="right"
            accessibilityLabel="Họ và tên"
            value={profile.fullName}
            onChangeText={(fullName) => onChange({ fullName })}
            maxLength={100}
            autoComplete="name"
            autoCapitalize="words"
            editable={!disabled}
            invalid={Boolean(error)}
            style={styles.input}
          />
          {error ? (
            <Text accessibilityLiveRegion="polite" className="font-sans text-xs text-danger">
              {error}
            </Text>
          ) : null}
        </View>
        <View className="gap-1.5">
          <Text className="font-sans-bold text-xs text-ink">Biệt danh hiển thị trong xóm</Text>
          <IconTextInput
            icon="person"
            iconNode={<CustomIcon name="editProfileNickname" size={18} />}
            iconPosition="right"
            accessibilityLabel="Biệt danh hiển thị trong xóm"
            value={profile.nickname}
            onChangeText={(nickname) => onChange({ nickname })}
            maxLength={50}
            editable={!disabled}
            style={styles.input}
          />
        </View>
        <View className="gap-1.5">
          <View className="flex-row items-center justify-between">
            <Text className="font-sans-bold text-xs text-ink">Giới thiệu ngắn</Text>
            <Text className="font-sans-bold text-[10px] text-[#4A4A4A]">
              {profile.bio.length}/{PROFILE_BIO_MAX_LENGTH}
            </Text>
          </View>
          <TextInput
            accessibilityLabel="Giới thiệu ngắn"
            placeholder="Viết vài dòng giới thiệu về bạn..."
            placeholderTextColor="#1A1A1A"
            multiline
            maxLength={PROFILE_BIO_MAX_LENGTH}
            value={profile.bio}
            onChangeText={(bio) => onChange({ bio })}
            editable={!disabled}
            style={styles.bio}
          />
        </View>
        <View className="gap-1.5">
          <View className="flex-row items-center justify-between">
            <Text className="font-sans-bold text-xs text-ink">Số điện thoại</Text>
            <Text className="font-sans-bold text-[11px] text-[#4A4A4A]">Không thể đổi</Text>
          </View>
          <View className="flex-row items-center gap-2.5 rounded-xl border border-[#E9ECEF]/60 bg-[#F1F3F5]/30 px-3.5 py-3">
            <CustomIcon name="editProfilePhone" size={16} />
            <Text className="flex-1 font-sans-bold text-[13px] text-ink">098 ••• ••89</Text>
            <CustomIcon name="editProfileEye" size={14} />
          </View>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  input: {
    height: 47,
    borderRadius: 13,
    backgroundColor: '#F1F3F566',
    fontFamily: fontFamily['sans-medium'],
    fontSize: 13,
  },
  bio: {
    height: 86,
    borderRadius: 14,
    borderColor: '#E9ECEFCC',
    backgroundColor: '#F1F3F566',
    fontFamily: fontFamily['sans-medium'],
    fontSize: 13,
    lineHeight: 21,
    paddingHorizontal: 13,
    paddingVertical: 10,
    textAlignVertical: 'top',
  },
});
