import type { CustomIconProps } from '../../components/ui/CustomIcon';

interface ReportReason {
  id: string;
  title: string;
  description: string;
  icon: CustomIconProps['name'];
}
export const REPORT_REASONS = [
  {
    id: 'false_information',
    title: 'Thông tin sai sự thật / Lừa đảo',
    description: 'Sai giá, địa chỉ giả, lừa gạt cư dân',
    icon: 'reportFalseInfo',
  },
  {
    id: 'spam',
    title: 'Spam quảng cáo rác',
    description: 'Đăng lặp lại nhiều lần, spam link',
    icon: 'reportSpam',
  },
  {
    id: 'offensive',
    title: 'Nội dung xúc phạm, đồi trụy',
    description: 'Xúc phạm cá nhân, ngôn từ thô tục',
    icon: 'reportOffensive',
  },
  {
    id: 'other',
    title: 'Lý do khác',
    description: 'Nội dung không phù hợp với khu phố',
    icon: 'reportOther',
  },
] as const satisfies readonly ReportReason[];
export type ReportReasonId = (typeof REPORT_REASONS)[number]['id'];
