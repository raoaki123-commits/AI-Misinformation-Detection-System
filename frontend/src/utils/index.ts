
export const getRiskBadgeClass = (risk: string): string => {
  const map: Record<string, string> = {
    Critical: 'badge-critical',
    High: 'badge-high',
    Moderate: 'badge-moderate',
    Low: 'badge-low',
  };
  return map[risk] || 'badge-moderate';
};

export const getCredibilityColor = (score: number): string => {
  if (score >= 70) return '#69db7c';
  if (score >= 50) return '#4dabf7';
  if (score >= 30) return '#f59f00';
  return '#ff6b6b';
};

export const getScoreColor = (score: number, inverted = false): string => {
  const s = inverted ? 100 - score : score;
  if (s >= 70) return '#69db7c';
  if (s >= 50) return '#4dabf7';
  if (s >= 30) return '#f59f00';
  return '#ff6b6b';
};

export const getPropagandaTypeLabel = (type: string): string => {
  const map: Record<string, string> = {
    fear_appeal: 'Fear Appeal',
    outrage_bait: 'Outrage Bait',
    us_vs_them: 'Us-vs-Them Framing',
    scapegoating: 'Scapegoating',
    vague_authority: 'Vague Authority Appeal',
    absolutist_language: 'Absolutist Language',
    conspiracy_framing: 'Conspiracy Framing',
    false_urgency: 'False Urgency',
    distrust_amplification: 'Distrust Amplification',
    emotional_loading: 'Emotionally Loaded Wording',
  };
  return map[type] || type;
};

export const getPropagandaColor = (intensity: number): string => {
  if (intensity >= 0.75) return '#ff6b6b';
  if (intensity >= 0.5) return '#f59f00';
  return '#4dabf7';
};

export const getFlagLabel = (flag: string): string => {
  const map: Record<string, string> = {
    unsupported_claim: 'Unsupported Claim',
    emotional_escalation: 'Emotional Escalation',
    propaganda_cue: 'Propaganda Cue',
    manipulative_language: 'Manipulative Language',
    // Scam flags
    upfront_fee: 'Advance Payment Request',
    identity_harvesting: 'Identity Harvesting',
    urgency_pressure: 'Urgency Pressure',
    unrealistic_promise: 'Unrealistic Promise',
    impersonation_cue: 'Impersonation Cue',
  };
  return map[flag] || flag.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
};

export const getFlagHighlightClass = (flag: string): string => {
  const map: Record<string, string> = {
    unsupported_claim: 'highlight-unsupported-claim',
    emotional_escalation: 'highlight-emotional-escalation',
    propaganda_cue: 'highlight-propaganda-cue',
    manipulative_language: 'highlight-manipulative-language',
    // Scam flags
    upfront_fee: 'highlight-unsupported-claim',         // red
    identity_harvesting: 'highlight-unsupported-claim', // red
    impersonation_cue: 'highlight-manipulative-language', // purple
    unrealistic_promise: 'highlight-propaganda-cue',    // orange
    urgency_pressure: 'highlight-emotional-escalation', // yellow
  };
  return map[flag] || 'highlight-unsupported-claim';
};

export const formatScore = (score: number): string => Math.round(score).toString();

export const truncate = (text: string, maxLen: number): string =>
  text.length > maxLen ? text.slice(0, maxLen) + '…' : text;

export const DEMO_TEXT = `BREAKING: Government Scientists Confirm Global Water Supply is Being Secretly Contaminated

Whistleblowers inside the EPA have revealed what the mainstream media refuses to report: our water supply has been systematically contaminated with experimental chemicals as part of a decade-long population control program. This devastating revelation, which officials are desperately trying to suppress, proves that the corrupt establishment has been deliberately poisoning millions of unsuspecting Americans.

According to anonymous insiders who risk their lives to speak out, the chemicals — never approved by any independent body — cause infertility, cognitive decline, and immune system destruction. Experts say the effects are already irreversible in 40% of the population.

The shocking cover-up runs all the way to the highest levels of government. Everyone knows this has been happening, but no one dares to speak. The deep state will stop at nothing to silence those who expose the truth.

This is not a conspiracy theory. This is happening right now. If you don't act immediately, it will be too late. Share this before they take it down. Wake up before they silence us all.`;

export const ANALYSIS_STAGES = [
  { id: 'parse', label: 'Parsing content structure' },
  { id: 'extract', label: 'Extracting claims & entities' },
  { id: 'evidence', label: 'Evaluating evidence quality' },
  { id: 'propaganda', label: 'Detecting propaganda patterns' },
  { id: 'narrative', label: 'Analyzing narrative framing' },
  { id: 'report', label: 'Building analyst intelligence report' },
];
