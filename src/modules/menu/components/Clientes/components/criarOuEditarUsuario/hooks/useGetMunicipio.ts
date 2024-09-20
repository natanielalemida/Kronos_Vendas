import {useState} from 'react';
import {MunicipioSelectDto} from '../components/type';
import MunicipioRepository from '../repository/municipioRepository';

export default function UseGetMunicipio() {
  const [municipios, setMunicipios] = useState<MunicipioSelectDto[]>([]);
  const repository = new MunicipioRepository();
  const getMunicipio = async () => {
    const data = await repository.getMunicipios();
    const result = data.map(item => ({
      id: item.Codigo,
      title: item.MunicipioNome,
    }));
    setMunicipios(result);
    return data;
  };
  return {
    getMunicipio,
    municipios,
    setMunicipios,
  };
}
