import { Redirect, router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { BackHandler, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomIcon } from '../src/components/ui/CustomIcon';
import { GradientSubmitButton } from '../src/components/ui/GradientSubmitButton';
import { POSTS } from '../src/features/home/data';
import { usePostInteractions } from '../src/features/home/postInteractions';

export default function ReportSuccessScreen() {
  const { lastReport, blockedAuthors, blockAuthor } = usePostInteractions();
  const post = POSTS.find((item) => item.id === lastReport?.postId);
  const toFeed = useCallback(() => router.dismissTo('/home'), []);
  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        toFeed();
        return true;
      });
      return () => subscription.remove();
    }, [toFeed]),
  );
  if (!post) return <Redirect href="/home" />;
  const blocked = blockedAuthors.includes(post.authorId);
  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.screen}>
      <View className="items-end px-6 pt-1">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Đóng và quay về dòng tin"
          onPress={toFeed}
          className="h-10 w-10 items-center justify-center rounded-full bg-[#F1F3F5]/60"
        >
          <CustomIcon name="successClose" size={18} />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.shield}>
            <CustomIcon name="successShield" size={48} />
          </View>
          <View className="absolute -bottom-1 -right-1 h-8 w-8 items-center justify-center rounded-full bg-primary">
            <CustomIcon name="successCheck" size={14} color="white" />
          </View>
        </View>
        <View className="w-full items-center gap-2.5">
          <Text
            accessibilityRole="header"
            className="text-center font-sans-black text-2xl leading-8 tracking-[-0.6px] text-[#1A1A1A]"
          >
            Cảm ơn bạn đã báo cáo!
          </Text>
          <Text
            style={styles.description}
            className="text-center font-sans text-[13.5px] leading-[22px] text-[#4A4A4A]"
          >
            Chúng tôi đã ghi nhận phản hồi và đang tiến hành kiểm duyệt bài viết này để giữ gìn môi trường xóm
            lành mạnh.
          </Text>
        </View>
        <View style={styles.card} className="gap-3.5 rounded-[20px] border border-[#E9ECEF]/80 bg-white p-4">
          <Text className="font-sans-black text-xs leading-[18px] tracking-[0.6px] text-[#4A4A4A]">
            HÀNH ĐỘNG TỰ ĐỘNG ĐÃ ÁP DỤNG:
          </Text>
          <View className="flex-row items-center gap-3">
            <View className="h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <CustomIcon name="successHide" size={14} />
            </View>
            <Text className="flex-1 font-sans-medium text-[13px] leading-[19.5px] text-[#1A1A1A]">
              Đã ẩn bài viết này khỏi dòng tin của bạn
            </Text>
          </View>
          <View className="flex-row items-center gap-3">
            <View className="h-7 w-7 items-center justify-center rounded-lg bg-[#FE9A00]/10">
              <CustomIcon name="successClock" size={14} />
            </View>
            <Text className="flex-1 font-sans-medium text-[13px] leading-[19.5px] text-[#1A1A1A]">
              Kiểm duyệt viên sẽ xử lý trong vòng <Text className="font-sans-bold">24h</Text>
            </Text>
          </View>
        </View>
        <View
          style={styles.card}
          className="flex-row items-center gap-3 rounded-[20px] border border-[#E9ECEF]/60 bg-[#F1F3F5]/30 p-3.5"
        >
          <CustomIcon name="successBlock" size={18} />
          <View className="flex-1">
            <Text className="font-sans-bold text-[12.5px] leading-[19px] text-[#1A1A1A]">
              {blocked ? 'Đã chặn người dùng này' : 'Chặn người dùng này?'}
            </Text>
            <Text className="font-sans text-[11px] leading-[16.5px] text-[#4A4A4A]">
              Bạn sẽ không thấy bất kỳ bài viết nào từ họ nữa
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Chặn ${post.name}`}
            accessibilityState={{ disabled: blocked }}
            disabled={blocked}
            onPress={() => blockAuthor(post.authorId)}
            className="min-h-[30px] items-center justify-center rounded-full bg-danger/10 px-3"
          >
            <Text className="font-sans-black text-[11.5px] text-danger">{blocked ? 'Đã chặn' : 'Chặn'}</Text>
          </Pressable>
        </View>
      </ScrollView>
      <View className="px-6 pb-2 pt-4">
        <GradientSubmitButton
          label="Quay về Dòng tin"
          vertical
          disabled={false}
          loading={false}
          onPress={toFeed}
          trailingIcon={<CustomIcon name="successArrow" size={16} color="white" />}
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8F9FA' },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 24,
  },
  hero: { width: 96, height: 96 },
  shield: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: '#00BC7D33',
    backgroundColor: '#00BC7D1A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00BC7D',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 4,
  },
  description: { maxWidth: 300 },
  card: { width: '100%', maxWidth: 322 },
});
