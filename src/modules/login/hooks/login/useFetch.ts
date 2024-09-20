import {useState} from 'react';
import ApiInstace from '../../../../api/ApiInstace';
import {UseFetchProps} from '../type';

export function useFetch() {
  const [organizations, setData] = useState<[]>([]);

  const getOrganizations = async () => {
    const data = await ApiInstace.openUrl({
      method: 'get',
      endPoint: 'arc/empresa/resumo',
      data: undefined,
      headers: undefined,
    });

    if (!data) {
      return;
    }

    setData(data.Resultado);
  };

  return {
    organizations,
    getOrganizations,
  };
}
