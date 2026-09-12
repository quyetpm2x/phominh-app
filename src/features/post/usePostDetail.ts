import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import {
  EMPTY_PROFILE,
  LOCAL_SIGN_IN_KEY,
  PROFILE_STORAGE_KEY,
  restoreProfile,
} from '../../lib/personalProfile';
import { findPost } from './findPost';
import { applyPostEdit } from '../post-edit/postEdit';
import { usePostInteractions } from '../home/postInteractions';
import { SAMPLE_COMMENTS, type PostComment } from './data';

export function usePostDetail(id: string | undefined) {
  const originalPost = findPost(id);
  const edit = usePostInteractions((state) => (id ? state.edits[id] : undefined));
  const post = originalPost ? applyPostEdit(originalPost, edit) : undefined;
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [draft, setDraft] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const { comments, saved, setSaved, setComments, useful, toggleUseful } = usePostInteractions();
  useEffect(() => {
    let active = true;
    Promise.allSettled([
      SecureStore.getItemAsync(LOCAL_SIGN_IN_KEY),
      SecureStore.getItemAsync(PROFILE_STORAGE_KEY),
    ]).then(([session, storedProfile]) => {
      if (!active) return;
      setSignedIn(session.status === 'fulfilled' && session.value === 'true');
      if (storedProfile.status === 'fulfilled') setProfile(restoreProfile(storedProfile.value));
    });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    setDraft('');
    setReplyTo(null);
    setLikedComments({});
  }, [id]);
  const localComments = post ? (comments[post.id] ?? []) : [];
  const rows: readonly PostComment[] = [
    ...(id === 'hoa' ? SAMPLE_COMMENTS : []),
    ...localComments.map((text, index) => ({
      id: `local-${index}`,
      name: profile.fullName || 'Bạn',
      avatar: profile.avatarUri ? { uri: profile.avatarUri } : undefined,
      time: 'Vừa xong',
      text,
    })),
  ];
  const sendComment = () => {
    if (!post || post.commentsEnabled === false || !draft.trim()) return;
    const text = replyTo ? `@${replyTo}: ${draft.trim()}` : draft.trim();
    setComments((previous) => ({ ...previous, [post.id]: [...(previous[post.id] ?? []), text] }));
    setDraft('');
    setReplyTo(null);
  };
  const share = () => setShareOpen(true);
  const contact = () =>
    Alert.alert(
      'Chưa có thông tin liên hệ',
      'Số 090... trong thiết kế là dữ liệu minh hoạ. Số điện thoại và Zalo của quán chưa được cập nhật.',
    );
  return {
    post,
    signedIn,
    profile,
    draft,
    setDraft,
    replyTo,
    setReplyTo,
    likedComments,
    setLikedComments,
    menuOpen,
    setMenuOpen,
    galleryOpen,
    setGalleryOpen,
    saved,
    setSaved,
    useful,
    toggleUseful,
    rows,
    commentCount: (id === 'hoa' ? 3 : 0) + localComments.length,
    sendComment,
    share,
    shareOpen,
    setShareOpen,
    contact,
  };
}
