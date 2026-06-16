import styled from 'styled-components';

export const Content = styled.div`
  width: min(1380px, calc(100% - 48px));
  margin: 0 auto;
  padding: 42px 0 56px;
  color: #102a43;

  @media (max-width: 720px) {
    width: min(100% - 28px, 1380px);
    padding: 28px 0 40px;
  }
`;

export const ContentHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 24px;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

export const SectionCategory = styled.span`
  display: block;
  margin-bottom: 6px;
  color: #fb7900;
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0;
`;

export const SectionTitle = styled.h1`
  margin: 0;
  color: #102a43;
  font-size: 28px;
  font-weight: 900;
  letter-spacing: 0;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

export const Select = styled.select`
  height: 40px;
  padding: 0 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #fff;
  color: #223044;
  font-size: 13px;
  font-weight: 800;
  outline: none;
`;

export const Button = styled.button`
  min-height: 40px;
  padding: 0 16px;
  border: 0;
  border-radius: 8px;
  background: #ff8424;
  color: #fff;
  cursor: pointer;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;

  &:hover {
    background: #fb7900;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 18px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const MetricCard = styled.div`
  min-height: 102px;
  padding: 18px;
  border: 1px solid #dbe6ef;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 14px 32px rgba(15, 23, 42, 0.06);

  span {
    display: block;
    margin-bottom: 10px;
    color: #64748b;
    font-size: 11px;
    font-weight: 900;
    text-transform: uppercase;
  }

  strong {
    color: #102a43;
    font-size: 30px;
    font-weight: 900;
  }

  p {
    margin: 8px 0 0;
    color: #64748b;
    font-size: 12px;
    font-weight: 700;
  }
`;

export const ReportGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: 18px;

  @media (max-width: 1040px) {
    grid-template-columns: 1fr;
  }
`;

export const Panel = styled.section`
  min-width: 0;
  padding: 22px;
  border: 1px solid #dbe6ef;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.07);
`;

export const PanelHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;

  h2 {
    margin: 0;
    color: #102a43;
    font-size: 18px;
    font-weight: 900;
  }

  span {
    color: #64748b;
    font-size: 12px;
    font-weight: 800;
  }
`;

export const BarList = styled.div`
  display: grid;
  gap: 12px;
`;

export const BarButton = styled.button<{ $active?: boolean }>`
  width: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  text-align: left;
  opacity: ${({ $active }) => ($active ? 1 : 0.78)};

  &:hover {
    opacity: 1;
  }
`;

export const BarMeta = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 6px;
  color: #334155;
  font-size: 12px;
  font-weight: 900;
`;

export const BarTrack = styled.div`
  height: 12px;
  border-radius: 999px;
  background: #eaf2f8;
  overflow: hidden;
`;

export const BarFill = styled.div<{ $percent: number; $tone?: string }>`
  width: ${({ $percent }) => Math.max($percent, 2)}%;
  height: 100%;
  border-radius: inherit;
  background: ${({ $tone }) => $tone ?? '#ff8424'};
  transition: width 180ms ease;
`;

export const ChartArea = styled.div`
  min-height: 220px;
  display: flex;
  align-items: flex-end;
  gap: 10px;
  padding: 12px 0 0;
`;

export const ColumnButton = styled.button<{ $active?: boolean }>`
  min-width: 0;
  flex: 1;
  height: 210px;
  border: 0;
  padding: 0;
  background: transparent;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 8px;
  cursor: pointer;
  opacity: ${({ $active }) => ($active ? 1 : 0.75)};

  &:hover {
    opacity: 1;
  }

  strong {
    color: #102a43;
    font-size: 12px;
    font-weight: 900;
  }

  span {
    color: #64748b;
    font-size: 10px;
    font-weight: 800;
    white-space: nowrap;
  }
`;

export const Column = styled.div<{ $height: number }>`
  width: 100%;
  min-height: 8px;
  height: ${({ $height }) => Math.max($height, 8)}%;
  border-radius: 8px 8px 3px 3px;
  background: #ff8424;
  box-shadow: inset 0 -10px 14px rgba(180, 83, 9, 0.15);
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;

  th {
    padding: 12px 10px;
    background: #eef5fb;
    color: #102a43;
    font-size: 11px;
    font-weight: 900;
    text-align: left;
    text-transform: uppercase;
  }

  td {
    padding: 13px 10px;
    border-bottom: 1px solid #e2e8f0;
    color: #334155;
    font-weight: 700;
    vertical-align: top;
  }
`;

export const AlertList = styled.div`
  display: grid;
  gap: 10px;
`;

export const AlertItem = styled.div`
  padding: 14px;
  border: 1px solid #fed7aa;
  border-radius: 8px;
  background: #fff7ed;
  color: #9a3412;
  font-size: 13px;
  font-weight: 800;
  line-height: 1.45;

  span {
    display: block;
    margin-top: 4px;
    color: #c2410c;
    font-size: 12px;
  }
`;

export const StateMessage = styled.div`
  padding: 18px;
  border: 1px solid #dbe6ef;
  border-radius: 8px;
  background: #fff;
  color: #64748b;
  font-size: 13px;
  font-weight: 800;
`;
