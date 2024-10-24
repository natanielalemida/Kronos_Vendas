import runSync from '../../../../../sync/runSync/runSync';
import {UsuarioDto} from '../../../../login/hooks/type';
import {useCliente} from '../../Clientes/context/clientContext';
import {UseSyncHookProps} from '../type';

export default function UseSync({setProgress}: UseSyncHookProps) {
  const {usuario, organizationCode} = useCliente();

  const newSync = new runSync(
    usuario as UsuarioDto,
    organizationCode as number,
    setProgress,
  );
  const clean = async () => {
    await newSync.iniciarSincronizacao();
  };

  const limpar = async () => {
    await newSync.limparDados();
  };
  return {
    limpar,
    clean,
  };
}
