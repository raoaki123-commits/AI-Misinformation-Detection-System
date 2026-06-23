import { motion } from 'framer-motion';
import { CheckCircle, Loader } from 'lucide-react';
import { ANALYSIS_STAGES } from '../../utils';

interface Props {
  currentStage: number;
}

export const AnalysisProgress = ({ currentStage }: Props) => (
  <div className="panel" style={{ padding: 32 }}>
    <div className="ornament" style={{ marginBottom: 24, fontSize: 11, letterSpacing: '0.15em', color: 'rgba(201,168,76,0.5)' }}>
      ANALYSIS IN PROGRESS
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {ANALYSIS_STAGES.map((stage, i) => {
        const isDone = i < currentStage;
        const isActive = i === currentStage;
        return (
          <motion.div
            key={stage.id}
            className={`stage-indicator ${isDone ? 'done' : isActive ? 'active' : ''}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="stage-dot" />
            <span style={{ fontSize: 13 }}>{stage.label}</span>
            {isDone && <CheckCircle size={13} style={{ marginLeft: 'auto', color: '#69db7c' }} />}
            {isActive && <Loader size={13} style={{ marginLeft: 'auto', animation: 'spin 1s linear infinite' }} />}
          </motion.div>
        );
      })}
    </div>
    <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
  </div>
);
