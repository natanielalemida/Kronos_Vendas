import {z} from 'zod';

export const loginFormSchema = z.object({
  cpf: z.string().min(1, 'Informe o CPF'),
  password: z.string().min(1, 'Informe a senha'),
  organizationCode: z.number().positive('Selecione uma empresa'),
});

export const loginRequestSchema = z.object({
  Aplicacao: z.number().int().positive(),
  Login: z.string().min(1),
  Senha: z.string().min(1),
  codigoEmpresa: z.number().int().positive(),
  NumeroTerminal: z.number().int().nonnegative(),
});
