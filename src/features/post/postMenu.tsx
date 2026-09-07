import { View } from 'react-native';
import type { ActionSheetItem } from '../../components/ui/ActionSheetMenu';
import { CustomIcon } from '../../components/ui/CustomIcon';

interface PostMenuActions {
  saved: boolean;
  onSave: () => void;
  onShare: () => void;
  onHide: () => void;
  onReport: () => void;
}
// One set of options for other people's posts, used by both the feed and detail screen.
export function getPostMenuItems({
  saved,
  onSave,
  onShare,
  onHide,
  onReport,
}: PostMenuActions): ActionSheetItem[] {
  return [
    {
      label: saved ? 'Bỏ lưu bài viết' : 'Lưu bài viết',
      description: 'Xem lại sau trong mục Hồ sơ của tôi',
      icon: (
        <View className="h-9 w-9 items-center justify-center rounded-lg bg-[#FE9A00]/10">
          <CustomIcon name="menuSave" size={18} />
        </View>
      ),
      onPress: onSave,
    },
    {
      label: 'Chia sẻ tin này',
      description: 'Gửi qua Zalo, Messenger hoặc sao chép link',
      icon: (
        <View className="h-9 w-9 items-center justify-center rounded-lg bg-[#00A6F4]/10">
          <CustomIcon name="menuShare" size={18} />
        </View>
      ),
      onPress: onShare,
      deferUntilDismiss: true,
    },
    {
      label: 'Ẩn bài viết / Không quan tâm',
      description: 'Giảm bớt các tin tương tự từ người này',
      icon: (
        <View className="h-9 w-9 items-center justify-center rounded-lg bg-[#79716B]/10">
          <CustomIcon name="menuHide" size={18} />
        </View>
      ),
      onPress: onHide,
      deferUntilDismiss: true,
    },
    {
      label: 'Báo cáo vi phạm',
      description: 'Tin giả, spam quảng cáo hoặc nội dung xấu',
      icon: (
        <View className="h-9 w-9 items-center justify-center rounded-lg bg-danger/15">
          <CustomIcon name="menuReport" size={18} />
        </View>
      ),
      destructive: true,
      deferUntilDismiss: true,
      onPress: onReport,
    },
  ];
}
