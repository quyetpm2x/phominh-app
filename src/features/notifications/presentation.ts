import type { CustomIconProps } from '../../components/ui/CustomIcon';
import type { NotificationType } from './data';

interface NotificationPresentation {
  color: string;
  icon: CustomIconProps['name'];
  badge: CustomIconProps['name'];
}

// Presentation belongs to the UI, not the notification payload.
const NOTIFICATION_PRESENTATION: Record<NotificationType, NotificationPresentation> = {
  comment: { color: '#FF416C', icon: 'feedComment', badge: 'feedComment' },
  reward: { color: '#00A982', icon: 'feedPriceNoti', badge: 'notiAward' },
  shop: { color: '#ED9200', icon: 'feedShop', badge: 'extendBoost' },
  likes: { color: '#FF416C', icon: 'statsHeart', badge: 'statsHeart' },
  reputation: { color: '#25A8D7', icon: 'feedShield', badge: 'menuStats' },
  feature: { color: '#AD64E9', icon: 'feedLive', badge: 'editInfo' },
};

export function getNotificationPresentation(type: NotificationType, read: boolean) {
  const presentation = NOTIFICATION_PRESENTATION[type];
  return {
    ...presentation,
    cardStyle: {
      borderColor: read ? '#E9ECEF99' : `${presentation.color}55`,
      backgroundColor: read ? '#FFFFFF' : `${presentation.color}06`,
      borderWidth: read ? 1 : 2,
      opacity: read ? 0.72 : 1,
    },
    iconStyle: {
      backgroundColor: `${presentation.color}18`,
      borderColor: `${presentation.color}30`,
    },
  };
}
