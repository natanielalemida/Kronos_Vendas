import SincronizarImages from '../../../../../sync/images/syncImagensProdutos';
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

  const images = new SincronizarImages(    usuario as UsuarioDto,
    organizationCode as number,)

  const clean = async () => {
    await newSync.iniciarSincronizacao();
  };

  const limpar = async () => {
    await newSync.limparDados();
  };

  const sincronizarImagens = async () => {
    await images.runSync();
  };
  return {
    limpar,
    clean,
    sincronizarImagens
  };
}
