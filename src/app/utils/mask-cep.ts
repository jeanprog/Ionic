export function cepMask(value: string): string {
  let cep = value.replace(/\D/g, '');
  const maxCepLength = 8;

  if (cep.length > maxCepLength) {
    cep = cep.substring(0, maxCepLength);
  }

  cep = cep.replace(/(\d{5})(\d)/, '$1-$2');

  return cep;
}
