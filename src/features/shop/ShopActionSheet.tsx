import { ScrollView, Text, View } from 'react-native';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { Button } from '../../components/ui/Button';
import { type ShopAction } from './data';

export function ShopActionSheet({ action, onClose }: { action: ShopAction | null; onClose: () => void }) {
  const title = action === 'menu' ? 'Quản lý ảnh Menu' : 'Lịch sử thanh toán gói';
  return (
    <BottomSheet visible={action !== null} onClose={onClose} variant="actions">
      <ScrollView keyboardShouldPersistTaps="handled">
        <View className="gap-4 py-4">
          <Text accessibilityRole="header" className="font-sans-bold text-lg text-ink">
            {title}
          </Text>
          <Text className="font-sans text-sm text-muted">
            {action === 'menu'
              ? 'Chức năng quản lý ảnh menu sẽ được bổ sung sau.'
              : 'Chức năng xem lịch sử thanh toán sẽ được bổ sung sau.'}
          </Text>
          <Button label="Đóng" variant="outline" onPress={onClose} />
        </View>
      </ScrollView>
    </BottomSheet>
  );
}
