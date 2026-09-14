import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomIcon } from '../src/components/ui/CustomIcon';
import { BottomSheet } from '../src/components/ui/BottomSheet';
import { Button } from '../src/components/ui/Button';
import { SettingsHeader } from '../src/features/settings/SettingsHeader';
import { FaqSearch } from '../src/features/help-faq/FaqSearch';
import { FaqTopics } from '../src/features/help-faq/FaqTopics';
import { FaqAccordion } from '../src/features/help-faq/FaqAccordion';
import { FaqSupport } from '../src/features/help-faq/FaqSupport';
import { filterFaq, type FaqTopic } from '../src/features/help-faq/data';
export default function HelpFaqScreen() {
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState<FaqTopic | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [support, setSupport] = useState<'chat' | 'hotline' | null>(null);
  const input = useRef<TextInput>(null);
  const scroll = useRef<ScrollView>(null);
  const items = filterFaq(query, topic);
  const focusSearch = () => {
    scroll.current?.scrollTo({ y: 0, animated: true });
    input.current?.focus();
  };
  return (
    <SafeAreaView style={styles.screen}>
      <SettingsHeader
        title="Trung tâm trợ giúp FAQ"
        compact
        whiteBack
        action={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Tìm câu hỏi"
            onPress={focusSearch}
            style={styles.search}
          >
            <CustomIcon name="faqHeaderSearch" size={18} />
          </Pressable>
        }
      />
      <ScrollView
        ref={scroll}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <FaqSearch inputRef={input} query={query} onChange={setQuery} />
        <View style={styles.topics}>
          <Text accessibilityRole="header" className="font-sans-black" style={styles.heading}>
            CHỦ ĐỀ THƯỜNG GẶP
          </Text>
          <FaqTopics selected={topic} onSelect={setTopic} />
        </View>
        <View style={styles.questions}>
          <Text accessibilityRole="header" className="font-sans-black" style={styles.heading}>
            CÂU HỎI PHỔ BIẾN
          </Text>
          <View style={styles.list}>
            {items.map((item) => (
              <FaqAccordion
                key={item.id}
                item={item}
                expanded={expanded === item.id}
                onToggle={() => setExpanded(expanded === item.id ? null : item.id)}
              />
            ))}
            {!items.length ? (
              <View style={styles.empty}>
                <Text className="font-sans text-sm text-muted">Không tìm thấy câu hỏi phù hợp.</Text>
                <Button
                  label="Xoá bộ lọc"
                  variant="outline"
                  onPress={() => {
                    setQuery('');
                    setTopic(null);
                  }}
                />
              </View>
            ) : null}
          </View>
        </View>
        <FaqSupport onSelect={setSupport} />
      </ScrollView>
      <BottomSheet visible={support !== null} onClose={() => setSupport(null)} variant="actions">
        <View style={styles.empty}>
          <Text className="font-sans-bold text-lg text-ink">
            {support === 'chat' ? 'Chat với CSKH' : 'Hotline hỗ trợ'}
          </Text>
          <Text className="font-sans text-sm text-muted">
            {support === 'chat'
              ? 'Kênh chat CSKH chưa được kết nối trong phiên bản hiện tại.'
              : 'Số hotline chính thức chưa được cung cấp. 1900 xxxx là số minh hoạ trong thiết kế.'}
          </Text>
          <Button label="Đóng" variant="outline" onPress={() => setSupport(null)} />
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8F9FA' },
  search: {
    width: 40,
    height: 40,
    borderRadius: 11.111,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { padding: 16, paddingBottom: 96, gap: 20 },
  topics: { gap: 10 },
  questions: { gap: 12 },
  list: { gap: 10 },
  heading: { fontSize: 11, lineHeight: 16.5, letterSpacing: 0.55, color: '#4A4A4A', paddingLeft: 1.5 },
  empty: { paddingVertical: 16, gap: 16 },
});
