import Loading from '@/modules/components/loading/Loading';
import {useSetupExitScreen} from './hooks/useSetupExitScreen';
import {ExitScreenProps} from './types/menu-router.types';

export default function Exit({navigation}: ExitScreenProps) {
  useSetupExitScreen(navigation);

  return <Loading isModalLoadingActive={true} />;
}
