import { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { CustomIcon } from '../../components/ui/CustomIcon';
import { TextInput } from '../../components/ui/TextInput';
export function ChatComposer({
  name,
  onSend,
}: {
  name: string;
  onSend: (text: string, image?: string) => boolean;
}) {
  const [text, setText] = useState('');
  const [image, setImage] = useState<string>();
  const [picking, setPicking] = useState(false);
  async function pick(camera: boolean) {
    if (picking) return;
    setPicking(true);
    try {
      if (camera && !(await ImagePicker.requestCameraPermissionsAsync()).granted) {
        Alert.alert('Cần quyền camera', 'Cho phép ứng dụng sử dụng camera trong Cài đặt để chụp ảnh.');
        return;
      }
      const result = camera
        ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.85 })
        : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.85 });
      if (!result.canceled && result.assets[0]) setImage(result.assets[0].uri);
    } catch {
      Alert.alert('Chưa chọn được ảnh', 'Vui lòng thử lại.');
    } finally {
      setPicking(false);
    }
  }
  const send = () => {
    if (onSend(text, image)) {
      setText('');
      setImage(undefined);
    }
  };
  return (
    <View style={styles.composer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.quickReplies}
      >
        {['👍 Ok cô nhé', '🛵 Cháu đang chạy qua', '💰 Cháu chuyển khoản trước'].map((reply) => (
          <Pressable
            key={reply}
            accessibilityRole="button"
            onPress={() => setText(reply)}
            style={styles.chip}
          >
            <Text className="font-sans-semibold" style={styles.reply}>
              {reply}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      {image && (
        <View style={styles.attachment}>
          <Image source={{ uri: image }} style={styles.thumbnail} />
          <Pressable accessibilityRole="button" onPress={() => setImage(undefined)}>
            <Text className="font-sans-bold text-primary">Bỏ ảnh</Text>
          </Pressable>
        </View>
      )}
      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Chụp ảnh"
          disabled={picking}
          onPress={() => void pick(true)}
          style={styles.button}
        >
          <CustomIcon name="chatCamera" size={18} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Chọn ảnh từ thư viện"
          disabled={picking}
          onPress={() => void pick(false)}
          style={styles.button}
        >
          <CustomIcon name="chatGallery" size={18} />
        </Pressable>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder={`Nhắn tin cho ${name}...`}
          accessibilityLabel="Nội dung tin nhắn"
          placeholderTextColor="#1A1A1A"
          multiline
          maxLength={4000}
          style={styles.input}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Gửi tin nhắn"
          disabled={!text.trim() && !image}
          onPress={send}
        >
          <LinearGradient colors={['#FF416C', '#FF4B2B']} style={styles.button}>
            <CustomIcon name="chatSend" size={18} />
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  composer: { borderTopWidth: 1, borderColor: '#E9ECEF', backgroundColor: '#FFFFFFF2', padding: 12, gap: 8 },
  quickReplies: { gap: 8, paddingBottom: 4 },
  chip: {
    borderRadius: 100,
    backgroundColor: '#F1F3F5',
    borderWidth: 1,
    borderColor: '#E9ECEF99',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  reply: { fontSize: 11, lineHeight: 16.5, color: '#1A1A1A' },
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  button: {
    width: 40,
    height: 40,
    borderRadius: 11.111,
    backgroundColor: '#F1F3F5CC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    height: 'auto',
    minHeight: 42,
    maxHeight: 110,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    lineHeight: 19.5,
    fontFamily: 'BeVietnamPro_400Regular',
    backgroundColor: '#F1F3F599',
    borderColor: '#E9ECEFB3',
    borderRadius: 11.528,
  },
  attachment: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  thumbnail: { width: 60, height: 60, borderRadius: 8 },
});
