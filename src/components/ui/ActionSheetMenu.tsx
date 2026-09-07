import { useEffect, useRef, type ReactNode } from 'react';
import { Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { BottomSheet } from './BottomSheet';
import { CustomIcon } from './CustomIcon';

export interface ActionSheetItem {
  label: string;
  onPress: () => void;
  destructive?: boolean;
  description?: string;
  icon?: ReactNode;
  // Wait until the native modal closes before sharing, navigating or showing another modal.
  deferUntilDismiss?: boolean;
}
interface ActionSheetMenuProps {
  visible: boolean;
  onClose: () => void;
  items: ActionSheetItem[];
  title?: string;
  subtitle?: string;
}
export function ActionSheetMenu({ visible, onClose, items, title, subtitle }: ActionSheetMenuProps) {
  const pending = useRef<(() => void) | null>(null);
  const flush = () => {
    const action = pending.current;
    pending.current = null;
    action?.();
  };
  useEffect(() => {
    if (visible || Platform.OS === 'ios') return;
    const timer = setTimeout(flush, 350);
    return () => clearTimeout(timer);
  }, [visible]);
  const choose = (item: ActionSheetItem) => {
    if (item.deferUntilDismiss) pending.current = item.onPress;
    onClose();
    if (!item.deferUntilDismiss) item.onPress();
  };
  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      onDismiss={flush}
      variant={title ? 'actions' : 'default'}
    >
      {title ? (
        <View className="mb-[15px] flex-row items-center gap-2.5 border-b border-[#E9ECEF]/60 pb-[9px]">
          <View className="h-9 w-9 items-center justify-center rounded-[10px] bg-primary/10">
            <CustomIcon name="menuOptions" size={18} />
          </View>
          <View className="flex-1">
            <Text
              accessibilityRole="header"
              className="font-sans-bold text-[15px] leading-[22.5px] text-[#1A1A1A]"
            >
              {title}
            </Text>
            {subtitle ? (
              <Text numberOfLines={1} className="font-sans text-[11px] leading-[16.5px] text-[#4A4A4A]">
                {subtitle}
              </Text>
            ) : null}
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Đóng tuỳ chọn"
            onPress={onClose}
            className="h-8 w-8 items-center justify-center rounded-full bg-[#F1F3F5]"
          >
            <CustomIcon name="menuClose" size={14} />
          </Pressable>
        </View>
      ) : null}
      <ScrollView bounces={false} keyboardShouldPersistTaps="handled">
        {items.map((item, i) =>
          title ? (
            <Pressable
              key={item.label}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              accessibilityHint={item.description}
              onPress={() => choose(item)}
              className={`mb-1.5 min-h-[60px] flex-row items-center gap-3.5 rounded-[14px] p-3 ${item.destructive ? 'border border-danger/10' : ''}`}
            >
              {item.icon}
              <View className="flex-1">
                <Text
                  className={`font-sans-bold text-[14px] leading-[21px] ${item.destructive ? 'text-danger' : 'text-[#1A1A1A]'}`}
                >
                  {item.label}
                </Text>
                {item.description ? (
                  <Text className="font-sans text-[11px] leading-[16.5px] text-[#4A4A4A]">
                    {item.description}
                  </Text>
                ) : null}
              </View>
              <CustomIcon name={item.destructive ? 'menuReportChevron' : 'menuChevron'} size={14} />
            </Pressable>
          ) : (
            <Pressable
              key={item.label}
              accessibilityRole="button"
              onPress={() => choose(item)}
              className={`h-12 items-center justify-center ${i < items.length - 1 ? 'border-b border-border-soft' : ''}`}
            >
              <Text
                className={`font-sans-semibold text-[15px] ${item.destructive ? 'text-danger' : 'text-ink'}`}
              >
                {item.label}
              </Text>
            </Pressable>
          ),
        )}
      </ScrollView>
      {title ? (
        <Pressable
          accessibilityRole="button"
          onPress={onClose}
          className="mt-4 h-11 items-center justify-center rounded-xl bg-[#F1F3F5]"
        >
          <Text className="font-sans-bold text-[13px] text-[#1A1A1A]">Đóng</Text>
        </Pressable>
      ) : null}
    </BottomSheet>
  );
}
