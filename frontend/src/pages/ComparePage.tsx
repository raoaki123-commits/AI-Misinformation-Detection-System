import { useState } from 'react';
import { motion } from 'framer-motion';
import { GitCompare, Zap, AlertTriangle, CheckCircle2, Flag } from 'lucide-react';
import { analyzeText } from '../services/api';
import { getCredibilityColor, getScoreColor, getRiskBadgeClass } from '../utils';
import { ModeSelectorBar } from '../components/analysis/ModeSelectorBar';
import type { AnalysisResult, ScanMode } from '../types';

const COMPARE_PLACEHOLDER_A = `Scientists have confirmed that the new vaccine is safe and effective after a large-scale clinical trial involving 40,000 participants showed a 95% efficacy rate. Dr. Sarah Chen, lead researcher at Johns Hopkins University, presented the peer-reviewed findings published in The Lancet. Side effects were mild and consistent with expectations.`;

const COMPARE_PLACEHOLDER_B = `EXPOSED: The new vaccine is KILLING people and the government is covering it up! Thousands of deaths are being hidden. Doctors are being silenced. Everyone knows Big Pharma is behind this but the mainstream media refuses to report it. Wake up people — they don't want you to know the truth!`;

interface CompareColumn {
  text: string;
  result: AnalysisResult | null;
  loading: boolean;
  error: string | null;
}

export const ComparePage = () => {
  const [selectedMode, setSelectedMode] = useState<ScanMode>('misinformation');
  const [colA, setColA] = useState<CompareColumn>({ text: '', result: null, loading: false, error: null });
  const [colB, setColB] = useState<CompareColumn>({ text: '', result: null, loading: false, error: null });

  const runAnalysis = async (col: 'a' | 'b') => {
    const text = col === 'a' ? colA.text : colB.text;
    if (text.trim().length < 30) return;

    const setCol = col === 'a' ? setColA : setColB;
    setCol(prev => ({ ...prev, loading: true, error: null, result: null }));

    try {
      const result = await analyzeText({
        text,
        mode: 'deep',
        analysis_mode: selectedMode
      });
      setCol(prev => ({ ...prev, result, loading: false }));
    } catch (err: any) {
      setCol(prev => ({
        ...prev,
        loading: false,
        error: err?.response?.data?.detail || err?.message || 'Analysis failed',
      }));
    }
  };

  const runBoth = () => {
    if (colA.text.trim().length >= 30 && colB.text.trim().length >= 30) {
      runAnalysis('a');
      runAnalysis('b');
    }
  };

  const loadDemo = () => {
    // Only load placeholders if mode is misinformation
    if (selectedMode === 'misinformation') {
      setColA({ text: COMPARE_PLACEHOLDER_A, result: null, loading: false, error: null });
      setColB({ text: COMPARE_PLACEHOLDER_B, result: null, loading: false, error: null });
    } else {
      setColA({
        text: `Urgent security warning! Your bank account has been locked due to suspicious login attempts. To verify your identity and restore access, click this secure link: http://secure-netbank-otp.com/login and input your banking password and Aadhaar number immediately. Failure to act in 24 hours will result in permanent suspension.`,
        result: null,
        loading: false,
        error: null
      });
      setColB({
        text: `Dear customer, please be informed that we are upgrading our security systems. Under no circumstances will the bank ask you for your PIN, OTP, CVV, or passwords via SMS or phone calls. If you receive any such request, report it immediately to our customer support.`,
        result: null,
        loading: false,
        error: null
      });
    }
  };

  const bothReady = colA.result && colB.result;

  const ScoreRow = ({ label, valA, valB, inverted = false }: { label: string; valA: number; valB: number; inverted?: boolean }) => {
    const better = inverted ? (valA < valB ? 'a' : 'b') : (valA > valB ? 'a' : 'b');
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr 1fr',
        alignItems: 'center',
        padding: '10px 0',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '1.3rem',
          fontWeight: 700,
          color: getScoreColor(valA, inverted),
          textAlign: 'center',
          opacity: better === 'a' ? 1 : 0.5,
        }}>
          {Math.round(valA)}
          {better === 'a' && <CheckCircle2 size={12} style={{ marginLeft: 4, display: 'inline-block', verticalAlign: 'middle' }} />}
        </div>
        <div style={{
          textAlign: 'center',
          fontFamily: 'var(--font-display)',
          fontSize: 12,
          letterSpacing: '0.08em',
          color: 'rgba(255,255,255,0.5)',
        }}>
          {label}
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '1.3rem',
          fontWeight: 700,
          color: getScoreColor(valB, inverted),
          textAlign: 'center',
          opacity: better === 'b' ? 1 : 0.5,
        }}>
          {Math.round(valB)}
          {better === 'b' && <CheckCircle2 size={12} style={{ marginLeft: 4, display: 'inline-block', verticalAlign: 'middle' }} />}
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '24px 32px', minHeight: '100vh', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <GitCompare size={16} color="#4dabf7" />
          <span className="section-label">Comparative Intelligence</span>
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.4rem',
          letterSpacing: '0.06em',
          color: 'rgba(255,255,255,0.9)',
        }}>
          Side-by-Side Comparison
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 6, maxWidth: 600 }}>
          Compare two pieces of text side-by-side using the selected intelligence analysis mode.
        </p>
      </div>

      {/* Mode Selector */}
      <ModeSelectorBar
        selectedMode={selectedMode}
        onChange={(mode) => {
          setSelectedMode(mode);
          setColA(prev => ({ ...prev, result: null }));
          setColB(prev => ({ ...prev, result: null }));
        }}
        disabled={colA.loading || colB.loading}
      />

      {/* Input grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Column A */}
        <div className="panel" style={{ padding: '20px 24px' }}>
          <div className="section-label" style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 20, height: 20, borderRadius: '50%',
              background: 'rgba(77,171,247,0.15)', border: '1px solid rgba(77,171,247,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 700, color: '#4dabf7',
            }}>A</div>
            Source A
          </div>
          <textarea
            className="analysis-input"
            placeholder="Paste the first text to analyze…"
            value={colA.text}
            onChange={e => setColA(prev => ({ ...prev, text: e.target.value }))}
            style={{ minHeight: 160 }}
          />
          {colA.loading && (
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--electric)', fontSize: 12 }}>
              <div className="stage-dot" style={{ background: 'var(--electric)', boxShadow: '0 0 8px rgba(77,171,247,0.6)', animation: 'pulse-dot 1s infinite' }} />
              Analyzing…
            </div>
          )}
          {colA.error && (
            <div style={{ marginTop: 10, fontSize: 12, color: '#ff6b6b', display: 'flex', gap: 6, alignItems: 'center' }}>
              <AlertTriangle size={12} /> {colA.error}
            </div>
          )}
        </div>

        {/* Column B */}
        <div className="panel" style={{ padding: '20px 24px' }}>
          <div className="section-label" style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 20, height: 20, borderRadius: '50%',
              background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 700, color: 'var(--gold)',
            }}>B</div>
            Source B
          </div>
          <textarea
            className="analysis-input"
            placeholder="Paste the second text to compare…"
            value={colB.text}
            onChange={e => setColB(prev => ({ ...prev, text: e.target.value }))}
            style={{ minHeight: 160 }}
          />
          {colB.loading && (
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--electric)', fontSize: 12 }}>
              <div className="stage-dot" style={{ background: 'var(--electric)', boxShadow: '0 0 8px rgba(77,171,247,0.6)', animation: 'pulse-dot 1s infinite' }} />
              Analyzing…
            </div>
          )}
          {colB.error && (
            <div style={{ marginTop: 10, fontSize: 12, color: '#ff6b6b', display: 'flex', gap: 6, alignItems: 'center' }}>
              <AlertTriangle size={12} /> {colB.error}
            </div>
          )}
        </div>
      </div>

      {/* Action bar */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 28 }}>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="btn btn-primary"
          onClick={runBoth}
          disabled={colA.loading || colB.loading || colA.text.trim().length < 30 || colB.text.trim().length < 30}
          style={{
            padding: '12px 32px',
            fontSize: 13,
            opacity: (colA.text.trim().length < 30 || colB.text.trim().length < 30) ? 0.4 : 1,
          }}
        >
          <Zap size={14} /> Compare Both
        </motion.button>
        <button className="btn btn-secondary" onClick={loadDemo} style={{ padding: '12px 24px', fontSize: 12 }}>
          Load Demo Sample
        </button>
      </div>

      {/* Results comparison */}
      {bothReady && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Verdict comparison */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 1fr', gap: 16, marginBottom: 24 }}>
            <div className="panel-elevated" style={{ padding: '24px 28px', textAlign: 'center' }}>
              <div className="section-label" style={{ marginBottom: 12 }}>Source A Verdict</div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.1rem',
                color: colA.result!.analysis_mode === 'misinformation'
                  ? getCredibilityColor(colA.result!.credibility_score ?? 50)
                  : getScoreColor(colA.result!.trust_score, false),
                letterSpacing: '0.04em',
                marginBottom: 10,
              }}>
                {colA.result!.verdict}
              </div>
              <span className={`badge ${getRiskBadgeClass(colA.result!.risk_level)}`}>
                {colA.result!.risk_level} Risk
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'rgba(77,171,247,0.08)', border: '1px solid rgba(77,171,247,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <GitCompare size={16} color="#4dabf7" />
              </div>
            </div>

            <div className="panel-elevated" style={{ padding: '24px 28px', textAlign: 'center' }}>
              <div className="section-label" style={{ marginBottom: 12 }}>Source B Verdict</div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.1rem',
                color: colB.result!.analysis_mode === 'misinformation'
                  ? getCredibilityColor(colB.result!.credibility_score ?? 50)
                  : getScoreColor(colB.result!.trust_score, false),
                letterSpacing: '0.04em',
                marginBottom: 10,
              }}>
                {colB.result!.verdict}
              </div>
              <span className={`badge ${getRiskBadgeClass(colB.result!.risk_level)}`}>
                {colB.result!.risk_level} Risk
              </span>
            </div>
          </div>

          {/* Score breakdown */}
          <div className="panel" style={{ padding: '24px 32px' }}>
            <div className="ornament" style={{ maxWidth: 400, margin: '0 auto 20px' }}>SCORE COMPARISON</div>
            {selectedMode === 'misinformation' ? (
              <>
                <ScoreRow label="CREDIBILITY" valA={colA.result!.credibility_score ?? 50} valB={colB.result!.credibility_score ?? 50} />
                <ScoreRow label="EVIDENCE QUALITY" valA={colA.result!.evidence_score ?? 0} valB={colB.result!.evidence_score ?? 0} />
                <ScoreRow label="MANIPULATION" valA={colA.result!.manipulation_score} valB={colB.result!.manipulation_score} inverted />
                <ScoreRow label="PROPAGANDA" valA={colA.result!.propaganda_score ?? 0} valB={colB.result!.propaganda_score ?? 0} inverted />
                <ScoreRow label="SOURCE TRUST" valA={colA.result!.source_trust_score ?? 50} valB={colB.result!.source_trust_score ?? 50} />
              </>
            ) : (
              <>
                <ScoreRow label="OVERALL SCAM RISK" valA={colA.result!.overall_risk_score} valB={colB.result!.overall_risk_score} inverted />
                <ScoreRow label="TRUST SCORE" valA={colA.result!.trust_score} valB={colB.result!.trust_score} />
                <ScoreRow label="DECEPTIVE SIGNALS" valA={colA.result!.manipulation_score} valB={colB.result!.manipulation_score} inverted />
              </>
            )}
          </div>

          {/* Bottom details: Claims or Red Flags */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 20 }}>
            {selectedMode === 'misinformation' ? (
              <>
                {/* Column A claims */}
                <div className="panel" style={{ padding: '20px 24px' }}>
                  <div className="section-label" style={{ marginBottom: 10 }}>Source A — Flagged Claims</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
                    {(colA.result!.claims || []).length} claims extracted,{' '}
                    <span style={{ color: '#ff6b6b' }}>
                      {(colA.result!.claims || []).filter(c => c.risk_score > 0.5).length} high-risk
                    </span>
                  </div>
                  {(colA.result!.claims || []).slice(0, 3).map((c, i) => (
                    <div key={i} style={{
                      padding: '8px 12px',
                      marginTop: 8,
                      background: 'rgba(255,255,255,0.03)',
                      borderLeft: `3px solid ${getScoreColor(c.risk_score * 100, true)}`,
                      borderRadius: '0 4px 4px 0',
                      fontSize: 12,
                      color: 'rgba(255,255,255,0.65)',
                      lineHeight: 1.5,
                    }}>
                      {c.claim.slice(0, 120)}…
                    </div>
                  ))}
                </div>

                {/* Column B claims */}
                <div className="panel" style={{ padding: '20px 24px' }}>
                  <div className="section-label" style={{ marginBottom: 10 }}>Source B — Flagged Claims</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
                    {(colB.result!.claims || []).length} claims extracted,{' '}
                    <span style={{ color: '#ff6b6b' }}>
                      {(colB.result!.claims || []).filter(c => c.risk_score > 0.5).length} high-risk
                    </span>
                  </div>
                  {(colB.result!.claims || []).slice(0, 3).map((c, i) => (
                    <div key={i} style={{
                      padding: '8px 12px',
                      marginTop: 8,
                      background: 'rgba(255,255,255,0.03)',
                      borderLeft: `3px solid ${getScoreColor(c.risk_score * 100, true)}`,
                      borderRadius: '0 4px 4px 0',
                      fontSize: 12,
                      color: 'rgba(255,255,255,0.65)',
                      lineHeight: 1.5,
                    }}>
                      {c.claim.slice(0, 120)}…
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* Column A Red Flags */}
                <div className="panel" style={{ padding: '20px 24px' }}>
                  <div className="section-label" style={{ marginBottom: 10 }}>Source A — Deception Signals</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
                    {(colA.result!.red_flags || []).length} flags detected,{' '}
                    <span style={{ color: '#ff6b6b' }}>
                      {(colA.result!.red_flags || []).filter(f => f.severity === 'critical' || f.severity === 'high').length} high/critical
                    </span>
                  </div>
                  {(colA.result!.red_flags || []).slice(0, 3).map((f, i) => (
                    <div key={i} style={{
                      padding: '8px 12px',
                      marginTop: 8,
                      background: 'rgba(255,255,255,0.03)',
                      borderLeft: '3px solid #ff6b6b',
                      borderRadius: '0 4px 4px 0',
                      fontSize: 12,
                      color: 'rgba(255,255,255,0.65)',
                      lineHeight: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8
                    }}>
                      <Flag size={12} color="#ff6b6b" />
                      <div>
                        <strong>{f.type.replace(/_/g, ' ')}:</strong> {f.description.slice(0, 90)}…
                      </div>
                    </div>
                  ))}
                </div>

                {/* Column B Red Flags */}
                <div className="panel" style={{ padding: '20px 24px' }}>
                  <div className="section-label" style={{ marginBottom: 10 }}>Source B — Deception Signals</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
                    {(colB.result!.red_flags || []).length} flags detected,{' '}
                    <span style={{ color: '#ff6b6b' }}>
                      {(colB.result!.red_flags || []).filter(f => f.severity === 'critical' || f.severity === 'high').length} high/critical
                    </span>
                  </div>
                  {(colB.result!.red_flags || []).slice(0, 3).map((f, i) => (
                    <div key={i} style={{
                      padding: '8px 12px',
                      marginTop: 8,
                      background: 'rgba(255,255,255,0.03)',
                      borderLeft: '3px solid #ff6b6b',
                      borderRadius: '0 4px 4px 0',
                      fontSize: 12,
                      color: 'rgba(255,255,255,0.65)',
                      lineHeight: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8
                    }}>
                      <Flag size={12} color="#ff6b6b" />
                      <div>
                        <strong>{f.type.replace(/_/g, ' ')}:</strong> {f.description.slice(0, 90)}…
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};
