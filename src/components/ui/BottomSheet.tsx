import { useEffect, useRef, type ReactNode } from 'react';
import { Animated, Modal, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onDismiss?: () => void;
  children: ReactNode;
  variant?: 'default' | 'actions';
}
export function BottomSheet({
  visible,
  onClose,
  onDismiss,
  children,
  variant = 'default',
}: BottomSheetProps) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(height)).current;
  const actions = variant === 'actions';
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
      <View className="flex-1 justify-end">
        {actions ? (
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
          className={actions ? 'absolute inset-0 bg-black/60' : 'absolute inset-0 bg-ink/40'}
          onPress={onClose}
        />
        <Animated.View
          className={
            actions
              ? 'rounded-t-[40px] border-t border-[#E9ECEF] bg-white px-5 pt-5'
              : 'rounded-t-3xl bg-cream px-5 pb-8 pt-4'
          }
          style={
            actions
              ? {
                  paddingBottom: Math.max(32, insets.bottom),
                  maxHeight: height - insets.top,
                  transform: [{ translateY }],
                }
              : undefined
          }
        >
          <View
            className={
              actions
                ? 'mx-auto mb-1 h-1.5 w-12 rounded-full bg-[#4A4A4A]/30'
                : 'mx-auto mb-4 h-1 w-9 rounded-full bg-border'
            }
          />
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}
