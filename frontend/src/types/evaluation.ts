export type EvaluationStatus = 'completed' | 'pending_review' | 'flagged' | 'processing';

export interface RubricCriterion {
  id: string;
  name: string;
  weight: number; // percentage, e.g. 30
  score?: number; // 0 - 100
  feedback?: string;
  description: string;
}

export interface EvaluationItem {
  id: string;
  studentName: string;
  studentId: string;
  assignmentTitle: string;
  subject: string;
  submittedAt: string;
  score: number; // 0 - 100
  status: EvaluationStatus;
  rubricName: string;
  criteriaScores: RubricCriterion[];
  questionPrompt: string;
  studentAnswer: string;
  referenceAnswer?: string;
  overallFeedback: string;
  strengths: string[];
  areasForImprovement: string[];
  coveredConcepts?: string[];
  missingConcepts?: string[];
  wordCount: number;
  isSample?: boolean; // Clearly marks synthetic demonstration records
}

export interface MetricSummary {
  totalEvaluations: number;
  averageScore: number;
  evaluatedAnswers: number;
  pendingReviews: number;
  totalChangePct: number;
  avgScoreChangePct: number;
  completionRatePct: number;
}

export interface ScoreBucket {
  range: string;
  count: number;
  percentage: number;
  grade: string;
}

export interface RubricDefinition {
  id: string;
  title: string;
  description: string;
  subject: string;
  criteria: RubricCriterion[];
  createdAt: string;
  totalSubmissions: number;
}

export interface BackendCapabilities {
  apiHealth: 'connected' | 'offline' | 'checking';
  nlpEngine: 'not_implemented' | 'connected';
  database: 'session_only' | 'connected';
  endpoint: string;
}
