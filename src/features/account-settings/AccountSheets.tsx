import { StyleSheet, Text, View } from 'react-native';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { Button } from '../../components/ui/Button';
export type AccountSheet = 'logout' | 'phone' | 'bank';
const DETAILS = {
  logout: [
    'Đăng xuất khỏi thiết bị này?',
    'Bạn sẽ cần đăng nhập lại để tiếp tục sử dụng. Hồ sơ đã lưu trên thiết bị được giữ lại.',
  ],
  phone: [
    'Thay đổi số điện thoại',
    'Chức năng thay đổi số điện thoại cần xác thực OTP và chưa được kết nối trong phiên bản hiện tại.',
  ],
  bank: [
    'Tài khoản nhận tiền',
    'Chức năng liên kết và quản lý tài khoản ngân hàng chưa được kết nối trong phiên bản hiện tại.',
  ],
} as const;
export function AccountSheets({
  sheet,
  onClose,
  loggingOut,
  onLogout,
}: {
  sheet: AccountSheet | null;
  onClose: () => void;
  loggingOut: boolean;
  onLogout: () => Promise<void>;
}) {
  return (
    <BottomSheet
      visible={sheet !== null}
      onClose={() => {
        if (!loggingOut) onClose();
      }}
      variant="actions"
    >
      <View style={styles.content}>
        <Text className="font-sans-bold text-lg text-ink">{sheet ? DETAILS[sheet][0] : ''}</Text>
        <Text className="font-sans text-sm text-muted">{sheet ? DETAILS[sheet][1] : ''}</Text>
        {sheet === 'logout' ? (
          <Button
            label={loggingOut ? 'Đang đăng xuất…' : 'Đăng xuất'}
            variant="danger"
            disabled={loggingOut}
            onPress={() => void onLogout()}
          />
        ) : null}
        <Button
          label={sheet === 'logout' ? 'Huỷ' : 'Đóng'}
          variant="outline"
          disabled={loggingOut}
          onPress={onClose}
        />
      </View>
    </BottomSheet>
  );
}
const styles = StyleSheet.create({ content: { gap: 16, paddingVertical: 16 } });
