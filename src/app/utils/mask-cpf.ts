export function cpfMask(value: string): string {
  let cpf = value.replace(/\D/g, '');
  const maxCpfLength = 11;

  if (cpf.length > maxCpfLength) {
    cpf = cpf.substring(0, maxCpfLength);
  }

  return cpf
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}
