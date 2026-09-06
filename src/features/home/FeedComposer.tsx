import { Image, Pressable, Text, View } from 'react-native';
import { Avatar } from '../../components/ui/Avatar';
import { CustomIcon } from '../../components/ui/CustomIcon';
import type { PersonalProfile } from '../../lib/personalProfile';
import { PHOTOS } from './data';
interface Props {
  profile: PersonalProfile;
  onCompose: () => void;
}
export function FeedComposer({ profile, onCompose }: Props) {
  return (
    <View className="flex-row items-center gap-3 rounded-[20px] border border-border bg-white p-3.5">
      <View>
        <Avatar
          size={40}
          radius={20}
          initial={profile.fullName.charAt(0) || 'P'}
          imageUrl={profile.avatarUri ?? Image.resolveAssetSource(PHOTOS.me).uri}
        />
        <View className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 items-center justify-center rounded-full bg-primary">
          <Text className="font-sans-bold text-[9px] text-white">+</Text>
        </View>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Đăng tin mới"
        onPress={onCompose}
        className="min-h-11 flex-1 flex-row items-center justify-between gap-2 rounded-xl border border-border/60 bg-cream-surface/60 px-3 py-2"
      >
        <Text numberOfLines={1} className="flex-1 font-sans-medium text-[12px] text-[#4A4A4A]">
          Khu bạn có gì mới hôm nay?
        </Text>
        <View className="flex-row items-center gap-1">
          <CustomIcon name="feedCompose" size={14} />
          <Text className="font-sans-semibold text-[11px] text-primary">Đăng tin</Text>
        </View>
      </Pressable>
    </View>
  );
}
