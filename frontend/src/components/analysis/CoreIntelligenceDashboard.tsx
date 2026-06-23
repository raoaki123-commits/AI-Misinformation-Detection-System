import { motion } from 'framer-motion';
import { ScoreGauge } from '../shared/ScoreGauge';
import { RiskBadge } from '../shared/RiskBadge';
import { ScoreRadarChart } from '../charts/RadarChart';
import { getScoreColor } from '../../utils';
import type { AnalysisResult } from '../../types';

const VERDICT_COLORS: Record<string, string> = {
  'Likely Reliable': '#69db7c',
  'Mixed / Unverified': '#4dabf7',
  'Misleading Framing': '#f59f00',
  'Emotionally Manipulative': '#f59f00',
  'Propaganda-Heavy': '#ff6b6b',
  'High-Risk Misinformation': '#c92a2a',
};

interface Props {
  result: AnalysisResult;
}

export const CoreIntelligenceDashboard = ({ result }: Props) => {
  const verdictColor = VERDICT_COLORS[result.verdict] || '#4dabf7';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Verdict Banner */}
      <motion.div
        className="panel-elevated"
        style={{ padding: '20px 24px' }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="section-label" style={{ marginBottom: 6 }}>Intelligence Verdict</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.2rem',
            fontWeight: 700,
            color: verdictColor,
            letterSpacing: '0.03em',
            textShadow: `0 0 20px ${verdictColor}44`,
          }}>
            {result.verdict}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <RiskBadge risk={result.risk_level} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
              {(result.confidence * 100).toFixed(0)}% confidence
            </span>
          </div>
        </div>

        {/* Topic tags */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
          {result.topic_tags.map(tag => (
            <span key={tag} style={{
              padding: '3px 10px',
              borderRadius: 4,
              background: 'rgba(201,168,76,0.1)',
              border: '1px solid rgba(201,168,76,0.25)',
              color: 'var(--gold)',
              fontSize: 10,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-display)',
            }}>
              {tag}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Score gauges */}
      <motion.div
        className="panel"
        style={{ padding: '20px 24px' }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="section-label" style={{ marginBottom: 16 }}>Score Intelligence</div>
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 16 }}>
          <ScoreGauge score={result.credibility_score ?? 50} label="Credibility" size={90} />
          <ScoreGauge score={result.evidence_score ?? 0} label="Evidence" size={90} />
          <ScoreGauge score={result.manipulation_score ?? 0} label="Manipulation" size={90} color={getScoreColor(result.manipulation_score ?? 0, true)} />
          <ScoreGauge score={result.propaganda_score ?? 0} label="Propaganda" size={90} color={getScoreColor(result.propaganda_score ?? 0, true)} />
          <ScoreGauge score={result.source_trust_score ?? 50} label="Source Trust" size={90} />
        </div>
      </motion.div>

      {/* Radar */}
      <motion.div
        className="panel"
        style={{ padding: '20px 24px' }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="section-label" style={{ marginBottom: 12 }}>Dimensional Score Breakdown</div>
        <ScoreRadarChart
          credibility={result.credibility_score ?? 50}
          evidence={result.evidence_score ?? 0}
          manipulation={result.manipulation_score ?? 0}
          propaganda={result.propaganda_score ?? 0}
          source_trust={result.source_trust_score ?? 50}
        />
      </motion.div>
    </div>
  );
};
