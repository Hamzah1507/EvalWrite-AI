'use client';

import React from 'react';
import Link from 'next/link';
import { MetricCards } from '@/components/dashboard/MetricCards';
import { ScoreDistributionChart } from '@/components/dashboard/ScoreDistributionChart';
import { CriteriaBreakdownCard } from '@/components/dashboard/CriteriaBreakdownCard';
import { RecentEvaluationsTable } from '@/components/dashboard/RecentEvaluationsTable';
import {
  sampleCohortMetrics,
  emptyMetrics,
  mockScoreDistribution,
} from '@/data/mockData';
import { useSearch } from '@/context/SearchContext';
import { useEvaluation } from '@/context/EvaluationContext';
import {
  Sliders,
  ArrowRight,
  FileCheck2,
  GraduationCap,
} from 'lucide-react';

export default function DashboardPage() {
  const { searchQuery } = useSearch();
  const { showSampleData, setShowSampleData, evaluations } = useEvaluation();

  // Determine metrics to display
  const isUsingSample = showSampleData && evaluations.some((e) => e.isSample);
  const metrics = isUsingSample ? sampleCohortMetrics : (evaluations.length > 0 ? {
    totalEvaluations: evaluations.length,
    averageScore: Math.round(evaluations.reduce((acc, curr) => acc + curr.score, 0) / evaluations.length * 10) / 10,
    evaluatedAnswers: evaluations.filter(e => e.status === 'completed').length,
    pendingReviews: evaluations.filter(e => e.status === 'pending_review' || e.status === 'flagged').length,
    totalChangePct: 0,
    avgScoreChangePct: 0,
    completionRatePct: Math.round((evaluations.filter(e => e.status === 'completed').length / evaluations.length) * 100),
  } : emptyMetrics);

  const distributionData = isUsingSample ? mockScoreDistribution : [];

  return (
    <div className="space-y-6">
      {/* Enterprise Academic Hero Treatment */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[#26332F] text-white border border-[#3A4A45] shadow-xs relative overflow-hidden">
        {/* Subtle, restrained ambient accent */}
        <div
          className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-[#527C70]/15 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#527C70]/25 text-[#D5DFDA] text-xs font-medium border border-[#527C70]/40">
              <GraduationCap className="w-3.5 h-3.5 text-[#D5DFDA]" />
              <span>Descriptive Assessment Platform</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white">
              Understand every answer. Improve every evaluation.
            </h2>
            <p className="text-xs sm:text-sm text-[#D5DFDA]/90 leading-relaxed font-normal">
              Evaluate descriptive answers with transparent rubric-based scoring, concept coverage and actionable feedback.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/evaluate"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#527C70] hover:bg-[#3F655A] text-white font-semibold text-xs sm:text-sm transition-colors shadow-2xs active:scale-[0.98]"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Evaluate Answer</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/rubrics"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs sm:text-sm border border-white/15 transition-colors"
            >
              <Sliders className="w-4 h-4" />
              <span>Configure Rubrics</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <section aria-label="Key Assessment Metrics">
        <MetricCards
          metrics={metrics}
          isSampleDataset={isUsingSample}
        />
      </section>

      {/* Visualizations: Score Distribution (2/3) + Criteria Breakdown (1/3) */}
      <section aria-label="Visualizations" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ScoreDistributionChart
            data={distributionData}
            isSampleData={isUsingSample}
          />
        </div>
        <div className="lg:col-span-1">
          <CriteriaBreakdownCard
            isSampleData={isUsingSample}
          />
        </div>
      </section>

      {/* Recent Evaluations Table */}
      <section aria-label="Recent Evaluations">
        <RecentEvaluationsTable
          evaluations={evaluations}
          searchQuery={searchQuery}
          onLoadSampleData={() => setShowSampleData(true)}
        />
      </section>
    </div>
  );
}
