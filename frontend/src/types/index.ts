// SENTINEL — Multi-Mode Trust & Scam Intelligence Platform Types

export type ScanMode =
  | 'misinformation'
  | 'job_scam'
  | 'phishing'
  | 'investment_scam'
  | 'marketplace_fraud'
  | 'scholarship_scam'
  | 'general_trust';

export interface SentenceAnnotation {
  sentence: string;
  flags: string[];
  risk_score: number;
  explanation: string;
}

export interface RedFlag {
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
}

export interface ModeSpecificData {
  // Job scam
  recruiter_trust_score?: number;
  fee_fraud_risk?: number;
  identity_theft_risk?: number;
  compensation_realism_score?: number;
  role_clarity_score?: number;
  // Phishing
  phishing_risk_score?: number;
  impersonation_confidence?: number;
  credential_theft_risk?: number;
  urgency_fear_score?: number;
  link_suspicion_score?: number;
  // Investment
  investment_scam_risk?: number;
  ponzi_mlm_risk?: number;
  unrealistic_return_score?: number;
  greed_appeal_score?: number;
  // Marketplace
  offer_fraud_risk?: number;
  payment_scam_risk?: number;
  seller_trust_score?: number;
  courier_refund_risk?: number;
  // Scholarship
  opportunity_scam_risk?: number;
  institution_trust_score?: number;
  fee_fraud_score?: number;
  documentation_risk?: number;
  // General trust
  fraud_risk_score?: number;
  trust_score?: number;
}

export interface Claim {
  claim: string;
  risk_score: number;
  support_score: number;
  evidence_notes: string;
  manipulation_notes: string;
  confidence: number;
}

export interface EvidenceMap {
  named_sources: number;
  statistics_references: number;
  citation_like_references: number;
  anonymous_claims: number;
  unsupported_assertions: number;
  evidence_quality: string;
}

export interface PropagandaMarker {
  type: string;
  intensity: number;
  examples: string[];
  description: string;
}

export interface EmotionProfile {
  fear: number;
  outrage: number;
  urgency: number;
  panic: number;
  disgust: number;
}

export interface NarrativeFrame {
  primary: string;
  secondary: string;
  explanation: string;
}

export interface AnalysisResult {
  analysis_id: string;
  analysis_mode: ScanMode;
  input_type: string;
  headline: string;
  verdict: string;
  risk_level: string;
  confidence: number;
  topic_tags: string[];
  analyst_summary: string;
  top_reasons: string[];
  sentence_annotations: SentenceAnnotation[];
  red_flags: RedFlag[];

  // Universal scores
  overall_risk_score: number;
  trust_score: number;
  manipulation_score: number;

  // Mode-specific sub-scores
  mode_specific?: ModeSpecificData;

  // Misinformation-only (optional for scam modes)
  credibility_score?: number;
  evidence_score?: number;
  propaganda_score?: number;
  source_trust_score?: number;
  narrative_frame?: NarrativeFrame;
  claims?: Claim[];
  evidence_map?: EvidenceMap;
  propaganda_markers?: PropagandaMarker[];
  emotion_profile?: EmotionProfile;
}

export interface AnalyzeRequest {
  text: string;
  mode?: string;
  analysis_mode?: ScanMode;
  source_url?: string;
}

export interface ReportListItem {
  id: number;
  analysis_id: string;
  analysis_mode: ScanMode;
  headline: string;
  verdict: string;
  risk_level: string;
  overall_risk_score: number;
  credibility_score?: number;
  created_at: string;
}

export interface ReportDetail {
  id: number;
  analysis_id: string;
  result: AnalysisResult;
  created_at: string;
}

export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';
export type AnalysisMode = 'quick' | 'deep' | 'propaganda' | 'narrative';
