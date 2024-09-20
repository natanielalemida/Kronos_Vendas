import {ProdutoDto} from '../type';

export default class ProdutoMapper {
  async mapOne(produto: ProdutoDto) {
    return {
      Codigo: produto.Codigo,
      Referencia: produto.Referencia,
      Descricao: produto.Descricao,
      UnidadeMedida: produto.UnidadeMedida,
      CodigoDeBarras: produto.CodigoDeBarras,
      ValorVenda: produto.ValorVenda,
      VendeProdutoNoAtacado: produto.VendeProdutoNoAtacado,
      ValorVendaAtacado: produto.ValorVendaAtacado,
      CodigoBarrasAtacado: produto.CodigoBarrasAtacado,
      UnidadeMedidaAtacado: produto.UnidadeMedidaAtacado,
      PermiteFracionar: produto.PermiteFracionar,
      CodigoSetor: produto.CodigoSetor ? produto.CodigoSetor : 0,
      CodigoGrupo: produto.CodigoGrupo ? produto.CodigoGrupo : 0,
      CodigoSubGrupo: produto.CodigoSubGrupo ? produto.CodigoSubGrupo : 0,
      CodigoMarca: produto.CodigoMarca ? produto.CodigoMarca : 0,
    };
  }
}
