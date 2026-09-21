import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { EMPTY_PROFILE, PROFILE_STORAGE_KEY, restoreProfile } from '../../lib/personalProfile';

export function useComposerProfile() {
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  useEffect(() => {
    let mounted = true;
    void SecureStore.getItemAsync(PROFILE_STORAGE_KEY)
      .then((raw) => {
        if (mounted) setProfile(restoreProfile(raw));
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);
  return profile;
}
