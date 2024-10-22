import React, {createContext, useState, useContext, ReactNode} from 'react';
import {SaveOrEditClienteType} from '../components/criarOuEditarUsuario/type';
import {ClienteDto} from '../../../../../sync/clientes/type';
import {ProdutoBodyCreateQtAndObsDto} from '../../../../../sync/products/type';
import {FormaPagamento} from '../../../../../sync/pagamentos/type';
import {FinalizarVenda} from '../type';
import {UsuarioDto} from '../../../../login/hooks/type';
import {ParametrosLocaisDto} from '../../Configuracoes/type';
import {MunicipioSelectDto} from '../components/criarOuEditarUsuario/components/type';
import {PedidoSearchDto} from '../../Pedidos/type';

interface CounterContextType {
  setForm: (value: SaveOrEditClienteType) => void;
  form: SaveOrEditClienteType;
  handleClearForm: () => void;
  clienteOnContext: ClienteDto | undefined;
  setClienteOnContext: (value: ClienteDto | undefined) => void;
  ProdutosSelecionados: ProdutoBodyCreateQtAndObsDto[];
  setProdutosSelecionados: (value: ProdutoBodyCreateQtAndObsDto[]) => void;
  formaPagamento: FormaPagamento[] | undefined;
  setFormaPagameto: (value: FormaPagamento[]) => void;
  finalizarVenda: FinalizarVenda | undefined;
  setFinalizarVenda: (value: FinalizarVenda) => void;
  usuario: UsuarioDto | undefined;
  setUsuario: (value: UsuarioDto) => void;
  valorPago: number;
  setValorPago: (value: number) => void;
  organizationCode: number | undefined;
  setOrganizationCode: (value: number) => void;
  isSyncing: boolean;
  setIsSyncing: (value: boolean) => void;
  params: ParametrosLocaisDto[];
  setParams: (value: ParametrosLocaisDto[]) => void;
  municipios: MunicipioSelectDto[];
  setMunicipios: (value: MunicipioSelectDto[]) => void;
  pedidosSelecionados: PedidoSearchDto[];
  setPedidosSelecionados: (value: PedidoSearchDto[]) => void;
  cleanPedido: () => void;
  clearAllContext: () => void;
  empresa;
  setEmpresa;
}

const CounterContext = createContext<CounterContextType | undefined>(undefined);

export const ClienteProvider: React.FC<{children: ReactNode}> = ({
  children,
}) => {
  const [form, setForm] = useState<SaveOrEditClienteType>({
    id: undefined,
    CNPJCPF: undefined,
    IE: undefined,
    NomeFantasia: undefined,
    RazaoSocial: undefined,
    Endereco: undefined,
    NumeroEndereco: undefined,
    Bairro: undefined,
    Complemento: undefined,
    Logradouro: undefined,
    Municipio: undefined,
    Celular: [],
    Email: [],
    CEP: undefined,
    IsSincronizado: undefined,
  });

  const handleClearForm = () => {
    setForm({
      id: undefined,
      CNPJCPF: undefined,
      IE: undefined,
      NomeFantasia: undefined,
      RazaoSocial: undefined,
      Endereco: undefined,
      NumeroEndereco: undefined,
      Bairro: undefined,
      Complemento: undefined,
      Logradouro: undefined,
      Municipio: undefined,
      Celular: [],
      Email: [],
      CEP: undefined,
      IsSincronizado: undefined,
    });
  };

  const cleanPedido = () => {
    setClienteOnContext(undefined);
    setFinalizarVenda(undefined);
    setFormaPagameto([]);
    setProdutosSelecionados([]);
    setValorPago(0);
  };

  const clearAllContext = () => {
    handleClearForm(); // Limpa o formulário

    setClienteOnContext(undefined); // Limpa o cliente no contexto
    setProdutosSelecionados([]); // Limpa os produtos selecionados
    setFormaPagameto([]); // Limpa as formas de pagamento
    setFinalizarVenda(undefined); // Limpa a finalização de venda
    setUsuario(undefined); // Limpa o usuário
    setValorPago(0); // Reseta o valor pago
    setOrganizationCode(undefined); // Limpa o código da organização
    setIsSyncing(false); // Reseta o estado de sincronização
    setParams([]); // Limpa os parâmetros locais
    setMunicipios([]); // Limpa os municípios
  };

  const [clienteOnContext, setClienteOnContext] = useState<
    ClienteDto | undefined
  >(undefined);

  const [ProdutosSelecionados, setProdutosSelecionados] = useState<
    ProdutoBodyCreateQtAndObsDto[]
  >([]);

  const [formaPagamento, setFormaPagameto] = useState<FormaPagamento[]>([]);

  const [finalizarVenda, setFinalizarVenda] = useState<FinalizarVenda>();
  const [valorPago, setValorPago] = useState<number>(0);
  const [usuario, setUsuario] = useState<UsuarioDto>();
  const [organizationCode, setOrganizationCode] = useState<number>();
  const [isSyncing, setIsSyncing] = useState(false);

  const [params, setParams] = useState<ParametrosLocaisDto[]>([]);
  const [municipios, setMunicipios] = useState<MunicipioSelectDto[]>([]);
  const [pedidosSelecionados, setPedidosSelecionados] = useState<
    PedidoSearchDto[]
  >([]);

  const [empresa, setEmpresa] = useState({});

  return (
    <CounterContext.Provider
      value={{
        setForm,
        form,
        handleClearForm,
        clienteOnContext,
        setClienteOnContext,
        ProdutosSelecionados,
        setProdutosSelecionados,
        formaPagamento,
        setFormaPagameto,
        finalizarVenda,
        setFinalizarVenda,
        usuario,
        setUsuario,
        valorPago,
        setValorPago,
        setOrganizationCode,
        organizationCode,
        isSyncing,
        setIsSyncing,
        params,
        setParams,
        municipios,
        setMunicipios,
        pedidosSelecionados,
        setPedidosSelecionados,
        cleanPedido,
        clearAllContext,
        setEmpresa,
        empresa,
      }}>
      {children}
    </CounterContext.Provider>
  );
};

export const useCliente = (): CounterContextType => {
  const context = useContext(CounterContext);
  if (context === undefined) {
    throw new Error('useCounter must be used within a CounterProvider');
  }
  return context;
};
