import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { router } from 'expo-router';
import { usePostInteractions } from '../home/postInteractions';
import type { FeedPost } from '../home/types';
import { createExtensionResult, type ExtensionResult } from './extensionResult';
import { useRemainingPostHours } from './useRemainingPostHours';

export function usePostExtension(post: FeedPost | null, dismiss: () => void) {
  const [hours, setHours] = useState<ExtensionResult['hours']>(24);
  const [boost, setBoost] = useState(true);
  const [result, setResult] = useState<ExtensionResult | null>(null);
  const submitted = useRef(false);
  const pending = useRef<(() => void) | null>(null);
  const extensions = usePostInteractions((state) => state.extensions);
  const remaining = useRemainingPostHours(post, post !== null);
  const flush = () => {
    const action = pending.current;
    pending.current = null;
    action?.();
  };
  useEffect(() => {
    if (post || Platform.OS === 'ios') return;
    const timer = setTimeout(flush, 350);
    return () => clearTimeout(timer);
  }, [post]);
  const close = () => {
    dismiss();
    setHours(24);
    setBoost(true);
    setResult(null);
    submitted.current = false;
  };
  const confirm = () => {
    if (!post || submitted.current) return;
    submitted.current = true;
    const next = createExtensionResult(
      post.id,
      hours,
      boost,
      post.remainingHours ?? 0,
      extensions[post.id]?.expiresAt,
    );
    usePostInteractions.getState().completeExtension(next);
    setResult(next);
  };
  const navigate = (destination: 'feed' | 'profile') => {
    if (!result) return;
    const postId = result.postId;
    pending.current = () =>
      router.dismissTo({
        pathname: '/home',
        params:
          destination === 'feed'
            ? { focusPost: postId, request: String(Date.now()) }
            : { panel: 'profile', request: String(Date.now()) },
      });
    close();
  };
  return { hours, setHours, boost, setBoost, result, remaining, close, confirm, navigate, flush };
}
