import { useEffect, useState, type ReactNode } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onDismiss?: () => void;
  children: ReactNode;
  variant?: 'default' | 'actions' | 'dialog';
  contentStyle?: StyleProp<ViewStyle>;
  showHandle?: boolean;
}
export function BottomSheet({
  visible,
  onClose,
  onDismiss,
  children,
  variant = 'default',
  contentStyle,
  showHandle = true,
}: BottomSheetProps) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [translateY] = useState(() => new Animated.Value(height));
  const actions = variant === 'actions';
  const dialog = variant === 'dialog';
  useEffect(() => {
    if (!visible || !actions) return;
    translateY.setValue(height);
    const animation = Animated.timing(translateY, { toValue: 0, duration: 260, useNativeDriver: true });
    animation.start();
    return () => animation.stop();
  }, [visible, actions, height, translateY]);
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
      onDismiss={onDismiss}
    >
      <View className={dialog ? 'flex-1 justify-center px-4' : 'flex-1 justify-end'}>
        {actions || dialog ? (
          <BlurView
            pointerEvents="none"
            intensity={4}
            tint="dark"
            experimentalBlurMethod="dimezisBlurView"
            style={StyleSheet.absoluteFill}
          />
        ) : null}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Đóng bảng tuỳ chọn"
          className={
            dialog
              ? 'absolute inset-0 bg-black/65'
              : actions
                ? 'absolute inset-0 bg-black/60'
                : 'absolute inset-0 bg-ink/40'
          }
          onPress={onClose}
        />
        <Animated.View
          className={
            dialog
              ? 'rounded-[44px] border border-[#E9ECEF]/80 bg-white p-6'
              : actions
                ? contentStyle
                  ? 'border-t border-[#E9ECEF] bg-white'
                  : 'rounded-t-[40px] border-t border-[#E9ECEF] bg-white px-5 pt-5'
                : 'rounded-t-3xl bg-cream px-5 pb-8 pt-4'
          }
          style={[
            dialog
              ? { maxHeight: height - insets.top - insets.bottom - 32 }
              : actions
                ? {
                    paddingBottom: Math.max(32, insets.bottom),
                    maxHeight: height - insets.top,
                    transform: [{ translateY }],
                  }
                : undefined,
            contentStyle,
          ]}
        >
          {!dialog && showHandle ? (
            <View
              className={
                actions
                  ? 'mx-auto mb-1 h-1.5 w-12 rounded-full bg-[#4A4A4A]/30'
                  : 'mx-auto mb-4 h-1 w-9 rounded-full bg-border'
              }
            />
          ) : null}
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}
