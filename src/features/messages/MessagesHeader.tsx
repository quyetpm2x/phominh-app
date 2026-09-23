import { useRef } from 'react';
import { Pressable, StyleSheet, Text, View, type TextInput as NativeInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { TextInput } from '../../components/ui/TextInput';
export function MessagesHeader({
  query,
  onSearch,
  unread,
}: {
  query: string;
  onSearch: (query: string) => void;
  unread: number;
}) {
  const input = useRef<NativeInput>(null);
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.header}>
      <View style={[styles.top, { paddingTop: Math.max(0, 48 - insets.top) }]}>
        <LinearGradient colors={['#FF416C', '#FF4B2B']} style={styles.logo}>
          <CustomIcon name="messageBubble" size={20} />
        </LinearGradient>
        <View style={styles.copy}>
          <Text className="font-sans-black" style={styles.title}>
            Tin nhắn hàng xóm
          </Text>
          <View style={styles.subtitle}>
            <View style={styles.dot} />
            <Text className="font-sans" style={styles.meta}>
              Khu Duy Tân · {unread} tin chưa đọc
            </Text>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tìm kiếm tin nhắn"
          onPress={() => input.current?.focus()}
          style={styles.searchButton}
        >
          <CustomIcon name="messageSearch" size={18} />
        </Pressable>
      </View>
      <View style={styles.search}>
        <CustomIcon name="messageSearchSmall" size={13.141} />
        <TextInput
          ref={input}
          value={query}
          onChangeText={onSearch}
          accessibilityLabel="Tìm người quen, tên quán hoặc tin nhắn"
          placeholder="Tìm người quen, tên quán hoặc tin nhắn..."
          placeholderTextColor="#1A1A1A"
          returnKeyType="search"
          autoCorrect={false}
          style={styles.input}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  header: { backgroundColor: '#FFFFFFF2', borderBottomWidth: 1, borderColor: '#E9ECEF', paddingBottom: 12 },
  top: { flexDirection: 'row', gap: 10, alignItems: 'center', paddingHorizontal: 20, paddingBottom: 14 },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 6px #FF416C40',
  },
  copy: { flex: 1 },
  title: { fontSize: 19, lineHeight: 28.5, color: '#1A1A1A' },
  subtitle: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#00BC7D' },
  meta: { fontSize: 11, lineHeight: 16.5, color: '#4A4A4A' },
  searchButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F1F3F5CC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: '#E9ECEF99',
    borderRadius: 10.417,
    backgroundColor: '#F1F3F599',
  },
  input: {
    flex: 1,
    height: 38,
    padding: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    fontFamily: 'BeVietnamPro_400Regular',
    fontSize: 13,
    lineHeight: 19.5,
  },
});
