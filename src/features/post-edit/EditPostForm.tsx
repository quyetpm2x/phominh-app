import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  BackHandler,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { GradientButton } from '../../components/ui/Button';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { TextInput } from '../../components/ui/TextInput';
import { usePostInteractions } from '../home/postInteractions';
import type { FeedPost } from '../home/types';
import { EditDisplaySettings } from './EditDisplaySettings';
import { LockedPostPhotos } from './LockedPostPhotos';
import { isValidPostEdit, MAX_POST_LENGTH, type PostEdit } from './postEdit';

export function EditPostForm({ post }: { post: FeedPost }) {
  const [initial] = useState<PostEdit>(() => ({
    text: post.text.replace(/==/g, ''),
    commentsEnabled: post.commentsEnabled ?? true,
    notifyReplies: post.notifyReplies ?? true,
  }));
  const [draft, setDraft] = useState(initial);
  const dirty =
    draft.text !== initial.text ||
    draft.commentsEnabled !== initial.commentsEnabled ||
    draft.notifyReplies !== initial.notifyReplies;
  const leave = useCallback(
    () =>
      router.canGoBack()
        ? router.back()
        : router.replace({ pathname: '/post/[id]', params: { id: post.id } }),
    [post.id],
  );
  const back = useCallback(() => {
    if (!dirty) {
      leave();
      return;
    }
    Alert.alert('Bỏ thay đổi?', 'Nội dung bạn chỉnh sửa chưa được lưu.', [
      { text: 'Tiếp tục sửa', style: 'cancel' },
      { text: 'Bỏ thay đổi', style: 'destructive', onPress: leave },
    ]);
  }, [dirty, leave]);
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      back();
      return true;
    });
    return () => subscription.remove();
  }, [back]);
  const save = () => {
    if (!dirty || !isValidPostEdit(draft)) return;
    if (usePostInteractions.getState().savePostEdit(post.id, draft)) {
      Keyboard.dismiss();
      leave();
    }
  };
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
      <View className="flex-row items-center gap-2.5 border-b border-[#E9ECEF]/80 bg-white px-4 py-4">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
          onPress={back}
          className="h-9 w-9 items-center justify-center rounded-full bg-[#F1F3F5]/60"
        >
          <CustomIcon name="statsBack" size={16} />
        </Pressable>
        <Text accessibilityRole="header" className="flex-1 font-sans-black text-base text-[#1A1A1A]">
          Chỉnh sửa nội dung
        </Text>
        <GradientButton
          compact
          label="Lưu thay đổi"
          disabled={!dirty || !isValidPostEdit(draft)}
          onPress={save}
        />
      </View>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
        <View className="rounded-[20px] border border-[#E9ECEF]/80 bg-white p-3.5">
          <View className="flex-row items-start gap-2.5 rounded-[14px] border border-[#E9ECEF]/60 bg-[#F1F3F5]/30 p-2.5">
            <CustomIcon name="editLocation" size={16} />
            <View className="flex-1 gap-0.5">
              <Text className="font-sans-bold text-[13px] text-[#1A1A1A]">
                {post.location?.title ?? 'Khu vực của bài viết'}
              </Text>
              <Text className="font-sans text-[11px] leading-[17px] text-[#4A4A4A]">
                {post.location?.address ?? 'Chưa có địa chỉ chi tiết'}
              </Text>
            </View>
          </View>
        </View>
        <View className="gap-2">
          <Text className="font-sans-bold text-xs tracking-[0.6px] text-[#4A4A4A]">NỘI DUNG BÀI ĐĂNG</Text>
          <View className="overflow-hidden rounded-[20px] border border-[#E9ECEF]/80 bg-white">
            <TextInput
              accessibilityLabel="Nội dung bài đăng"
              value={draft.text}
              onChangeText={(text) => setDraft({ ...draft, text })}
              multiline
              maxLength={MAX_POST_LENGTH}
              textAlignVertical="top"
              style={styles.input}
            />
            <Text className="self-end px-3 pb-2 font-sans-bold text-[11px] text-[#4A4A4A]">
              {draft.text.length}/{MAX_POST_LENGTH}
            </Text>
          </View>
        </View>
        <LockedPostPhotos photos={post.photos} />
        <EditDisplaySettings value={draft} onChange={setDraft} />
        <View className="flex-row items-start gap-2.5 rounded-[17px] border border-[#E9ECEF]/60 bg-[#F1F3F5]/30 p-3">
          <CustomIcon name="editInfo" size={14} />
          <Text className="flex-1 font-sans text-[10.5px] leading-[17px] text-[#4A4A4A]">
            Để đảm bảo tính xác thực cho khu vực, hình ảnh bài đăng không thể chỉnh sửa sau khi đã phát hành.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 16, gap: 20, paddingBottom: 32 },
  input: { height: 112, borderWidth: 0, fontSize: 13, paddingTop: 12, fontFamily: 'BeVietnamPro_400Regular' },
});
