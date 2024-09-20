import {knexConfig} from '../../../../../database/connection';
import {useCliente} from '../../Clientes/context/clientContext';
import parametrosLocaisRepository from '../repository/parametrosLocaisRepository';
import {ParametrosLocaisDto} from '../type';

export default function UseRepository() {
  const repository = new parametrosLocaisRepository();
  const {setParams} = useCliente();

  const save = async (parametro: ParametrosLocaisDto) => {
    const parametroExist = await repository.getByName(parametro.Descricao);

    if (parametroExist) {
      await repository.update(parametro);
      const newParams = await repository.getParametros();
      setParams(prevParams => {
        return newParams.map(newParam => {
          const existingParamIndex = prevParams.findIndex(
            param => param.id === newParam.id,
          );

          if (existingParamIndex !== -1) {
            // Atualiza o parâmetro existente
            return {
              ...prevParams[existingParamIndex],
              ...newParam,
            };
          } else {
            // Adiciona o novo parâmetro
            return newParam;
          }
        });
      });
      return;
    }

    await repository.save(parametro);
    const params = await repository.getParametros();
    setParams(prevParams => {
      return params.map(newParam => {
        const existingParamIndex = prevParams.findIndex(
          param => param.id === newParam.id,
        );

        if (existingParamIndex !== -1) {
          // Atualiza o parâmetro existente
          return {
            ...prevParams[existingParamIndex],
            ...newParam,
          };
        } else {
          // Adiciona o novo parâmetro
          return newParam;
        }
      });
    });
  };

  const getParams = async () => {
    const params = await repository.getParametros();
    setParams(prevParams => {
      return params.map(newParam => {
        const existingParamIndex = prevParams.findIndex(
          param => param.id === newParam.id,
        );

        if (existingParamIndex !== -1) {
          // Atualiza o parâmetro existente
          return {
            ...prevParams[existingParamIndex],
            ...newParam,
          };
        } else {
          // Adiciona o novo parâmetro
          return newParam;
        }
      });
    });
  };

  return {
    save,
    getParams,
  };
}
