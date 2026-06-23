import { getRiskBadgeClass } from '../../utils';
import { AlertTriangle, CheckCircle, AlertCircle, Zap } from 'lucide-react';

const ICONS: Record<string, React.ReactNode> = {
  Critical: <Zap size={10} />,
  High: <AlertTriangle size={10} />,
  Moderate: <AlertCircle size={10} />,
  Low: <CheckCircle size={10} />,
};

export const RiskBadge = ({ risk }: { risk: string }) => (
  <span className={`badge ${getRiskBadgeClass(risk)}`}>
    {ICONS[risk] || <AlertCircle size={10} />}
    {risk}
  </span>
);
