import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, FileCheck, Zap, ChevronRight, Mail, Briefcase, Coins, ShoppingBag, GraduationCap } from 'lucide-react';

const CAPABILITIES = [
  { icon: FileCheck, title: 'Credibility & Propaganda', desc: 'Preserves the core Sentinel engine to audit articles and social posts for narrative framing and rhetoric.', color: '#3b5bdb' },
  { icon: Briefcase, title: 'Job & Career Fraud Scan', desc: 'Detects fake job postings, recruiter domain mismatches, upfront onboarding fees, and identity theft risks.', color: '#f59f00' },
  { icon: Mail, title: 'Phishing & Impersonation', desc: 'Identifies brand spoofing, OTP/credential harvesting requests, courier traps, and artificial urgency tactics.', color: '#c92a2a' },
  { icon: Coins, title: 'Investment & Crypto Audit', desc: 'Scrutinizes high-yield speculative promises, Ponzi/MLM dynamics, and celebrity endorsement traps.', color: '#e8590c' },
  { icon: ShoppingBag, title: 'Marketplace Fraud Engine', desc: 'Screens buyers and sellers for too-good-to-be-true offers, QR scanning traps, and payment coercion.', color: '#15aabf' },
  { icon: GraduationCap, title: 'Scholarships & Visas', desc: 'Checks visa processing demands and academic grant offers for fee-based fraud and verifiability.', color: '#862e9c' }
];

const HOW_IT_WORKS = [
  { num: '01', title: 'Choose Mode & Paste', desc: 'Select one of the 7 specialized analysis modes (Credibility, Job, Phishing, etc.) and submit your content.' },
  { num: '02', title: 'Cross-Signal Inspection', desc: 'SENTINEL parses the text, extracting identity harvesting cues, payment requests, urgency markers, and logical leaps.' },
  { num: '03', title: 'Risk Gauge Breakdown', desc: 'Calculates overall risk, trust score, and detailed mode-specific sub-scores displayed via an interactive dashboard.' },
  { num: '04', title: 'Analyst Intelligence Report', desc: 'Delivers a premium, explainable report detailing red flags, highlighted sentences, and a comprehensive summary.' },
];

export const HomePage = () => (
  <div style={{ minHeight: '100vh' }}>
    {/* Top bar */}
    <div style={{
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      padding: '16px 48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'rgba(10,10,12,0.8)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Shield size={20} color="#4dabf7" />
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.9)' }}>
          SENTINEL
        </span>
        <span style={{
          fontSize: 9,
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.1em',
          color: 'rgba(201,168,76,0.6)',
          marginLeft: 4,
          padding: '2px 6px',
          border: '1px solid rgba(201,168,76,0.2)',
          borderRadius: 3,
        }}>
          INTELLIGENCE PLATFORM
        </span>
      </div>
      <Link to="/analyze" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: 12 }}>
        <Zap size={13} /> Launch Console
      </Link>
    </div>

    {/* Hero */}
    <section style={{
      padding: '100px 48px 80px',
      maxWidth: 900,
      margin: '0 auto',
      textAlign: 'center',
    }}>
      {/* Crest ornament */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: 24 }}
      >
        <div className="ornament" style={{ justifyContent: 'center', maxWidth: 400, margin: '0 auto' }}>
          DECEPTION & RISK INTELLIGENCE CONSOLE
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.8rem, 6vw, 5rem)',
          fontWeight: 800,
          letterSpacing: '0.08em',
          lineHeight: 1.1,
          marginBottom: 12,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 40%, rgba(77,171,247,0.8))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          SENTINEL
        </h1>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(0.85rem, 2vw, 1.1rem)',
          letterSpacing: '0.18em',
          color: 'rgba(201,168,76,0.7)',
          marginBottom: 32,
        }}>
          AI TRUST, MISINFORMATION & SCAM INTELLIGENCE PLATFORM
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <p style={{
          fontFamily: 'var(--font-editorial)',
          fontSize: '1.25rem',
          lineHeight: 1.8,
          color: 'rgba(255,255,255,0.62)',
          marginBottom: 48,
          maxWidth: 700,
          margin: '0 auto 48px',
        }}>
          Audits the digital ecosystem for credibility and deception. Detect manipulation, unsupported claims, 
          and propaganda, or screen messages, offers, and job postings for scam risk with full analytical transparency.
        </p>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link to="/analyze" className="btn btn-primary" style={{ padding: '14px 36px', fontSize: 14 }}>
              <Shield size={16} /> Run Intelligence Scan
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link to="/reports" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: 14 }}>
              View Past Reports <ChevronRight size={14} />
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Decorative glow */}
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 600,
        height: 300,
        background: 'radial-gradient(ellipse at center, rgba(59,91,219,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: -1,
      }} />
    </section>

    {/* Capabilities */}
    <section style={{ padding: '60px 48px', maxWidth: 1200, margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        style={{ textAlign: 'center', marginBottom: 40 }}
      >
        <div className="ornament" style={{ maxWidth: 400, margin: '0 auto 16px' }}>CORE CAPABILITIES</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', letterSpacing: '0.04em', color: 'rgba(255,255,255,0.88)' }}>
          Intelligence Beyond Misinformation
        </h2>
      </motion.div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 16,
      }}>
        {CAPABILITIES.map((cap, i) => {
          const Icon = cap.icon;
          return (
            <motion.div
              key={cap.title}
              className="panel"
              style={{ padding: '24px 28px' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ borderColor: `${cap.color}33`, boxShadow: `0 4px 24px rgba(0,0,0,0.5), 0 0 20px ${cap.color}11` }}
            >
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: `${cap.color}14`,
                border: `1px solid ${cap.color}33`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}>
                <Icon size={18} color={cap.color} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', letterSpacing: '0.04em', marginBottom: 8, color: 'rgba(255,255,255,0.88)' }}>
                {cap.title}
              </h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65 }}>
                {cap.desc}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>

    {/* How it works */}
    <section style={{ padding: '60px 48px', maxWidth: 1000, margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        style={{ textAlign: 'center', marginBottom: 40 }}
      >
        <div className="ornament" style={{ maxWidth: 400, margin: '0 auto 16px' }}>ANALYTICAL PROCESS</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', letterSpacing: '0.04em', color: 'rgba(255,255,255,0.88)' }}>
          How SENTINEL Works
        </h2>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
        {HOW_IT_WORKS.map((step, i) => (
          <motion.div
            key={step.num}
            className="glass-panel"
            style={{ padding: '24px 24px' }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.5rem',
              fontWeight: 800,
              color: 'rgba(201,168,76,0.12)',
              marginBottom: 12,
              lineHeight: 1,
            }}>{step.num}</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', letterSpacing: '0.06em', marginBottom: 10, color: 'rgba(255,255,255,0.85)' }}>
              {step.title}
            </h3>
            <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.48)', lineHeight: 1.65 }}>{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section style={{ padding: '60px 48px', textAlign: 'center' }}>
      <motion.div
        className="glass-panel"
        style={{
          maxWidth: 600,
          margin: '0 auto',
          padding: '48px',
          background: 'linear-gradient(135deg, rgba(59,91,219,0.08), rgba(77,171,247,0.04))',
        }}
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <Shield size={32} color="#4dabf7" style={{ marginBottom: 20 }} />
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', letterSpacing: '0.05em', marginBottom: 12 }}>
          Understand why content is risky — not just whether it is.
        </h2>
        <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 28, fontFamily: 'var(--font-editorial)' }}>
          Begin your intelligence analysis now. SENTINEL scans text in seconds and delivers a multi-mode intelligence report.
        </p>
        <Link to="/analyze" className="btn btn-gold" style={{ padding: '13px 36px', fontSize: 13.5 }}>
          Begin Analysis <ChevronRight size={14} />
        </Link>
      </motion.div>
    </section>

    {/* Footer */}
    <footer style={{
      borderTop: '1px solid rgba(255,255,255,0.05)',
      padding: '24px 48px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Shield size={14} color="#4dabf7" />
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)' }}>
          SENTINEL
        </span>
      </div>
      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-mono)' }}>
        AI Trust, Misinformation & Scam Intelligence Platform
      </p>
    </footer>
  </div>
);
