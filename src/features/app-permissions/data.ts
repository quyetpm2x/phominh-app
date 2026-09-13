import type { DevicePermission } from '../../hooks/useDevicePermissions';
import type { CustomIconProps } from '../../components/ui/CustomIcon';
export interface PermissionItem {
  key: DevicePermission;
  title: string;
  subtitle: string;
  icon: CustomIconProps['name'];
  background: string;
  badge?: string;
  badgeColor?: string;
}
export const PERMISSION_ITEMS: PermissionItem[] = [
  {
    key: 'location',
    title: 'Vị trí (GPS)',
    subtitle: 'Bán kính tin & khu phố xung quanh',
    icon: 'appPermissionLocation',
    background: '#00BC7D1A',
    badge: 'Bắt buộc',
    badgeColor: '#009966',
  },
  {
    key: 'notifications',
    title: 'Thông báo đẩy',
    subtitle: 'Cảnh báo khẩn, bình luận & tin mới',
    icon: 'appPermissionBell',
    background: '#FE9A001A',
    badge: 'Khuyên dùng',
    badgeColor: '#E17100',
  },
  {
    key: 'camera',
    title: 'Máy ảnh (Camera)',
    subtitle: 'Chụp tin nhanh Locket & xác thực quán',
    icon: 'appPermissionCamera',
    background: '#00BC7D1A',
  },
  {
    key: 'photos',
    title: 'Thư viện ảnh',
    subtitle: 'Đăng ảnh phản ánh, menu & cập nhật',
    icon: 'appPermissionPhotos',
    background: '#00A6F41A',
  },
  {
    key: 'microphone',
    title: 'Ghi âm',
    subtitle: 'Đăng bài & tìm kiếm bằng giọng nói',
    icon: 'appPermissionMicrophone',
    background: '#AD46FF1A',
  },
];
