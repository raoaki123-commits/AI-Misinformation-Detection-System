import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnalysisInput } from '../components/analysis/AnalysisInput';
import { AnalysisProgress } from '../components/analysis/AnalysisProgress';
import { SentenceViewer } from '../components/analysis/SentenceViewer';
import { CoreIntelligenceDashboard } from '../components/analysis/CoreIntelligenceDashboard';
import { AnalystPanel } from '../components/analysis/AnalystPanel';
import { DeepAnalysisTabs } from '../components/analysis/DeepAnalysisTabs';
import { ModeSelectorBar } from '../components/analysis/ModeSelectorBar';
import { ScamIntelligenceDashboard } from '../components/analysis/ScamIntelligenceDashboard';
import { ScamAnalystPanel } from '../components/analysis/ScamAnalystPanel';
import { RedFlagPanel } from '../components/analysis/RedFlagPanel';
import { analyzeText } from '../services/api';
import type { AnalysisResult, AnalysisMode, ScanMode } from '../types';
import { AlertTriangle, RefreshCw, Shield } from 'lucide-react';

const STAGE_DELAYS = [400, 900, 1500, 2200, 3000, 3800];

export const AnalyzePage = () => {
  const [selectedMode, setSelectedMode] = useState<ScanMode>('misinformation');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');

  const handleAnalyze = async (text: string, mode: AnalysisMode, sourceUrl?: string) => {
    setLoading(true);
    setResult(null);
    setError(null);
    setInputText(text);
    setStage(0);

    // Staged progress simulation
    const timers: ReturnType<typeof setTimeout>[] = [];
    STAGE_DELAYS.forEach((delay, i) => {
      const t = setTimeout(() => setStage(i), delay);
      timers.push(t);
    });

    try {
      const data = await analyzeText({
        text,
        mode,
        analysis_mode: selectedMode,
        source_url: sourceUrl
      });
      timers.forEach(clearTimeout);
      setStage(6); // All done
      await new Promise(r => setTimeout(r, 300));
      setResult(data);
    } catch (err: any) {
      timers.forEach(clearTimeout);
      const msg = err?.response?.data?.detail || err?.message || 'Analysis failed. Please check if the backend server is running.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setStage(-1);
  };

  return (
    <div style={{ padding: '24px 32px', minHeight: '100vh', maxWidth: 1600, margin: '0 auto' }}>
      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <Shield size={16} color="#4dabf7" />
          <span className="section-label">Intelligence Console</span>
          {result && (
            <button
              className="btn btn-secondary"
              style={{ padding: '5px 12px', fontSize: 11, marginLeft: 'auto' }}
              onClick={handleReset}
            >
              <RefreshCw size={11} /> New Scan
            </button>
          )}
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.4rem',
          letterSpacing: '0.06em',
          color: 'rgba(255,255,255,0.9)',
        }}>
          Content Analysis Dashboard
        </h1>
      </div>

      {/* Input — always shown unless result is present */}
      <AnimatePresence mode="wait">
        {!result && !loading && (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModeSelectorBar selectedMode={selectedMode} onChange={setSelectedMode} disabled={loading} />
            <AnalysisInput onAnalyze={handleAnalyze} loading={loading} selectedMode={selectedMode} />
          </motion.div>
        )}

        {/* Loading state */}
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ maxWidth: 600, margin: '0 auto' }}
          >
            <AnalysisProgress currentStage={stage} />
          </motion.div>
        )}

        {/* Error */}
        {error && !loading && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              padding: '28px 32px',
              background: 'rgba(201,42,42,0.08)',
              border: '1px solid rgba(201,42,42,0.25)',
              borderRadius: 8,
              display: 'flex',
              gap: 16,
              alignItems: 'flex-start',
              marginBottom: 24,
            }}
          >
            <AlertTriangle size={20} color="#ff6b6b" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: '#ff6b6b', marginBottom: 6 }}>Analysis Failed</div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{error}</p>
              <button className="btn btn-secondary" style={{ marginTop: 12, padding: '7px 16px', fontSize: 12 }} onClick={handleReset}>
                <RefreshCw size={12} /> Try Again
              </button>
            </div>
          </motion.div>
        )}

        {/* Results */}
        {result && !loading && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {result.analysis_mode === 'misinformation' ? (
              <>
                {/* Misinformation mode: 3-column grid */}
                <div
                  className="analyze-grid"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1.1fr 1fr',
                    gap: 20,
                    marginBottom: 24,
                    alignItems: 'start',
                  }}
                >
                  {/* Left: Content viewer */}
                  <div className="panel" style={{ padding: '20px 24px' }}>
                    <div className="section-label" style={{ marginBottom: 12 }}>Content Viewer</div>
                    <div style={{ marginBottom: 8, fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: 'var(--gold)', letterSpacing: '0.04em', lineHeight: 1.4 }}>
                      {result.headline}
                    </div>
                    <div className="divider" />
                    <SentenceViewer
                      text={inputText}
                      annotations={result.sentence_annotations}
                    />
                  </div>

                  {/* Center: Core dashboard */}
                  <div>
                    <CoreIntelligenceDashboard result={result} />
                  </div>

                  {/* Right: Analyst panel */}
                  <div>
                    <AnalystPanel result={result} />
                  </div>
                </div>

                {/* Deep analysis tabs — full width */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <DeepAnalysisTabs result={result} />
                </motion.div>
              </>
            ) : (
              <>
                {/* Scam modes: 3-column grid */}
                <div
                  className="analyze-grid"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1.1fr 1fr',
                    gap: 20,
                    marginBottom: 24,
                    alignItems: 'start',
                  }}
                >
                  {/* Left: Content viewer */}
                  <div className="panel" style={{ padding: '20px 24px' }}>
                    <div className="section-label" style={{ marginBottom: 12 }}>Content Viewer</div>
                    <div style={{ marginBottom: 8, fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: 'var(--gold)', letterSpacing: '0.04em', lineHeight: 1.4 }}>
                      {result.headline}
                    </div>
                    <div className="divider" />
                    <SentenceViewer
                      text={inputText}
                      annotations={result.sentence_annotations}
                    />
                  </div>

                  {/* Center: Scam dashboard */}
                  <div>
                    <ScamIntelligenceDashboard result={result} />
                  </div>

                  {/* Right: Scam Analyst panel */}
                  <div>
                    <ScamAnalystPanel result={result} />
                  </div>
                </div>

                {/* Red Flags Panel — full width */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <RedFlagPanel redFlags={result.red_flags} />
                </motion.div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
