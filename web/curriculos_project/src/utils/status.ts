import type { CurriculoStatus } from '../types/curriculo';

export const statusLabels: Array<{ label: string; status: CurriculoStatus }> = [
  { label: 'Desconsiderado', status: 'desconsiderado' },
  { label: 'Entrevistado', status: 'entrevistado' },
  { label: 'Selecionado', status: 'selecionado' },
  { label: 'Visualizado', status: 'visualizado' },
];

export function getStatusLabel(status: CurriculoStatus) {
  return statusLabels.find((item) => item.status === status)?.label ?? status;
}

export function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    desconsiderado: '#dc2626',
    entrevistado: '#fde047',
    selecionado: '#2f8f75',
    visualizado: '#2f70ad',
  };

  return colors[status] ?? '#94a3b8';
}

export function formatList(
  values?: Array<{
    nome?: string | null;
    cargo?: string | null;
    escola?: string | null;
    empresa?: string | null;
  }>,
) {
  if (!values?.length) {
    return '-';
  }

  return values
    .map((item) => item.nome ?? item.cargo ?? item.escola ?? item.empresa)
    .filter(Boolean)
    .join(', ');
}
