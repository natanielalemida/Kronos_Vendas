import {useState} from 'react';
import ApiInstace from '../../../../api/ApiInstace';
import {useNavigation} from '@react-navigation/native';
import { getOrganizacaoOffline } from '../../../../storage';

export function useFetch(handleChangeOrganization) {
  const navigation = useNavigation();
  const [organizations, setData] = useState<[]>([]);
  const [isLoadingOrganization, setLoading] = useState(false);

  const getOrganizations = async () => {
    try {
      setLoading(true);
      const data = await ApiInstace.openUrl({
        method: 'get',
        endPoint: 'arc/empresa/resumo',
        data: undefined,
        headers: undefined,
      });

      if (!data) {
        setLoading(false);
        navigation.navigate('Settings');
        return;
      }

      setData(data.Resultado);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar organizações:', error);
      const resultado = await getOrganizacaoOffline()
      await handleChangeOrganization(resultado)
      // Aqui você pode tratar o erro, exibir uma mensagem, etc.
      setLoading(false);
    } finally {
      setLoading(false); // Sempre desativa o loading, independentemente do sucesso ou erro
    }
  };

  return {
    organizations,
    isLoadingOrganization,
    getOrganizations,
  };
}
