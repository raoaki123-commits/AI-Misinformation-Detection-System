import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Shield, Trash2, Clock, AlertTriangle, RefreshCw, Search, Download } from 'lucide-react';
import { getReports, deleteReport, exportReportUrl } from '../services/api';
import { getRiskBadgeClass, getCredibilityColor, getScoreColor, truncate } from '../utils';
import type { ReportListItem, ScanMode } from '../types';

const MODE_OPTIONS = [
  { value: '', label: 'All Modes' },
  { value: 'misinformation', label: 'Credibility Scan' },
  { value: 'job_scam', label: 'Job Scam' },
  { value: 'phishing', label: 'Phishing' },
  { value: 'investment_scam', label: 'Investment' },
  { value: 'marketplace_fraud', label: 'Marketplace' },
  { value: 'scholarship_scam', label: 'Opportunity' },
  { value: 'general_trust', label: 'General Scam' }
];

const RISK_OPTIONS = [
  { value: '', label: 'All Risks' },
  { value: 'Low', label: 'Low Risk' },
  { value: 'Moderate', label: 'Moderate Risk' },
  { value: 'High', label: 'High Risk' },
  { value: 'Critical', label: 'Critical Risk' }
];

export const ReportsPage = () => {
  const [reports, setReports] = useState<ReportListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getReports(
        selectedMode || undefined,
        selectedRisk || undefined
      );
      setReports(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load reports. Ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [selectedMode, selectedRisk]);

  const handleDelete = async (analysisId: string) => {
    if (!confirm('Delete this intelligence report permanently?')) return;
    setDeletingId(analysisId);
    try {
      await deleteReport(analysisId);
      setReports(prev => prev.filter(r => r.analysis_id !== analysisId));
    } catch {
      alert('Failed to delete report.');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = reports.filter(r =>
    r.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.verdict.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const getModeLabel = (mode: ScanMode) => {
    const found = MODE_OPTIONS.find(m => m.value === mode);
    return found ? found.label : mode;
  };

  return (
    <div style={{ padding: '24px 32px', minHeight: '100vh', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <FileText size={16} color="#4dabf7" />
          <span className="section-label">Intelligence Archive</span>
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.4rem',
          letterSpacing: '0.06em',
          color: 'rgba(255,255,255,0.9)',
        }}>
          Past Analysis Reports
        </h1>
      </div>

      {/* Filters bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ flex: 2, minWidth: 250, position: 'relative' }}>
          <Search size={14} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            className="analysis-input"
            placeholder="Search reports by headline or verdict…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ minHeight: 'auto', height: 42, paddingLeft: 38, paddingTop: 0, paddingBottom: 0 }}
          />
        </div>

        {/* Mode filter select */}
        <select
          className="premium-select"
          value={selectedMode}
          onChange={e => setSelectedMode(e.target.value)}
          style={{ height: 42, minWidth: 150 }}
        >
          {MODE_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* Risk filter select */}
        <select
          className="premium-select"
          value={selectedRisk}
          onChange={e => setSelectedRisk(e.target.value)}
          style={{ height: 42, minWidth: 150 }}
        >
          {RISK_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <button className="btn btn-secondary" style={{ padding: '9px 16px', fontSize: 12, height: 42 }} onClick={fetchReports}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div className="skeleton" style={{ width: 200, height: 20, margin: '0 auto 12px' }} />
          <div className="skeleton" style={{ width: 300, height: 14, margin: '0 auto' }} />
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="panel"
          style={{
            padding: '28px 32px',
            background: 'rgba(201,42,42,0.06)',
            border: '1px solid rgba(201,42,42,0.2)',
            display: 'flex',
            gap: 16,
            alignItems: 'flex-start',
          }}
        >
          <AlertTriangle size={20} color="#ff6b6b" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: '#ff6b6b', marginBottom: 6 }}>
              Could Not Load Reports
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{error}</p>
          </div>
        </motion.div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel"
          style={{ textAlign: 'center', padding: '60px 40px' }}
        >
          <Shield size={36} color="rgba(77,171,247,0.3)" style={{ marginBottom: 16 }} />
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: '0.06em',
            marginBottom: 10,
          }}>
            No Matching Reports
          </h3>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', lineHeight: 1.7, maxWidth: 400, margin: '0 auto' }}>
            Try a different search term or clear filters to see your archives.
          </p>
        </motion.div>
      )}

      {/* Report list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <AnimatePresence>
          {filtered.map((report, idx) => (
            <motion.div
              key={report.analysis_id}
              className="panel"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ delay: idx * 0.04 }}
              style={{
                padding: '18px 24px',
                display: 'grid',
                gridTemplateColumns: '1fr auto auto auto auto',
                gap: 20,
                alignItems: 'center',
                cursor: 'default',
              }}
              whileHover={{
                borderColor: 'rgba(77,171,247,0.15)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.5), 0 0 20px rgba(77,171,247,0.05)',
              }}
            >
              {/* Headline + Verdict */}
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.85rem',
                  letterSpacing: '0.03em',
                  color: 'rgba(255,255,255,0.88)',
                  marginBottom: 5,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {truncate(report.headline, 90)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span className={`badge ${getRiskBadgeClass(report.risk_level)}`}>
                    {report.risk_level}
                  </span>
                  <span style={{
                    fontSize: 10,
                    letterSpacing: '0.05em',
                    padding: '2px 8px',
                    borderRadius: 4,
                    background: 'rgba(255,255,255,0.04)',
                    color: 'rgba(255,255,255,0.5)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {getModeLabel(report.analysis_mode).toUpperCase()}
                  </span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                    {report.verdict}
                  </span>
                </div>
              </div>

              {/* Score */}
              <div style={{ textAlign: 'center', minWidth: 60 }}>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: report.analysis_mode === 'misinformation'
                    ? getCredibilityColor(report.credibility_score ?? 50)
                    : getScoreColor(report.overall_risk_score, true),
                  lineHeight: 1,
                }}>
                  {Math.round(report.analysis_mode === 'misinformation' ? (report.credibility_score ?? 50) : report.overall_risk_score)}
                </div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>
                  {report.analysis_mode === 'misinformation' ? 'CRED' : 'RISK'}
                </div>
              </div>

              {/* Date */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)' }}>
                <Clock size={11} />
                {formatDate(report.created_at)}
              </div>

              {/* Export JSON Link */}
              <a
                href={exportReportUrl(report.analysis_id)}
                download
                className="btn btn-secondary"
                style={{
                  padding: '6px 8px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Export report JSON"
              >
                <Download size={14} />
              </a>

              {/* Delete */}
              <button
                onClick={() => handleDelete(report.analysis_id)}
                disabled={deletingId === report.analysis_id}
                style={{
                  background: 'rgba(201,42,42,0.08)',
                  border: '1px solid rgba(201,42,42,0.2)',
                  color: '#ff6b6b',
                  padding: '6px 8px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  opacity: deletingId === report.analysis_id ? 0.4 : 1,
                  transition: 'all 0.2s',
                }}
                title="Delete report"
              >
                <Trash2 size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Stats footer */}
      {!loading && reports.length > 0 && (
        <div style={{
          marginTop: 24,
          padding: '12px 20px',
          fontSize: 11,
          color: 'rgba(255,255,255,0.25)',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.05em',
          textAlign: 'center',
        }}>
          {reports.length} report{reports.length !== 1 ? 's' : ''} in archive
          {searchQuery && ` · ${filtered.length} matching search`}
        </div>
      )}
    </div>
  );
};
