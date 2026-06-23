import { motion } from 'framer-motion';
import {
  ShieldAlert,
  Briefcase,
  Mail,
  Coins,
  ShoppingBag,
  GraduationCap,
  Fingerprint
} from 'lucide-react';
import type { ScanMode } from '../../types';

interface ModeOption {
  value: ScanMode;
  label: string;
  shortLabel: string;
  desc: string;
  icon: any;
  color: string;
}

const MODES: ModeOption[] = [
  {
    value: 'misinformation',
    label: 'Credibility & Propaganda',
    shortLabel: 'Credibility',
    desc: 'Verify articles, media reports, and editorial claims',
    icon: ShieldAlert,
    color: '#3b5bdb' // royal blue
  },
  {
    value: 'job_scam',
    label: 'Job & Career Fraud',
    shortLabel: 'Job Scam',
    desc: 'Detect fake employment offers and recruitment traps',
    icon: Briefcase,
    color: '#f59f00' // amber/gold
  },
  {
    value: 'phishing',
    label: 'Phishing & Impersonation',
    shortLabel: 'Phishing',
    desc: 'Identify fake brand messages, OTP traps, and credentials theft',
    icon: Mail,
    color: '#c92a2a' // crimson
  },
  {
    value: 'investment_scam',
    label: 'Investment & Crypto',
    shortLabel: 'Investment',
    desc: 'Scrutinize high-yield, Ponzi, and crypto scheme claims',
    icon: Coins,
    color: '#e8590c' // orange
  },
  {
    value: 'marketplace_fraud',
    label: 'Marketplace & Offers',
    shortLabel: 'Marketplace',
    desc: 'Analyze buyer/seller risks and refund/payment scams',
    icon: ShoppingBag,
    color: '#15aabf' // cyan
  },
  {
    value: 'scholarship_scam',
    label: 'Scholarships & Visas',
    shortLabel: 'Opportunity',
    desc: 'Verify academic offers, grants, and visa processing claims',
    icon: GraduationCap,
    color: '#862e9c' // grape
  },
  {
    value: 'general_trust',
    label: 'General Scam Audit',
    shortLabel: 'General Scan',
    desc: 'Run multi-mode fallbacks for suspicious messages and posts',
    icon: Fingerprint,
    color: '#2f9e44' // emerald
  }
];

interface Props {
  selectedMode: ScanMode;
  onChange: (mode: ScanMode) => void;
  disabled?: boolean;
}

export const ModeSelectorBar = ({ selectedMode, onChange, disabled }: Props) => {
  const activeMode = MODES.find(m => m.value === selectedMode) || MODES[0];

  return (
    <div style={{ marginBottom: 24 }}>
      {/* Label/Title */}
      <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="section-label">Select Analysis Intelligence Mode</span>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>
          MODE: {selectedMode.toUpperCase()}
        </span>
      </div>

      {/* Grid of modes */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: 10,
        background: 'rgba(0,0,0,0.2)',
        padding: 8,
        borderRadius: 8,
        border: '1px solid rgba(255,255,255,0.05)'
      }}>
        {MODES.map(m => {
          const Icon = m.icon;
          const isSelected = m.value === selectedMode;

          return (
            <button
              key={m.value}
              disabled={disabled}
              onClick={() => onChange(m.value)}
              style={{
                background: isSelected ? 'rgba(255,255,255,0.03)' : 'transparent',
                border: '1px solid',
                borderColor: isSelected ? m.color : 'transparent',
                borderRadius: 6,
                padding: '10px 8px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.2s ease',
                opacity: disabled ? 0.5 : isSelected ? 1 : 0.7,
                boxShadow: isSelected ? `0 0 12px ${m.color}25` : 'none'
              }}
              title={m.desc}
              className={isSelected ? '' : 'hover-glow-btn'}
            >
              <div style={{
                background: isSelected ? `${m.color}15` : 'rgba(255,255,255,0.03)',
                color: isSelected ? m.color : 'rgba(255,255,255,0.6)',
                borderRadius: '50%',
                padding: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}>
                <Icon size={18} />
              </div>
              <div style={{
                fontSize: 12,
                fontWeight: isSelected ? 600 : 400,
                color: isSelected ? '#ffffff' : 'rgba(255,255,255,0.7)',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                width: '100%'
              }}>
                {m.shortLabel}
              </div>
            </button>
          );
        })}
      </div>

      {/* Mode explanation box */}
      <motion.div
        key={selectedMode}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          marginTop: 10,
          background: 'rgba(255,255,255,0.02)',
          borderLeft: `2px solid ${activeMode.color}`,
          padding: '8px 12px',
          borderRadius: '0 4px 4px 0',
          fontSize: 12.5,
          color: 'rgba(255,255,255,0.6)'
        }}
      >
        <span style={{ fontWeight: 600, color: 'rgba(255,255,255,0.95)', marginRight: 6 }}>
          {activeMode.label}:
        </span>
        {activeMode.desc}
      </motion.div>
    </div>
  );
};
