import {useEffect, useState} from 'react';

export default function UseSetup({getById, id}) {
  const [host, setHost] = useState('');
  const [codStore, setCodLoja] = useState('');
  const [terminal, setTerminal] = useState('');

  const handleGet = async () => {
    if (getById && id) {
      const resultado = await getById(id);
      setHost(resultado.host);
      setCodLoja(resultado.codStore);
      setTerminal(resultado.terminal);
    }
  };

  useEffect(() => {
    handleGet();
  }, [id]);

  return {
    host,
    setHost,
    codStore,
    setCodLoja,
    terminal,
    setTerminal,
  };
}
