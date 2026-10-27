import { mockCriteriaPerformance } from '@/data/mockData';
import { Sliders, TrendingUp, SlidersHorizontal } from 'lucide-react';

interface CriteriaBreakdownCardProps {
  isSampleData?: boolean;
}

export function CriteriaBreakdownCard({ isSampleData = false }: CriteriaBreakdownCardProps) {
  if (!isSampleData) {
    return (
      <div className="p-6 bg-white border border-[#E4E7E1] rounded-2xl shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#EEF3F0] text-[#3F655A]">
                <Sliders className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-[#26332F] tracking-tight">
                Criteria Proficiency
              </h2>
            </div>
          </div>
          <div className="py-12 flex flex-col items-center justify-center text-center border border-dashed border-[#E4E7E1] rounded-xl bg-[#F7F7F2]/60">
            <SlidersHorizontal className="w-8 h-8 text-[#68756F]/60 mb-2" />
            <p className="text-xs font-semibold text-[#26332F]">No criteria data available</p>
            <p className="text-[11px] text-[#68756F] max-w-xs mt-1">
              Dimension scores will compute when descriptive answers are scored against active rubrics.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border border-[#E4E7E1] rounded-2xl shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#EEF3F0] text-[#3F655A]">
              <Sliders className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-[#26332F] tracking-tight">
              Criteria Proficiency
            </h2>
          </div>
          <span className="text-[10px] font-semibold text-[#68756F] bg-[#F7F7F2] border border-[#E4E7E1] px-2 py-0.5 rounded-md">
            Sample Breakdown
          </span>
        </div>

        <p className="text-xs text-[#68756F] mb-6">
          Mean scores across core evaluation dimensions compared against institutional benchmarks.
        </p>

        <div className="space-y-4">
          {mockCriteriaPerformance.map((item) => {
            const isAhead = item.score >= item.benchmark;
            return (
              <div key={item.criteria} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#26332F]">{item.criteria}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#26332F]">{item.score}%</span>
                    <span className="text-[11px] text-[#68756F] font-mono">
                      (target {item.benchmark}%)
                    </span>
                  </div>
                </div>

                <div className="relative w-full h-2 rounded-full bg-[#EEF3F0] overflow-hidden">
                  {/* Target marker */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-[#68756F] z-10"
                    style={{ left: `${item.benchmark}%` }}
                    title={`Benchmark target: ${item.benchmark}%`}
                  />
                  {/* Progress bar */}
                  <div
                    className={`h-full rounded-full transition-all ${
                      isAhead ? 'bg-[#527C70]' : 'bg-[#B88738]'
                    }`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-[#E4E7E1] flex items-center justify-between text-xs text-[#68756F]">
        <span className="flex items-center gap-1 text-[#48735B] font-medium">
          <TrendingUp className="w-3.5 h-3.5" />
          4 of 5 sample dimensions meet target
        </span>
        <span className="text-[#68756F]/80 text-[11px]">Standard Rubric Benchmark</span>
      </div>
    </div>
  );
}
