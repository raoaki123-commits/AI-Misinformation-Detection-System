import { motion } from 'framer-motion';

interface Props {
  value: number; // 0-1
  color?: string;
  height?: number;
}

export const IntensityBar = ({ value, color = '#4dabf7', height = 6 }: Props) => (
  <div className="intensity-bar-track" style={{ height }}>
    <motion.div
      className="intensity-bar-fill"
      style={{ background: color, height }}
      initial={{ width: 0 }}
      animate={{ width: `${Math.min(value * 100, 100)}%` }}
      transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
    />
  </div>
);
