import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Scan, RotateCcw, FileText, Upload } from 'lucide-react';
import { DEMO_TEXT } from '../../utils';
import type { AnalysisMode, ScanMode } from '../../types';

const MODES: { value: AnalysisMode; label: string; desc: string }[] = [
  { value: 'quick', label: 'Quick Scan', desc: 'Fast credibility overview' },
  { value: 'deep', label: 'Deep Credibility Audit', desc: 'Full multi-layer analysis' },
  { value: 'propaganda', label: 'Propaganda Analysis', desc: 'Focus on rhetoric & manipulation' },
  { value: 'narrative', label: 'Narrative Risk Scan', desc: 'Detect framing & narrative patterns' },
];

interface Props {
  onAnalyze: (text: string, mode: AnalysisMode, sourceUrl?: string) => void;
  loading: boolean;
  selectedMode?: ScanMode;
}

export const AnalysisInput = ({ onAnalyze, loading, selectedMode = 'misinformation' }: Props) => {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<AnalysisMode>('deep');
  const [sourceUrl, setSourceUrl] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (!text.trim() || loading) return;
    onAnalyze(text.trim(), mode, sourceUrl || undefined);
  };

  const handleDemo = () => {
    setText(DEMO_TEXT);
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type === 'text/plain') {
      const t = await file.text();
      setText(t);
    }
  };

  return (
    <div className="panel" style={{ padding: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div className="section-label" style={{ marginBottom: 4 }}>Intelligence Scan</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.9)' }}>
            Submit Content for Analysis
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary" style={{ padding: '7px 14px', fontSize: 12 }} onClick={handleDemo} disabled={loading}>
            <FileText size={13} /> Demo Sample
          </button>
          <button className="btn btn-secondary" style={{ padding: '7px 14px', fontSize: 12 }} onClick={() => fileRef.current?.click()} disabled={loading}>
            <Upload size={13} /> Upload File
          </button>
          <input ref={fileRef} type="file" accept=".txt,.pdf" style={{ display: 'none' }} onChange={handleFile} />
        </div>
      </div>

      {/* Textarea */}
      <textarea
        className="analysis-input"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste a news article, social media post, headline, transcript, or any text content for intelligence analysis..."
        disabled={loading}
      />

      {/* Controls row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
        {/* Mode select */}
        {selectedMode === 'misinformation' && (
          <select
            className="premium-select"
            value={mode}
            onChange={e => setMode(e.target.value as AnalysisMode)}
            disabled={loading}
          >
            {MODES.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        )}

        {/* Source URL */}
        <input
          type="text"
          value={sourceUrl}
          onChange={e => setSourceUrl(e.target.value)}
          placeholder="Source URL (optional)"
          disabled={loading}
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 6,
            color: 'rgba(255,255,255,0.7)',
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            padding: '8px 14px',
            outline: 'none',
            flex: 1,
            minWidth: 200,
          }}
        />

        <div style={{ flex: 1 }} />

        {/* Clear */}
        {text && (
          <button className="btn btn-secondary" style={{ padding: '9px 16px' }} onClick={() => { setText(''); setSourceUrl(''); }} disabled={loading}>
            <RotateCcw size={13} /> Clear
          </button>
        )}

        {/* Analyze */}
        <motion.button
          className="btn btn-primary"
          style={{ padding: '10px 28px', fontSize: 13.5 }}
          onClick={handleSubmit}
          disabled={!text.trim() || loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Scan size={15} />
          {loading ? 'Scanning...' : 'Run Intelligence Scan'}
        </motion.button>
      </div>

      {/* Char count */}
      {text && (
        <div style={{ marginTop: 8, fontSize: 11, color: 'rgba(255,255,255,0.2)', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
          {text.length.toLocaleString()} characters · {text.split(/\s+/).filter(Boolean).length} words
        </div>
      )}
    </div>
  );
};
