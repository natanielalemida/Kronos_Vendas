import {styles} from '../styles/syncPage.styles';
import {SyncActionCardTone} from '../types/sync-page.types';

export function getSyncToneStyle(tone: SyncActionCardTone) {
  switch (tone) {
    case 'success':
      return {
        card: styles.actionCardSuccess,
        badge: styles.actionBadgeSuccess,
      };
    case 'info':
      return {
        card: styles.actionCardInfo,
        badge: styles.actionBadgeInfo,
      };
    case 'warning':
      return {
        card: styles.actionCardWarning,
        badge: styles.actionBadgeWarning,
      };
    case 'neutral':
    default:
      return {
        card: styles.actionCardNeutral,
        badge: styles.actionBadgeNeutral,
      };
  }
}
