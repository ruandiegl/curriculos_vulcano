import { jsPDF } from 'jspdf';
import type { Curriculo, CurriculoRelation } from '../types/curriculo';
import { formatCnh, formatCpf, formatPhone, formatRg, valueOrDash } from './masks';
import { formatList, getStatusLabel } from './status';

function formatDate(value?: string | null) {
  if (!value) {
    return '-';
  }

  return new Date(value).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}

function formatRelations(
  values: CurriculoRelation[] | undefined,
  getLabel: (item: CurriculoRelation) => string,
) {
  if (!values?.length) {
    return '-';
  }

  return values.map(getLabel).filter(Boolean).join('; ') || '-';
}

function addWrappedLine(doc: jsPDF, label: string, value: string, x: number, y: number) {
  const pageHeight = doc.internal.pageSize.getHeight();
  const lines = doc.splitTextToSize(`${label}: ${value}`, 175);

  if (y + lines.length * 7 > pageHeight - 18) {
    doc.addPage();
    y = 18;
  }

  doc.text(lines, x, y);
  return y + lines.length * 7;
}

export function downloadCurriculoSistemaPdf(curriculo: Curriculo) {
  const doc = new jsPDF();
  const firstAddress = curriculo.enderecos?.[0];
  let y = 18;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Curriculo', 18, y);
  y += 10;

  doc.setFontSize(11);
  doc.text('Dados pessoais', 18, y);
  y += 8;
  doc.setFont('helvetica', 'normal');

  y = addWrappedLine(doc, 'Nome', curriculo.nome, 18, y);
  y = addWrappedLine(doc, 'Email', valueOrDash(curriculo.email), 18, y);
  y = addWrappedLine(doc, 'CPF', valueOrDash(formatCpf(curriculo.cpf)), 18, y);
  y = addWrappedLine(doc, 'RG', valueOrDash(formatRg(curriculo.rg)), 18, y);
  y = addWrappedLine(doc, 'Nascimento', formatDate(curriculo.nascimento), 18, y);
  y = addWrappedLine(doc, 'Estado civil', valueOrDash(curriculo.estadoCivil), 18, y);
  y = addWrappedLine(doc, 'Celular', valueOrDash(formatPhone(curriculo.celular)), 18, y);
  y = addWrappedLine(doc, 'Telefone', valueOrDash(formatPhone(curriculo.telefone)), 18, y);
  y = addWrappedLine(doc, 'Status', getStatusLabel(curriculo.status), 18, y);
  y = addWrappedLine(doc, 'Possui CNH', curriculo.possuiCnh ? 'Sim' : 'Nao', 18, y);

  if (curriculo.possuiCnh) {
    y = addWrappedLine(doc, 'Numero da CNH', valueOrDash(formatCnh(curriculo.numeroCnh)), 18, y);
    y = addWrappedLine(doc, 'Vencimento da CNH', formatDate(curriculo.vencimentoCnh), 18, y);
    y = addWrappedLine(doc, 'Categoria da CNH', valueOrDash(curriculo.categoriaCnh), 18, y);
  }

  y += 4;
  doc.setFont('helvetica', 'bold');
  y = addWrappedLine(doc, 'Endereco', '', 18, y);
  doc.setFont('helvetica', 'normal');
  y = addWrappedLine(doc, 'Logradouro', valueOrDash(firstAddress?.rua), 18, y);
  y = addWrappedLine(doc, 'Numero', valueOrDash(firstAddress?.numero), 18, y);
  y = addWrappedLine(doc, 'Bairro', valueOrDash(firstAddress?.bairro), 18, y);
  y = addWrappedLine(doc, 'Complemento', valueOrDash(firstAddress?.complemento), 18, y);
  y = addWrappedLine(doc, 'Cidade', valueOrDash(firstAddress?.cidade), 18, y);
  y = addWrappedLine(doc, 'Estado', valueOrDash(firstAddress?.estado), 18, y);

  y += 4;
  doc.setFont('helvetica', 'bold');
  y = addWrappedLine(doc, 'Dados profissionais', '', 18, y);
  doc.setFont('helvetica', 'normal');
  y = addWrappedLine(doc, 'Atuacoes', formatList(curriculo.atuacoes), 18, y);
  y = addWrappedLine(
    doc,
    'Cursos',
    formatRelations(curriculo.cursos, (curso) =>
      [curso.nome, curso.instituicao, curso.cargaHoraria].filter(Boolean).join(' - '),
    ),
    18,
    y,
  );
  y = addWrappedLine(
    doc,
    'Experiencias',
    formatRelations(curriculo.experiencias, (experiencia) =>
      [experiencia.empresa, experiencia.cargo, experiencia.funcoes].filter(Boolean).join(' - '),
    ),
    18,
    y,
  );
  addWrappedLine(
    doc,
    'Escolaridades',
    formatRelations(curriculo.escolaridades, (escolaridade) =>
      [escolaridade.curso, escolaridade.escola].filter(Boolean).join(' - '),
    ),
    18,
    y,
  );

  doc.save(`curriculo-${curriculo.nome.replace(/\s+/g, '-').toLowerCase()}.pdf`);
}
