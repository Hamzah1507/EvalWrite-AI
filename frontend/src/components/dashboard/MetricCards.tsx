import React from 'react';
import { MetricSummary } from '@/types/evaluation';
import {
  FileCheck,
  TrendingUp,
  CheckCircle,
  ClockAlert,
  ArrowUpRight,
} from 'lucide-react';

interface MetricCardsProps {
  metrics: MetricSummary;
  isSampleDataset?: boolean;
}

export function MetricCards({ metrics, isSampleDataset = false }: MetricCardsProps) {
  const isZero = metrics.totalEvaluations === 0;

  const cards = [
    {
      id: 'total',
      label: 'Total Evaluations',
      value: isZero ? '0' : metrics.totalEvaluations.toLocaleString(),
      change: isZero ? 'Awaiting submissions' : `+${metrics.totalChangePct}%`,
      changeType: (isZero ? 'neutral' : 'positive') as 'positive' | 'neutral' | 'warning',
      subtext: isSampleDataset ? 'Demonstration cohort' : 'Live submissions',
      icon: FileCheck,
      color: 'text-[#527C70]',
      bgColor: 'bg-[#EEF3F0]',
      borderColor: 'border-[#D5DFDA]',
    },
    {
      id: 'average',
      label: 'Average Score',
      value: isZero ? '—' : `${metrics.averageScore}%`,
      change: isZero ? 'No data' : `+${metrics.avgScoreChangePct}%`,
      changeType: (isZero ? 'neutral' : 'positive') as 'positive' | 'neutral' | 'warning',
      subtext: isZero ? 'Mean across answers' : (isSampleDataset ? 'Sample cohort mean' : 'Class average'),
      icon: TrendingUp,
      color: 'text-[#48735B]',
      bgColor: 'bg-[#EDF4EF]',
      borderColor: 'border-[#CDE1D4]',
    },
    {
      id: 'evaluated',
      label: 'Evaluated Answers',
      value: isZero ? '0' : metrics.evaluatedAnswers.toLocaleString(),
      change: isZero ? '0%' : `${metrics.completionRatePct}%`,
      changeType: 'neutral' as const,
      subtext: isZero ? 'Completed evaluations' : (isSampleDataset ? 'Evaluated in sample' : 'Completed evaluations'),
      icon: CheckCircle,
      color: 'text-[#3F655A]',
      bgColor: 'bg-[#EEF3F0]',
      borderColor: 'border-[#D5DFDA]',
    },
    {
      id: 'pending',
      label: 'Pending Reviews',
      value: isZero ? '0' : metrics.pendingReviews.toLocaleString(),
      change: isZero ? 'All clear' : 'Awaiting review',
      changeType: (isZero ? 'neutral' : 'warning') as 'positive' | 'neutral' | 'warning',
      subtext: 'Flagged for faculty check',
      icon: ClockAlert,
      color: 'text-[#B88738]',
      bgColor: 'bg-[#FBF5EA]',
      borderColor: 'border-[#F2E4CB]',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.id}
            className="p-5 bg-white border border-[#E4E7E1] rounded-2xl shadow-xs hover:border-[#527C70]/40 transition-all hover:shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#68756F] uppercase tracking-wider">
                {card.label}
              </span>
              <div
                className={`flex items-center justify-center w-9 h-9 rounded-xl ${card.bgColor} ${card.color} border ${card.borderColor}`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#26332F] tracking-tight">
                {card.value}
              </span>
              {isSampleDataset && !isZero && (
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#F7F7F2] text-[#68756F] border border-[#E4E7E1]">
                  Sample
                </span>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#E4E7E1] text-xs">
              <span
                className={`inline-flex items-center gap-0.5 font-medium ${
                  card.changeType === 'positive'
                    ? 'text-[#48735B]'
                    : card.changeType === 'warning'
                    ? 'text-[#B88738] font-semibold'
                    : 'text-[#68756F]'
                }`}
              >
                {card.changeType === 'positive' && (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                )}
                {card.change}
              </span>
              <span className="text-[#68756F]/80 text-[11px] truncate">{card.subtext}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
