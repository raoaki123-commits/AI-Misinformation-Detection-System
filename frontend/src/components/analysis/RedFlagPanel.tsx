import { ShieldCheck, ShieldAlert, Flag } from 'lucide-react';
import type { RedFlag } from '../../types';

interface Props {
  redFlags: RedFlag[];
}

export const RedFlagPanel = ({ redFlags }: Props) => {
  if (!redFlags || redFlags.length === 0) {
    return (
      <div className="panel" style={{ padding: 24, textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', padding: 12, borderRadius: '50%', background: 'var(--emerald-dim)', color: 'var(--emerald)', marginBottom: 12 }}>
          <ShieldCheck size={28} />
        </div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: '#fff', marginBottom: 6 }}>No Red Flags Detected</h3>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
          This content does not trigger any of SENTINEL's standard fraud, deception, or risk patterns.
        </p>
      </div>
    );
  }

  const getSeverityStyle = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return {
          bg: 'rgba(201, 42, 42, 0.15)',
          color: '#ff6b6b',
          border: '1px solid rgba(201, 42, 42, 0.3)',
          label: 'CRITICAL RISK'
        };
      case 'high':
        return {
          bg: 'rgba(232, 89, 12, 0.15)',
          color: '#ff922b',
          border: '1px solid rgba(232, 89, 12, 0.3)',
          label: 'HIGH RISK'
        };
      case 'medium':
        return {
          bg: 'rgba(245, 159, 0, 0.12)',
          color: '#fcc419',
          border: '1px solid rgba(245, 159, 0, 0.25)',
          label: 'MEDIUM RISK'
        };
      case 'low':
      default:
        return {
          bg: 'rgba(77, 171, 247, 0.1)',
          color: '#74c0fc',
          border: '1px solid rgba(77, 171, 247, 0.2)',
          label: 'LOW RISK'
        };
    }
  };

  return (
    <div className="panel" style={{ padding: 24 }}>
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <div style={{ color: 'var(--amber)', display: 'flex', alignItems: 'center' }}>
          <ShieldAlert size={20} />
        </div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: '#fff', letterSpacing: '0.03em' }}>
          Risk Indicators & Red Flags ({redFlags.length})
        </h3>
      </div>

      {/* Flag List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {redFlags.map((flag, idx) => {
          const style = getSeverityStyle(flag.severity);
          return (
            <div
              key={idx}
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.04)',
                borderRadius: 6,
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12
              }}
            >
              {/* Icon */}
              <div style={{
                color: style.color,
                marginTop: 2,
                display: 'flex',
                alignItems: 'center'
              }}>
                <Flag size={16} />
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
                  <span style={{
                    fontWeight: 600,
                    fontSize: 13,
                    color: 'rgba(255,255,255,0.9)',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {flag.type.replace(/_/g, ' ').toUpperCase()}
                  </span>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    padding: '3px 8px',
                    borderRadius: 4,
                    background: style.bg,
                    color: style.color,
                    border: style.border,
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {style.label}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>
                  {flag.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
