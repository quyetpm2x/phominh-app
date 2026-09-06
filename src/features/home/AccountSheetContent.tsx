import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { TextInput } from '../../components/ui/TextInput';
import type { HomeFeedController } from './useHomeFeed';
type Props = Pick<
  HomeFeedController,
  'sheet' | 'profile' | 'loggingOut' | 'logout' | 'draft' | 'setDraft' | 'savingDraft' | 'saveDraft'
>;
export function AccountSheetContent({
  sheet,
  profile,
  loggingOut,
  logout,
  draft,
  setDraft,
  savingDraft,
  saveDraft,
}: Props) {
  return (
    <>
      {sheet === 'notifications' ? (
        <Text className="font-sans text-muted">
          Thông báo đang dùng dữ liệu minh hoạ. Chưa có thông báo mới từ hệ thống.
        </Text>
      ) : null}
      {sheet === 'profile' ? (
        <View className="gap-4">
          <View className="flex-row items-center gap-3">
            <Avatar
              size={56}
              radius={28}
              initial={profile.fullName.charAt(0) || 'P'}
              imageUrl={profile.avatarUri ?? undefined}
            />
            <View className="flex-1">
              <Text className="font-sans-bold text-lg text-ink">
                {profile.fullName || 'Thành viên Phố Mình'}
              </Text>
              <Text className="font-sans text-muted">{profile.nickname}</Text>
            </View>
          </View>
          {profile.bio ? <Text className="font-sans text-ink">{profile.bio}</Text> : null}
          <Button label="Đăng xuất" variant="outline" disabled={loggingOut} onPress={() => void logout()} />
        </View>
      ) : null}
      {sheet === 'compose' ? (
        <>
          <TextInput
            accessibilityLabel="Nội dung bài viết"
            placeholder="Khu bạn có gì mới hôm nay?"
            value={draft}
            onChangeText={setDraft}
            multiline
            maxLength={300}
            textAlignVertical="top"
            style={styles.draftInput}
          />
          <Text className="font-sans text-sm text-muted">
            Bạn có thể lưu bản nháp. Tính năng đăng bài sẽ được kết nối sau.
          </Text>
          <Button
            label="Lưu bản nháp"
            disabled={savingDraft || !draft.trim()}
            onPress={() => void saveDraft()}
          />
        </>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  draftInput: { height: 140, paddingTop: 12 },
});
