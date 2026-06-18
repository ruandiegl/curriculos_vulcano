import jsPDF from 'jspdf';
import { useEffect, useMemo, useState } from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { FeedbackMessage } from '../../components/FeedbackMessage';
import { listCurriculos } from '../../services/curriculos';
import { listVagas } from '../../services/vagas';
import type { Curriculo, CurriculoStatus } from '../../types/curriculo';
import type { Vaga } from '../../types/vaga';
import { formatList, getStatusLabel, statusLabels } from '../../utils/status';
import {
  AlertItem,
  AlertList,
  BarButton,
  BarFill,
  BarList,
  BarMeta,
  BarTrack,
  Button,
  ChartArea,
  Column,
  ColumnButton,
  Content,
  ContentHeader,
  HeaderActions,
  MetricCard,
  MetricsGrid,
  Panel,
  PanelHeader,
  ReportGrid,
  SectionCategory,
  SectionTitle,
  Select,
  StateMessage,
  Table,
} from './styles';

type PeriodFilter = '30' | '90' | '365' | 'all';
type ActiveChart = { type: 'status' | 'role' | 'month'; label: string } | null;

const STATUS_TONES: Record<CurriculoStatus, string> = {
  visualizado: '#2f74b5',
  entrevistado: '#facc15',
  selecionado: '#2f9b84',
  desconsiderado: '#dc2626',
};

function parseDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isInsidePeriod(value: string | undefined, period: PeriodFilter) {
  if (period === 'all') return true;
  const date = parseDate(value);
  if (!date) return false;
  const start = new Date();
  start.setDate(start.getDate() - Number(period));
  return date >= start;
}

function formatPeriod(period: PeriodFilter) {
  if (period === 'all') return 'Todo o período';
  return `Últimos ${period} dias`;
}

function monthKey(value?: string) {
  const date = parseDate(value);
  if (!date) return 'Sem data';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function monthLabel(key: string) {
  if (key === 'Sem data') return key;
  const [year, month] = key.split('-');
  return `${month}/${year.slice(2)}`;
}

function countBy<T>(items: T[], getKey: (item: T) => string) {
  return items.reduce<Record<string, number>>((acc, item) => {
    const key = getKey(item) || 'Não informado';
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}

function topEntries(record: Record<string, number>, limit = 7) {
  return Object.entries(record)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit);
}

function getPrimaryRole(curriculo: Curriculo) {
  const role = [...(curriculo.atuacoes ?? [])].sort((a, b) => (a.prioridade ?? 99) - (b.prioridade ?? 99))[0];
  return role?.nome || 'Não informado';
}

function formatLocation(vaga: Vaga) {
  return [vaga.cidade, vaga.estado].filter(Boolean).join(' / ') || 'Local não informado';
}

function hexToRgb(hex: string) {
  const normalized = hex.replace('#', '');
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

function setFill(doc: jsPDF, hex: string) {
  const color = hexToRgb(hex);
  doc.setFillColor(color.r, color.g, color.b);
}

function setText(doc: jsPDF, hex: string) {
  const color = hexToRgb(hex);
  doc.setTextColor(color.r, color.g, color.b);
}

function addFooter(doc: jsPDF, page: number) {
  setText(doc, '#94a3b8');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Relatório RH - página ${page}`, 14, 287);
  doc.text(new Date().toLocaleDateString('pt-BR'), 178, 287);
}

function drawSectionTitle(doc: jsPDF, title: string, x: number, y: number) {
  setFill(doc, '#ff8424');
  doc.roundedRect(x, y - 5, 3, 8, 1, 1, 'F');
  setText(doc, '#102a43');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(title, x + 7, y);
}

function drawMetricCard(doc: jsPDF, x: number, y: number, width: number, label: string, value: string, detail: string, color: string) {
  setFill(doc, '#ffffff');
  doc.roundedRect(x, y, width, 30, 3, 3, 'F');
  setFill(doc, color);
  doc.roundedRect(x, y, 4, 30, 2, 2, 'F');

  setText(doc, '#64748b');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text(label.toUpperCase(), x + 8, y + 8);

  setText(doc, '#102a43');
  doc.setFontSize(18);
  doc.text(value, x + 8, y + 20);

  setText(doc, '#64748b');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(detail, x + 8, y + 27);
}

function drawHorizontalBars(doc: jsPDF, entries: { label: string; value: number; color: string }[], x: number, y: number, width: number) {
  const maxValue = Math.max(...entries.map((item) => item.value), 1);
  entries.forEach((item, index) => {
    const rowY = y + index * 13;
    const percent = item.value / maxValue;

    setText(doc, '#334155');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.text(item.label.slice(0, 30), x, rowY);
    doc.text(String(item.value), x + width - 8, rowY, { align: 'right' });

    setFill(doc, '#eaf2f8');
    doc.roundedRect(x, rowY + 3.5, width, 4, 2, 2, 'F');
    setFill(doc, item.color);
    doc.roundedRect(x, rowY + 3.5, Math.max(width * percent, 2), 4, 2, 2, 'F');
  });
}

function drawTable(doc: jsPDF, headers: string[], rows: string[][], x: number, y: number, widths: number[]) {
  setFill(doc, '#eef5fb');
  doc.roundedRect(x, y, widths.reduce((sum, width) => sum + width, 0), 9, 2, 2, 'F');

  setText(doc, '#102a43');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  let cursorX = x;
  headers.forEach((header, index) => {
    doc.text(header.toUpperCase(), cursorX + 2, y + 6);
    cursorX += widths[index];
  });

  doc.setFont('helvetica', 'normal');
  rows.forEach((row, rowIndex) => {
    const rowY = y + 11 + rowIndex * 8;
    cursorX = x;
    row.forEach((cell, index) => {
      setText(doc, '#334155');
      doc.text(String(cell).slice(0, index === 0 ? 38 : 22), cursorX + 2, rowY + 5);
      cursorX += widths[index];
    });
    setFill(doc, '#e2e8f0');
    doc.rect(x, rowY + 8, widths.reduce((sum, width) => sum + width, 0), 0.2, 'F');
  });
}

function exportPdf(data: {
  period: PeriodFilter;
  curriculos: Curriculo[];
  vagas: Vaga[];
  statusCounts: Record<CurriculoStatus, number>;
  roleEntries: [string, number][];
  topJobs: Vaga[];
  emptyJobs: Vaga[];
}) {
  const doc = new jsPDF();
  const activeJobs = data.vagas.filter((vaga) => vaga.ativa).length;
  const totalApplications = data.vagas.reduce((sum, vaga) => sum + (vaga.candidaturas?.length ?? 0), 0);
  const selectedRate = data.curriculos.length
    ? Math.round(((data.statusCounts.selecionado ?? 0) / data.curriculos.length) * 100)
    : 0;
  const completionTotal = data.curriculos.length || 1;
  const completionEntries = [
    {
      label: 'Com PDF',
      value: Math.round((data.curriculos.filter((curriculo) => (curriculo.arquivos?.length ?? 0) > 0).length / completionTotal) * 100),
      color: '#2f74b5',
    },
    {
      label: 'Com experiência',
      value: Math.round((data.curriculos.filter((curriculo) => (curriculo.experiencias?.length ?? 0) > 0).length / completionTotal) * 100),
      color: '#2f9b84',
    },
    {
      label: 'Com formação',
      value: Math.round((data.curriculos.filter((curriculo) => (curriculo.escolaridades?.length ?? 0) > 0).length / completionTotal) * 100),
      color: '#ff8424',
    },
    {
      label: 'Com cursos',
      value: Math.round((data.curriculos.filter((curriculo) => (curriculo.cursos?.length ?? 0) > 0).length / completionTotal) * 100),
      color: '#8b5cf6',
    },
  ];
  const cityEntries = topEntries(countBy(data.curriculos, (curriculo) => curriculo.enderecos?.[0]?.cidade ?? 'Não informado'), 5);

  setFill(doc, '#10172a');
  doc.rect(0, 0, 210, 58, 'F');
  setFill(doc, '#ff8424');
  doc.roundedRect(14, 14, 12, 12, 3, 3, 'F');
  setText(doc, '#ffffff');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('RH', 17, 22);
  doc.setFontSize(22);
  doc.text('Relatório de Inteligência RH', 32, 22);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Metalúrgica Vulcano', 32, 31);
  setText(doc, '#cbd5e1');
  doc.text(`Período: ${formatPeriod(data.period)}`, 14, 47);
  doc.text(`Gerado em ${new Date().toLocaleDateString('pt-BR')}`, 150, 47);

  drawMetricCard(doc, 14, 70, 42, 'Currículos', String(data.curriculos.length), formatPeriod(data.period), '#2f74b5');
  drawMetricCard(doc, 61, 70, 42, 'Vagas abertas', String(activeJobs), `${data.vagas.length} cadastradas`, '#ff8424');
  drawMetricCard(doc, 108, 70, 42, 'Candidaturas', String(totalApplications), `${data.vagas.length ? (totalApplications / data.vagas.length).toFixed(1) : '0'} por vaga`, '#2f9b84');
  drawMetricCard(doc, 155, 70, 42, 'Selecionados', `${selectedRate}%`, `${data.statusCounts.selecionado ?? 0} candidatos`, '#8b5cf6');

  drawSectionTitle(doc, 'Funil de currículos', 14, 120);
  drawHorizontalBars(
    doc,
    statusLabels.map((item) => ({
      label: item.label,
      value: data.statusCounts[item.status] ?? 0,
      color: STATUS_TONES[item.status],
    })),
    14,
    132,
    82,
  );

  drawSectionTitle(doc, 'Cargos mais cadastrados', 112, 120);
  drawHorizontalBars(
    doc,
    data.roleEntries.slice(0, 6).map(([role, count]) => ({
      label: role,
      value: count,
      color: '#ff8424',
    })),
    112,
    132,
    82,
  );

  drawSectionTitle(doc, 'Qualidade da base', 14, 216);
  drawHorizontalBars(
    doc,
    completionEntries.map((item) => ({ ...item, label: `${item.label} (${item.value}%)` })),
    14,
    228,
    82,
  );

  drawSectionTitle(doc, 'Cidades com mais candidatos', 112, 216);
  drawHorizontalBars(
    doc,
    cityEntries.map(([city, count]) => ({ label: city, value: count, color: '#2f74b5' })),
    112,
    228,
    82,
  );

  addFooter(doc, 1);

  doc.addPage();
  setFill(doc, '#f8fafc');
  doc.rect(0, 0, 210, 297, 'F');
  drawSectionTitle(doc, 'Vagas com mais candidaturas', 14, 22);
  drawTable(
    doc,
    ['Vaga', 'Local', 'Candidatos'],
    data.topJobs.slice(0, 9).map((vaga) => [vaga.titulo, formatLocation(vaga), String(vaga.candidaturas?.length ?? 0)]),
    14,
    34,
    [86, 62, 28],
  );

  drawSectionTitle(doc, 'Alertas para ação do RH', 14, 124);
  setFill(doc, '#fff7ed');
  doc.roundedRect(14, 134, 182, 72, 4, 4, 'F');
  setText(doc, '#9a3412');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  if (data.emptyJobs.length === 0) {
    doc.text('Nenhuma vaga aberta sem candidatura no período.', 22, 148);
  } else {
    data.emptyJobs.slice(0, 7).forEach((vaga, index) => {
      const y = 148 + index * 8;
      doc.text(`${index + 1}. ${vaga.titulo}`.slice(0, 58), 22, y);
      doc.setFont('helvetica', 'normal');
      doc.text(formatLocation(vaga).slice(0, 36), 132, y);
      doc.setFont('helvetica', 'bold');
    });
  }

  drawSectionTitle(doc, 'Leituras rápidas', 14, 226);
  const insights = [
    `Base analisada: ${data.curriculos.length} currículo(s) e ${data.vagas.length} vaga(s).`,
    `Taxa de seleção no período: ${selectedRate}%.`,
    `Média de candidatura por vaga: ${data.vagas.length ? (totalApplications / data.vagas.length).toFixed(1) : '0'}.`,
    `Principal cargo na base: ${data.roleEntries[0]?.[0] ?? 'Não informado'}.`,
  ];
  setText(doc, '#334155');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  insights.forEach((insight, index) => {
    const lines = doc.splitTextToSize(insight, 170);
    doc.text(lines, 18, 238 + index * 10);
  });

  addFooter(doc, 2);

  doc.save(`relatorio-rh-${new Date().toISOString().slice(0, 10)}.pdf`);
}

export default function Reports() {
  const [period, setPeriod] = useState<PeriodFilter>('90');
  const [curriculos, setCurriculos] = useState<Curriculo[]>([]);
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [activeChart, setActiveChart] = useState<ActiveChart>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let isCurrent = true;

    async function loadReports() {
      try {
        setLoading(true);
        setMessage('');
        const [curriculosResponse, vagasResponse] = await Promise.all([
          listCurriculos({ page: 1, limit: 1000 }),
          listVagas({ page: 1, limit: 1000 }),
        ]);

        if (!isCurrent) return;

        setCurriculos(curriculosResponse.data);
        setVagas(vagasResponse.data);
      } catch {
        if (isCurrent) {
          setMessage('Não foi possível carregar os dados dos relatórios.');
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    }

    loadReports();

    return () => {
      isCurrent = false;
    };
  }, []);

  const filteredCurriculos = useMemo(
    () => curriculos.filter((curriculo) => isInsidePeriod(curriculo.createdAt, period)),
    [curriculos, period],
  );

  const filteredVagas = useMemo(
    () => vagas.filter((vaga) => isInsidePeriod(vaga.createdAt, period)),
    [vagas, period],
  );

  const statusCounts = useMemo(() => ({
    visualizado: filteredCurriculos.filter((curriculo) => curriculo.status === 'visualizado').length,
    entrevistado: filteredCurriculos.filter((curriculo) => curriculo.status === 'entrevistado').length,
    selecionado: filteredCurriculos.filter((curriculo) => curriculo.status === 'selecionado').length,
    desconsiderado: filteredCurriculos.filter((curriculo) => curriculo.status === 'desconsiderado').length,
  }), [filteredCurriculos]);

  const roleEntries = useMemo(
    () => topEntries(countBy(filteredCurriculos, getPrimaryRole), 8),
    [filteredCurriculos],
  );

  const cityEntries = useMemo(
    () => topEntries(countBy(filteredCurriculos, (curriculo) => curriculo.enderecos?.[0]?.cidade ?? 'Não informado'), 6),
    [filteredCurriculos],
  );

  const monthEntries = useMemo(
    () => Object.entries(countBy(filteredVagas.flatMap((vaga) => vaga.candidaturas ?? []), (item) => monthKey(item.createdAt)))
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-8),
    [filteredVagas],
  );

  const totalApplications = useMemo(
    () => filteredVagas.reduce((sum, vaga) => sum + (vaga.candidaturas?.length ?? 0), 0),
    [filteredVagas],
  );

  const topJobs = useMemo(
    () => [ ...filteredVagas].sort((a, b) => (b.candidaturas?.length ?? 0) - (a.candidaturas?.length ?? 0)).slice(0, 6),
    [filteredVagas],
  );

  const emptyJobs = useMemo(
    () => filteredVagas.filter((vaga) => vaga.ativa && (vaga.candidaturas?.length ?? 0) === 0).slice(0, 6),
    [filteredVagas],
  );

  const completion = useMemo(() => {
    const total = filteredCurriculos.length || 1;
    return {
      pdf: Math.round((filteredCurriculos.filter((curriculo) => (curriculo.arquivos?.length ?? 0) > 0).length / total) * 100),
      experiencia: Math.round((filteredCurriculos.filter((curriculo) => (curriculo.experiencias?.length ?? 0) > 0).length / total) * 100),
      formacao: Math.round((filteredCurriculos.filter((curriculo) => (curriculo.escolaridades?.length ?? 0) > 0).length / total) * 100),
      cursos: Math.round((filteredCurriculos.filter((curriculo) => (curriculo.cursos?.length ?? 0) > 0).length / total) * 100),
    };
  }, [filteredCurriculos]);

  const selectedDetails = useMemo(() => {
    if (!activeChart) return [];

    if (activeChart.type === 'status') {
      return filteredCurriculos
        .filter((curriculo) => getStatusLabel(curriculo.status) === activeChart.label)
        .slice(0, 8)
        .map((curriculo) => ({
          title: curriculo.nome,
          detail: `${formatList(curriculo.atuacoes)} | ${curriculo.email ?? 'E-mail não informado'}`,
        }));
    }

    if (activeChart.type === 'role') {
      return filteredCurriculos
        .filter((curriculo) => getPrimaryRole(curriculo) === activeChart.label)
        .slice(0, 8)
        .map((curriculo) => ({
          title: curriculo.nome,
          detail: `${getStatusLabel(curriculo.status)} | ${curriculo.enderecos?.[0]?.cidade ?? 'Cidade não informada'}`,
        }));
    }

    return filteredVagas
      .flatMap((vaga) => (vaga.candidaturas ?? []).map((candidatura) => ({ vaga, candidatura })))
      .filter(({ candidatura }) => monthLabel(monthKey(candidatura.createdAt)) === activeChart.label)
      .slice(0, 8)
      .map(({ vaga, candidatura }) => ({
        title: vaga.titulo,
        detail: `${formatLocation(vaga)} | ${new Date(candidatura.createdAt).toLocaleDateString('pt-BR')}`,
      }));
  }, [activeChart, filteredCurriculos, filteredVagas]);

  const maxStatus = Math.max(...Object.values(statusCounts), 1);
  const maxRole = Math.max(...roleEntries.map(([, value]) => value), 1);
  const maxMonth = Math.max(...monthEntries.map(([, value]) => value), 1);

  return (
    <AdminLayout activeSection="relatorios">
      <Content>
        <ContentHeader>
          <div>
            <SectionCategory>Relatórios</SectionCategory>
            <SectionTitle>Inteligência de RH</SectionTitle>
          </div>

          <HeaderActions>
            <Select value={period} onChange={(event) => setPeriod(event.target.value as PeriodFilter)}>
              <option value="30">Últimos 30 dias</option>
              <option value="90">Últimos 90 dias</option>
              <option value="365">Últimos 12 meses</option>
              <option value="all">Todo o período</option>
            </Select>
            <Button
              type="button"
              disabled={loading}
              onClick={() => exportPdf({ period, curriculos: filteredCurriculos, vagas: filteredVagas, statusCounts, roleEntries, topJobs, emptyJobs })}
            >
              Gerar PDF
            </Button>
          </HeaderActions>
        </ContentHeader>

        {message && <FeedbackMessage>{message}</FeedbackMessage>}

        {loading ? (
          <StateMessage>Carregando indicadores de RH...</StateMessage>
        ) : (
          <>
            <MetricsGrid>
              <MetricCard>
                <span>Currículos no período</span>
                <strong>{filteredCurriculos.length}</strong>
                <p>{formatPeriod(period)}</p>
              </MetricCard>
              <MetricCard>
                <span>Vagas abertas</span>
                <strong>{filteredVagas.filter((vaga) => vaga.ativa).length}</strong>
                <p>{filteredVagas.length} vagas cadastradas</p>
              </MetricCard>
              <MetricCard>
                <span>Candidaturas</span>
                <strong>{totalApplications}</strong>
                <p>{filteredVagas.length ? (totalApplications / filteredVagas.length).toFixed(1) : '0'} por vaga</p>
              </MetricCard>
              <MetricCard>
                <span>Selecionados</span>
                <strong>{statusCounts.selecionado}</strong>
                <p>{filteredCurriculos.length ? Math.round((statusCounts.selecionado / filteredCurriculos.length) * 100) : 0}% da base</p>
              </MetricCard>
            </MetricsGrid>

            <ReportGrid>
              <Panel>
                <PanelHeader>
                  <div>
                    <h2>Funil de currículos</h2>
                    <span>Clique em uma etapa para ver exemplos</span>
                  </div>
                </PanelHeader>
                <BarList>
                  {statusLabels.map((item) => {
                    const count = statusCounts[item.status] ?? 0;
                    return (
                      <BarButton
                        key={item.status}
                        type="button"
                        $active={activeChart?.type !== 'status' || activeChart.label === item.label}
                        onClick={() => setActiveChart({ type: 'status', label: item.label })}
                      >
                        <BarMeta>
                          <span>{item.label}</span>
                          <strong>{count}</strong>
                        </BarMeta>
                        <BarTrack>
                          <BarFill $percent={(count / maxStatus) * 100} $tone={STATUS_TONES[item.status]} />
                        </BarTrack>
                      </BarButton>
                    );
                  })}
                </BarList>
              </Panel>

              <Panel>
                <PanelHeader>
                  <div>
                    <h2>Candidaturas por mês</h2>
                    <span>Volume de entrada nas vagas</span>
                  </div>
                </PanelHeader>
                <ChartArea>
                  {monthEntries.length === 0 && <StateMessage>Nenhuma candidatura no período.</StateMessage>}
                  {monthEntries.map(([key, value]) => {
                    const label = monthLabel(key);
                    return (
                      <ColumnButton
                        key={key}
                        type="button"
                        $active={activeChart?.type !== 'month' || activeChart.label === label}
                        onClick={() => setActiveChart({ type: 'month', label })}
                      >
                        <strong>{value}</strong>
                        <Column $height={(value / maxMonth) * 100} />
                        <span>{label}</span>
                      </ColumnButton>
                    );
                  })}
                </ChartArea>
              </Panel>

                 <Panel>
                <PanelHeader>
                  <div>
                    <h2>Detalhe interativo</h2>
                    <span>{activeChart ? activeChart.label : 'Clique em um gráfico'}</span>
                  </div>
                </PanelHeader>
                {selectedDetails.length === 0 ? (
                  <StateMessage>Selecione uma barra ou coluna para ver registros relacionados.</StateMessage>
                ) : (
                  <Table>
                    <thead>
                      <tr>
                        <th>Registro</th>
                        <th>Detalhe</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedDetails.map((item) => (
                        <tr key={`${item.title}-${item.detail}`}>
                          <td>{item.title}</td>
                          <td>{item.detail}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Panel>

              <Panel>
                <PanelHeader>
                  <div>
                    <h2>Cargos mais cadastrados</h2>
                    <span>Banco de talentos por atuação</span>
                  </div>
                </PanelHeader>
                <BarList>
                  {roleEntries.map(([role, count]) => (
                    <BarButton
                      key={role}
                      type="button"
                      $active={activeChart?.type !== 'role' || activeChart.label === role}
                      onClick={() => setActiveChart({ type: 'role', label: role })}
                    >
                      <BarMeta>
                        <span>{role}</span>
                        <strong>{count}</strong>
                      </BarMeta>
                      <BarTrack>
                        <BarFill $percent={(count / maxRole) * 100} />
                      </BarTrack>
                    </BarButton>
                  ))}
                </BarList>
              </Panel>

              <Panel>
                <PanelHeader>
                  <div>
                    <h2>Completude dos currículos</h2>
                    <span>Qualidade da base para triagem</span>
                  </div>
                </PanelHeader>
                <BarList>
                  {[
                    ['Com PDF', completion.pdf],
                    ['Com experiência', completion.experiencia],
                    ['Com formação', completion.formacao],
                    ['Com cursos', completion.cursos],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <BarMeta>
                        <span>{label}</span>
                        <strong>{value}%</strong>
                      </BarMeta>
                      <BarTrack>
                        <BarFill $percent={Number(value)} $tone="#2f9b84" />
                      </BarTrack>
                    </div>
                  ))}
                </BarList>
              </Panel>

              <Panel>
                <PanelHeader>
                  <div>
                    <h2>Vagas com mais candidaturas</h2>
                    <span>Oportunidades com maior tração</span>
                  </div>
                </PanelHeader>
                <Table>
                  <thead>
                    <tr>
                      <th>Vaga</th>
                      <th>Local</th>
                      <th>Candidatos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topJobs.map((vaga) => (
                      <tr key={vaga.id}>
                        <td>{vaga.titulo}</td>
                        <td>{formatLocation(vaga)}</td>
                        <td>{vaga.candidaturas?.length ?? 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Panel>

              <Panel>
                <PanelHeader>
                  <div>
                    <h2>Alertas para ação</h2>
                    <span>Vagas abertas sem candidatos</span>
                  </div>
                </PanelHeader>
                <AlertList>
                  {emptyJobs.length === 0 && <StateMessage>Nenhuma vaga aberta sem candidatura no período.</StateMessage>}
                  {emptyJobs.map((vaga) => (
                    <AlertItem key={vaga.id}>
                      {vaga.titulo}
                      <span>{formatLocation(vaga)}</span>
                    </AlertItem>
                  ))}
                </AlertList>
              </Panel>

              <Panel>
                <PanelHeader>
                  <div>
                    <h2>Cidades com mais candidatos</h2>
                    <span>Distribuicao geografica da base</span>
                  </div>
                </PanelHeader>
                <BarList>
                  {cityEntries.map(([city, count]) => (
                    <div key={city}>
                      <BarMeta>
                        <span>{city}</span>
                        <strong>{count}</strong>
                      </BarMeta>
                      <BarTrack>
                        <BarFill $percent={(count / Math.max(...cityEntries.map(([, value]) => value), 1)) * 100} $tone="#2f74b5" />
                      </BarTrack>
                    </div>
                  ))}
                </BarList>
              </Panel>

            
            </ReportGrid>
          </>
        )}
      </Content>
    </AdminLayout>
  );
}
