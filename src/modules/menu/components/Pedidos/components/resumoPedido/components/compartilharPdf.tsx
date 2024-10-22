import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import {useCliente} from '../../../../Clientes/context/clientContext';
import {getClienteToSave} from '../hooks/getClienteToSave';
import {useEffect, useState} from 'react';

function mascararCPF(cpf: string) {
  if (!cpf) return;
  cpf = cpf.replace(/\D/g, '');

  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function mascararCNPJ(cnpj: string) {
  if (!cnpj) return;
  cnpj = cnpj.replace(/\D/g, '');

  // Aplica a máscara no formato XX.XXX.XXX/XXXX-XX
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

function formatDate(isoDate) {
  const date = new Date(isoDate);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês começa em 0
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

export default function useExportPdf() {
  const {usuario, empresa} = useCliente();
  const {getByIdToSaveByCpf} = getClienteToSave();

  const fetchPessoa = async CNPJCPF => {
    const result = await getByIdToSaveByCpf(CNPJCPF);
    return result;
  };

  const PedidoPDF = async Pedido => {
    const pessoa = await fetchPessoa(Pedido.Pessoa.CNPJCPF);

    const calculateTotalBruto = Pedido?.Itens.reduce(
      (acc, item) => acc + item.Quantidade * item.ValorUnitario,
      0,
    ).toFixed(2);

    const calculateTotalLiquido = Pedido?.MeiosPagamentos.reduce(
      (acc, item) => acc + item.ValorRecebido,
      0,
    ).toFixed(2);

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
          <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Recibo de Pedido</title>
              <style>
                  body {
                      font-family: Arial, sans-serif;
                      margin: 0;
                      padding: 0;
                      background-color: #fff;
                  }
                  .container {
                      width: 794px;
                      margin: 0 auto;
                      padding: 20px;
                  }
                  .header {
                      width: 100%;
                      display: flex;
                      flex-direction: row;  
                      margin-bottom: 5px;
                  }
                  .header h1 {
                      margin: 0;
                      font-size: 18px;
                  }
                  .header p {
                      margin: 3px 0;
                      font-size: 12px;
                  }
                  .order-info {
                      text-align: right;
                      font-size: 12px;
                      margin-bottom: 10px;
                  }
                  .client-info,
                  .details,
                  .payment-info,
                  .footer {
                      font-size: 12px;
                      padding: 5px;
                      margin-bottom: 10px;
                  }
                  .observations {
                      border: 2px solid #f0f0f0;
                      border-radius: 10px;
                  }
                  .payment-info {
                      border: 2px solid #f0f0f0;
                      border-radius: 10px;
                  }
                  .details {
                      border: 2px solid #f0f0f0;
                      border-radius: 10px;
                  }
                  .client-info {
                      border: 2px solid #f0f0f0;
                      border-radius: 10px;
                  }
                  .client-info p,
                  .payment-info p {
                      margin: 2px 0;
                      padding: 2px;
                  }
                 .details table {
                      width: 100%;
                      border-collapse: collapse;
                      margin-bottom: 20px;
                  }
                  tbody tr:nth-child(odd) {
                      background-color: #ffffff;
                  }
      
                  tbody tr:nth-child(even) {
                      background-color: #f0f0f0;
                  }
      
                  .details th,
                  .details td {
                      padding: 8px;
                      text-align: center;
                  }
                  th {
                      background-color: #f0f0f0;
                  }
                  .total-summary {
                      text-align: right;
                  }
                  .total-summary p {
                      margin: 2px 0;
                      font-weight: bold;
                  }
                  .footer {
                      display: flex;
                      justify-content: space-between;
                  }
                  .footer div {
                      width: 48%;
                  }
                  .signature {
                      text-align: center;
                  }
                  .signature hr {
                      width: 80%;
                  }
                  .textLeft {
                      text-align: right;
                      width: 35%;
                  }
                  .textCenter {
                      text-align: center;
                  }
                  .widthHundred {
                  }
                  .flexRow {
                      display: flex;
                      flex-direction: row;
                  }
                  .textBold {
                      font-weight: bold;
                  }
                  .title {
                      width: 100% !important;
                      border-bottom: 2px solid #f0f0f0;
                  }
                  .title p {
                      font-size: 16px;
                      font-weight: bold;
                  }
                  .spaceBetween {
                      display: flex;
                      justify-content: space-between;
                      width: 100% !important;
                  }
                  .spaceBetweenTable {
                      display: flex;
                      justify-content: space-between; /* Espaço entre os itens */
                      align-items: center; /* Alinha os itens verticalmente ao centro, se necessário */
                      width: 30%; /* Largura da div */
                      margin-left: auto; /* Empurra a div para a direita */
                  }
                .payment-info th,
                  .payment-info td {
                      padding: 2px;
                      text-align: center;
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <div class="header">
                  <div class="header">
                  <img style="width: 150px; height: 90px; margin-right: 15px;" src="data:image/png;base64,${
                    empresa.ImgLogo
                  }" alt="Logo da Empresa" />
                                        <div class="widthHundred">
                          <h1>${empresa.AsEmpresaOperacao.NomeFantasia}</h1>
                          <p>${
                            empresa.AsEmpresaOperacao.CNPJ.length > 11
                              ? `CNPJ: ${mascararCNPJ(
                                  empresa.AsEmpresaOperacao.CNPJ,
                                )}`
                              : `CPF: ${mascararCPF(
                                  empresa.AsEmpresaOperacao.CNPJ,
                                )}`
                          }</p>
                                <p>
                                ${
                                  empresa.Enderecos &&
                                  empresa.Enderecos.length > 0
                                    ? `${empresa.Enderecos[0].Logradouro}, ${
                                        empresa.Enderecos[0].Numero
                                      }, ${
                                        empresa.Enderecos[0].Complemento || ''
                                      }, ${empresa.Enderecos[0].Bairro}, ${
                                        empresa.Enderecos[0].Municipio
                                          .MunicipioNome
                                      }, ${empresa.Enderecos[0].CEP}`
                                    : 'Nenhum endereço disponível.'
                                }
                                </p>
                          <p>
  Contato: ${
    empresa.Contatos && empresa.Contatos.length > 0
      ? `${
          (empresa.Contatos.find(contato => contato.Tipo === 1) || {})
            .Contato || 'Não informado'
        } - 
         Email: ${
           (empresa.Contatos.find(contato => contato.Tipo === 2) || {})
             .Contato || 'Não informado'
         }`
      : 'Nenhum contato disponível.'
  }
</p>

                      </div>
                  </div>

                      <div class="textLeft">
                          <p>
                              <strong>${
                                Pedido.Codigo
                                  ? `Pedido n. ${Pedido.Codigo}`
                                  : 'Não sincronizado'
                              }</strong>
                          </p>
                          <p><strong>Vendedor:</strong> ${usuario?.Codigo} - ${
      usuario?.Referencia
    }</p>
                          <p>Emitido em ${formatDate(Pedido.DataEmissao)}</p>
                          <p>Impresso em ${formatDate(new Date())}</p>
                      </div>
                  </div>
                  <div class="client-info">
                      <div class="title">
                          <p>Cliente</p>
                      </div>
                      <p>
                          <strong> ${Pedido.Pessoa.Codigo} - ${
      Pedido.Pessoa.NomeFantasia
    }</strong>
                      </p>
                                               <p>${
                                                 Pedido.Pessoa.CNPJCPF.length >
                                                 11
                                                   ? `CNPJ: ${mascararCNPJ(
                                                       Pedido.Pessoa.CNPJCPF,
                                                     )}`
                                                   : `CPF: ${mascararCPF(
                                                       Pedido.Pessoa.CNPJCPF,
                                                     )}`
                                               }</p>
                      <p><strong>Endereço:</strong> ${pessoa.CEP} - ${
      pessoa.Municipio.MunicipioNome
    } - ${pessoa.Municipio.Estado}</p>
                  </div>
                  <div class="details">
                      <table>
                          <thead>
                              <tr>
                                  <th>Código</th>
                                  <th>Descrição</th>
                                  <th>NCM</th>
                                  <th>Marca</th>
                                  <th>UN</th>
                                  <th>Qtde.</th>
                                  <th>Valor Unit.</th>
                                  <th>Desc.</th>
                                  <th>Valor Líquido</th>
                              </tr>
                          </thead>
                          <tbody>
                          
                      ${
                        Pedido.Itens &&
                        Pedido.Itens.length > 0 &&
                        Pedido.Itens.map(item => {
                          return `<tr>
                                  <td>${item.Codigo}</td>
                                  <td>${item.Descricao}</td>
                                  <td></td>
                                  <td></td>
                                  <td>${item.UnidadeMedida}</td>
                                  <td>${item.Quantidade}</td>
                                  <td>${item.ValorUnitario.toFixed(2)}</td>
                                  <td>${(
                                    item.ValorUnitario - item.ValorVendaDesconto
                                  ).toFixed(2)}</td>
                                  <td>${item.ValorVendaDesconto.toFixed(2)}</td>
                              </tr>`;
                        })
                      }    
                          </tbody>
                      </table>
                      <div class="total-summary">
                          <div class="spaceBetweenTable">
                              <p>
                                  Total Bruto:
                              </p>
                              <p>
                                  ${calculateTotalBruto}
                              </p>
                          </div>
                          <div class="spaceBetweenTable">
                              <p>
                                  Total Descontos:
                              </p>
                              <p>
                                  ${(
                                    Number(calculateTotalBruto) -
                                    Number(calculateTotalLiquido)
                                  ).toFixed(2)}
                              </p>
                          </div>
                          <div class="spaceBetweenTable">
                              <p>
                                  Total Líquido:
                              </p>
                              <p>
                                  ${calculateTotalLiquido}
                              </p>
                          </div>
                      </div>
                  </div>
                  <div class="footer">
                      <div class="payment-info">
                          <div class="title">
                              <p>Observações</p>
                          </div>
                          <p>${Pedido.Observacao}</p>
                      </div>
                      <div class="payment-info">
                          <div class="title">
                              <p>Meios de Pagamento</p>
                          </div>
                          <table>
                              <tbody>
                              ${
                                Pedido.MeiosPagamentos &&
                                Pedido.MeiosPagamentos.length > 0 &&
                                Pedido.MeiosPagamentos.map(meioPagamento => {
                                  return `<tr>
                                            <td style="width: 90%; text-align: left">${
                                              meioPagamento.FormaPagamento
                                                .Descricao
                                            }</td>
                                            <td>${meioPagamento.ValorRecebido.toFixed(
                                              2,
                                            )}</td>
                                        </tr> `;
                                })
                              }
                              </tbody>
                          </table>
                      </div>
                  </div>
                  <div>
                      <div class="payment-info">
                          <div>
                              <p>Assinatura:</p>
                              <hr />
                          </div>
                          <p class="textCenter"><strong>${
                            Pedido.Pessoa.RazaoSocial
                          }</strong></p>
                      </div>
                  </div>
              </div>
          </body>
      </html>
        `;

    // Gerando o PDF
    let options = {
      html: htmlContent,
      fileName: 'Pedido',
      directory: 'Documents',
    };

    const file = await RNHTMLtoPDF.convert(options);

    // Compartilhando o PDF
    await Share.open({
      url: `file://${file.filePath}`,
      type: 'application/pdf',
      title: 'Compartilhar Pedido',
    });
  };

  return {
    PedidoPDF,
  };
}
