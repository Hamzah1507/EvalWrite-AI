'use client';

import { useRouter } from 'next/navigation';
import { ScoreDistributionChart } from '@/components/dashboard/ScoreDistributionChart';
import { CriteriaBreakdownCard } from '@/components/dashboard/CriteriaBreakdownCard';
import { EmptyState } from '@/components/common/EmptyState';
import { mockScoreDistribution, mockWeeklyTrends } from '@/data/mockData';
import { useIsMounted } from '@/hooks/useIsMounted';
import { useEvaluation } from '@/context/EvaluationContext';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Sliders,
  Server,
  FileCheck,
} from 'lucide-react';

export default function AnalyticsPage() {
  const router = useRouter();
  const isMounted = useIsMounted();
  const { showSampleData, setShowSampleData, evaluations, rubrics, backendStatus } = useEvaluation();

  const isUsingSample = showSampleData && evaluations.some((e) => e.isSample);
  const isApiOnline = backendStatus.apiHealth === 'connected';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#26332F] tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#527C70]" />
            Evaluation Analytics & Longitudinal Trends
          </h2>
          <p className="text-xs text-[#68756F] mt-1">
            Aggregated cohort performance, score distributions, and criteria mastery trends.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-white border border-[#E4E7E1] text-[#26332F] font-medium shadow-2xs">
            {isUsingSample ? 'Dataset: Demonstration Cohort' : 'Dataset: Live Session Records'}
          </span>
        </div>
      </div>

      {!isUsingSample && evaluations.length === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="No evaluation analytics collected yet"
          description="Cohort score distributions, rubric criteria trends, and throughput analytics will automatically compute once answers are evaluated and saved to the database."
          actionLabel="Evaluate First Answer"
          onAction={() => router.push('/evaluate')}
          secondaryActionLabel="View Sample Cohort Analytics"
          onSecondaryAction={() => setShowSampleData(true)}
        />
      ) : (
        <>
          {/* Honest Operational Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-white border border-[#E4E7E1] rounded-2xl shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#68756F] uppercase tracking-wider">
                  Active Rubrics
                </span>
                <div className="p-1.5 rounded-lg bg-[#EEF3F0] text-[#3F655A]">
                  <Sliders className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-[#26332F]">{rubrics.length} Standard Sets</div>
              <p className="text-xs text-[#68756F]/80 mt-1">Configured for multi-criteria assessment</p>
            </div>

            <div className="p-5 bg-white border border-[#E4E7E1] rounded-2xl shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#68756F] uppercase tracking-wider">
                  Evaluations Monitored
                </span>
                <div className="p-1.5 rounded-lg bg-[#EDF4EF] text-[#48735B]">
                  <FileCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-[#26332F]">
                {isUsingSample ? '1,248' : evaluations.length} Answers
              </div>
              <p className="text-xs text-[#68756F]/80 mt-1">
                {isUsingSample ? 'Demonstration sample cohort' : 'Live submissions in session'}
              </p>
            </div>

            <div className="p-5 bg-white border border-[#E4E7E1] rounded-2xl shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#68756F] uppercase tracking-wider">
                  FastAPI Server
                </span>
                <div className="p-1.5 rounded-lg bg-[#F7F7F2] text-[#68756F] border border-[#E4E7E1]">
                  <Server className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-[#26332F]">
                {isApiOnline ? 'Online (:8000)' : 'Standby'}
              </div>
              <p className="text-xs text-[#68756F]/80 mt-1">
                {isApiOnline ? 'Health probe responding 200 OK' : 'Local server offline'}
              </p>
            </div>
          </div>

          {/* Charts: Score Distribution & Criteria Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ScoreDistributionChart
                data={isUsingSample ? mockScoreDistribution : []}
                isSampleData={isUsingSample}
              />
            </div>
            <div className="lg:col-span-1">
              <CriteriaBreakdownCard
                isSampleData={isUsingSample}
              />
            </div>
          </div>

          {/* Weekly Evaluations Volume & Average Trend */}
          {isUsingSample && (
            <div className="p-6 bg-white border border-[#E4E7E1] rounded-2xl shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#EEF3F0] text-[#3F655A]">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold text-[#26332F] tracking-tight">
                      Weekly Evaluation Throughput
                    </h3>
                    <span className="text-[10px] font-semibold text-[#68756F] bg-[#F7F7F2] border border-[#E4E7E1] px-2 py-0.5 rounded-md">
                      Demonstration Sample
                    </span>
                  </div>
                  <p className="text-xs text-[#68756F] mt-0.5">
                    Simulated weekly volume of assessed descriptive student essays
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-[#527C70]" />
                    <span className="text-[#68756F]">Sample Submissions Volume</span>
                  </span>
                </div>
              </div>

              <div className="h-64 w-full">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={mockWeeklyTrends}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorEvals" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#527C70" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#527C70" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E7E1" />
                      <XAxis
                        dataKey="week"
                        axisLine={{ stroke: '#E4E7E1' }}
                        tickLine={false}
                        tick={{ fill: '#68756F', fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#68756F', fontSize: 11 }}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="p-3 bg-[#26332F] text-white rounded-xl shadow-lg text-xs space-y-1 border border-[#3A4A45]">
                                <p className="font-semibold">{data.week}</p>
                                <p className="text-[#D5DFDA]">
                                  Sample Evaluations: <strong>{data.evaluations}</strong>
                                </p>
                                <p className="text-slate-300">
                                  Cohort Mean: <strong>{data.avgScore}%</strong>
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="evaluations"
                        stroke="#527C70"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorEvals)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-[#68756F]">
                    Loading chart...
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
