export function formatarData(dataString: string): string {
  // Dividir a string da data em partes
  const partesDataHora = dataString.split(' ');
  const dataParte = partesDataHora[0];

  // Dividir a parte da data em dia, mês e ano
  const [dia, mes, ano] = dataParte.split('/');

  // Construir uma nova string de data no formato desejado (dd/MM/yyyy)
  return `${dia}/${mes}/${ano}`;
}
