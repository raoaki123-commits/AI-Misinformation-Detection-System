import { motion } from 'framer-motion';
import { Brain, AlertTriangle, BookOpen } from 'lucide-react';
import type { AnalysisResult } from '../../types';

interface Props {
  result: AnalysisResult;
}

export const AnalystPanel = ({ result }: Props) => {
  const { analyst_summary, top_reasons, narrative_frame } = result;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Summary */}
      <motion.div
        className="panel"
        style={{ padding: '20px 24px' }}
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Brain size={14} color="var(--electric)" />
          <div className="section-label">Analyst Summary</div>
        </div>
        <p style={{
          fontFamily: 'var(--font-editorial)',
          fontSize: '0.95rem',
          lineHeight: 1.8,
          color: 'rgba(255,255,255,0.78)',
          letterSpacing: '0.01em',
        }}>
          {analyst_summary}
        </p>
      </motion.div>

      {/* Top reasons */}
      <motion.div
        className="panel"
        style={{ padding: '20px 24px' }}
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <AlertTriangle size={14} color="var(--amber)" />
          <div className="section-label">Why Flagged</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {top_reasons.map((reason, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{
                flexShrink: 0,
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: 'rgba(245,159,0,0.1)',
                border: '1px solid rgba(245,159,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--amber)',
              }}>{i + 1}</span>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.72)', lineHeight: 1.6 }}>{reason}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Narrative Frame */}
      {narrative_frame && (
        <motion.div
          className="panel"
          style={{ padding: '20px 24px' }}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <BookOpen size={14} color="var(--gold)" />
            <div className="section-label">Narrative Framing</div>
          </div>
          <div style={{
            background: 'rgba(201,168,76,0.05)',
            border: '1px solid rgba(201,168,76,0.15)',
            borderRadius: 6,
            padding: '14px 16px',
            marginBottom: 12,
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--gold)', marginBottom: 4 }}>
              {narrative_frame.primary}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'rgba(201,168,76,0.6)', letterSpacing: '0.05em' }}>
              ↳ {narrative_frame.secondary}
            </div>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.62)', lineHeight: 1.65 }}>
            {narrative_frame.explanation}
          </p>
        </motion.div>
      )}

      {/* Caution note */}
      <motion.div
        style={{
          padding: '12px 16px',
          background: 'rgba(201,42,42,0.06)',
          border: '1px solid rgba(201,42,42,0.2)',
          borderRadius: 6,
          fontSize: 12,
          color: 'rgba(255,100,100,0.8)',
          lineHeight: 1.6,
          display: 'flex',
          gap: 8,
          alignItems: 'flex-start',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <AlertTriangle size={13} style={{ flexShrink: 0, marginTop: 2 }} />
        <span>
          SENTINEL produces automated intelligence analysis. Conclusions should be treated as analytical guidance, not definitive fact. Always verify claims through primary sources.
        </span>
      </motion.div>
    </div>
  );
};
