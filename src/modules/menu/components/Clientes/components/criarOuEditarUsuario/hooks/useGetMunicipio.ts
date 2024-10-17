import {useState} from 'react';
import {MunicipioSelectDto} from '../components/type';
import MunicipioRepository from '../repository/municipioRepository';

export default function UseGetMunicipio() {
  const [municipios, setMunicipios] = useState<MunicipioSelectDto[]>([]);
  const repository = new MunicipioRepository();
  const getMunicipio = async () => {
    const data = await repository.getMunicipios();
    setMunicipios(data);
    return data;
  };
  return {
    getMunicipio,
    municipios,
    setMunicipios,
  };
}
