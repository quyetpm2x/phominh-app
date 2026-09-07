import { useEffect, useRef, useState } from 'react';
import { Alert, Image, Platform, Pressable, ScrollView, Share, Text, View } from 'react-native';
import { Avatar } from '../../components/ui/Avatar';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { TextInput } from '../../components/ui/TextInput';
import type { FeedPost } from '../home/types';
import { SHARE_FRIENDS, SHARE_OPTIONS } from './data';

interface PostShareSheetProps {
  post: FeedPost | null;
  onClose: () => void;
  areaLabel?: string;
}

export function PostShareSheet({ post, onClose: dismiss, areaLabel }: PostShareSheetProps) {
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState('');
  const pendingShare = useRef<FeedPost | null>(null);
  const visible = post !== null;
  const onClose = () => {
    setSearching(false);
    setQuery('');
    setNotice('');
    dismiss();
  };
  const flushShare = () => {
    const selected = pendingShare.current;
    pendingShare.current = null;
    if (!selected) return;
    void Share.share({ message: `${selected.name}\n${selected.text.replace(/==/g, '')}` }).catch(() =>
      Alert.alert('Chưa chia sẻ được', 'Vui lòng thử lại.'),
    );
  };
  useEffect(() => {
    if (visible || Platform.OS === 'ios') return;
    const timer = setTimeout(flushShare, 350);
    return () => clearTimeout(timer);
  }, [visible]);
  const choose = (id: (typeof SHARE_OPTIONS)[number]['id']) => {
    if (id === 'link') {
      setNotice('Bài viết chưa có liên kết công khai để sao chép.');
    } else if (id === 'qr') {
      setNotice('Mã QR sẽ có khi bài viết được cấp liên kết chia sẻ.');
    } else if (post) {
      // Let the user choose an installed app after our modal has dismissed.
      pendingShare.current = post;
      onClose();
    }
  };
  const friends = SHARE_FRIENDS.filter((friend) =>
    friend.name.toLocaleLowerCase('vi').includes(query.trim().toLocaleLowerCase('vi')),
  );
  return (
    <BottomSheet visible={visible} onClose={onClose} onDismiss={flushShare} variant="actions">
      <ScrollView bounces={false} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center gap-2.5">
          <View className="h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <CustomIcon name="menuShare" size={16} color="#FF416C" />
          </View>
          <Text accessibilityRole="header" className="flex-1 font-sans-black text-base text-[#1A1A1A]">
            Chia sẻ bài viết
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Đóng chia sẻ"
            onPress={onClose}
            className="h-8 w-8 items-center justify-center rounded-full bg-[#F1F3F5]/60"
          >
            <CustomIcon name="menuClose" size={14} />
          </Pressable>
        </View>
        {post ? (
          <View className="mt-5 flex-row items-center gap-3 rounded-[17px] border border-[#E9ECEF]/60 bg-[#F1F3F5]/40 p-[13px]">
            <Avatar
              initial={post.name.charAt(0)}
              imageUrl={Image.resolveAssetSource(post.avatar).uri}
              size={36}
              radius={18}
            />
            <View className="flex-1">
              <Text numberOfLines={1} className="font-sans-bold text-[12.5px] leading-[19px] text-[#1A1A1A]">
                {post.name}: “{post.text.replace(/==/g, '')}”
              </Text>
              <View className="flex-row items-center gap-1">
                <CustomIcon name="feedLocation" size={12} color="#FF416C" />
                <Text numberOfLines={1} className="flex-1 font-sans text-[10.5px] leading-4 text-[#4A4A4A]">
                  {areaLabel || 'Khu vực của bạn'} • {post.distance}
                </Text>
              </View>
            </View>
          </View>
        ) : null}
        <Text className="mb-2 mt-5 font-sans-bold text-[11.5px] tracking-[0.575px] text-[#4A4A4A]">
          GỬI NHANH CHO BẠN BÈ
        </Text>
        {searching ? (
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Tìm bạn bè"
            accessibilityLabel="Tìm bạn bè"
            className="mb-3"
          />
        ) : null}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 16, padding: 2, paddingBottom: 4 }}
        >
          {friends.map((friend, index) => (
            <Pressable
              key={friend.name}
              accessibilityRole="button"
              accessibilityLabel={`Gửi cho ${friend.name}`}
              onPress={() =>
                setNotice('Danh sách bạn bè đang là dữ liệu mẫu. Chức năng gửi tin nhắn chưa được kết nối.')
              }
              className="w-14 items-center gap-1.5"
            >
              <View
                className="rounded-full border-2"
                style={{ borderColor: index === 0 ? '#FF416C' : '#E9ECEF' }}
              >
                <Avatar
                  initial={friend.name.charAt(0)}
                  imageUrl={Image.resolveAssetSource(friend.avatar).uri}
                  size={50}
                  radius={25}
                />
                {friend.online ? (
                  <View className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-[#00BC7D]" />
                ) : null}
              </View>
              <Text numberOfLines={1} className="font-sans-bold text-[11px] leading-[16.5px] text-[#1A1A1A]">
                {friend.name}
              </Text>
            </Pressable>
          ))}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Tìm kiếm bạn bè"
            onPress={() => setSearching((value) => !value)}
            className="w-14 items-center gap-1.5"
          >
            <View className="h-[52px] w-[52px] items-center justify-center rounded-full bg-[#F1F3F5]">
              <CustomIcon name="shareSearch" size={18} />
            </View>
            <Text className="font-sans-bold text-[11px] leading-[16.5px] text-[#4A4A4A]">Tìm kiếm</Text>
          </Pressable>
        </ScrollView>
        <View className="mt-5 border-t border-[#E9ECEF]/60 pt-1">
          <Text className="mb-3 font-sans-bold text-[11.5px] tracking-[0.575px] text-[#4A4A4A]">
            CHIA SẺ QUA
          </Text>
          <View className="flex-row gap-2.5">
            {SHARE_OPTIONS.map((option) => (
              <Pressable
                key={option.id}
                accessibilityRole="button"
                accessibilityLabel={option.label.replace('\n', ' ')}
                accessibilityHint={
                  option.id === 'messenger' || option.id === 'zalo'
                    ? 'Mở bảng chia sẻ của thiết bị để chọn ứng dụng'
                    : undefined
                }
                onPress={() => choose(option.id)}
                className="min-h-[103px] flex-1 items-center justify-center gap-1.5 rounded-[20px] bg-[#F1F3F5]/40 px-1 py-2.5"
              >
                <View
                  className="h-11 w-11 items-center justify-center rounded-xl"
                  style={{ backgroundColor: option.background }}
                >
                  <CustomIcon name={option.icon} size={20} />
                </View>
                <Text className="text-center font-sans-bold text-[11px] leading-[16.5px] text-[#1A1A1A]">
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
        {notice ? (
          <Text accessibilityLiveRegion="polite" className="mt-3 font-sans text-xs text-[#4A4A4A]">
            {notice}
          </Text>
        ) : null}
        <Pressable
          accessibilityRole="button"
          onPress={onClose}
          className="mt-5 h-11 items-center justify-center rounded-full bg-[#F1F3F5]/60"
        >
          <Text className="font-sans-black text-[13px] text-[#1A1A1A]">Đóng</Text>
        </Pressable>
      </ScrollView>
    </BottomSheet>
  );
}
