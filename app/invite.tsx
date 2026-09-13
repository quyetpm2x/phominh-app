import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomIcon } from '../src/components/ui/CustomIcon';
import { INVITE_PREVIEW } from '../src/features/invite/data';
import { InviteCodeCard } from '../src/features/invite/InviteCodeCard';
import { InviteHero } from '../src/features/invite/InviteHero';
import { InviteStats } from '../src/features/invite/InviteStats';
import { InviteSteps } from '../src/features/invite/InviteSteps';
import { useInviteActions } from '../src/features/invite/useInviteActions';

export default function InviteScreen() {
  const actions = useInviteActions();
  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FA]">
      <View className="flex-row items-center justify-between border-b border-[#E9ECEF]/60 px-5 pb-4 pt-2">
        <View className="flex-row items-center gap-3">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/home?tab=profile'))}
            style={styles.headerButton}
          >
            <CustomIcon name="inviteBack" size={20} />
          </Pressable>
          <Text accessibilityRole="header" className="font-sans-black text-lg tracking-[-0.45px] text-ink">
            Mời bạn bè
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Chia sẻ lời mời"
          onPress={() => void actions.share()}
          style={styles.headerButton}
        >
          <CustomIcon name="inviteShare" size={18} />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <InviteHero />
        <InviteCodeCard
          code={INVITE_PREVIEW.code}
          copied={actions.copied}
          onCopy={() => void actions.copyCode()}
          onShare={() => void actions.share()}
          onLink={() => void actions.copyLink()}
        />
        <InviteStats invited={INVITE_PREVIEW.invited} earned={INVITE_PREVIEW.earned} />
        <InviteSteps code={INVITE_PREVIEW.code} />
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 1 },
  },
  content: { padding: 20, paddingBottom: 48, gap: 24 },
});
