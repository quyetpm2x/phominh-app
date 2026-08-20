import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { extractErrorMessage } from '../../src/api/client';
import { DateOfBirthFields } from '../../src/components/DateOfBirthFields';
import { GenderSelector, type Gender } from '../../src/components/GenderSelector';
import { Avatar } from '../../src/components/ui/Avatar';
import { GradientButton } from '../../src/components/ui/Button';
import { TextInput } from '../../src/components/ui/TextInput';
import { useMe } from '../../src/hooks/useMe';
import { useUpdateProfile, useUploadAvatar } from '../../src/hooks/useUserProfile';
import { toIsoDate, type DateOfBirthParts } from '../../src/lib/dateOfBirth';

const EMPTY_DOB: DateOfBirthParts = { day: '', month: '', year: '' };

// on.personalInfo — bắt buộc điền đủ họ tên/ảnh/ngày sinh/giới tính trước khi vào feed (bổ sung
// ngoài 117 mục gốc, quyết định 2026-08-20). Cuối chuỗi onboarding (sau area-work, trước done) —
// cũng là nơi app/index.tsx đẩy user CŨ (chưa từng điền) tới mỗi lần mở app cho tới khi điền xong,
// xem isProfileComplete() ở src/lib/profileCompleteness.ts.
export default function PersonalInfoScreen() {
  const { data: me } = useMe();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();

  const [realName, setRealName] = useState('');
  const [dob, setDob] = useState<DateOfBirthParts>(EMPTY_DOB);
  const [gender, setGender] = useState<Gender | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Prefill cho user đã điền một phần trước đó (vd realName qua màn chỉnh sửa hồ sơ cũ).
  useEffect(() => {
    if (!me) return;
    setRealName((prev) => prev || me.realName || '');
    setGender((prev) => prev ?? me.gender);
    if (me.dateOfBirth) {
      const [y, m, d] = me.dateOfBirth.split('-');
      setDob({ day: String(Number(d)), month: String(Number(m)), year: y });
    }
  }, [me]);

  const isoDate = toIsoDate(dob);
  const canSubmit = realName.trim().length > 0 && !!isoDate && !!gender && !!me?.avatarUrl;

  const onPickAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (result.canceled || !result.assets[0]) return;
    try {
      await uploadAvatar.mutateAsync(result.assets[0].uri);
    } catch (err) {
      setError(await extractErrorMessage(err));
    }
  };

  const onContinue = async () => {
    if (!canSubmit || updateProfile.isPending || !isoDate || !gender) return;
    setError(null);
    try {
      await updateProfile.mutateAsync({ realName: realName.trim(), dateOfBirth: isoDate, gender });
      router.push('/(auth)/done');
    } catch (err) {
      setError(await extractErrorMessage(err));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView contentContainerClassName="flex-1 px-6 pt-3.5 pb-6" keyboardShouldPersistTaps="handled">
        <Text className="text-[26px] font-sans-bold tracking-tight text-ink">Thông tin cá nhân</Text>
        <Text className="mt-2 text-sm leading-[22px] text-muted">
          Cần thêm vài thông tin trước khi vào xóm — bí danh của bạn vẫn giữ nguyên, tên thật chỉ hiện khi bạn tự
          chọn hiện cho một bài cụ thể.
        </Text>

        <View className="mt-5 items-center">
          <Pressable onPress={() => void onPickAvatar()} disabled={uploadAvatar.isPending} className="relative">
            <Avatar
              initial={(realName || me?.alias || '?').charAt(0).toUpperCase()}
              imageUrl={me?.avatarUrl}
              size={88}
              radius={26}
            />
            <View className="absolute bottom-0 right-0 h-7 w-7 items-center justify-center rounded-full border-2 border-cream bg-ink">
              {uploadAvatar.isPending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className="text-xs text-white">+</Text>
              )}
            </View>
          </Pressable>
          <Text className="mt-2 text-xs text-muted">Ảnh đại diện *</Text>
        </View>

        <Text className="mt-5 font-mono-medium text-xs tracking-wide text-muted">HỌ VÀ TÊN *</Text>
        <View className="mt-2">
          <TextInput value={realName} onChangeText={setRealName} placeholder="Nguyễn Văn A" />
        </View>

        <Text className="mt-5 font-mono-medium text-xs tracking-wide text-muted">NGÀY SINH *</Text>
        <View className="mt-2">
          <DateOfBirthFields value={dob} onChange={setDob} />
        </View>

        <Text className="mt-5 font-mono-medium text-xs tracking-wide text-muted">GIỚI TÍNH *</Text>
        <View className="mt-2">
          <GenderSelector value={gender} onChange={setGender} />
        </View>

        {error ? <Text className="mt-3 text-xs text-danger">{error}</Text> : null}

        <View className="flex-1" />
        <View className="pt-5">
          {updateProfile.isPending ? (
            <View className="h-[54px] items-center justify-center">
              <ActivityIndicator />
            </View>
          ) : (
            <GradientButton label="Tiếp tục" onPress={() => void onContinue()} disabled={!canSubmit} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
