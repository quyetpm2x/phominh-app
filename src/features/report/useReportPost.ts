import { useEffect, useRef, useState } from 'react';
import { Keyboard } from 'react-native';
import { router } from 'expo-router';
import { usePostInteractions } from '../home/postInteractions';
import * as SecureStore from 'expo-secure-store';
import { LOCAL_SIGN_IN_KEY } from '../../lib/personalProfile';
import { POSTS } from '../home/data';
import { REPORT_REASONS, type ReportReasonId } from './reasons';

export function useReportPost(postId: string | undefined) {
  const post = POSTS.find((item) => item.id === postId);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [reason, setReason] = useState<ReportReasonId>(REPORT_REASONS[0].id);
  const [details, setDetails] = useState('');
  const submitting = useRef(false);
  useEffect(() => {
    submitting.current = false;
    setDetails('');
    setReason(REPORT_REASONS[0].id);
  }, [postId]);
  useEffect(() => {
    let active = true;
    SecureStore.getItemAsync(LOCAL_SIGN_IN_KEY)
      .then((value) => {
        if (active) setSignedIn(value === 'true');
      })
      .catch(() => {
        if (active) setSignedIn(false);
      });
    return () => {
      active = false;
    };
  }, []);
  const submit = () => {
    if (!post || !signedIn || submitting.current) return;
    submitting.current = true;
    Keyboard.dismiss();
    // Local demo only; replace with the reporting API before shipping real moderation.
    usePostInteractions
      .getState()
      .completeLocalReport({ postId: post.id, reason, details: reason === 'other' ? details.trim() : '' });
    router.replace('/report-success');
  };
  return { post, signedIn, reason, setReason, details, setDetails, submit };
}
