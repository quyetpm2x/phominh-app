import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { extractErrorMessage } from '../../src/api/client';
import { useHideComment } from '../../src/hooks/useComments';
import { useMe } from '../../src/hooks/useMe';
import { useCreateReport } from '../../src/hooks/useReports';

const REASONS = ['Quấy rối / xúc phạm', 'Spam / quảng cáo', 'Thông tin sai sự thật', 'Khác'];

// on.reportComment — báo cáo bình luận; chủ bài có thể tự ẩn ngay không cần chờ kiểm duyệt.
export default function ReportCommentScreen() {
  const { postId, commentId, content, postAuthorId } = useLocalSearchParams<{
    postId: string;
    commentId: string;
    content: string;
    postAuthorId: string;
  }>();
  const { data: me } = useMe();
  const [reason, setReason] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const createReport = useCreateReport();
  const hideComment = useHideComment(postId);
  const isPostOwner = me?.id === postAuthorId;

  const onSubmit = async () => {
    if (!reason || !commentId || createReport.isPending) return;
    setError(null);
    try {
      await createReport.mutateAsync({ targetType: 'comment', targetId: commentId, reason });
      router.back();
    } catch (err) {
      setError(await extractErrorMessage(err));
    }
  };

  const onHide = async () => {
    if (!commentId || hideComment.isPending) return;
    setError(null);
    try {
      await hideComment.mutateAsync(commentId);
      router.back();
    } catch (err) {
      setError(await extractErrorMessage(err));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="h-[46px] flex-row items-center gap-1.5 px-3 border-b border-border">
        <Pressable onPress={() => router.back()} className="w-[34px] h-[34px] items-center justify-center">
          <Text className="text-[21px] text-ink">‹</Text>
        </Pressable>
        <Text className="font-sans-semibold text-[14.5px] text-ink">Báo cáo bình luận</Text>
      </View>

      <ScrollView contentContainerClassName="p-4.5">
        {content ? (
          <View className="rounded-[13px] border border-border bg-white p-3.5">
            <Text className="text-[13px] text-ink/85">"{content}"</Text>
          </View>
        ) : null}

        <View className="mt-3.5 gap-2.5">
          {REASONS.map((r) => (
            <Pressable
              key={r}
              onPress={() => setReason(r)}
              className={`rounded-[13px] border px-3.5 py-3 flex-row items-center gap-2.5 ${
                reason === r ? 'border-primary bg-primary-50' : 'border-border bg-white'
              }`}
            >
              <View className={`w-[18px] h-[18px] rounded-full border-2 ${reason === r ? 'border-primary bg-primary' : 'border-strong'}`} />
              <Text className="text-sm text-ink">{r}</Text>
            </Pressable>
          ))}
        </View>

        {isPostOwner ? (
          <>
            <View className="mt-3.5 rounded-[13px] border border-border bg-white px-3.5 py-3">
              <Text className="text-[12.5px] leading-[19px] text-muted">
                Bạn là chủ bài đăng — có thể tự ẩn bình luận này ngay mà không cần chờ kiểm duyệt.
              </Text>
            </View>
            <Pressable
              onPress={() => void onHide()}
              disabled={hideComment.isPending}
              className="mt-3 h-[46px] rounded-[13px] border border-border bg-white items-center justify-center"
            >
              <Text className="font-sans-semibold text-sm text-ink">Ẩn bình luận trên bài của tôi</Text>
            </Pressable>
          </>
        ) : null}

        {error ? <Text className="mt-2 text-xs text-danger">{error}</Text> : null}
      </ScrollView>

      <View className="px-4.5 pt-3.5 pb-6 border-t border-border">
        <Pressable
          onPress={() => void onSubmit()}
          disabled={!reason || createReport.isPending}
          className={`h-[52px] rounded-2xl items-center justify-center ${reason ? 'bg-danger' : 'bg-border'}`}
        >
          <Text className={`font-sans-semibold text-[15.5px] ${reason ? 'text-white' : 'text-muted'}`}>Gửi báo cáo</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
