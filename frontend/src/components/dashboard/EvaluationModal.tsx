'use client';

import React, { useState } from 'react';
import { EvaluationItem } from '@/types/evaluation';
import { StatusBadge } from '../common/StatusBadge';
import { ScoreBadge } from '../common/ScoreBadge';
import {
  X,
  User,
  BookOpen,
  Calendar,
  FileText,
  CheckCircle2,
  AlertCircle,
  Layers,
  Tag,
  Check,
  Award,
} from 'lucide-react';

interface EvaluationModalProps {
  evaluation: EvaluationItem | null;
  onClose: () => void;
}

export function EvaluationModal({ evaluation, onClose }: EvaluationModalProps) {
  const [confirmed, setConfirmed] = useState(false);

  if (!evaluation) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#26332F]/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-xl border border-[#E4E7E1] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 sm:p-6 border-b border-[#E4E7E1] bg-[#F7F7F2]">
          <div className="space-y-1 pr-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-white text-[#26332F] border border-[#E4E7E1]">
                {evaluation.id}
              </span>
              {evaluation.isSample && (
                <span className="text-[10px] font-semibold text-[#68756F] bg-white border border-[#E4E7E1] px-2 py-0.5 rounded-md">
                  Demonstration Record
                </span>
              )}
              <StatusBadge status={evaluation.status} size="sm" />
              <ScoreBadge score={evaluation.score} />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#26332F] tracking-tight">
              {evaluation.assignmentTitle}
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#68756F] pt-0.5">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#68756F]" />
                <strong className="text-[#26332F]">{evaluation.studentName}</strong> ({evaluation.studentId})
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-[#68756F]" />
                {evaluation.subject}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#68756F]" />
                {evaluation.submittedAt}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#68756F] hover:text-[#26332F] hover:bg-white rounded-xl border border-transparent hover:border-[#E4E7E1] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Prompt Section */}
          <div className="p-4 rounded-xl bg-[#F7F7F2] border border-[#E4E7E1] space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-[#68756F] uppercase tracking-wider">
              <span>Question Prompt</span>
              <span className="font-normal lowercase text-[#68756F]/70">Descriptive prompt</span>
            </div>
            <p className="text-sm font-medium text-[#26332F] leading-relaxed">
              {evaluation.questionPrompt}
            </p>
          </div>

          {/* Student Answer */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#26332F] uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#527C70]" />
                Student Response
              </span>
              <span className="text-xs text-[#68756F]">
                Word Count: <strong className="text-[#26332F]">{evaluation.wordCount}</strong>
              </span>
            </div>
            <div className="p-4 rounded-xl border border-[#E4E7E1] bg-white text-sm leading-relaxed text-[#26332F] whitespace-pre-wrap font-serif">
              {evaluation.studentAnswer}
            </div>
          </div>

          {/* Reference Answer if available */}
          {evaluation.referenceAnswer && (
            <div className="p-4 rounded-xl border border-[#D5DFDA] bg-[#EEF3F0]/60 space-y-1.5">
              <span className="text-xs font-semibold text-[#3F655A] uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#527C70]" />
                Reference Benchmark / Key Concepts Expected
              </span>
              <p className="text-xs text-[#26332F] leading-relaxed">
                {evaluation.referenceAnswer}
              </p>
            </div>
          )}

          {/* Concept Coverage Section */}
          {(evaluation.coveredConcepts || evaluation.missingConcepts) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {evaluation.coveredConcepts && (
                <div className="p-3.5 rounded-xl border border-[#CDE1D4] bg-[#EDF4EF]/70 space-y-2">
                  <span className="text-xs font-semibold text-[#314E46] uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#48735B]" />
                    Covered Concepts
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {evaluation.coveredConcepts.map((concept, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#EDF4EF] text-[#314E46] border border-[#CDE1D4]"
                      >
                        <Tag className="w-2.5 h-2.5" />
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {evaluation.missingConcepts && (
                <div className="p-3.5 rounded-xl border border-[#F2E4CB] bg-[#FBF5EA]/70 space-y-2">
                  <span className="text-xs font-semibold text-[#8B6220] uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-[#B88738]" />
                    Unaddressed Key Concepts
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {evaluation.missingConcepts.map((concept, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#FBF5EA] text-[#8B6220] border border-[#F2E4CB]"
                      >
                        <Tag className="w-2.5 h-2.5" />
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Rubric Criteria Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#26332F] uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#527C70]" />
                Rubric Criteria Breakdown ({evaluation.rubricName})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {evaluation.criteriaScores.map((criterion) => {
                const score = criterion.score ?? 75;
                const isHigh = score >= 80;
                const isMid = score >= 65 && score < 80;

                return (
                  <div
                    key={criterion.id}
                    className="p-3.5 rounded-xl border border-[#E4E7E1] bg-white space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#26332F]">{criterion.name}</span>
                      <span className="font-bold text-[#26332F]">{score}%</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-[#EEF3F0] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isHigh ? 'bg-[#48735B]' : isMid ? 'bg-[#527C70]' : 'bg-[#B88738]'
                        }`}
                        style={{ width: `${score}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#68756F]">
                      <span>Weight: {criterion.weight}%</span>
                      <span className="text-[#68756F]/70 truncate max-w-[150px]">
                        {criterion.description}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Evaluator Feedback */}
          <div className="p-4 rounded-xl border border-[#E4E7E1] bg-[#F7F7F2] space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#527C70]" />
              <h4 className="text-xs font-bold text-[#26332F] uppercase tracking-wider">
                Rubric Feedback & Diagnostic Synthesis
              </h4>
            </div>

            <p className="text-xs text-[#26332F] leading-relaxed font-normal">
              {evaluation.overallFeedback}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {/* Strengths */}
              <div className="p-3 rounded-lg bg-[#EDF4EF] border border-[#CDE1D4] text-xs space-y-1.5">
                <span className="font-semibold text-[#314E46] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#48735B]" />
                  Key Strengths
                </span>
                <ul className="list-disc list-inside space-y-1 text-[#26332F] text-[11px]">
                  {evaluation.strengths.map((str, i) => (
                    <li key={i}>{str}</li>
                  ))}
                </ul>
              </div>

              {/* Areas for Improvement */}
              <div className="p-3 rounded-lg bg-[#FBF5EA] border border-[#F2E4CB] text-xs space-y-1.5">
                <span className="font-semibold text-[#8B6220] flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-[#B88738]" />
                  Areas for Improvement
                </span>
                <ul className="list-disc list-inside space-y-1 text-[#26332F] text-[11px]">
                  {evaluation.areasForImprovement.map((area, i) => (
                    <li key={i}>{area}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-t border-[#E4E7E1] bg-[#F7F7F2]">
          <div className="text-[11px] text-[#68756F]">
            Transparent Criteria Scoring • Session Audit Trail
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#68756F] hover:text-[#26332F] hover:bg-white rounded-lg border border-transparent hover:border-[#E4E7E1] transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => setConfirmed(true)}
              disabled={confirmed}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#527C70] hover:bg-[#3F655A] disabled:bg-[#48735B] rounded-lg shadow-2xs transition-colors inline-flex items-center gap-1.5"
            >
              {confirmed ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </>
              ) : (
                <span>Confirm Evaluation</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
