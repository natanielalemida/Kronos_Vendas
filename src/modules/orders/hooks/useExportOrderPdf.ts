import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import {CustomerEditRepository} from '@/modules/customers/repositories/customer-edit.repository';
import {useAppSession} from '@/shared/hooks/useAppSession';

import {
  getCompanyPrimaryContact,
  mapEditableCustomerRecordToClienteDto,
} from '../helpers/order-summary.helpers';
import {
  OrderSummaryCompany,
  OrderSummaryRecord,
} from '../types/order-summary.types';

function maskCpf(document: string): string {
  const numericDocument = document.replace(/\D/g, '');

  return numericDocument.replace(
    /(\d{3})(\d{3})(\d{3})(\d{2})/,
    '$1.$2.$3-$4',
  );
}

function maskCnpj(document: string): string {
  const numericDocument = document.replace(/\D/g, '');

  return numericDocument.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    '$1.$2.$3/$4-$5',
  );
}

function formatDateTime(dateValue: string | Date): string {
  const date = new Date(dateValue);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

export function useExportOrderPdf() {
  const customerRepository = new CustomerEditRepository();
  const {empresa, usuario} = useAppSession();
  const company = empresa as OrderSummaryCompany | undefined;

  const exportOrderPdf = async (order: OrderSummaryRecord) => {
    const editableCustomer = await customerRepository.findByDocument(
      order.Pessoa.CNPJCPF,
    );
    const customer = mapEditableCustomerRecordToClienteDto(editableCustomer);
    const totalGross = order.Itens.reduce(
      (currentTotal, item) => currentTotal + item.Quantidade * item.ValorUnitario,
      0,
    );
    const totalNet = order.MeiosPagamentos.reduce(
      (currentTotal, item) => currentTotal + item.ValorRecebido,
      0,
    );

    const companyAddress = company?.Enderecos?.[0];
    const customerAddress = customer.Enderecos?.[0];

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Recibo de Pedido</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #fff; }
            .container { width: 794px; margin: 0 auto; padding: 20px; }
            .header { width: 100%; display: flex; flex-direction: row; margin-bottom: 5px; }
            .header h1 { margin: 0; font-size: 18px; }
            .header p { margin: 3px 0; font-size: 12px; }
            .order-info { text-align: right; font-size: 12px; margin-bottom: 10px; }
            .client-info, .details, .payment-info, .footer { font-size: 12px; padding: 5px; margin-bottom: 10px; }
            .payment-info, .details, .client-info { border: 2px solid #f0f0f0; border-radius: 10px; }
            .client-info p, .payment-info p { margin: 2px 0; padding: 2px; }
            .details table, .payment-info table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            tbody tr:nth-child(odd) { background-color: #ffffff; }
            tbody tr:nth-child(even) { background-color: #f0f0f0; }
            .details th, .details td, .payment-info td { padding: 8px; text-align: center; }
            th { background-color: #f0f0f0; }
            .total-summary { text-align: right; }
            .total-summary p { margin: 2px 0; font-weight: bold; }
            .footer { display: flex; justify-content: space-between; }
            .footer div { width: 48%; }
            .textLeft { text-align: right; width: 35%; }
            .textCenter { text-align: center; }
            .widthHundred {}
            .title { width: 100% !important; border-bottom: 2px solid #f0f0f0; }
            .title p { font-size: 16px; font-weight: bold; }
            .spaceBetweenTable { display: flex; justify-content: space-between; align-items: center; width: 30%; margin-left: auto; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img style="width: 150px; height: 90px; margin-right: 15px;" src="data:image/png;base64,${
                company?.ImgLogo ?? ''
              }" alt="Logo da Empresa" />
              <div class="widthHundred">
                <h1>${company?.AsEmpresaOperacao?.NomeFantasia ?? ''}</h1>
                <p>${
                  (company?.AsEmpresaOperacao?.CNPJ?.length ?? 0) > 11
                    ? `CNPJ: ${maskCnpj(company?.AsEmpresaOperacao?.CNPJ ?? '')}`
                    : `CPF: ${maskCpf(company?.AsEmpresaOperacao?.CNPJ ?? '')}`
                }</p>
                <p>${
                  companyAddress
                    ? `${companyAddress.Logradouro}, ${companyAddress.Numero}, ${
                        companyAddress.Complemento || ''
                      }, ${companyAddress.Bairro}, ${
                        companyAddress.Municipio?.MunicipioNome ?? ''
                      }, ${companyAddress.CEP}`
                    : 'Nenhum endereço disponível.'
                }</p>
                <p>
                  Contato: ${getCompanyPrimaryContact(company, 1)} -
                  Email: ${getCompanyPrimaryContact(company, 2)}
                </p>
              </div>
              <div class="textLeft">
                <p><strong>${
                  order.Codigo ? `Pedido n. ${order.Codigo}` : 'Não sincronizado'
                }</strong></p>
                <p><strong>Vendedor:</strong> ${usuario?.Codigo ?? ''} - ${
      usuario?.Referencia ?? ''
    }</p>
                <p>Emitido em ${formatDateTime(order.DataEmissao)}</p>
                <p>Impresso em ${formatDateTime(new Date())}</p>
              </div>
            </div>
            <div class="client-info">
              <div class="title"><p>Cliente</p></div>
              <p><strong>${order.Pessoa.Codigo ?? 0} - ${
      order.Pessoa.NomeFantasia
    }</strong></p>
              <p>${
                order.Pessoa.CNPJCPF
                  ? order.Pessoa.CNPJCPF.length > 11
                    ? `CNPJ: ${maskCnpj(order.Pessoa.CNPJCPF)}`
                    : `CPF: ${maskCpf(order.Pessoa.CNPJCPF)}`
                  : 'CNPJ/CPF não cadastrado'
              }</p>
              <p><strong>Endereço:</strong> ${
                customerAddress?.CEP &&
                customerAddress.Municipio?.MunicipioNome &&
                customerAddress.Municipio?.UFSigla
                  ? `${customerAddress.CEP} - ${customerAddress.Municipio.MunicipioNome} - ${customerAddress.Municipio.UFSigla}`
                  : 'Endereço não cadastrado'
              }</p>
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
                  ${order.Itens.map(
                    item => `<tr>
                      <td>${item.Codigo}</td>
                      <td>${item.Descricao}</td>
                      <td></td>
                      <td></td>
                      <td>${item.UnidadeMedida}</td>
                      <td>${item.Quantidade}</td>
                      <td>${item.ValorUnitario.toFixed(2)}</td>
                      <td>${(
                        (item.ValorUnitario - item.ValorVendaDesconto) *
                        item.Quantidade
                      ).toFixed(2)}</td>
                      <td>${(
                        item.ValorVendaDesconto * item.Quantidade
                      ).toFixed(2)}</td>
                    </tr>`,
                  ).join('')}
                </tbody>
              </table>
              <div class="total-summary">
                <div class="spaceBetweenTable"><p>Total Bruto:</p><p>${totalGross.toFixed(
                  2,
                )}</p></div>
                <div class="spaceBetweenTable"><p>Total Descontos:</p><p>${(
                  totalGross - totalNet
                ).toFixed(2)}</p></div>
                <div class="spaceBetweenTable"><p>Total Líquido:</p><p>${totalNet.toFixed(
                  2,
                )}</p></div>
              </div>
            </div>
            <div class="footer">
              <div class="payment-info">
                <div class="title"><p>Observações</p></div>
                <p>${order.Observacao ?? ''}</p>
              </div>
              <div class="payment-info">
                <div class="title"><p>Meios de Pagamento</p></div>
                <table>
                  <tbody>
                    ${order.MeiosPagamentos.map(
                      paymentMethod => `<tr>
                        <td style="width: 90%; text-align: left">${
                          paymentMethod.FormaPagamento.Descricao
                        }</td>
                        <td>${paymentMethod.ValorRecebido.toFixed(2)}</td>
                      </tr>`,
                    ).join('')}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <div class="payment-info">
                <div><p>Assinatura:</p><hr /></div>
                <p class="textCenter"><strong>${
                  customer.RazaoSocial || order.Pessoa.NomeFantasia
                }</strong></p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const file = await Print.printToFileAsync({
      base64: false,
      html: htmlContent,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(file.uri, {
        UTI: '.pdf',
        mimeType: 'application/pdf',
      });
    }
  };

  return {
    exportOrderPdf,
  };
}
