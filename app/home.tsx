import { Redirect, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../src/constants/design-tokens';
import { HomeFeedTab } from '../src/features/home/HomeFeedTab';
import { HomeNavigation } from '../src/features/home/HomeNavigation';
import { HomeSheets } from '../src/features/home/HomeSheets';
import type { HomeTab } from '../src/features/home/types';
import { useHomeDestination } from '../src/features/home/useHomeDestination';
import { useHomeFeed } from '../src/features/home/useHomeFeed';
import { NotificationsTab } from '../src/features/notifications/NotificationsTab';
import { useNotifications } from '../src/features/notifications/useNotifications';
import { ShopTab } from '../src/features/shop/ShopTab';
import { ProfileTab } from '../src/features/profile/ProfileTab';

export default function HomeScreen() {
  const controller = useHomeFeed();
  const notifications = useNotifications();
  const params = useLocalSearchParams<{
    tab?: string;
    panel?: string;
    request?: string;
    focusPost?: string;
    feedFilter?: string;
  }>();
  const routeKey = JSON.stringify([
    params.tab,
    params.panel,
    params.request,
    params.focusPost,
    params.feedFilter,
  ]);
  const routeTab: HomeTab =
    params.panel === 'profile'
      ? 'profile'
      : !params.focusPost &&
          !params.feedFilter &&
          (params.tab === 'notifications' || params.tab === 'shop' || params.tab === 'profile')
        ? params.tab
        : 'feed';
  const [selection, setSelection] = useState<{ routeKey: string; tab: HomeTab }>({
    routeKey,
    tab: routeTab,
  });
  const activeTab = selection.routeKey === routeKey ? selection.tab : routeTab;
  const [showShopPosts, setShowShopPosts] = useState(false);
  const setActiveTab = (tab: HomeTab) => setSelection({ routeKey, tab });
  const destination = useHomeDestination(controller);
  const { signedIn, scroll, setFilter, setSheet } = controller;

  if (signedIn === null)
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-cream">
        <ActivityIndicator color={colors.primary.DEFAULT} />
      </SafeAreaView>
    );
  if (!signedIn) return <Redirect href="/(auth)/welcome" />;

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-white">
      <View className="flex-1" style={activeTab === 'feed' ? styles.visible : styles.hidden}>
        <HomeFeedTab controller={controller} destination={destination} />
      </View>
      <View className="flex-1" style={activeTab === 'notifications' ? styles.visible : styles.hidden}>
        <NotificationsTab controller={notifications} />
      </View>
      <View className="flex-1" style={activeTab === 'shop' ? styles.visible : styles.hidden}>
        <ShopTab
          controller={controller}
          onCompose={() => setSheet('compose')}
          showPosts={showShopPosts}
          onSelectPosts={setShowShopPosts}
        />
      </View>
      <View className="flex-1" style={activeTab === 'profile' ? styles.visible : styles.hidden}>
        <ProfileTab
          controller={controller}
          onMyPosts={() => {
            setShowShopPosts(true);
            setActiveTab('shop');
          }}
        />
      </View>
      <HomeNavigation
        activeTab={activeTab}
        unread={notifications.unread}
        onFilterChange={(next) => {
          setActiveTab('feed');
          setFilter(next);
          scroll.current?.scrollTo({ y: 0, animated: true });
        }}
        onNotifications={() => setActiveTab('notifications')}
        onShop={() => setActiveTab('shop')}
        onCompose={() => setSheet('compose')}
        onProfile={() => setActiveTab('profile')}
      />
      <HomeSheets controller={controller} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ visible: { display: 'flex' }, hidden: { display: 'none' } });
