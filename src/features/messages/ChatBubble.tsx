import { Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Avatar } from '../../components/ui/Avatar';
import { CustomIcon } from '../../components/ui/CustomIcon';
import type { MessageContact } from './data';
import type { ChatMessage } from './chatStore';
export function ChatBubble({ message, contact }: { message: ChatMessage; contact: MessageContact }) {
  return (
    <View style={[styles.row, message.outgoing && styles.outgoing]}>
      {!message.outgoing && (
        <Avatar initial={contact.name[0]} imageSource={contact.avatar} size={28} radius={7.778} />
      )}
      <View style={styles.column}>
        <LinearGradient
          colors={message.outgoing ? ['#FF4B2B26', '#FF416C26'] : ['#F1F3F5CC', '#F1F3F5CC']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.bubble, message.outgoing ? styles.sent : styles.received]}
        >
          {message.image && <Image source={{ uri: message.image }} style={styles.image} resizeMode="cover" />}
          {!!message.text && (
            <Text className={message.outgoing ? 'font-sans-medium' : 'font-sans'} style={styles.text}>
              {message.text}
            </Text>
          )}
        </LinearGradient>
        <View style={[styles.timeRow, message.outgoing && styles.outgoing]}>
          <Text className="font-sans-medium" style={styles.time}>
            {message.time}
            {message.localOnly ? ' · Chưa gửi (bản thử trên thiết bị)' : ''}
          </Text>
          {message.outgoing && !message.localOnly && <CustomIcon name="chatRead" size={12} />}
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  outgoing: { justifyContent: 'flex-end' },
  column: { width: '78%', gap: 4 },
  bubble: { padding: 12, borderRadius: 19.556, gap: 8 },
  sent: { borderBottomRightRadius: 0, borderWidth: 1, borderColor: '#FF416C40' },
  received: { borderBottomLeftRadius: 0 },
  text: { fontSize: 13.5, lineHeight: 18.563, color: '#1A1A1A' },
  timeRow: { flexDirection: 'row', gap: 4, alignItems: 'center', paddingHorizontal: 4, minHeight: 24 },
  time: { fontSize: 10, lineHeight: 15, color: '#4A4A4A', flexShrink: 1 },
  image: { width: '100%', height: 180, borderRadius: 10 },
});
