import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthDecorativeBlobs } from '../../src/components/ui/AuthDecorativeBlobs';
import { CustomIcon } from '../../src/components/ui/CustomIcon';
import { GradientPrimaryButton } from '../../src/components/ui/GradientPrimaryButton';
import { GradientText } from '../../src/components/ui/GradientText';
import { colors } from '../../src/constants/design-tokens';
import { type DevicePermission, useDevicePermissions } from '../../src/hooks/useDevicePermissions';

const PERMISSIONS = [
  {
    key: 'location',
    title: 'Vị trí hiện tại',
    description: 'Quét tin tức quanh Nhà & Chỗ làm',
    icon: 'permissionLocation',
    color: colors.primary.DEFAULT,
  },
  {
    key: 'notifications',
    title: 'Thông báo',
    description: 'Tin khẩn, sự cố mất điện, nước',
    icon: 'permissionNotification',
    color: colors.accent.DEFAULT,
  },
  {
    key: 'camera',
    title: 'Máy ảnh',
    description: 'Chụp nhanh ảnh xác thực hiện trường',
    icon: 'permissionCamera',
    color: colors.primary.DEFAULT,
  },
] as const;

export default function PermissionsScreen() {
  const { permissions, pending, request } = useDevicePermissions();
  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(auth)/welcome');
  };
  const onContinue = () => router.push('/(auth)/home-area');
  const buttonLabel = (key: DevicePermission) =>
    permissions[key]?.canAskAgain === false ? 'Cài đặt' : 'Cho phép';

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View pointerEvents="none" style={styles.mirroredBackground}>
        <AuthDecorativeBlobs />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center justify-between">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
            onPress={goBack}
            className="h-11 w-11 items-center justify-center rounded-2xl border border-border/80 bg-white shadow-sm active:scale-95"
          >
            <Ionicons name="arrow-back" size={20} color={colors.ink.DEFAULT} />
          </Pressable>
          <View className="overflow-hidden rounded-full border border-primary/15">
            <LinearGradient
              colors={['#FF416C1a', '#FF4B2B1a']}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 0 }}
              style={styles.badge}
            >
              <View className="h-1.5 w-1.5 rounded-full bg-primary/60" />
              <GradientText
                direction="vertical"
                colors={[colors.primary.DEFAULT, colors.accent.DEFAULT]}
                className="font-sans-bold text-[11.5px] tracking-[0.575px]"
              >
                CÀI ĐẶT THIẾT BỊ
              </GradientText>
            </LinearGradient>
          </View>
        </View>

        <View className="mt-6">
          <View className="self-start flex-row items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1">
            <CustomIcon name="permissionDevice" size={14} />
            <Text className="font-sans-bold text-xs text-primary">Quyền hệ điều hành</Text>
          </View>
          <View className="mt-3 flex-row flex-wrap items-baseline">
            <Text className="font-sans-black text-[28px] leading-[35px] tracking-[-0.7px] text-primary-darker">
              Cấp quyền{' '}
            </Text>
            <GradientText
              direction="vertical"
              colors={[colors.primary.DEFAULT, colors.accent.DEFAULT]}
              className="font-sans-black text-[28px] leading-[35px] tracking-[-0.7px]"
            >
              truy cập
            </GradientText>
          </View>
          <Text className="mt-2 font-sans-medium text-sm leading-[22.75px] text-[#4A4A4A]">
            Để dòng tin khu phố luôn chính xác và kịp thời, vui lòng cấp một số quyền cơ bản.
          </Text>
        </View>

        <View className="mt-6 gap-3.5">
          {PERMISSIONS.map((item) => {
            const granted = permissions[item.key]?.granted === true;
            const loading = pending === item.key;
            return (
              <View
                key={item.key}
                style={styles.card}
                className="flex-row items-center gap-3.5 rounded-[20px] border border-border/80 bg-white/85 p-4"
              >
                <LinearGradient
                  colors={[`${item.color}33`, `${item.color}0D`]}
                  style={[styles.icon, { borderColor: `${item.color}33` }]}
                >
                  <CustomIcon name={item.icon} size={24} />
                </LinearGradient>
                <View className="flex-1">
                  <Text className="font-sans-bold text-[14.5px] leading-[21.75px] text-primary-darker">
                    {item.title}
                  </Text>
                  <Text className="font-sans-medium text-[12.5px] leading-[18.75px] text-[#4A4A4A]">
                    {item.description}
                  </Text>
                </View>
                {granted ? (
                  <View
                    accessible
                    accessibilityLabel={`${item.title}: Đã cho phép`}
                    className="h-8 w-8 items-center justify-center rounded-[9px] bg-primary/10"
                  >
                    <CustomIcon name="otpCheck" size={16} color={colors.primary.DEFAULT} />
                  </View>
                ) : (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`${buttonLabel(item.key)}: ${item.title}`}
                    accessibilityState={{ disabled: pending !== null, busy: loading }}
                    disabled={pending !== null}
                    onPress={() => void request(item.key)}
                    hitSlop={5}
                    className="active:opacity-60"
                  >
                    {item.key === 'location' ? (
                      <LinearGradient
                        colors={[colors.primary.DEFAULT, colors.accent.DEFAULT]}
                        style={styles.allowPrimary}
                      >
                        {loading ? (
                          <ActivityIndicator size="small" color="white" />
                        ) : (
                          <Text className="font-sans-bold text-xs text-white">{buttonLabel(item.key)}</Text>
                        )}
                      </LinearGradient>
                    ) : (
                      <View style={styles.allowSecondary}>
                        {loading ? (
                          <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
                        ) : (
                          <Text className="font-sans-bold text-xs text-primary-darker">
                            {buttonLabel(item.key)}
                          </Text>
                        )}
                      </View>
                    )}
                  </Pressable>
                )}
              </View>
            );
          })}
          <View className="flex-row items-start gap-3 rounded-[20px] border border-border/80 bg-white/60 p-4">
            <LinearGradient colors={['#FF416C33', '#FF4B2B0D']} style={[styles.icon, styles.privacyIcon]}>
              <CustomIcon name="permissionShield" size={24} />
            </LinearGradient>
            <Text className="flex-1 font-sans-medium text-xs leading-[19.5px] text-[#4A4A4A]">
              Theo <Text className="font-sans-bold text-primary-darker">Nghị định 13/2023/NĐ-CP</Text>, vị trí
              là dữ liệu nhạy cảm. Phố Mình cam kết không bao giờ chia sẻ vị trí của bạn cho bất kỳ bên thứ 3
              nào.
            </Text>
          </View>
        </View>
        <View style={styles.spacer} />
        <View className="gap-3 pt-6">
          <Pressable
            accessibilityRole="button"
            onPress={onContinue}
            disabled={pending !== null}
            className="active:scale-[0.98]"
          >
            <GradientPrimaryButton>
              <Text className="font-sans-bold text-base tracking-wide text-white">Tiếp tục</Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </GradientPrimaryButton>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={onContinue}
            disabled={pending !== null}
            className="min-h-11 items-center justify-center active:opacity-60"
          >
            <Text className="font-sans-semibold text-[13px] text-[#4A4A4A]">
              Để sau, thiết lập trong Cài đặt
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 8, paddingBottom: 24 },
  mirroredBackground: { ...StyleSheet.absoluteFillObject, transform: [{ scaleX: -1 }] },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6 },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 13.5,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  privacyIcon: { borderColor: '#FF416C33' },
  allowPrimary: {
    minWidth: 86,
    height: 36,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary.DEFAULT,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  allowSecondary: {
    minWidth: 86,
    height: 36,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border.DEFAULT,
    backgroundColor: colors.cream.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer: { flexGrow: 1, minHeight: 30 },
});
