import {styles} from '../styles/syncPage.styles';
import {SyncActionCardTone} from '../types/sync-page.types';

export function getSyncToneStyle(tone: SyncActionCardTone) {
  switch (tone) {
    case 'success':
      return styles.actionButtonSuccess;
    case 'info':
      return styles.actionButtonInfo;
    case 'warning':
      return styles.actionButtonWarning;
    case 'neutral':
    default:
      return styles.actionButtonNeutral;
  }
}
