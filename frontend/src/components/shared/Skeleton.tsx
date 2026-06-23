export const Skeleton = ({ width = '100%', height = 16, className = '' }: { width?: string | number; height?: number; className?: string }) => (
  <div
    className={`skeleton ${className}`}
    style={{ width, height, borderRadius: 4 }}
  />
);

export const SkeletonCard = () => (
  <div className="panel" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
    <Skeleton width="60%" height={12} />
    <Skeleton width="100%" height={40} />
    <Skeleton width="80%" height={12} />
  </div>
);
