import { useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../src/components/ui/Button';
import { CustomIcon } from '../src/components/ui/CustomIcon';
import { SettingsHeader } from '../src/features/settings/SettingsHeader';
import { useComposerProfile } from '../src/features/new-post/useComposerProfile';
import { createCapturedPhoto } from '../src/features/capture/capturePhoto';
import { useNewPostDraft } from '../src/features/new-post/draft';
import { NewPostEditor } from '../src/features/new-post/NewPostEditor';
import { NewPostOptions } from '../src/features/new-post/NewPostOptions';
import { NewPostSettings } from '../src/features/new-post/NewPostSettings';

export default function NewPostScreen() {
  const { draft, update } = useNewPostDraft();
  const insets = useSafeAreaInsets();
  const profile = useComposerProfile();
  const [adding, setAdding] = useState(false);
  const picking = useRef(false);
  const nickname = profile.nickname || 'User_842';
  const fullName = profile.fullName || 'Chưa đặt tên';
  async function addPhotos() {
    if (picking.current) return;
    picking.current = true;
    setAdding(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        selectionLimit: 6 - draft.photos.length,
        quality: 0.9,
      });
      if (!result.canceled) {
        const current = useNewPostDraft.getState().draft.photos;
        update({
          photos: [
            ...current,
            ...result.assets.map((asset) => createCapturedPhoto(asset.uri, 'library', null)),
          ].slice(0, 6),
        });
      }
    } catch {
      Alert.alert('Không mở được thư viện', 'Vui lòng thử lại.');
    } finally {
      picking.current = false;
      setAdding(false);
    }
  }
  function publish() {
    if (!draft.text.trim() && !draft.photos.length) {
      Alert.alert('Chưa có nội dung', 'Thêm ảnh hoặc viết nội dung trước khi đăng.');
      return;
    }
    if (useNewPostDraft.getState().completePreview()) router.replace('/post-complete');
  }
  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <SettingsHeader
        compact
        title="Đăng bài lên xóm"
        backIcon="newPostBack"
        backIconSize={18}
        style={[styles.header, { paddingTop: Math.max(48, insets.top) }]}
        backStyle={styles.back}
        titleStyle={styles.title}
        action={<View style={styles.spacer} />}
      />
      <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={styles.content}
        >
          <NewPostEditor
            draft={draft}
            update={update}
            onAdd={() => void addPhotos()}
            adding={adding}
            name={draft.anonymous ? nickname : fullName}
            avatar={profile.avatarUri}
          />
          <NewPostOptions draft={draft} update={update} nickname={nickname} fullName={fullName} />
          <NewPostSettings draft={draft} update={update} />
        </ScrollView>
        <LinearGradient
          colors={['#F8F9FA00', '#F8F9FAF2', '#F8F9FA']}
          style={[styles.footer, { paddingBottom: Math.max(16, insets.bottom) }]}
        >
          <Button
            label="Đăng lên xóm ngay"
            onPress={publish}
            className="flex-row gap-2"
            style={styles.submit}
            labelStyle={styles.submitText}
            leadingIcon={
              <LinearGradient pointerEvents="none" colors={['#FF416C', '#FF4B2B']} style={styles.fill} />
            }
            trailingIcon={<CustomIcon name="newPostSend" size={16} />}
          />
        </LinearGradient>
      </KeyboardAvoidingView>
    </View>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { paddingHorizontal: 20, paddingBottom: 14, backgroundColor: '#FFF' },
  back: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F1F3F599' },
  title: { fontSize: 17, lineHeight: 25.5, textAlign: 'center', letterSpacing: 0 },
  spacer: { width: 36 },
  content: { paddingHorizontal: 16, gap: 16, paddingBottom: 32 },
  footer: { paddingHorizontal: 16, paddingTop: 16, borderTopWidth: 1, borderColor: '#E9ECEF66' },
  submit: {
    height: 54.5,
    borderRadius: 14.583,
    shadowColor: '#FF416C',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 10 },
  },
  fill: { ...StyleSheet.absoluteFill, borderRadius: 14.583 },
  submitText: { fontSize: 15, lineHeight: 22.5, fontFamily: 'BeVietnamPro_900Black' },
});
