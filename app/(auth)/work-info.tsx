import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '../../src/components/ui/Avatar';
import { BottomSheet } from '../../src/components/ui/BottomSheet';
import { Button } from '../../src/components/ui/Button';
import { FilterChip } from '../../src/components/ui/Chip';
import { CustomIcon } from '../../src/components/ui/CustomIcon';
import { GradientSubmitButton } from '../../src/components/ui/GradientSubmitButton';
import { IconTextInput } from '../../src/components/ui/IconTextInput';
import { TextInput } from '../../src/components/ui/TextInput';
import { colors, fontFamily } from '../../src/constants/design-tokens';
import {
  EMPTY_PROFILE,
  PROFILE_STORAGE_KEY,
  PROFILE_BIO_MAX_LENGTH,
  formatBirthDate,
  parseBirthDate,
  restoreProfile,
  validateProfile,
  type PersonalProfile,
} from '../../src/lib/personalProfile';

const SAMPLE_AVATAR = Image.resolveAssetSource(
  require('../../assets/images/onboarding/profile-avatar.png'),
).uri;
const GENDERS = [
  { value: 'male', label: 'Nam', icon: 'profileMale' },
  { value: 'female', label: 'Nữ', icon: 'profileFemale' },
  { value: 'other', label: 'Khác', icon: 'profileOther' },
] as const;

function FieldLabel({ label, required, hint }: { label: string; required?: boolean; hint?: string }) {
  return (
    <View className="flex-row flex-wrap items-center justify-between gap-1">
      <Text className="font-sans-bold text-xs leading-4 text-primary-darker">
        {label}
        {required ? <Text className="text-danger"> *</Text> : null}
      </Text>
      {hint ? <Text className="font-sans text-[10px] text-[#4A4A4A]">{hint}</Text> : null}
    </View>
  );
}

export default function WorkInfoScreen() {
  const [profile, setProfile] = useState<PersonalProfile>({ ...EMPTY_PROFILE });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [picking, setPicking] = useState(false);
  const [errors, setErrors] = useState<ReturnType<typeof validateProfile>>({});
  const [avatarSheet, setAvatarSheet] = useState(false);
  const [dateVisible, setDateVisible] = useState(false);
  const [dateDraft, setDateDraft] = useState(new Date(2000, 0, 1));
  const busy = useRef(false);
  const pendingPhoto = useRef<boolean | null>(null);
  const scroll = useRef<ScrollView>(null);

  useEffect(() => {
    let active = true;
    SecureStore.getItemAsync(PROFILE_STORAGE_KEY)
      .then((raw) => {
        if (active) setProfile(restoreProfile(raw));
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  const update = <K extends keyof PersonalProfile>(key: K, value: PersonalProfile[K]) => {
    setProfile((previous) => ({ ...previous, [key]: value }));
    if (key === 'fullName' || key === 'birthDate')
      setErrors((previous) => ({ ...previous, [key]: undefined }));
  };
  const choosePhoto = async (camera: boolean) => {
    if (busy.current) return;
    busy.current = true;
    setPicking(true);
    setAvatarSheet(false);
    try {
      if (camera) {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          Alert.alert(
            'Chưa có quyền máy ảnh',
            'Bạn có thể chọn ảnh từ thư viện hoặc bật quyền máy ảnh trong Cài đặt.',
            [
              { text: 'Đóng', style: 'cancel' },
              {
                text: 'Cài đặt',
                onPress: () => {
                  void Linking.openSettings().catch(() =>
                    Alert.alert('Không mở được Cài đặt', 'Vui lòng mở Cài đặt của thiết bị.'),
                  );
                },
              },
            ],
          );
          return;
        }
      }
      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      };
      const result = camera
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);
      if (!result.canceled && result.assets[0]) update('avatarUri', result.assets[0].uri);
    } catch {
      Alert.alert('Không mở được ảnh', 'Vui lòng thử lại hoặc chọn ảnh khác.');
    } finally {
      busy.current = false;
      setPicking(false);
    }
  };
  const openPhoto = (camera: boolean) => {
    // iOS must dismiss the sheet before presenting its native photo picker.
    if (Platform.OS === 'ios') {
      pendingPhoto.current = camera;
      setAvatarSheet(false);
    } else {
      void choosePhoto(camera);
    }
  };
  const onAvatarDismiss = () => {
    if (pendingPhoto.current === null) return;
    const camera = pendingPhoto.current;
    pendingPhoto.current = null;
    void choosePhoto(camera);
  };
  const openDate = () => {
    Keyboard.dismiss();
    setDateDraft(parseBirthDate(profile.birthDate) ?? new Date(2000, 0, 1));
    setDateVisible(true);
  };
  const onSubmit = async () => {
    if (busy.current || loading) return;
    const nextErrors = validateProfile(profile);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      scroll.current?.scrollTo({ y: 145, animated: true });
      return;
    }
    busy.current = true;
    setSaving(true);
    Keyboard.dismiss();
    try {
      await SecureStore.setItemAsync(
        PROFILE_STORAGE_KEY,
        JSON.stringify({
          ...profile,
          fullName: profile.fullName.trim(),
          nickname: profile.nickname.trim(),
          bio: profile.bio.trim(),
        }),
      );
      router.push('/(auth)/onboarding-complete');
    } catch {
      Alert.alert('Chưa lưu được thông tin', 'Vui lòng thử lại.');
    } finally {
      busy.current = false;
      setSaving(false);
    }
  };
  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(auth)/home-area');
  };
  const datePicker = (
    <DateTimePicker
      value={dateDraft}
      mode="date"
      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
      maximumDate={new Date()}
      minimumDate={new Date(1900, 0, 1)}
      locale="vi-VN"
      onChange={(event, date) => {
        if (Platform.OS === 'android') {
          setDateVisible(false);
          if (event.type === 'set' && date) update('birthDate', formatBirthDate(date));
        } else if (date) setDateDraft(date);
      }}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-row items-center gap-3 border-b border-border/60 px-5 pb-4 pt-2">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Quay lại chọn khu vực"
          onPress={goBack}
          className="h-10 w-10 items-center justify-center rounded-xl border border-border bg-white active:opacity-60"
        >
          <Ionicons name="chevron-back" size={20} color={colors.ink.DEFAULT} />
        </Pressable>
        <View>
          <Text
            accessibilityRole="header"
            className="font-sans-black text-lg leading-7 tracking-[-0.45px] text-primary-darker"
          >
            Thông tin cá nhân
          </Text>
          <Text className="font-sans-medium text-[11px] leading-[16.5px] text-[#4A4A4A]">
            Bước 2/2: Thiết lập hồ sơ của bạn
          </Text>
        </View>
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView
          ref={scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center">
            <View style={styles.avatarFrame}>
              <Avatar
                initial={profile.fullName.trim().charAt(0) || 'P'}
                size={92}
                radius={25}
                imageUrl={profile.avatarUri ?? SAMPLE_AVATAR}
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Đổi ảnh đại diện"
                disabled={loading || picking || saving}
                onPress={() => {
                  Keyboard.dismiss();
                  setAvatarSheet(true);
                }}
                style={styles.cameraButton}
              >
                <LinearGradient
                  colors={[colors.primary.DEFAULT, colors.accent.DEFAULT]}
                  style={styles.cameraFill}
                >
                  {picking ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <CustomIcon name="permissionCamera" size={14} color="white" />
                  )}
                </LinearGradient>
              </Pressable>
            </View>
            <Text className="mt-2 font-sans-bold text-xs text-primary-darker">Ảnh đại diện</Text>
            <Text className="mt-0.5 font-sans text-[11px] text-[#4A4A4A]">
              Chạm vào máy ảnh để đổi ảnh đại diện
            </Text>
          </View>
          <View className="gap-4 rounded-[31px] border border-border bg-white p-5" style={styles.card}>
            <View className="gap-1.5">
              <FieldLabel label="Họ và tên" required />
              <IconTextInput
                icon="person"
                iconNode={<CustomIcon name="profileUser" size={14} />}
                accessibilityLabel="Họ và tên, bắt buộc"
                placeholder="Nhập họ và tên..."
                placeholderTextColor="#1A1A1A"
                style={styles.input}
                value={profile.fullName}
                onChangeText={(text) => update('fullName', text)}
                maxLength={100}
                autoCapitalize="words"
                autoComplete="name"
                editable={!loading && !saving}
                invalid={Boolean(errors.fullName)}
              />
              {errors.fullName ? (
                <Text accessibilityLiveRegion="polite" className="font-sans text-xs text-danger">
                  {errors.fullName}
                </Text>
              ) : null}
            </View>
            <View className="gap-1.5">
              <FieldLabel label="Biệt danh hiển thị" hint="Hiển thị với hàng xóm" />
              <IconTextInput
                icon="pricetag"
                iconNode={<CustomIcon name="profileNickname" size={16} />}
                accessibilityLabel="Biệt danh hiển thị"
                placeholder="Ví dụ: Quyết Keangnam,..."
                placeholderTextColor="#1A1A1A"
                style={styles.input}
                value={profile.nickname}
                onChangeText={(text) => update('nickname', text)}
                maxLength={50}
                editable={!loading && !saving}
              />
            </View>
            <View className="gap-1.5">
              <FieldLabel label="Ngày sinh" required hint="DD/MM/YYYY" />
              {Platform.OS === 'web' ? (
                <IconTextInput
                  icon="calendar"
                  iconNode={<CustomIcon name="profileCalendar" size={14} />}
                  accessibilityLabel="Ngày sinh, ngày/tháng/năm"
                  placeholder="DD/MM/YYYY"
                  style={styles.input}
                  value={profile.birthDate}
                  onChangeText={(text) => update('birthDate', text)}
                  maxLength={10}
                  invalid={Boolean(errors.birthDate)}
                />
              ) : (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Ngày sinh: ${profile.birthDate || 'Chưa chọn'}`}
                  onPress={openDate}
                  disabled={loading || saving}
                >
                  <View pointerEvents="none">
                    <IconTextInput
                      icon="calendar"
                      iconNode={<CustomIcon name="profileCalendar" size={14} />}
                      placeholder="DD/MM/YYYY"
                      placeholderTextColor="#1A1A1A"
                      style={styles.input}
                      value={profile.birthDate}
                      editable={false}
                      invalid={Boolean(errors.birthDate)}
                    />
                  </View>
                </Pressable>
              )}
              {errors.birthDate ? (
                <Text accessibilityLiveRegion="polite" className="font-sans text-xs text-danger">
                  {errors.birthDate}
                </Text>
              ) : null}
            </View>
            <View className="gap-1.5">
              <FieldLabel label="Giới tính" />
              <View className="flex-row gap-2">
                {GENDERS.map((gender) => (
                  <FilterChip
                    key={gender.value}
                    label={gender.label}
                    selected={profile.gender === gender.value}
                    icon={
                      <CustomIcon
                        name={gender.icon}
                        size={14}
                        color={profile.gender === gender.value ? colors.primary.DEFAULT : '#4A4A4A'}
                      />
                    }
                    accessibilityRole="radio"
                    accessibilityState={{ checked: profile.gender === gender.value }}
                    disabled={loading || saving}
                    onPress={() => update('gender', gender.value)}
                    style={styles.gender}
                  />
                ))}
              </View>
            </View>
            <View className="gap-1.5">
              <FieldLabel label="Giới thiệu bản thân" hint={`Tối đa ${PROFILE_BIO_MAX_LENGTH} ký tự`} />
              <TextInput
                accessibilityLabel={`Giới thiệu bản thân, tối đa ${PROFILE_BIO_MAX_LENGTH} ký tự`}
                multiline
                maxLength={PROFILE_BIO_MAX_LENGTH}
                value={profile.bio}
                onChangeText={(text) => update('bio', text)}
                placeholder="Thích tìm quán ăn ngon trưa & cafe thư giãn quanh tòa nhà..."
                placeholderTextColor="#1A1A1A"
                style={styles.bio}
                editable={!loading && !saving}
              />
            </View>
          </View>
          <View className="gap-2">
            <GradientSubmitButton
              compact
              label="Hoàn tất & Bắt đầu khám phá"
              disabled={loading || picking}
              loading={saving}
              onPress={onSubmit}
            />
            <Text className="text-center font-sans-medium text-[11px] leading-[16.5px] text-[#4A4A4A]">
              Bạn có thể thay đổi thông tin cá nhân bất cứ lúc nào trong mục Tôi.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <BottomSheet visible={avatarSheet} onClose={() => setAvatarSheet(false)} onDismiss={onAvatarDismiss}>
        <View className="gap-3">
          <Text className="font-sans-bold text-base text-ink">Đổi ảnh đại diện</Text>
          <Button label="Chọn từ thư viện" onPress={() => openPhoto(false)} />
          <Button label="Chụp ảnh mới" variant="secondary" onPress={() => openPhoto(true)} />
          <Button label="Huỷ" variant="outline" onPress={() => setAvatarSheet(false)} />
        </View>
      </BottomSheet>
      {Platform.OS === 'ios' ? (
        <BottomSheet visible={dateVisible} onClose={() => setDateVisible(false)}>
          <Text className="font-sans-bold text-base text-ink">Chọn ngày sinh</Text>
          {datePicker}
          <Button
            label="Xong"
            onPress={() => {
              update('birthDate', formatBirthDate(dateDraft));
              setDateVisible(false);
            }}
          />
        </BottomSheet>
      ) : dateVisible && Platform.OS === 'android' ? (
        datePicker
      ) : null}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 20, paddingBottom: 28, gap: 20 },
  avatarFrame: {
    width: 96,
    height: 96,
    padding: 2,
    borderRadius: 27,
    backgroundColor: '#FF416C4D',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  cameraButton: { position: 'absolute', right: -4, bottom: -4, width: 32, height: 32 },
  cameraFill: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 9 },
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 0,
    elevation: 1,
  },
  input: {
    height: 46,
    borderRadius: 13,
    backgroundColor: '#FFFFFF66',
    fontFamily: fontFamily['sans-semibold'],
    color: '#1A1A1A',
  },
  gender: { flex: 1, height: 38, borderRadius: 11, paddingHorizontal: 8, paddingVertical: 0 },
  bio: {
    height: 54,
    borderRadius: 14,
    borderColor: colors.border.DEFAULT,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontFamily: fontFamily['sans-medium'],
    fontSize: 12,
    lineHeight: 16,
    textAlignVertical: 'top',
    color: '#1A1A1A',
  },
});
