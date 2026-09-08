import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useRef } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import type { HomeFeedController } from './useHomeFeed';

// Return from post actions to the requested feed card or the existing profile panel.
export function useHomeDestination({ scroll, setFilter, setSheet, signedIn }: HomeFeedController) {
  const params = useLocalSearchParams<{ focusPost?: string; panel?: string; request?: string }>();
  const target = useRef<string | null>(null);
  const positions = useRef<Record<string, number>>({});
  const handled = useRef<string | undefined>(undefined);
  const scrollToTarget = useCallback(() => {
    if (!target.current || positions.current[target.current] === undefined) return;
    scroll.current?.scrollTo({ y: Math.max(0, positions.current[target.current] - 16), animated: true });
  }, [scroll]);
  useFocusEffect(
    useCallback(() => {
      if (!signedIn || !params.request || handled.current === params.request) return;
      handled.current = params.request;
      if (params.panel === 'profile') {
        setSheet('profile');
        return;
      }
      if (!params.focusPost) return;
      target.current = params.focusPost;
      setFilter('all');
      let frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(scrollToTarget);
      });
      return () => cancelAnimationFrame(frame);
    }, [signedIn, params.request, params.panel, params.focusPost, setSheet, setFilter, scrollToTarget]),
  );
  const onPostLayout = (id: string, event: LayoutChangeEvent) => {
    positions.current[id] = event.nativeEvent.layout.y;
    if (id === target.current) scrollToTarget();
  };
  return {
    onPostLayout,
    onContentSizeChange: scrollToTarget,
    onScrollBeginDrag: () => {
      target.current = null;
    },
  };
}
