import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { CustomIcon, type CustomIconProps } from '../../components/ui/CustomIcon';

export const captureCategories = ['QUÁN XÓM', 'TIN TỨC XÓM', 'HỎI ĐÁP'] as const;
export type CaptureCategory = (typeof captureCategories)[number];

export function CaptureIconButton({
  icon,
  label,
  onPress,
  round = false,
  selected = false,
  disabled = false,
}: {
  icon: CustomIconProps['name'];
  label: string;
  onPress: () => void;
  round?: boolean;
  selected?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.iconButton,
        round && styles.round,
        selected && styles.selected,
        disabled && styles.disabled,
      ]}
    >
      <BlurView pointerEvents="none" intensity={12} tint="dark" style={StyleSheet.absoluteFill} />
      <CustomIcon name={icon} size={round ? 18 : 24} />
    </Pressable>
  );
}

export function CaptureControls({
  category,
  onCategory,
  onCapture,
  onGallery,
  onFlip,
  busy,
  ready,
  bottom,
}: {
  category: CaptureCategory;
  onCategory: (category: CaptureCategory) => void;
  onCapture: () => void;
  onGallery: () => void;
  onFlip: () => void;
  busy: boolean;
  ready: boolean;
  bottom: number;
}) {
  const { width } = useWindowDimensions();
  return (
    <LinearGradient
      colors={['transparent', '#000000CC', '#000000']}
      style={[styles.footer, { paddingBottom: Math.max(48, bottom + 14) }]}
    >
      <View accessibilityRole="tablist" style={styles.categories}>
        {captureCategories.map((item) => (
          <Pressable
            key={item}
            accessibilityRole="tab"
            accessibilityState={{ selected: item === category }}
            onPress={() => onCategory(item)}
            hitSlop={10}
            style={styles.category}
          >
            <Text
              className="font-sans-bold"
              style={[styles.categoryText, item === category && styles.activeText]}
            >
              {item}
            </Text>
            {item === category && <LinearGradient colors={['#FF416C', '#FF4B2B']} style={styles.indicator} />}
          </Pressable>
        ))}
      </View>
      <View style={[styles.actions, { gap: Math.min(59.33, (width - 224) / 2) }]}>
        <CaptureIconButton
          icon="captureGallery"
          label="Chọn ảnh từ thư viện"
          onPress={onGallery}
          disabled={busy}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Chụp ảnh"
          accessibilityState={{ disabled: !ready || busy, busy }}
          disabled={!ready || busy}
          onPress={onCapture}
          style={styles.shutterShadow}
        >
          <LinearGradient colors={['#FF416C', '#FF4B2B']} style={styles.shutter}>
            <View style={styles.shutterInner}>
              {busy ? (
                <ActivityIndicator color="#FF416C" />
              ) : (
                <LinearGradient colors={['#FF416C', '#FF4B2B']} style={styles.shutterDot} />
              )}
            </View>
          </LinearGradient>
        </Pressable>
        <CaptureIconButton
          icon="captureFlip"
          label="Đổi camera trước hoặc sau"
          onPress={onFlip}
          disabled={!ready || busy}
        />
      </View>
      <Text className="font-sans-medium" style={styles.hint}>
        Chụp trực tiếp tại chỗ để được gắn huy hiệu xác thực &amp; nhận thêm điểm uy tín
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    overflow: 'hidden',
    width: 48,
    height: 48,
    borderRadius: 13.333,
    backgroundColor: '#FFFFFF1A',
    borderWidth: 1,
    borderColor: '#FFFFFF26',
    alignItems: 'center',
    justifyContent: 'center',
  },
  round: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#00000066', borderColor: '#FFFFFF1A' },
  selected: { borderColor: '#FF416C', backgroundColor: '#FF416C55' },
  disabled: { opacity: 0.45 },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 20,
  },
  categories: { flexDirection: 'row', justifyContent: 'center', gap: 24, height: 20 },
  category: { alignItems: 'center', justifyContent: 'flex-start', height: 20 },
  categoryText: { fontSize: 12, lineHeight: 16, color: '#FFFFFF80' },
  activeText: { color: '#FF416C', letterSpacing: 0.6 },
  indicator: { width: 16, height: 2, borderRadius: 1, position: 'absolute', bottom: 0 },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  shutterShadow: {
    shadowColor: '#FF416C',
    shadowOpacity: 0.6,
    shadowRadius: 12.5,
    shadowOffset: { width: 0, height: 0 },
  },
  shutter: { width: 80, height: 80, borderRadius: 40, padding: 4 },
  shutterInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: '#00000066',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterDot: { width: 20, height: 20, borderRadius: 10 },
  hint: {
    fontSize: 11,
    lineHeight: 16.5,
    textAlign: 'center',
    color: '#FFFFFFB3',
    maxWidth: 328,
    alignSelf: 'center',
  },
});
