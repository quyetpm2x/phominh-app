import type { Ref } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { IconTextInput } from '../../components/ui/IconTextInput';
export function FaqSearch({
  query,
  onChange,
  inputRef,
}: {
  query: string;
  onChange: (text: string) => void;
  inputRef: Ref<TextInput>;
}) {
  return (
    <LinearGradient colors={['#FF416C1A', '#FF416C0D', '#FF416C00']} style={styles.card}>
      <View style={styles.heading}>
        <View style={styles.icon}>
          <CustomIcon name="faqIntro" size={20} />
        </View>
        <View style={styles.copy}>
          <Text className="font-sans-bold" style={styles.title}>
            Bạn cần hỗ trợ điều gì?
          </Text>
          <Text className="font-sans" style={styles.subtitle}>
            Tìm kiếm câu trả lời nhanh hoặc liên hệ với đội ngũ
          </Text>
        </View>
      </View>
      <IconTextInput
        inputRef={inputRef}
        icon="search"
        iconNode={<CustomIcon name="faqSearch" size={14} />}
        value={query}
        onChangeText={onChange}
        accessibilityLabel="Tìm kiếm câu hỏi"
        placeholder="Tìm câu hỏi, ví dụ: Rút tiền, Điểm uy tín..."
        placeholderTextColor="#1A1A1A"
        style={styles.input}
        autoCorrect={false}
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  card: { padding: 16, gap: 12, borderWidth: 1, borderColor: '#FF416C33', borderRadius: 19.556 },
  heading: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 11.111,
    backgroundColor: '#FF416C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1 },
  title: { fontSize: 15, lineHeight: 22.5, color: '#1A1A1A' },
  subtitle: { fontSize: 11.5, lineHeight: 17.25, color: '#4A4A4A' },
  input: {
    height: 40,
    borderRadius: 11.111,
    backgroundColor: '#FFF',
    fontSize: 12.5,
    fontFamily: 'BeVietnamPro_400Regular',
    paddingLeft: 35,
  },
});
