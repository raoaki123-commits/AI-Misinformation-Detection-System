import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, GitCompare, FileText, Activity } from 'lucide-react';

const NAV = [
  { to: '/', icon: Shield, label: 'Intelligence' },
  { to: '/analyze', icon: Activity, label: 'Scan' },
  { to: '/compare', icon: GitCompare, label: 'Compare' },
  { to: '/reports', icon: FileText, label: 'Reports' },
];

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--obsidian)' }}>
      {/* Sidebar */}
      <aside style={{
        width: 64,
        background: 'var(--graphite)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20,
        gap: 4,
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 100,
        boxShadow: '4px 0 20px rgba(0,0,0,0.4)',
      }}>
        {/* Logo */}
        <div style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            width: 36,
            height: 36,
            background: 'linear-gradient(135deg, #1a2a6c, #3b5bdb)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(59,91,219,0.4)',
          }}>
            <Shield size={18} color="#4dabf7" />
          </div>
        </div>

        {/* Nav items */}
        {NAV.map(({ to, icon: Icon, label }) => {
          const active = pathname === to || (to !== '/' && pathname.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              title={label}
              style={{
                width: 44,
                height: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
                color: active ? 'var(--electric)' : 'rgba(255,255,255,0.35)',
                background: active ? 'rgba(77,171,247,0.1)' : 'transparent',
                border: active ? '1px solid rgba(77,171,247,0.2)' : '1px solid transparent',
                textDecoration: 'none',
                transition: 'all 0.2s',
                position: 'relative',
              }}
            >
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  style={{
                    position: 'absolute',
                    left: -1,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 3,
                    height: 24,
                    background: 'var(--electric)',
                    borderRadius: '0 2px 2px 0',
                    boxShadow: '0 0 8px rgba(77,171,247,0.6)',
                  }}
                />
              )}
              <Icon size={17} />
            </Link>
          );
        })}

        {/* Bottom status */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#69db7c', boxShadow: '0 0 8px #69db7c' }} />
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>LIVE</span>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, marginLeft: 64, minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  );
};
