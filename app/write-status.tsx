import { useCallback, useRef, useState } from 'react';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '../src/components/ui/Avatar';
import { GradientButton } from '../src/components/ui/Button';
import { TextInput } from '../src/components/ui/TextInput';
import { CaptureLocation } from '../src/features/capture/CaptureLocation';
import { createCapturedPhoto, type CapturePlace } from '../src/features/capture/capturePhoto';
import { useNewPostDraft } from '../src/features/new-post/draft';
import { useComposerProfile } from '../src/features/new-post/useComposerProfile';
import { StatusPhotoActions } from '../src/features/new-post/StatusPhotoActions';
import { styles } from '../src/features/new-post/writeStatusStyles';

const palette = [
  { color: '#FF416C', name: 'Hồng' },
  { color: '#FF4B2B', name: 'Cam' },
  { color: '#E85D3E', name: 'Cam đất' },
  { color: '#1A1A1A', name: 'Đen' },
  { color: '#5D5950', name: 'Xám' },
];
export default function WriteStatusScreen() {
  const { draft, update } = useNewPostDraft();
  const profile = useComposerProfile();
  const insets = useSafeAreaInsets();
  const [busy, setBusy] = useState(false);
  const picking = useRef(false);
  const locate = useCallback((location: CapturePlace | null) => update({ location }), [update]);
  const cancel = () => (router.canGoBack() ? router.back() : router.replace('/home'));
  const next = () => {
    if (!draft.text.trim() && !draft.photos.length) {
      Alert.alert('Chưa có nội dung', 'Viết trạng thái hoặc chọn ảnh để tiếp tục.');
      return;
    }
    router.push('/new-post');
  };
  async function library() {
    if (picking.current) return;
    picking.current = true;
    setBusy(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        selectionLimit: 6,
        quality: 0.9,
      });
      if (!result.canceled) {
        update({
          photos: result.assets.slice(0, 6).map((photo) => createCapturedPhoto(photo.uri, 'library', null)),
        });
        router.push('/new-post');
      }
    } catch {
      Alert.alert('Không mở được thư viện', 'Vui lòng thử lại.');
    } finally {
      picking.current = false;
      setBusy(false);
    }
  }
  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <View style={[styles.header, { paddingTop: Math.max(48, insets.top) }]}>
        <Pressable accessibilityRole="button" hitSlop={12} onPress={cancel}>
          <Text className="font-sans-bold" style={styles.cancel}>
            Huỷ
          </Text>
        </Pressable>
        <Text accessibilityRole="header" className="font-sans-black" style={styles.title}>
          Viết trạng thái
        </Text>
        <GradientButton compact label="Đăng" onPress={next} disabled={busy} className="w-[78px]" />
      </View>
      <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={[styles.content, { paddingBottom: Math.max(20, insets.bottom) }]}
        >
          <View style={styles.author}>
            <Avatar
              initial={(profile.fullName || 'B').charAt(0)}
              size={40}
              radius={20}
              imageUrl={profile.avatarUri}
            />
            <View style={styles.copy}>
              <Text className="font-sans-bold" style={styles.name}>
                {profile.fullName || 'Bạn'}
              </Text>
              <Text className="font-sans-medium" style={styles.meta}>
                hiện cho hàng xóm trong 1.5km · mặc định vô hạn
              </Text>
            </View>
          </View>
          <View style={styles.editorSection}>
            <View style={styles.editor}>
              <TextInput
                accessibilityLabel="Nội dung trạng thái"
                multiline
                maxLength={500}
                value={draft.text}
                onChangeText={(text) => update({ text })}
                placeholder="Hàng xóm ơi..."
                placeholderTextColor={draft.textColor ?? '#1A1A1A'}
                textAlignVertical="top"
                style={[styles.input, { color: draft.textColor ?? '#1A1A1A' }]}
              />
            </View>
            <View style={styles.palette}>
              {palette.map((item) => (
                <Pressable
                  key={item.color}
                  accessibilityRole="radio"
                  accessibilityLabel={`Màu chữ ${item.name}`}
                  accessibilityState={{ checked: draft.textColor === item.color }}
                  onPress={() => update({ textColor: item.color })}
                  hitSlop={5}
                  style={[
                    styles.swatch,
                    { backgroundColor: item.color },
                    draft.textColor === item.color && styles.selected,
                  ]}
                />
              ))}
            </View>
          </View>
          <View style={styles.footer}>
            <CaptureLocation top={0} variant="status" onLocation={locate} />
            <StatusPhotoActions
              onCamera={() => router.push({ pathname: '/capture', params: { origin: 'status' } })}
              onLibrary={() => void library()}
              busy={busy}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
