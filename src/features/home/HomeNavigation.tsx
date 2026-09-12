import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { colors } from '../../constants/design-tokens';
import type { Filter, HomeTab } from './types';
interface Props {
  activeTab?: HomeTab;
  unread: number;
  onFilterChange: (filter: Filter) => void;
  onNotifications: () => void;
  onShop: () => void;
  onCompose: () => void;
  onProfile: () => void;
}
export function HomeNavigation({
  activeTab = 'feed',
  unread,
  onFilterChange,
  onNotifications,
  onShop,
  onCompose,
  onProfile,
}: Props) {
  const feedActive = activeTab === 'feed';
  return (
    <View style={styles.navigation}>
      <Pressable
        accessibilityRole="tab"
        accessibilityState={{ selected: feedActive }}
        onPress={() => onFilterChange('all')}
        style={styles.navItem}
      >
        <View>
          <CustomIcon name="feedNews" size={24} color={feedActive ? colors.primary.DEFAULT : '#A0A0A0'} />
          {feedActive ? <View className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-primary" /> : null}
        </View>
        <Text
          className="font-sans-black text-[10px]"
          style={feedActive ? styles.activeNav : styles.inactiveNav}
        >
          Dòng tin
        </Text>
      </Pressable>
      <Pressable
        accessibilityRole="tab"
        accessibilityState={{ selected: activeTab === 'notifications' }}
        onPress={onNotifications}
        style={styles.navItem}
      >
        <View>
          <CustomIcon
            name="feedBell"
            size={24}
            color={activeTab === 'notifications' ? colors.primary.DEFAULT : '#A0A0A0'}
          />
          {unread > 0 ? (
            <View className="absolute -right-1 -top-1 min-w-3.5 items-center rounded-full bg-accent px-1">
              <Text className="font-sans-black text-[8px] text-white">{unread}</Text>
            </View>
          ) : null}
        </View>
        <Text
          className="font-sans-medium text-[10px]"
          style={activeTab === 'notifications' ? styles.activeNav : styles.inactiveNav}
        >
          Thông báo
        </Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Đăng tin"
        onPress={onCompose}
        style={styles.addButton}
      >
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            boxShadow: [
              {
                offsetX: 0,
                offsetY: 4,
                blurRadius: 10,
                spreadDistance: -2,
                color: 'rgba(255, 75, 43, 0.4)',
              },
              {
                offsetX: 0,
                offsetY: 10,
                blurRadius: 25,
                spreadDistance: -4,
                color: 'rgba(255, 65, 108, 0.5)',
              },
              {
                offsetX: 0,
                offsetY: 0,
                blurRadius: 0,
                spreadDistance: 4,
                color: '#FFFFFF',
              },
            ],
          }}
        >
          <LinearGradient
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 16,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 2,
              borderColor: 'rgba(255,255,255,0.3)',
            }}
            colors={['#FF416C', '#FF4B2B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            <CustomIcon name="feedPlus" size={26} color="white" />
          </LinearGradient>
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="tab"
        accessibilityState={{ selected: activeTab === 'shop' }}
        onPress={onShop}
        style={styles.navItem}
      >
        <CustomIcon
          name="feedShop"
          size={24}
          color={activeTab === 'shop' ? colors.primary.DEFAULT : '#A0A0A0'}
        />
        <Text
          className="font-sans-medium text-[10px]"
          style={activeTab === 'shop' ? styles.activeNav : styles.inactiveNav}
        >
          Quán
        </Text>
      </Pressable>
      <Pressable accessibilityRole="tab" onPress={onProfile} style={styles.navItem}>
        <CustomIcon name="feedProfile" size={24} />
        <Text className="font-sans-medium text-[10px] text-[#A0A0A0]">Tôi</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  activeNav: { color: colors.primary.DEFAULT },

  inactiveNav: { color: '#A0A0A0' },

  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F1E7E2',
    paddingHorizontal: 10,
    paddingVertical: 9,
  },

  navItem: { flex: 1, alignItems: 'center', gap: 4, minHeight: 44, justifyContent: 'center' },

  addButton: { flex: 1, alignItems: 'center', transform: [{ translateY: -14 }] },
});
