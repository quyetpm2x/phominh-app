import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { extractErrorMessage } from '../../src/api/client';
import { DateOfBirthFields } from '../../src/components/DateOfBirthFields';
import { GenderSelector, type Gender } from '../../src/components/GenderSelector';
import { Avatar } from '../../src/components/ui/Avatar';
import { TextInput } from '../../src/components/ui/TextInput';
import { useMe } from '../../src/hooks/useMe';
import { useUpdateProfile, useUploadAvatar } from '../../src/hooks/useUserProfile';
import { toIsoDate, type DateOfBirthParts } from '../../src/lib/dateOfBirth';
import { areas } from '../../src/mocks/phoMinh';

const EMPTY_DOB: DateOfBirthParts = { day: '', month: '', year: '' };

// on.editProfile — chỉnh sửa tên/ảnh/ngày sinh/giới tính (bắt buộc lúc onboarding, sửa lại được
// sau đó ở đây) + hai khu vực cố định.
export default function EditProfileScreen() {
  const { data: me } = useMe();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const [realName, setRealName] = useState('');
  const [dob, setDob] = useState<DateOfBirthParts>(EMPTY_DOB);
  const [gender, setGender] = useState<Gender | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!me) return;
    setRealName(me.realName ?? '');
    setGender(me.gender);
    if (me.dateOfBirth) {
      const [y, m, d] = me.dateOfBirth.split('-');
      setDob({ day: String(Number(d)), month: String(Number(m)), year: y });
    }
  }, [me]);

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

  const onSave = async () => {
    setError(null);
    const isoDate = toIsoDate(dob);
    try {
      await updateProfile.mutateAsync({
        realName: realName.trim(),
        dateOfBirth: isoDate ?? undefined,
        gender: gender ?? undefined,
      });
      router.back();
    } catch (err) {
      setError(await extractErrorMessage(err));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="h-[46px] flex-row items-center gap-1.5 px-3 border-b border-border bg-white">
        <Pressable onPress={() => router.back()} className="w-[34px] h-[34px] items-center justify-center">
          <Text className="text-[21px] text-ink">‹</Text>
        </Pressable>
        <Text className="font-sans-semibold text-sm text-ink">Chỉnh sửa hồ sơ</Text>
        <View className="flex-1" />
        <Pressable onPress={() => void onSave()} className="h-8 rounded-lg bg-ink px-3.5 items-center justify-center">
          <Text className="font-sans-semibold text-xs text-white">Lưu</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerClassName="p-4.5">
        {error ? <Text className="mb-2 text-xs text-danger">{error}</Text> : null}

        <View className="flex-row items-center gap-3.5">
          <Avatar
            initial={(me?.realName ?? me?.alias ?? '?').charAt(0).toUpperCase()}
            imageUrl={me?.avatarUrl}
            size={72}
            radius={22}
          />
          <Pressable
            onPress={() => void onPickAvatar()}
            disabled={uploadAvatar.isPending}
            className="h-[38px] rounded-[11px] border border-border bg-white px-3.5 items-center justify-center flex-row gap-2"
          >
            {uploadAvatar.isPending ? <ActivityIndicator size="small" /> : null}
            <Text className="font-sans-semibold text-[13px] text-ink">Đổi ảnh đại diện</Text>
          </Pressable>
        </View>

        <Text className="mt-5 font-mono-medium text-xs tracking-wide text-muted">HỌ VÀ TÊN</Text>
        <View className="mt-2 h-[50px] rounded-[13px] bg-white border-[1.5px] border-primary justify-center px-4">
          <TextInput
            value={realName}
            onChangeText={setRealName}
            placeholder={me?.alias ?? '...'}
            className="border-0 h-auto px-0 text-[15px] font-sans-medium"
          />
        </View>
        <Text className="mt-1.5 text-xs text-muted">
          Bắt buộc điền lúc đăng ký. Bí danh vẫn dùng khi bình luận — tên thật chỉ hiện khi bạn tự chọn cho một bài
          cụ thể.
        </Text>

        <Text className="mt-5 font-mono-medium text-xs tracking-wide text-muted">NGÀY SINH</Text>
        <View className="mt-2">
          <DateOfBirthFields value={dob} onChange={setDob} />
        </View>

        <Text className="mt-5 font-mono-medium text-xs tracking-wide text-muted">GIỚI TÍNH</Text>
        <View className="mt-2">
          <GenderSelector value={gender} onChange={setGender} />
        </View>

        <Text className="mt-5 font-mono-medium text-xs tracking-wide text-muted">HAI KHU VỰC CỐ ĐỊNH</Text>
        <View className="mt-2.5 gap-2.5">
          <AreaRow label={`Nhà · ${areas.home.place}`} dot={areas.home.color} />
          <AreaRow label={`Chỗ làm · ${areas.work.place}`} dot={areas.work.color} />
        </View>
        <Text className="mt-3 text-xs leading-[19px] text-muted">
          Chỉ được đổi khu vực 2 lần mỗi tháng — tránh việc nhảy khu liên tục để soi tin khắp nơi.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function AreaRow({ label, dot }: { label: string; dot: string }) {
  return (
    <Pressable
      onPress={() => router.push('/profile/areas')}
      className="rounded-[13px] border border-border bg-white px-3.5 py-3 flex-row items-center gap-2.5"
    >
      <View style={{ backgroundColor: dot }} className="w-2 h-2 rounded-full" />
      <View className="flex-1">
        <Text className="font-sans-semibold text-sm text-ink">{label}</Text>
        <Text className="text-[11.5px] text-muted mt-0.5">Đổi vị trí & bán kính</Text>
      </View>
      <Text className="text-muted-light">›</Text>
    </Pressable>
  );
}
