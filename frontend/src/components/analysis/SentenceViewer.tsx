import { useState } from 'react';
import type { SentenceAnnotation } from '../../types';
import { getFlagHighlightClass, getFlagLabel } from '../../utils';

interface Props {
  text: string;
  annotations: SentenceAnnotation[];
}

export const SentenceViewer = ({ text, annotations }: Props) => {
  const [activeAnnotation, setActiveAnnotation] = useState<SentenceAnnotation | null>(null);

  // Build annotated segments
  const segments: { text: string; annotation?: SentenceAnnotation }[] = [];
  let remaining = text;

  const sortedAnnotations = [...annotations].sort((a, b) => text.indexOf(a.sentence) - text.indexOf(b.sentence));

  for (const ann of sortedAnnotations) {
    const idx = remaining.indexOf(ann.sentence);
    if (idx === -1) continue;
    if (idx > 0) segments.push({ text: remaining.slice(0, idx) });
    segments.push({ text: ann.sentence, annotation: ann });
    remaining = remaining.slice(idx + ann.sentence.length);
  }
  if (remaining) segments.push({ text: remaining });

  return (
    <div style={{ position: 'relative' }}>
      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
        {[
          { cls: 'highlight-unsupported-claim', label: 'Unsupported Claim', color: '#ff6b6b' },
          { cls: 'highlight-propaganda-cue', label: 'Propaganda Cue', color: '#f59f00' },
          { cls: 'highlight-emotional-escalation', label: 'Emotional Escalation', color: '#c9a84c' },
        ].map(({ cls, label, color }) => (
          <div key={cls} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
            <div style={{ width: 12, height: 4, background: color, opacity: 0.7, borderRadius: 2 }} />
            {label}
          </div>
        ))}
      </div>

      {/* Text body */}
      <div style={{
        fontFamily: 'var(--font-editorial)',
        fontSize: '1rem',
        lineHeight: 1.85,
        color: 'rgba(255,255,255,0.82)',
        letterSpacing: '0.01em',
      }}>
        {segments.map((seg, i) => {
          if (!seg.annotation) return <span key={i}>{seg.text}</span>;
          const primaryFlag = seg.annotation.flags[0] || 'unsupported_claim';
          return (
            <span
              key={i}
              className={getFlagHighlightClass(primaryFlag)}
              onClick={() => setActiveAnnotation(activeAnnotation?.sentence === seg.annotation!.sentence ? null : seg.annotation!)}
              title={seg.annotation.explanation}
            >
              {seg.text}
            </span>
          );
        })}
      </div>

      {/* Annotation popover */}
      {activeAnnotation && (
        <div className="popover-content" style={{
          marginTop: 16,
          position: 'relative',
          background: 'var(--graphite-mid)',
        }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
            {activeAnnotation.flags.map(f => (
              <span key={f} className="badge badge-high" style={{ fontSize: 10 }}>{getFlagLabel(f)}</span>
            ))}
            <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: '#ff6b6b' }}>
              Risk: {(activeAnnotation.risk_score * 100).toFixed(0)}%
            </span>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>
            {activeAnnotation.explanation}
          </p>
          <button
            onClick={() => setActiveAnnotation(null)}
            style={{ marginTop: 10, fontSize: 11, color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer' }}
          >Close ×</button>
        </div>
      )}
    </div>
  );
};
