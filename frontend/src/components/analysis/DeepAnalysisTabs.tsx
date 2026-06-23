import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IntensityBar } from '../shared/IntensityBar';
import { getPropagandaColor, getPropagandaTypeLabel, getScoreColor } from '../../utils';
import type { AnalysisResult } from '../../types';

const TABS = [
  { id: 'claims', label: 'Claim Breakdown' },
  { id: 'evidence', label: 'Evidence Map' },
  { id: 'propaganda', label: 'Propaganda Markers' },
  { id: 'emotion', label: 'Emotion Profile' },
  { id: 'narrative', label: 'Narrative Framing' },
  { id: 'source', label: 'Source Intelligence' },
];

interface Props {
  result: AnalysisResult;
}

export const DeepAnalysisTabs = ({ result }: Props) => {
  const [activeTab, setActiveTab] = useState('claims');

  return (
    <div className="panel" style={{ overflow: 'hidden' }}>
      {/* Tab bar */}
      <div className="tab-bar" style={{ padding: '0 24px', paddingTop: 4 }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ padding: 24 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'claims' && <ClaimsTab result={result} />}
            {activeTab === 'evidence' && <EvidenceTab result={result} />}
            {activeTab === 'propaganda' && <PropagandaTab result={result} />}
            {activeTab === 'emotion' && <EmotionTab result={result} />}
            {activeTab === 'narrative' && <NarrativeTab result={result} />}
            {activeTab === 'source' && <SourceTab result={result} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const ClaimsTab = ({ result }: Props) => {
  const claims = result.claims || [];
  return (
    <div>
      <div className="section-label" style={{ marginBottom: 16 }}>Extracted Claims · {claims.length} detected</div>
      {claims.length === 0 && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>No significant claims extracted.</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {claims.map((claim, i) => (
          <div key={i} style={{
            background: 'var(--graphite-light)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 6,
            padding: '14px 16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
              <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 13.5, color: 'rgba(255,255,255,0.82)', lineHeight: 1.6, flex: 1 }}>
                {claim.claim}
              </p>
              <div style={{ flexShrink: 0, textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: getScoreColor(claim.risk_score * 100, true), fontWeight: 600 }}>
                  {(claim.risk_score * 100).toFixed(0)} risk
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
                  {(claim.support_score * 100).toFixed(0)} support
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 4, letterSpacing: '0.08em' }}>EVIDENCE</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{claim.evidence_notes}</div>
              </div>
              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 4, letterSpacing: '0.08em' }}>MANIPULATION</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{claim.manipulation_notes}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const EvidenceTab = ({ result }: Props) => {
  const ev = result.evidence_map;
  if (!ev) return null;
  const qualityColors: Record<string, string> = {
    Strong: '#69db7c', Moderate: '#4dabf7', Weak: '#f59f00', 'Very Weak': '#ff6b6b'
  };
  const metrics = [
    { label: 'Named Sources', value: ev.named_sources, max: 10, good: true },
    { label: 'Statistics / Data References', value: ev.statistics_references, max: 10, good: true },
    { label: 'Citation-like References', value: ev.citation_like_references, max: 10, good: true },
    { label: 'Anonymous Source Claims', value: ev.anonymous_claims, max: 10, good: false },
    { label: 'Unsupported Assertions', value: ev.unsupported_assertions, max: 15, good: false },
  ];
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div className="section-label">Evidence Quality Assessment</div>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: 13,
          fontWeight: 600,
          color: qualityColors[ev.evidence_quality] || '#4dabf7',
          letterSpacing: '0.05em',
        }}>
          {ev.evidence_quality}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {metrics.map(m => (
          <div key={m.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{m.label}</span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                color: m.good
                  ? (m.value > 0 ? '#69db7c' : 'rgba(255,255,255,0.3)')
                  : (m.value > 2 ? '#ff6b6b' : m.value > 0 ? '#f59f00' : '#69db7c'),
                fontWeight: 600,
              }}>{m.value}</span>
            </div>
            <IntensityBar
              value={m.value / m.max}
              color={m.good ? '#69db7c' : (m.value > 2 ? '#ff6b6b' : '#f59f00')}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const PropagandaTab = ({ result }: Props) => {
  const markers = result.propaganda_markers || [];
  return (
    <div>
      <div className="section-label" style={{ marginBottom: 16 }}>Detected Propaganda Markers · {markers.length} patterns</div>
      {markers.length === 0 && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>No significant propaganda patterns detected.</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {markers.map((marker, i) => (
          <div key={i} style={{
            background: 'var(--graphite-light)',
            border: `1px solid ${getPropagandaColor(marker.intensity)}33`,
            borderRadius: 6,
            padding: '14px 16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: getPropagandaColor(marker.intensity) }}>
                {getPropagandaTypeLabel(marker.type)}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: getPropagandaColor(marker.intensity) }}>
                {(marker.intensity * 100).toFixed(0)}% intensity
              </span>
            </div>
            <IntensityBar value={marker.intensity} color={getPropagandaColor(marker.intensity)} height={4} />
            {marker.examples.length > 0 && (
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', marginBottom: 6 }}>EXAMPLE SENTENCES</div>
                {marker.examples.slice(0, 2).map((ex, j) => (
                  <p key={j} style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, fontStyle: 'italic', marginBottom: 4 }}>"…{ex.slice(0, 120)}…"</p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const EmotionTab = ({ result }: Props) => {
  const profile = result.emotion_profile;
  if (!profile) return null;
  const emotions = [
    { key: 'fear' as const, label: 'Fear', color: '#ff6b6b' },
    { key: 'outrage' as const, label: 'Outrage', color: '#f59f00' },
    { key: 'urgency' as const, label: 'Urgency', color: '#4dabf7' },
    { key: 'panic' as const, label: 'Panic', color: '#c92a2a' },
    { key: 'disgust' as const, label: 'Disgust', color: '#9c36b5' },
  ];
  return (
    <div>
      <div className="section-label" style={{ marginBottom: 16 }}>Emotional Manipulation Profile</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {emotions.map(({ key, label, color }) => (
          <div key={key}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}>{label}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color, fontWeight: 600 }}>
                {(profile[key] * 100).toFixed(0)}%
              </span>
            </div>
            <IntensityBar value={profile[key]} color={color} height={8} />
          </div>
        ))}
      </div>
    </div>
  );
};



const NarrativeTab = ({ result }: Props) => {
  const frame = result.narrative_frame;
  if (!frame) return null;
  return (
    <div>
      <div className="section-label" style={{ marginBottom: 16 }}>Narrative Intelligence Assessment</div>
      <div style={{
        background: 'rgba(201,168,76,0.05)',
        border: '1px solid rgba(201,168,76,0.2)',
        borderRadius: 8,
        padding: '20px 24px',
        marginBottom: 20,
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--gold)', marginBottom: 8 }}>
          {frame.primary}
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, color: 'rgba(201,168,76,0.55)', letterSpacing: '0.05em', marginBottom: 16 }}>
          Secondary: {frame.secondary}
        </div>
        <div className="divider-gold" style={{ marginBottom: 16 }} />
        <p style={{ fontFamily: 'var(--font-editorial)', fontSize: 14, lineHeight: 1.75, color: 'rgba(255,255,255,0.72)' }}>
          {frame.explanation}
        </p>
      </div>
      <div style={{
        padding: '12px 16px',
        background: 'rgba(77,171,247,0.05)',
        border: '1px solid rgba(77,171,247,0.15)',
        borderRadius: 6,
        fontSize: 12.5,
        color: 'rgba(255,255,255,0.55)',
        lineHeight: 1.65,
      }}>
        Narrative framing analysis identifies the dominant rhetorical lens through which the content presents its message. This does not constitute proof of deliberate deception, but indicates elevated attention is warranted.
      </div>
    </div>
  );
};

const SourceTab = ({ result }: Props) => {
  const source_trust_score = result.source_trust_score ?? 50;
  return (
    <div>
      <div className="section-label" style={{ marginBottom: 16 }}>Source Intelligence Profile</div>
      <div style={{
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        padding: '16px 20px',
        background: 'var(--graphite-light)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 6,
        marginBottom: 16,
      }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 8,
          background: source_trust_score > 70 ? 'rgba(105,219,124,0.1)' : source_trust_score > 40 ? 'rgba(77,171,247,0.1)' : 'rgba(201,42,42,0.1)',
          border: `1px solid ${source_trust_score > 70 ? 'rgba(105,219,124,0.3)' : source_trust_score > 40 ? 'rgba(77,171,247,0.3)' : 'rgba(201,42,42,0.3)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-display)',
          fontSize: '1.1rem',
          fontWeight: 700,
          color: source_trust_score > 70 ? '#69db7c' : source_trust_score > 40 ? '#4dabf7' : '#ff6b6b',
          flexShrink: 0,
        }}>
          {Math.round(source_trust_score)}
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, marginBottom: 4 }}>Source Trust Score</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
            {source_trust_score > 70 ? 'Generally reliable source signals detected.'
              : source_trust_score > 40 ? 'Mixed trust signals. Source identity uncertain.'
              : 'Low trust indicators detected. Exercise significant caution.'}
          </div>
        </div>
      </div>
      <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65 }}>
        Source intelligence is derived from heuristic domain analysis. For verified source assessments, cross-reference with established media bias and reliability databases.
      </p>
    </div>
  );
};

