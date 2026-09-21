import { Redirect, router, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { BackHandler, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../src/components/ui/Button';
import { CustomIcon } from '../src/components/ui/CustomIcon';
import { useNewPostDraft } from '../src/features/new-post/draft';
import { CompletedPostPreview } from '../src/features/new-post/CompletedPostPreview';
import { PostCompleteSummary } from '../src/features/new-post/PostCompleteSummary';

export default function PostCompleteScreen() {
  const draft = useNewPostDraft((state) => state.completion);
  const [preview, setPreview] = useState(false);
  const insets = useSafeAreaInsets();
  const toFeed = useCallback(() => router.dismissTo('/home'), []);
  useFocusEffect(
    useCallback(() => {
      const listener = BackHandler.addEventListener('hardwareBackPress', () => {
        toFeed();
        return true;
      });
      return () => listener.remove();
    }, [toFeed]),
  );
  if (!draft) return <Redirect href="/home" />;
  return (
    <LinearGradient colors={['#FFF0F3', '#FFE8EC', '#FFF5F6']} style={styles.screen}>
      <StatusBar style="dark" />
      <View pointerEvents="none" style={styles.topGlow} />
      <View pointerEvents="none" style={styles.bottomGlow} />
      <View pointerEvents="none" style={styles.whiteGlow} />
      <View style={[styles.header, { paddingTop: Math.max(32, insets.top) }]}>
        <Text className="font-sans-medium" style={styles.previewLabel}>
          Xem thử giao diện · Chưa phát hành bài
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Đóng và về dòng tin"
          onPress={toFeed}
          style={styles.close}
        >
          <CustomIcon name="postCompleteClose" size={18} />
        </Pressable>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <LinearGradient colors={['#FF416C', '#E85D3E']} style={styles.check}>
            <CustomIcon name="postCompleteCheck" size={60} />
          </LinearGradient>
          <View style={styles.sparkle}>
            <CustomIcon name="postCompleteSparkle" size={18} />
          </View>
        </View>
        <Text accessibilityRole="header" className="font-sans-black" style={styles.title}>
          Tuyệt vời, tin của bạn đang được lan tỏa!
        </Text>
        <Text className="font-sans" style={styles.description}>
          Cảm ơn bạn đã đóng góp cho xóm mình. Bài viết sẽ hiển thị ưu tiên trong khu vực của bạn.
        </Text>
        <PostCompleteSummary autoHide={draft.autoHide} />
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: Math.max(32, insets.bottom) }]}>
        <Button
          label="Xem bài của tôi"
          onPress={() => setPreview(true)}
          className="flex-row gap-2"
          style={styles.primary}
          labelStyle={styles.primaryText}
          leadingIcon={
            <LinearGradient pointerEvents="none" colors={['#FF416C', '#FF4B2B']} style={styles.fill} />
          }
          trailingIcon={<CustomIcon name="postCompleteArrow" size={16} />}
        />
        <Button
          label="Về dòng tin xóm"
          variant="outline"
          onPress={toFeed}
          style={styles.secondary}
          labelStyle={styles.secondaryText}
        />
      </View>
      <CompletedPostPreview draft={draft} visible={preview} onClose={() => setPreview(false)} />
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  previewLabel: { flex: 1, fontSize: 10, color: '#80616A', lineHeight: 15 },
  close: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    backgroundColor: '#FFFFFFCC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 32,
  },
  hero: { width: 128, height: 128, marginBottom: 32 },
  check: {
    width: 128,
    height: 128,
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF416C',
    shadowOpacity: 0.3,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 25 },
  },
  sparkle: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#FEF3C6',
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 7.5,
    shadowOffset: { width: 0, height: 10 },
  },
  title: {
    maxWidth: 338,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.6,
    textAlign: 'center',
    color: '#1A1A1A',
  },
  description: {
    maxWidth: 320,
    fontSize: 14,
    lineHeight: 22.75,
    textAlign: 'center',
    color: '#4A4A4A',
    marginTop: 12,
    marginBottom: 24,
  },
  footer: { paddingHorizontal: 24, paddingTop: 16, gap: 12 },
  primary: {
    height: 54.5,
    borderRadius: 15.278,
    shadowColor: '#FF416C',
    shadowOpacity: 0.25,
    shadowRadius: 7.5,
    shadowOffset: { width: 0, height: 10 },
  },
  fill: { ...StyleSheet.absoluteFill, borderRadius: 15.278 },
  primaryText: { fontFamily: 'BeVietnamPro_900Black', fontSize: 15, lineHeight: 22.5 },
  secondary: { height: 51, borderRadius: 14.167, borderColor: '#E9ECEF', backgroundColor: '#FFFFFFCC' },
  secondaryText: { fontFamily: 'BeVietnamPro_700Bold', fontSize: 14, lineHeight: 21 },
  topGlow: {
    position: 'absolute',
    top: -96,
    right: -96,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#FF416C0D',
    boxShadow: '0 0 64px 32px #FF416C0D',
  },
  bottomGlow: {
    position: 'absolute',
    bottom: -112,
    left: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#FF4B2B0D',
    boxShadow: '0 0 64px 32px #FF4B2B0D',
  },
  whiteGlow: {
    position: 'absolute',
    top: '28%',
    left: '2%',
    width: '96%',
    aspectRatio: 1,
    borderRadius: 200,
    backgroundColor: '#FFFFFF66',
    boxShadow: '0 0 40px 20px #FFFFFF66',
  },
});
