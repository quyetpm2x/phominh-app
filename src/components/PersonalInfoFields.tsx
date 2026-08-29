import { Text, TextInput, View } from 'react-native';

import { colors } from '../constants/design-tokens';
import { DateOfBirthFields } from './DateOfBirthFields';
import { GenderSelector, type Gender } from './GenderSelector';
import { IconTextInput } from './ui/IconTextInput';
import { type DateOfBirthParts } from '../lib/dateOfBirth';

interface PersonalInfoFieldsProps {
  realName: string;
  onRealNameChange: (value: string) => void;
  onRealNameBlur: () => void;
  realNameInvalid: boolean;
  nickname: string;
  onNicknameChange: (value: string) => void;
  onNicknameBlur: () => void;
  nicknameInvalid: boolean;
  dob: DateOfBirthParts;
  onDobChange: (value: DateOfBirthParts) => void;
  gender: Gender | null;
  onGenderChange: (value: Gender | null) => void;
  genderInvalid: boolean;
  bio: string;
  onBioChange: (value: string) => void;
  onBioBlur: () => void;
  bioInvalid: boolean;
}

// Tất cả field đều bắt buộc (đính chính 2026-08-25, ban đầu nickname/bio/gender optional) — mọi
// title đều có dấu * đỏ, kèm "Không hợp lệ" khi rỗng (sau khi user rời field hoặc đã bấm thử
// submit lúc còn thiếu).
const RequiredMark = () => <Text className="text-danger">*</Text>;

// Tách khỏi personal-info.tsx (vượt 250 dòng sau khi thêm validate "Không hợp lệ" + focus glow) —
// gộp trọn khối card trắng chứa 5 field onboarding, giữ personal-info.tsx chỉ còn state/logic +
// header/CTA.
export function PersonalInfoFields({
  realName,
  onRealNameChange,
  onRealNameBlur,
  realNameInvalid,
  nickname,
  onNicknameChange,
  onNicknameBlur,
  nicknameInvalid,
  dob,
  onDobChange,
  gender,
  onGenderChange,
  genderInvalid,
  bio,
  onBioChange,
  onBioBlur,
  bioInvalid,
}: PersonalInfoFieldsProps) {
  return (
    <View className="mt-5 gap-4 rounded-3xl border border-border bg-white p-5 shadow-sm">
      <View className="gap-1.5">
        <Text className="font-sans-bold text-xs text-ink">
          Họ và tên <Text className="text-danger">*</Text>
        </Text>
        <IconTextInput
          icon="person"
          value={realName}
          onChangeText={onRealNameChange}
          onBlur={onRealNameBlur}
          placeholder="Nhập họ và tên..."
          maxLength={60}
          invalid={realNameInvalid}
        />
        {realNameInvalid ? <Text className="text-[11px] text-danger">Vui lòng nhập họ và tên</Text> : null}
      </View>

      <View className="gap-1.5">
        <View className="flex-row items-center justify-between">
          <Text className="font-sans-bold text-xs text-ink">
            Biệt danh hiển thị <RequiredMark />
          </Text>
          <Text className="text-[10px] text-muted">Hiển thị với hàng xóm</Text>
        </View>
        <IconTextInput
          icon="pricetag"
          value={nickname}
          onChangeText={onNicknameChange}
          onBlur={onNicknameBlur}
          placeholder="Ví dụ: Quyết Keangnam,..."
          maxLength={40}
          invalid={nicknameInvalid}
        />
        {nicknameInvalid ? (
          <Text className="text-[11px] text-danger">Vui lòng nhập biệt danh hiển thị</Text>
        ) : null}
      </View>

      <View className="gap-1.5">
        <View className="flex-row items-center justify-between">
          <Text className="font-sans-bold text-xs text-ink">
            Ngày sinh <Text className="text-danger">*</Text>
          </Text>
          <Text className="font-mono text-[10px] text-muted">DD/MM/YYYY</Text>
        </View>
        <DateOfBirthFields value={dob} onChange={onDobChange} />
      </View>

      <View className="gap-1.5">
        <Text className="font-sans-bold text-xs text-ink">
          Giới tính <RequiredMark />
        </Text>
        <GenderSelector value={gender} onChange={onGenderChange} />
        {genderInvalid ? <Text className="text-[11px] text-danger">Vui lòng chọn giới tính</Text> : null}
      </View>

      <View className="gap-1.5">
        <View className="flex-row items-center justify-between">
          <Text className="font-sans-bold text-xs text-ink">
            Giới thiệu bản thân <RequiredMark />
          </Text>
          <Text className="text-[10px] text-muted">Tối đa 80 ký tự</Text>
        </View>
        <TextInput
          value={bio}
          onChangeText={onBioChange}
          onBlur={onBioBlur}
          placeholder="Thích tìm quán ăn ngon trưa & cafe thư giãn quanh toà nhà..."
          placeholderTextColor={colors.muted.light}
          maxLength={80}
          multiline
          numberOfLines={2}
          className={`rounded-xl border bg-cream-surface/40 px-3.5 py-2.5 text-xs font-sans-medium text-ink ${
            bioInvalid ? 'border-danger' : 'border-border'
          }`}
          style={{ textAlignVertical: 'top', minHeight: 52 }}
        />
        {bioInvalid ? (
          <Text className="text-[11px] text-danger">Vui lòng nhập giới thiệu bản thân</Text>
        ) : null}
      </View>
    </View>
  );
}
