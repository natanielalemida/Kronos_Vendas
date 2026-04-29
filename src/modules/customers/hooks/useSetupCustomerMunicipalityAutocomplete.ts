import {useEffect, useMemo, useState} from 'react';
import {Keyboard} from 'react-native';

import {useAppSession} from '@/shared/hooks/useAppSession';

import {
  createUpdatedCustomerForm,
  mapMunicipalityQueryValue,
} from '../helpers/customer-form.helpers';
import {CustomerMunicipalityRepository} from '../repositories/customer-municipality.repository';

export function useSetupCustomerMunicipalityAutocomplete() {
  const {form, municipios, setForm, setMunicipios} = useAppSession();
  const [query, setQuery] = useState(form.Municipio?.MunicipioNome ?? '');

  useEffect(() => {
    if (municipios.length) {
      return;
    }

    const repository = new CustomerMunicipalityRepository();

    repository
      .getMunicipalities()
      .then(setMunicipios)
      .catch(error => {
        console.error('Error while loading municipalities', error);
      });
  }, [municipios.length, setMunicipios]);

  useEffect(() => {
    setQuery(form.Municipio?.MunicipioNome ?? '');
  }, [form.Municipio?.MunicipioNome]);

  const filteredMunicipalities = useMemo(
    () => mapMunicipalityQueryValue(query, municipios),
    [municipios, query],
  );

  return {
    data: {
      filteredMunicipalities,
      query,
    },
    handlers: {
      handleMunicipalitySelect: (
        municipality: (typeof municipios)[number],
      ) => {
        Keyboard.dismiss();
        setForm(
          createUpdatedCustomerForm(form, {
            Municipio: {
              Codigo: municipality.Codigo,
              Estado: municipality.Estado,
              MunicipioCodigo: municipality.MunicipioCodigo,
              MunicipioNome: municipality.MunicipioNome,
            },
          }),
        );
        setQuery(municipality.MunicipioNome);
      },
      handleSearchChange: setQuery,
    },
  };
}
