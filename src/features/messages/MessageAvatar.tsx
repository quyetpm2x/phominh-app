import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import { Avatar } from '../../components/ui/Avatar';
import type { MessageContact } from './data';
export function MessageAvatar({
  contact,
  size = 48,
  online = false,
  highlighted = false,
}: {
  contact: MessageContact;
  size?: number;
  online?: boolean;
  highlighted?: boolean;
}) {
  const padding = highlighted ? 2 : 3;
  return (
    <View style={{ width: size, height: size }}>
      <LinearGradient
        colors={highlighted ? ['#FF416C', '#FF4B2B'] : ['#F1F3F5', '#F1F3F5']}
        style={{ padding, borderRadius: size / 3.6 }}
      >
        <Avatar
          initial={contact.name[0]}
          imageSource={contact.avatar}
          size={size - padding * 2}
          radius={(size - padding * 2) / 3.6}
        />
      </LinearGradient>
      {online && <View style={[styles.online, size === 40 ? styles.smallDot : styles.largeDot]} />}
    </View>
  );
}

const styles = StyleSheet.create({
  smallDot: { width: 12, height: 12 },
  largeDot: { width: 14, height: 14 },
  online: { position: 'absolute', right: -2, bottom: -2, borderRadius: 7, backgroundColor: '#00BC7D' },
});
