import { useEffect, useRef, useState } from 'react';
import { Alert, Clipboard, Platform, Share } from 'react-native';
import { INVITE_PREVIEW } from './data';

export function useInviteActions() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sharing = useRef(false);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const copyText = async (text: string) => {
    if (Platform.OS === 'web') await navigator.clipboard.writeText(text);
    else Clipboard.setString(text);
  };
  const copyCode = async () => {
    try {
      await copyText(INVITE_PREVIEW.code);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      Alert.alert('Chưa sao chép được', 'Bạn có thể nhấn giữ mã giới thiệu để sao chép.');
    }
  };
  const copyLink = async () => {
    if (!INVITE_PREVIEW.referralUrl) {
      Alert.alert('Liên kết mời chưa sẵn sàng', 'Bạn có thể sao chép mã giới thiệu để chia sẻ.');
      return;
    }
    try {
      await copyText(INVITE_PREVIEW.referralUrl);
      Alert.alert('Đã sao chép liên kết');
    } catch {
      Alert.alert('Chưa sao chép được', 'Vui lòng thử lại.');
    }
  };
  const share = async () => {
    if (sharing.current) return;
    sharing.current = true;
    try {
      // Match the existing post sharing flow: the OS lets the user choose an installed app.
      await Share.share({
        title: 'Mời bạn bè đến Phố Mình',
        message: `Cùng tham gia Phố Mình với mình nhé! Mã giới thiệu của mình: ${INVITE_PREVIEW.code}${INVITE_PREVIEW.referralUrl ? `\n${INVITE_PREVIEW.referralUrl}` : ''}`,
      });
    } catch {
      Alert.alert('Chưa chia sẻ được', 'Vui lòng thử lại.');
    } finally {
      sharing.current = false;
    }
  };
  return { copied, copyCode, copyLink, share };
}
