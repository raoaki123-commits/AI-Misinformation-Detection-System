import { RadarChart as ReRadar, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';

interface Props {
  credibility: number;
  evidence: number;
  manipulation: number;
  propaganda: number;
  source_trust: number;
}

export const ScoreRadarChart = ({ credibility, evidence, manipulation, propaganda, source_trust }: Props) => {
  const data = [
    { dimension: 'Credibility', value: credibility },
    { dimension: 'Evidence', value: evidence },
    { dimension: 'Neutrality', value: Math.max(0, 100 - manipulation) },
    { dimension: 'Anti-Propaganda', value: Math.max(0, 100 - propaganda) },
    { dimension: 'Source Trust', value: source_trust },
    { dimension: 'Claim Support', value: Math.max(0, 100 - propaganda * 0.5) },
  ];

  return (
    <ResponsiveContainer width="100%" height={240}>
      <ReRadar data={data}>
        <PolarGrid stroke="rgba(255,255,255,0.07)" />
        <PolarAngleAxis
          dataKey="dimension"
          tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 10, fontFamily: 'var(--font-display)' }}
        />
        <Radar
          name="Score"
          dataKey="value"
          stroke="#4dabf7"
          fill="rgba(77,171,247,0.15)"
          strokeWidth={1.5}
          dot={{ fill: '#4dabf7', r: 3 }}
        />
        <Tooltip
          contentStyle={{ background: 'var(--graphite-mid)', border: '1px solid var(--border-glow)', borderRadius: 6, fontSize: 12, fontFamily: 'var(--font-mono)' }}
          formatter={(v: any) => [`${Math.round(v)}`, 'Score']}
        />
      </ReRadar>
    </ResponsiveContainer>
  );
};
