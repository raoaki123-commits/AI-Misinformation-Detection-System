import { motion } from 'framer-motion';
import { getCredibilityColor } from '../../utils';

interface ScoreGaugeProps {
  score: number;
  label: string;
  size?: number;
  color?: string;
}

export const ScoreGauge = ({ score, label, size = 100, color }: ScoreGaugeProps) => {
  const r = (size / 2) - 8;
  const circumference = 2 * Math.PI * r;
  const resolvedColor = color || getCredibilityColor(score);
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={6}
          />
          <motion.circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none"
            stroke={resolvedColor}
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 6px ${resolvedColor}66)` }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: size * 0.22, fontWeight: 700, color: resolvedColor, fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
            {Math.round(score)}
          </span>
          <span style={{ fontSize: size * 0.1, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' }}>/100</span>
        </div>
      </div>
      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-display)' }}>
        {label}
      </span>
    </div>
  );
};
