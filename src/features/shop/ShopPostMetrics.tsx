import { Text, View } from 'react-native';
import { formatCount } from './data';

type Metrics = { views: number; votes: number; comments: number; calls: number };
export function ShopPostMetrics({
  post,
  compact = false,
  pinned = false,
}: {
  post: Metrics;
  compact?: boolean;
  pinned?: boolean;
}) {
  const labels = compact
    ? ['XEM', 'VOTE HỮU ÍCH', 'BÌNH LUẬN', 'GỌI ĐIỆN']
    : ['Lượt xem', pinned ? 'Thích' : 'Hữu ích', 'Bình luận', 'Bấm gọi'];
  const values = [post.views, post.votes, post.comments, post.calls];
  const tones = ['#FF416C', '#FF4B2B', '#FF4B2B', '#009977'];
  return (
    <View
      className={`flex-row ${compact ? '' : 'rounded-[14px] border border-[#F1F3F5] bg-[#F8F9FA] py-2.5'}`}
    >
      {values.map((value, index) => (
        <View
          key={labels[index]}
          className={`flex-1 items-center gap-1 ${compact ? 'flex-col-reverse' : ''}`}
        >
          <Text className={`font-sans text-[#4A4A4A] ${compact ? 'text-[8px]' : 'text-[10px]'}`}>
            {labels[index]}
          </Text>
          <Text
            className={`font-sans-black ${compact ? 'text-base' : 'text-[13px]'}`}
            style={{ color: compact ? tones[index] : index === 3 ? '#FF416C' : '#1A1A1A' }}
          >
            {formatCount(value)}
          </Text>
        </View>
      ))}
    </View>
  );
}
