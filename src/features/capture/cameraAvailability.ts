import { CameraView } from 'expo-camera';
import { Platform } from 'react-native';

export async function checkCameraAvailability(platform = Platform.OS): Promise<boolean> {
  // expo-camera only implements isAvailableAsync on web. On native, let
  // permission checks and CameraView.onMountError determine whether it can open.
  if (platform !== 'web') return true;
  return CameraView.isAvailableAsync();
}
