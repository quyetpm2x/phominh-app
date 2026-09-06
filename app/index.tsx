import { Redirect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useState } from 'react';
import { Splash } from '../src/components/Splash';
import { LOCAL_SIGN_IN_KEY } from '../src/lib/personalProfile';

export default function Index() {
  const [splashDone, setSplashDone] = useState(false);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const onSplashDone = useCallback(() => setSplashDone(true), []);
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
  if (!splashDone || signedIn === null) return <Splash onDone={onSplashDone} />;
  return <Redirect href={signedIn ? '/home' : '/(auth)/welcome'} />;
}
