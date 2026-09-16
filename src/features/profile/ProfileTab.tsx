import { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { Button } from '../../components/ui/Button';
import type { HomeFeedController } from '../home/useHomeFeed';
import { ProfileHeader } from './ProfileHeader';
import { ProfileMenuRow } from './ProfileMenuRow';
import { ProfileReputationCard } from './ProfileReputationCard';
import { useAreaAddress } from './useAreaAddress';

const DETAILS = {
  reputation: [
    'Điểm uy tín cộng đồng',
    '842 điểm · Bậc 4/10 · Rất tin cậy. Dữ liệu mẫu theo thiết kế; lịch sử và quyền lợi sẽ có khi kết nối dịch vụ điểm uy tín.',
  ],
  wallet: [
    'Ví thưởng & Thu nhập',
    'Số dư 350.000đ đang là dữ liệu mẫu theo thiết kế. Chức năng ví chưa được kết nối.',
  ],
} as const;

export function ProfileTab({
  controller,
  onMyPosts,
}: {
  controller: HomeFeedController;
  onMyPosts: () => void;
}) {
  const [detail, setDetail] = useState<keyof typeof DETAILS | null>(null);
  const homeAddress = useAreaAddress(controller.home);
  const workAddress = useAreaAddress(controller.work);
  const homeSubtitle = homeAddress.includes('Bán kính')
    ? homeAddress
    : `${homeAddress} · Bán kính ${controller.home.radiusKm}km`;
  const workSubtitle = controller.work
    ? workAddress.includes('Bán kính')
      ? workAddress
      : `${workAddress} · Bán kính ${controller.work.radiusKm}km`
    : 'Chưa thiết lập khu vực chỗ làm';
  const openArea = (tab: 'home' | 'work') => {
    router.push({ pathname: '/edit-area', params: { place: tab } });
  };
  return (
    <>
      <ScrollView
        className="flex-1 bg-[#F8F9FA]"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.block0}
      >
        <ProfileHeader profile={controller.profile} onEdit={() => router.push('/profile')} />
        <View style={styles.body}>
          <ProfileReputationCard onDetails={() => setDetail('reputation')} />
          <View style={styles.section}>
            <Text accessibilityRole="header" className="font-sans-black" style={styles.sectionTitle}>
              KHU VỰC THEO DÕI
            </Text>
            <View className="overflow-hidden rounded-[20px] border border-[#E9ECEF] bg-white">
              <ProfileMenuRow
                icon="meHome"
                title="Khu vực Nhà"
                subtitle={homeSubtitle}
                tone="pink"
                onPress={() => openArea('home')}
              />
              <ProfileMenuRow
                icon="meWork"
                title="Khu vực Chỗ làm"
                subtitle={workSubtitle}
                tone="orange"
                last
                onPress={() => openArea('work')}
              />
            </View>
          </View>
          <View style={styles.section}>
            <Text accessibilityRole="header" className="font-sans-black" style={styles.sectionTitle}>
              TIỆN ÍCH & LAN TOẢ
            </Text>
            <View className="overflow-hidden rounded-[20px] border border-[#E9ECEF] bg-white">
              <ProfileMenuRow icon="mePosts" title="Bài đăng của tôi" value="42 bài" onPress={onMyPosts} />
              <ProfileMenuRow
                icon="meWallet"
                title="Ví thưởng & Thu nhập"
                value="350.000đ"
                tone="orange"
                onPress={() => setDetail('wallet')}
              />
              <ProfileMenuRow
                icon="meGift"
                title="Mời bạn bè & Nhận thưởng"
                subtitle="Nhận 20.000đ/lượt mời thành công"
                value="+20K"
                tone="invite"
                onPress={() => router.push('/invite')}
              />
              <ProfileMenuRow
                icon="meSettings"
                title="Cài đặt ứng dụng"
                last
                onPress={() => router.push('/settings')}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <BottomSheet visible={detail !== null} onClose={() => setDetail(null)}>
        <View className="gap-4">
          <Text className="font-sans-bold text-lg text-ink">{detail ? DETAILS[detail][0] : ''}</Text>
          <Text className="font-sans text-sm text-muted">{detail ? DETAILS[detail][1] : ''}</Text>
          <Button label="Đóng" onPress={() => setDetail(null)} />
        </View>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  block0: { paddingBottom: 56 },
  body: { padding: 16, gap: 20 },
  section: { gap: 8 },
  sectionTitle: { fontSize: 11, lineHeight: 16.5, letterSpacing: 0.55, color: '#4A4A4A', paddingLeft: 2 },
});
