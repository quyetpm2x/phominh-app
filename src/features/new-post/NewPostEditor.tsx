import { useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { styles } from './newPostEditorStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { Avatar } from '../../components/ui/Avatar';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { TextInput } from '../../components/ui/TextInput';
import { LegalCard } from '../legal/LegalCard';
import { topics, type PostDraft } from './draft';

export function NewPostEditor({
  draft,
  update,
  onAdd,
  adding,
  name,
  avatar,
}: {
  draft: PostDraft;
  update: (patch: Partial<PostDraft>) => void;
  onAdd: () => void;
  adding: boolean;
  name: string;
  avatar: string | null;
}) {
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [showEmoji, setShowEmoji] = useState(false);
  const place = draft.photos.find((photo) => photo.place)?.place;
  const insert = (prefix: string, suffix = '') => {
    const text =
      draft.text.slice(0, selection.start) +
      prefix +
      draft.text.slice(selection.start, selection.end) +
      suffix +
      draft.text.slice(selection.end);
    if (text.length <= 500) {
      update({ text });
      setSelection({ start: selection.end + prefix.length, end: selection.end + prefix.length });
    }
  };
  return (
    <LegalCard style={styles.card}>
      <View style={styles.author}>
        <View>
          <LinearGradient colors={['#FF416C', '#FF4B2B']} style={styles.avatarRing}>
            <View style={styles.avatarBorder}>
              <Avatar
                initial={name.charAt(0)}
                size={36}
                radius={18}
                imageUrl={draft.anonymous ? null : avatar}
              />
            </View>
          </LinearGradient>
          <Text style={styles.star}>★</Text>
        </View>
        <View style={styles.authorCopy}>
          <View style={styles.authorNameRow}>
            <Text numberOfLines={1} className="font-sans-black" style={styles.authorName}>
              {draft.anonymous ? `Bí danh (${name})` : name}
            </Text>
            <Text className="font-sans-black" style={styles.topic}>
              {topics.find((t) => t.id === draft.topic)?.title.toUpperCase()}
            </Text>
          </View>
          <View style={styles.metadata}>
            <CustomIcon name="newPostRank" size={12} />
            <Text className="font-sans-bold" style={styles.rank}>
              Bậc 1
            </Text>
            <Text style={styles.dot}>•</Text>
            <CustomIcon name="newPostOnSite" size={12} />
            <Text className="font-sans-semibold" style={styles.local}>
              {place ? 'Tại chỗ' : 'Ảnh đã chọn'}
            </Text>
            {place?.accuracy != null && (
              <>
                <Text style={styles.dot}>•</Text>
                <CustomIcon name="newPostDistance" size={11} />
                <Text className="font-sans-bold" style={styles.distance}>
                  ~{Math.round(place.accuracy)}m
                </Text>
              </>
            )}
          </View>
        </View>
      </View>
      <View style={styles.body}>
        <TextInput
          accessibilityLabel="Nội dung bài mới"
          placeholder="Chia sẻ thêm chi tiết câu chuyện cho xóm mình cùng biết nhé..."
          placeholderTextColor="#1A1A1A"
          value={draft.text}
          onChangeText={(text) => update({ text })}
          onSelectionChange={(event) => setSelection(event.nativeEvent.selection)}
          multiline
          maxLength={500}
          textAlignVertical="top"
          style={[styles.input, draft.textColor ? { color: draft.textColor } : null]}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photos}>
          {draft.photos.map((photo, index) => (
            <View key={`${photo.uri}-${index}`} style={styles.photo}>
              <Image
                accessibilityLabel={`Ảnh bài viết ${index + 1}`}
                source={{ uri: photo.uri }}
                style={styles.image}
              />
              <View style={styles.photoTag}>
                <CustomIcon name="newPostPhotoTag" size={9} />
                <Text className="font-sans-medium" style={styles.photoTagText}>
                  {photo.place ? 'Tại chỗ' : 'Thư viện'}
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Xóa ảnh ${index + 1}`}
                hitSlop={8}
                onPress={() => update({ photos: draft.photos.filter((_, i) => i !== index) })}
                style={styles.remove}
              >
                <CustomIcon name="newPostRemove" size={9} />
              </Pressable>
            </View>
          ))}
          {draft.photos.length < 6 && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Thêm ảnh"
              disabled={adding}
              onPress={onAdd}
              style={styles.add}
            >
              <CustomIcon name="newPostAdd" size={20} />
              <Text className="font-sans-bold" style={styles.addText}>
                {adding ? 'Đang chọn…' : 'Thêm ảnh'}
              </Text>
            </Pressable>
          )}
        </ScrollView>
        <View style={styles.toolbar}>
          <View style={styles.tools}>
            {(
              [
                {
                  icon: 'newPostBold',
                  label: 'In đậm phần văn bản đã chọn',
                  action: () => insert('**', '**'),
                },
                { icon: 'newPostMention', label: 'Thêm ký hiệu nhắc tên', action: () => insert('@') },
                {
                  icon: 'newPostEmoji',
                  label: 'Chọn biểu tượng cảm xúc',
                  action: () => setShowEmoji(!showEmoji),
                },
              ] as const
            ).map((tool) => (
              <Pressable
                key={tool.icon}
                accessibilityRole="button"
                accessibilityLabel={tool.label}
                onPress={tool.action}
                style={styles.tool}
              >
                <CustomIcon name={tool.icon} size={14} />
              </Pressable>
            ))}
          </View>
          <View style={styles.countRow}>
            <Text className="font-sans-medium" style={styles.count}>
              {draft.text.length}/500
            </Text>
            <View style={[styles.countDot, draft.text.length === 500 && styles.countLimit]} />
          </View>
        </View>
        {showEmoji && (
          <View style={styles.tools}>
            {['😊', '❤️', '👍', '🎉', '🙏'].map((emoji) => (
              <Pressable
                key={emoji}
                accessibilityRole="button"
                accessibilityLabel={emoji}
                onPress={() => insert(emoji)}
                style={styles.tool}
              >
                <Text>{emoji}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </LegalCard>
  );
}
