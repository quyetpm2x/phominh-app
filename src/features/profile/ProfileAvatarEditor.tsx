import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Avatar } from '../../components/ui/Avatar';
import { CustomIcon } from '../../components/ui/CustomIcon';
import type { PersonalProfile } from '../../lib/personalProfile';

export function ProfileAvatarEditor({
  profile,
  onPress,
  disabled,
  picking,
}: {
  profile: PersonalProfile;
  onPress: () => void;
  disabled: boolean;
  picking: boolean;
}) {
  return (
    <View className="items-center rounded-[31px] border border-[#E9ECEF]/70 bg-white px-5 py-5">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Đổi ảnh đại diện"
        disabled={disabled}
        onPress={onPress}
      >
        <LinearGradient colors={['#FF416C', '#FF4B2B']} style={styles.frame}>
          <Avatar
            initial={profile.fullName.charAt(0) || 'P'}
            imageUrl={profile.avatarUri}
            size={88}
            radius={44}
          />
        </LinearGradient>
        <View className="absolute bottom-0 right-0 h-8 w-8 items-center justify-center rounded-full bg-[#1A1A1A]">
          {picking ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <CustomIcon name="meCamera" size={14} color="white" />
          )}
        </View>
      </Pressable>
      <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} className="mt-3">
        <Text className="font-sans-black text-[13px] text-primary">Đổi ảnh đại diện</Text>
      </Pressable>
      <Text className="mt-1 text-center font-sans text-[11px] text-[#4A4A4A]">
        Khuyên dùng ảnh đại diện rõ mặt để tăng độ tin cậy
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  frame: {
    padding: 4,
    borderRadius: 48,
    shadowColor: '#FF416C',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
  },
});
