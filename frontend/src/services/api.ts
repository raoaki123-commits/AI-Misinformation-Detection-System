import axios from 'axios';
import type { AnalyzeRequest, AnalysisResult, ReportListItem, ReportDetail } from '../types';

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
});

export const analyzeText = async (request: AnalyzeRequest): Promise<AnalysisResult> => {
  const { data } = await api.post<AnalysisResult>('/analyze', request);
  return data;
};

export const analyzeFile = async (file: File): Promise<AnalysisResult> => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post<AnalysisResult>('/analyze/file', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const getReports = async (mode?: string, riskLevel?: string): Promise<ReportListItem[]> => {
  const params: Record<string, string> = {};
  if (mode) params.mode = mode;
  if (riskLevel) params.risk_level = riskLevel;
  const { data } = await api.get<ReportListItem[]>('/reports', { params });
  return data;
};

export const getReport = async (analysisId: string): Promise<ReportDetail> => {
  const { data } = await api.get<ReportDetail>(`/reports/${analysisId}`);
  return data;
};

export const exportReportUrl = (analysisId: string): string => {
  return `/api/v1/reports/${analysisId}/export`;
};

export const deleteReport = async (analysisId: string): Promise<void> => {
  await api.delete(`/reports/${analysisId}`);
};
