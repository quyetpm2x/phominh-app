import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Keyboard, Pressable, ScrollView, Text, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { extractErrorMessage } from '../../src/api/client';
import { colors } from '../../src/constants/design-tokens';
import { type Gender } from '../../src/components/GenderSelector';
import { PersonalInfoFields } from '../../src/components/PersonalInfoFields';
import { Avatar } from '../../src/components/ui/Avatar';
import { GradientSubmitButton } from '../../src/components/ui/GradientSubmitButton';
import { useMe } from '../../src/hooks/useMe';
import { useUpdateProfile, useUploadAvatar } from '../../src/hooks/useUserProfile';
import { toIsoDate, type DateOfBirthParts } from '../../src/lib/dateOfBirth';
import { sanitizeSpacing } from '../../src/lib/sanitizeSpacing';

const EMPTY_DOB: DateOfBirthParts = { day: '', month: '', year: '' };

// on.personalInfo — bắt buộc điền đủ họ tên/ảnh/ngày sinh/giới tính trước khi vào feed (bổ sung
// ngoài 117 mục gốc, quyết định 2026-08-20). Cuối chuỗi onboarding (sau area-work, trước done) —
// cũng là nơi app/index.tsx đẩy user CŨ (chưa từng điền) tới mỗi lần mở app cho tới khi điền xong,
// xem isProfileComplete() ở src/lib/profileCompleteness.ts.
//
// Giao diện làm lại theo mockup 2026-08-25. "Biệt danh hiển thị"/"Giới thiệu bản thân" ban đầu
// KHÔNG đưa vào vì backend chưa hỗ trợ — đã bổ sung thêm field `nickname`/`bio` (migration
// 20260825000000_user_nickname_bio, CHƯA chạy migrate, đúng quy ước dự án) TÁCH BIỆT hoàn toàn với
// `alias` (bí danh tự sinh, cố định vĩnh viễn, bussiness §4.3 — KHÔNG đổi quy tắc đó, đã xác nhận
// với người dùng). ĐÍNH CHÍNH (cùng ngày): cả 5 field (kể cả nickname/bio/gender, ban đầu optional)
// giờ đều BẮT BUỘC điền để submit onboarding, theo yêu cầu rõ ràng sau đó — vẫn optional ở tầng DTO
// backend (UpdateProfileDto) vì DTO dùng chung cho cả patch từng phần ở profile/edit.tsx.
export default function PersonalInfoScreen() {
  const { data: me } = useMe();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();

  const [realName, setRealName] = useState('');
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [dob, setDob] = useState<DateOfBirthParts>(EMPTY_DOB);
  const [gender, setGender] = useState<Gender | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [realNameTouched, setRealNameTouched] = useState(false);
  const [nicknameTouched, setNicknameTouched] = useState(false);
  const [bioTouched, setBioTouched] = useState(false);
  // Chip giới tính không có sự kiện blur — chỉ báo "Không hợp lệ" sau khi user đã bấm thử submit
  // với field còn trống (không có cách "rời khỏi" 1 nhóm chip như input văn bản).
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Chỉ hiện "Không hợp lệ" sau khi user đã rời khỏi field (touched) hoặc đã bấm thử submit —
  // tránh báo lỗi ngay khi vừa vào màn, trước khi user kịp gõ gì.
  const realNameInvalid = (realNameTouched || submitAttempted) && realName.trim().length === 0;
  const nicknameInvalid = (nicknameTouched || submitAttempted) && nickname.trim().length === 0;
  const bioInvalid = (bioTouched || submitAttempted) && bio.trim().length === 0;
  const genderInvalid = submitAttempted && !gender;

  // Prefill cho user đã điền một phần trước đó (vd realName qua màn chỉnh sửa hồ sơ cũ).
  useEffect(() => {
    if (!me) return;
    setRealName((prev) => prev || me.realName || '');
    setNickname((prev) => prev || me.nickname || '');
    setBio((prev) => prev || me.bio || '');
    setGender((prev) => prev ?? me.gender);
    if (me.dateOfBirth) {
      const [y, m, d] = me.dateOfBirth.split('-');
      setDob({ day: String(Number(d)), month: String(Number(m)), year: y });
    }
  }, [me]);

  const isoDate = toIsoDate(dob);
  const canSubmit =
    realName.trim().length > 0 &&
    nickname.trim().length > 0 &&
    bio.trim().length > 0 &&
    !!isoDate &&
    !!gender &&
    !!me?.avatarUrl;

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
    if (!canSubmit || updateProfile.isPending || !isoDate || !gender) {
      setSubmitAttempted(true);
      return;
    }
    setError(null);
    try {
      await updateProfile.mutateAsync({
        realName: realName.trim(),
        dateOfBirth: isoDate,
        gender,
        nickname: nickname.trim(),
        bio: bio.trim(),
      });
      router.push('/(auth)/done');
    } catch (err) {
      setError(await extractErrorMessage(err));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      {/* Header: mockup có "sticky top-0 backdrop-blur-md" khi cuộn — RN không có position:sticky
          trong ScrollView, nên đặt header NGOÀI ScrollView (đứng yên tự nhiên) thay vì cố mô
          phỏng sticky-khi-cuộn. */}
      <View className="flex-row items-center gap-3 border-b border-border/60 px-5 pb-4 pt-2">
        <Pressable
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-xl border border-border bg-white active:scale-95"
        >
          <Ionicons name="chevron-back" size={20} color={colors.ink.DEFAULT} />
        </Pressable>
        <View>
          <Text className="font-sans-black text-lg tracking-tight text-ink">Thông tin cá nhân</Text>
          <Text className="text-[11px] font-sans-medium text-muted">Bước 2/2: Thiết lập hồ sơ của bạn</Text>
        </View>
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="flex-1">
          <ScrollView contentContainerClassName="flex-1 px-5 pt-5 pb-6" keyboardShouldPersistTaps="handled">
            <View className="items-center pb-1 pt-1">
              <Pressable onPress={() => void onPickAvatar()} disabled={uploadAvatar.isPending} className="relative">
                <View className="rounded-3xl border-2 border-primary/30 bg-white p-1 shadow-sm">
                  <Avatar
                    initial={(realName || me?.alias || '?').charAt(0).toUpperCase()}
                    imageUrl={me?.avatarUrl}
                    size={88}
                    radius={20}
                  />
                </View>
                <View className="absolute -bottom-1 -right-1 h-8 w-8 items-center justify-center rounded-xl overflow-hidden shadow-sm">
                  <LinearGradient
                    colors={[colors.primary.DEFAULT, colors.accent.DEFAULT]}
                    style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {uploadAvatar.isPending ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Ionicons name="camera" size={14} color="#fff" />
                    )}
                  </LinearGradient>
                </View>
              </Pressable>
              <Text className="mt-2 text-xs font-sans-bold text-ink">Ảnh đại diện</Text>
              <Text className="text-[11px] text-muted">Chạm vào máy ảnh để đổi ảnh đại diện</Text>
            </View>

            <PersonalInfoFields
              realName={realName}
              onRealNameChange={(value) => setRealName(sanitizeSpacing(value))}
              onRealNameBlur={() => {
                setRealName((prev) => prev.trim());
                setRealNameTouched(true);
              }}
              realNameInvalid={realNameInvalid}
              nickname={nickname}
              onNicknameChange={(value) => setNickname(sanitizeSpacing(value))}
              onNicknameBlur={() => {
                setNickname((prev) => prev.trim());
                setNicknameTouched(true);
              }}
              nicknameInvalid={nicknameInvalid}
              dob={dob}
              onDobChange={setDob}
              gender={gender}
              onGenderChange={setGender}
              genderInvalid={genderInvalid}
              bio={bio}
              onBioChange={setBio}
              onBioBlur={() => setBioTouched(true)}
              bioInvalid={bioInvalid}
            />

            {error ? <Text className="mt-3 text-xs text-danger">{error}</Text> : null}

            <View className="flex-1" />
            <View className="pt-5">
              <GradientSubmitButton
                label="Hoàn tất & Bắt đầu khám phá"
                disabled={!canSubmit}
                loading={updateProfile.isPending}
                onPress={() => void onContinue()}
              />
              <Text className="mt-2 text-center text-[11px] text-muted">
                Bạn có thể thay đổi thông tin cá nhân bất cứ lúc nào trong mục Tôi.
              </Text>
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
