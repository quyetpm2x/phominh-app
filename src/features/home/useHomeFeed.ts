import { selectFeedPosts } from './selectFeedPosts';
import { applyPostEdit } from '../post-edit/postEdit';
import { usePostInteractions } from './postInteractions';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useRef, useState } from 'react';
import { Alert, type ScrollView } from 'react-native';
import {
  DEFAULT_HOME_AREA,
  HOME_AREA_STORAGE_KEY,
  WORK_AREA_STORAGE_KEY,
  parseHomeArea,
  type HomeArea,
} from '../../lib/homeArea';
import {
  EMPTY_PROFILE,
  LOCAL_SIGN_IN_KEY,
  PROFILE_STORAGE_KEY,
  restoreProfile,
} from '../../lib/personalProfile';

import { POSTS, POST_DRAFT_STORAGE_KEY } from './data';
import type { AreaTab, FeedPost, Filter, Sheet } from './types';

export function useHomeFeed() {
  const {
    liked,
    edits,
    extensions,
    saved,
    comments,
    hidden,
    reports,
    reducedTopics,
    reduceTopic,
    blockedAuthors,
    blockAuthor,
    unblockAuthor,
    restoreTopic,
    setHidden,
    setLiked,
    setSaved,
    setComments,
  } = usePostInteractions();
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [home, setHome] = useState<HomeArea>(DEFAULT_HOME_AREA);
  const [work, setWork] = useState<HomeArea | null>(null);
  const [nearby, setNearby] = useState<HomeArea | null>(null);
  const [tab, setTab] = useState<AreaTab>('nearby');
  const [areaLabel, setAreaLabel] = useState('Khu vực của bạn');
  const [filter, setFilter] = useState<Filter>('all');
  const [sheet, setSheet] = useState<Sheet>(null);
  const [selected, setSelected] = useState(0);
  const [menu, setMenu] = useState<number | null>(null);
  const [ownedMenuPost, setOwnedMenuPost] = useState<FeedPost | null>(null);
  const [sharingPost, setSharingPost] = useState<FeedPost | null>(null);
  const [comment, setComment] = useState('');
  const [draft, setDraft] = useState('');
  const [unread, setUnread] = useState(3);
  const [loggingOut, setLoggingOut] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const scroll = useRef<ScrollView>(null);
  const selectedArea = tab === 'work' && work ? work : tab === 'nearby' && nearby ? nearby : home;
  const currentPosts = POSTS.map((post) => applyPostEdit(post, edits[post.id]));
  const selectedPost = currentPosts[selected];
  const visiblePosts = selectFeedPosts(currentPosts, filter, {
    hidden,
    reports,
    blockedAuthors,
    reducedTopics,
    extensions,
  });

  useEffect(() => {
    let active = true;
    const load = async () => {
      const values = await Promise.allSettled([
        SecureStore.getItemAsync(LOCAL_SIGN_IN_KEY),
        SecureStore.getItemAsync(PROFILE_STORAGE_KEY),
        SecureStore.getItemAsync(HOME_AREA_STORAGE_KEY),
        SecureStore.getItemAsync(WORK_AREA_STORAGE_KEY),
        SecureStore.getItemAsync(POST_DRAFT_STORAGE_KEY),
      ]);
      if (!active) return;
      const value = (index: number) => (values[index].status === 'fulfilled' ? values[index].value : null);
      setSignedIn(value(0) === 'true');
      // Demo account is configured as an activated shop so the registered-shop tab is visible.
      setProfile({ ...restoreProfile(value(1)), isShopRegistered: true });
      setHome(parseHomeArea(value(2)) ?? DEFAULT_HOME_AREA);
      setWork(parseHomeArea(value(3)));
      setDraft(value(4) ?? '');
      try {
        if (value(0) !== 'true') return;
        const permission = await Location.getForegroundPermissionsAsync();
        if (!permission.granted) return;
        const position = await Location.getLastKnownPositionAsync();
        if (active && position)
          setNearby({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            radiusKm: 1.5,
          });
      } catch {
        /* Saved home remains available without GPS. */
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    let active = true;
    setAreaLabel(tab === 'work' ? 'Chỗ làm của bạn' : 'Khu vực của bạn');
    const resolve = async () => {
      try {
        const permission = await Location.getForegroundPermissionsAsync();
        if (!permission.granted) return;
        const [address] = await Location.reverseGeocodeAsync({
          latitude: selectedArea.latitude,
          longitude: selectedArea.longitude,
        });
        if (active && address)
          setAreaLabel(address.street || address.district || address.city || 'Khu vực của bạn');
      } catch {
        /* Keep the area label when address lookup is unavailable. */
      }
    };
    if (signedIn) void resolve();
    return () => {
      active = false;
    };
  }, [selectedArea.latitude, selectedArea.longitude, tab, signedIn]);

  const changeTab = (next: AreaTab) => {
    if (next === 'work' && !work) {
      Alert.alert('Chưa chọn Chỗ làm', 'Bạn có thể thiết lập khu vực chỗ làm khi cần.');
      return;
    }
    setTab(next);
    scroll.current?.scrollTo({ y: 0, animated: true });
  };
  const openPost = (index: number, next: Sheet) => {
    setSelected(index);
    setComment('');
    setSheet(next);
  };
  const sharePost = (index: number) => setSharingPost(currentPosts[index] ?? null);
  const logout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await SecureStore.deleteItemAsync(LOCAL_SIGN_IN_KEY);
      usePostInteractions.getState().reset();
      setSheet(null);
      router.replace('/(auth)/welcome');
    } catch {
      Alert.alert('Chưa đăng xuất được', 'Vui lòng thử lại.');
    } finally {
      setLoggingOut(false);
    }
  };
  const saveDraft = async () => {
    if (savingDraft || !draft.trim()) return;
    setSavingDraft(true);
    try {
      await SecureStore.setItemAsync(POST_DRAFT_STORAGE_KEY, draft.trim());
      setSheet(null);
      Alert.alert('Đã lưu bản nháp', 'Bản nháp của bạn đã được lưu trên thiết bị.');
    } catch {
      Alert.alert('Chưa lưu được bản nháp', 'Vui lòng thử lại.');
    } finally {
      setSavingDraft(false);
    }
  };

  return {
    signedIn,
    reports,
    blockedAuthors,
    blockAuthor,
    unblockAuthor,
    restoreTopic,
    reducedTopics,
    reduceTopic,
    profile,
    home,
    nearby,
    tab,
    areaLabel,
    filter,
    sheet,
    selectedPost,
    selectedArea,
    menu,
    ownedMenuPost,
    setOwnedMenuPost,
    liked,
    saved,
    comment,
    comments,
    draft,
    unread,
    loggingOut,
    savingDraft,
    scroll,
    visiblePosts,
    changeTab,
    openPost,
    sharePost,
    sharingPost,
    setSharingPost,
    logout,
    saveDraft,
    setSheet,
    setFilter,
    setMenu,
    setLiked,
    setSaved,
    setHidden,
    setComment,
    setComments,
    setDraft,
    setUnread,
    setNearby,
    setTab,
  };
}
export type HomeFeedController = ReturnType<typeof useHomeFeed>;
