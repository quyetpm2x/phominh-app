import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/design-tokens';
import type { PersonalProfile } from '../../lib/personalProfile';
import { PHOTOS } from '../home/data';
import { SHOP } from './data';
import { ShopActionButton } from './ShopActionButton';
import { ShopRegistrationBanner } from './ShopRegistrationBanner';

export function ShopHeader({
  showPosts,
  onSelect,
  profile,
  showRegistrationBanner = true,
}: {
  showPosts: boolean;
  onSelect: (posts: boolean) => void;
  profile: PersonalProfile;
  showRegistrationBanner?: boolean;
}) {
  const registered = profile.isShopRegistered === true;
  const name = profile.fullName.trim() || SHOP.name;
  return (
    <View className="gap-5 border-b border-[#E9ECEF] bg-white px-4 pb-3 pt-4">
      <View className="flex-row items-center justify-between gap-3">
        <View className="flex-1 gap-1">
          <Text accessibilityRole="header" className="font-sans-black text-[23px] leading-8 text-[#1A1A1A]">
            {name}
          </Text>
          <View className="flex-row flex-wrap items-center gap-2">
            <Text className="rounded-md bg-primary/10 px-1.5 py-0.5 font-sans-black text-[11px] text-primary">
              {registered ? 'CHỦ QUÁN' : 'TÀI KHOẢN CÁ NHÂN'}
            </Text>
            <View className="flex-row items-center gap-1">
              <Ionicons name="star" size={12} color={colors.accent.DEFAULT} />
              <Text className="font-sans-bold text-xs text-[#1A1A1A]">{SHOP.reputation} điểm uy tín</Text>
            </View>
          </View>
        </View>
        <View className="h-[52px] w-[52px] overflow-hidden rounded-[17px] border border-primary/20 bg-white p-0.5">
          <View className="flex-1 overflow-hidden rounded-[14px]">
            <Image
              source={profile.avatarUri ? { uri: profile.avatarUri } : registered ? SHOP.avatar : PHOTOS.me}
              accessibilityLabel={`Ảnh ${name}`}
              style={registered && !profile.avatarUri ? styles.avatar : styles.personalAvatar}
            />
          </View>
        </View>
      </View>
      {registered ? (
        <View className="flex-row gap-2">
          <ShopActionButton
            label="Bài viết của tôi"
            icon="newspaper-outline"
            tone={showPosts ? 'gradient' : 'neutral'}
            onPress={() => onSelect(true)}
          />
          <ShopActionButton
            label="Thống kê cho quán"
            icon="bar-chart"
            tone={showPosts ? 'neutral' : 'gradient'}
            onPress={() => onSelect(false)}
          />
        </View>
      ) : showRegistrationBanner ? (
        <ShopRegistrationBanner />
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  avatar: { width: '100%', height: '100%', transform: [{ scale: 1.49 }] },
  personalAvatar: { width: '100%', height: '100%' },
});
