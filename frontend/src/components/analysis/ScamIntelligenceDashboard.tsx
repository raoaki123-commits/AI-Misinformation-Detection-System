import { motion } from 'framer-motion';
import { ScoreGauge } from '../shared/ScoreGauge';
import { RiskBadge } from '../shared/RiskBadge';
import { getScoreColor } from '../../utils';
import type { AnalysisResult } from '../../types';

interface Props {
  result: AnalysisResult;
}

const RISK_LEVEL_COLORS: Record<string, string> = {
  Low: '#2f9e44', // emerald
  Moderate: '#4dabf7', // blue
  High: '#f59f00', // amber
  Critical: '#c92a2a' // crimson
};

export const ScamIntelligenceDashboard = ({ result }: Props) => {
  const riskColor = RISK_LEVEL_COLORS[result.risk_level] || '#4dabf7';

  // Extract mode specific breakdown entries
  const getSubScores = () => {
    const data = result.mode_specific || {};
    const scores: { label: string; value: number; type: 'risk' | 'trust' }[] = [];

    switch (result.analysis_mode) {
      case 'job_scam':
        if (data.fee_fraud_risk !== undefined)
          scores.push({ label: 'Upfront Fee Fraud Risk', value: data.fee_fraud_risk, type: 'risk' });
        if (data.identity_theft_risk !== undefined)
          scores.push({ label: 'Identity Theft/Harvesting Risk', value: data.identity_theft_risk, type: 'risk' });
        if (data.compensation_realism_score !== undefined)
          scores.push({ label: 'Compensation Realism Score', value: data.compensation_realism_score, type: 'trust' });
        if (data.role_clarity_score !== undefined)
          scores.push({ label: 'Role & Responsibility Clarity', value: data.role_clarity_score, type: 'trust' });
        if (data.recruiter_trust_score !== undefined)
          scores.push({ label: 'Recruiter Domain/Identity Trust', value: data.recruiter_trust_score, type: 'trust' });
        break;

      case 'phishing':
        if (data.impersonation_confidence !== undefined)
          scores.push({ label: 'Brand Impersonation Confidence', value: data.impersonation_confidence, type: 'risk' });
        if (data.credential_theft_risk !== undefined)
          scores.push({ label: 'Credential/OTP Theft Risk', value: data.credential_theft_risk, type: 'risk' });
        if (data.urgency_fear_score !== undefined)
          scores.push({ label: 'Urgency & Fear Tactics', value: data.urgency_fear_score, type: 'risk' });
        if (data.link_suspicion_score !== undefined)
          scores.push({ label: 'Link / URL Suspicion Score', value: data.link_suspicion_score, type: 'risk' });
        break;

      case 'investment_scam':
        if (data.ponzi_mlm_risk !== undefined)
          scores.push({ label: 'Ponzi / Pyramid Scheme Signals', value: data.ponzi_mlm_risk, type: 'risk' });
        if (data.unrealistic_return_score !== undefined)
          scores.push({ label: 'Unrealistic Guaranteed Returns', value: data.unrealistic_return_score, type: 'risk' });
        if (data.greed_appeal_score !== undefined)
          scores.push({ label: 'High Greed/FOMO Appeal', value: data.greed_appeal_score, type: 'risk' });
        break;

      case 'marketplace_fraud':
        if (data.payment_scam_risk !== undefined)
          scores.push({ label: 'Advance Payment Scam Risk', value: data.payment_scam_risk, type: 'risk' });
        if (data.courier_refund_risk !== undefined)
          scores.push({ label: 'Courier Refund Fraud Signals', value: data.courier_refund_risk, type: 'risk' });
        if (data.seller_trust_score !== undefined)
          scores.push({ label: 'Seller Account Trust Score', value: data.seller_trust_score, type: 'trust' });
        break;

      case 'scholarship_scam':
        if (data.fee_fraud_score !== undefined)
          scores.push({ label: 'Processing Fee Fraud Risk', value: data.fee_fraud_score, type: 'risk' });
        if (data.documentation_risk !== undefined)
          scores.push({ label: 'Suspect Documentation Demands', value: data.documentation_risk, type: 'risk' });
        if (data.institution_trust_score !== undefined)
          scores.push({ label: 'Institution Verifiability Score', value: data.institution_trust_score, type: 'trust' });
        break;

      case 'general_trust':
      default:
        if (data.fraud_risk_score !== undefined)
          scores.push({ label: 'Aggregated Deception Index', value: data.fraud_risk_score, type: 'risk' });
        if (data.trust_score !== undefined)
          scores.push({ label: 'Composite Trust Index', value: data.trust_score, type: 'trust' });
        break;
    }
    return scores;
  };

  const subScores = getSubScores();

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
        <div className="section-label" style={{ marginBottom: 6 }}>Trust Intelligence Verdict</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.2rem',
            fontWeight: 700,
            color: riskColor,
            letterSpacing: '0.03em',
            textShadow: `0 0 20px ${riskColor}33`,
          }}>
            {result.verdict}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <RiskBadge risk={result.risk_level} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
              {(result.confidence * 100).toFixed(0)}% scan confidence
            </span>
          </div>
        </div>

        {/* Topic tags */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
          {result.topic_tags.map(tag => (
            <span key={tag} style={{
              padding: '3px 10px',
              borderRadius: 4,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.6)',
              fontSize: 10,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-mono)',
            }}>
              {tag}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Core Gauges */}
      <motion.div
        className="panel"
        style={{ padding: '20px 24px' }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="section-label" style={{ marginBottom: 16 }}>Core Score Matrix</div>
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 20 }}>
          {/* Overall Risk: inverted color scale (higher is bad) */}
          <ScoreGauge
            score={result.overall_risk_score}
            label="Overall Risk"
            size={90}
            color={getScoreColor(result.overall_risk_score, true)}
          />

          {/* Trust Score: normal color scale (higher is good) */}
          <ScoreGauge
            score={result.trust_score}
            label="Trust Score"
            size={90}
            color={getScoreColor(result.trust_score, false)}
          />

          {/* Manipulation: inverted color scale (higher is bad) */}
          <ScoreGauge
            score={result.manipulation_score}
            label="Deceptive Signals"
            size={90}
            color={getScoreColor(result.manipulation_score, true)}
          />
        </div>
      </motion.div>

      {/* Sub-score Details */}
      {subScores.length > 0 && (
        <motion.div
          className="panel"
          style={{ padding: '20px 24px' }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="section-label" style={{ marginBottom: 16 }}>Detailed Signal Breakdown</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {subScores.map((item, idx) => {
              const color = item.type === 'risk'
                ? getScoreColor(item.value, true)
                : getScoreColor(item.value, false);

              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{item.label}</span>
                    <span style={{ color: color, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                      {Math.round(item.value)}/100
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      width: `${item.value}%`,
                      height: '100%',
                      background: color,
                      borderRadius: 3,
                      boxShadow: `0 0 8px ${color}55`
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};
