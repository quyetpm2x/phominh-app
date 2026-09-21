import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { LegalCard } from '../legal/LegalCard';
import { topics, type PostDraft } from './draft';

export function NewPostOptions({
  draft,
  update,
  nickname,
  fullName,
}: {
  draft: PostDraft;
  update: (patch: Partial<PostDraft>) => void;
  nickname: string;
  fullName: string;
}) {
  return (
    <>
      <LegalCard style={styles.topics}>
        <View style={styles.heading}>
          <View style={styles.row}>
            <CustomIcon name="newPostTopic" size={14} />
            <Text className="font-sans-black" style={styles.title}>
              CHỦ ĐỀ BÀI VIẾT
            </Text>
          </View>
          <Text className="font-sans-bold" style={styles.required}>
            Bắt buộc
          </Text>
        </View>
        <View style={styles.grid}>
          {topics.map((topic) => {
            const selected = topic.id === draft.topic;
            return (
              <Pressable
                key={topic.id}
                accessibilityRole="radio"
                accessibilityLabel={topic.title}
                accessibilityState={{ checked: selected }}
                onPress={() => update({ topic: topic.id })}
                style={[styles.topic, selected && styles.selected]}
              >
                {selected && <LinearGradient colors={['#FFF1F4', '#FFF5F7']} style={styles.fill} />}
                <View style={[styles.icon, { backgroundColor: topic.background }]}>
                  {selected && <LinearGradient colors={['#FF416C', '#FF4B2B']} style={styles.iconFill} />}
                  <CustomIcon
                    name={topic.icon}
                    size={16}
                    forceColor={selected}
                    color={selected ? '#FFF' : topic.color}
                  />
                </View>
                <View style={styles.copy}>
                  <Text className="font-sans-bold" style={styles.name}>
                    {topic.title}
                  </Text>
                  <Text className="font-sans" style={[styles.description, selected && styles.pink]}>
                    {topic.description}
                  </Text>
                </View>
                {selected && <CustomIcon name="newPostSelected" size={16} />}
              </Pressable>
            );
          })}
        </View>
      </LegalCard>
      <LegalCard style={styles.identity}>
        <Text className="font-sans-black" style={styles.identityTitle}>
          CHẾ ĐỘ HIỂN THỊ DANH TÍNH
        </Text>
        <View style={styles.identities}>
          {[true, false].map((anonymous) => (
            <Pressable
              key={String(anonymous)}
              accessibilityRole="radio"
              accessibilityState={{ checked: draft.anonymous === anonymous }}
              onPress={() => update({ anonymous })}
              style={[styles.identityOption, draft.anonymous === anonymous && styles.selected]}
            >
              {draft.anonymous === anonymous && (
                <LinearGradient colors={['#FFF1F4', '#FFF']} style={styles.fill} />
              )}
              <View style={[styles.radio, draft.anonymous === anonymous && styles.radioActive]}>
                {draft.anonymous === anonymous && <View style={styles.radioDot} />}
              </View>
              <View style={styles.copy}>
                <Text className="font-sans-bold" style={styles.name}>
                  {anonymous ? 'Bí danh ẩn danh' : 'Tên thật'}
                </Text>
                <Text
                  numberOfLines={1}
                  className={anonymous ? 'font-sans-bold' : 'font-sans'}
                  style={[styles.description, anonymous && styles.pink]}
                >
                  {anonymous ? nickname : fullName}
                </Text>
              </View>
              <CustomIcon name={anonymous ? 'newPostAnonymous' : 'newPostPerson'} size={18} />
            </Pressable>
          ))}
        </View>
      </LegalCard>
    </>
  );
}
const styles = StyleSheet.create({
  topics: { padding: 14, gap: 10 },
  heading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { fontSize: 11.5, lineHeight: 17.25, color: '#1A1A1A', letterSpacing: 0.575 },
  required: {
    fontSize: 10,
    lineHeight: 15,
    color: '#E63946',
    borderRadius: 20,
    paddingHorizontal: 7,
    paddingVertical: 2,
    backgroundColor: '#E639461A',
    borderWidth: 1,
    borderColor: '#E6394633',
    overflow: 'hidden',
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  topic: {
    width: '48.8%',
    flexGrow: 1,
    minHeight: 56,
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    backgroundColor: '#F1F3F566',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selected: { borderWidth: 2, borderColor: '#FF416C' },
  fill: { ...StyleSheet.absoluteFill, borderRadius: 12 },
  icon: { width: 32, height: 32, borderRadius: 8.444, alignItems: 'center', justifyContent: 'center' },
  iconFill: { ...StyleSheet.absoluteFill, borderRadius: 8.444 },
  copy: { flex: 1 },
  name: { fontSize: 12.5, lineHeight: 18.75, color: '#1A1A1A' },
  description: { fontSize: 10, lineHeight: 15, color: '#4A4A4A' },
  pink: { color: '#FF416C' },
  identity: { gap: 14 },
  identityTitle: { fontSize: 11, lineHeight: 16.5, letterSpacing: 1.1, color: '#4A4A4A' },
  identities: { flexDirection: 'row', gap: 10 },
  identityOption: {
    flex: 1,
    minHeight: 62.5,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 14,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: '#FF416C' },
  radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF416C' },
});
