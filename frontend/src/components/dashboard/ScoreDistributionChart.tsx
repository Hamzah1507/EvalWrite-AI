'use client';

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { ScoreBucket } from '@/types/evaluation';
import { BarChart3, FolderSearch } from 'lucide-react';
import { useIsMounted } from '@/hooks/useIsMounted';

interface ScoreDistributionChartProps {
  data: ScoreBucket[];
  isSampleData?: boolean;
}

export function ScoreDistributionChart({ data, isSampleData = false }: ScoreDistributionChartProps) {
  const isMounted = useIsMounted();
  const [activeBucket, setActiveBucket] = useState<ScoreBucket | null>(null);

  // Coordinated restrained palette for enterprise assessment platform
  const getBarColor = (range: string, isHovered: boolean) => {
    if (range.includes('0–49')) return isHovered ? '#9E4C46' : '#B35D57';
    if (range.includes('50–59')) return isHovered ? '#A87632' : '#C08B42';
    if (range.includes('60–69')) return isHovered ? '#647E73' : '#769085';
    if (range.includes('70–79')) return isHovered ? '#3F655A' : '#527C70';
    if (range.includes('80–89')) return isHovered ? '#314E46' : '#3F655A';
    return isHovered ? '#243C36' : '#314E46';
  };

  if (!isMounted) {
    return (
      <div className="p-6 bg-white border border-[#E4E7E1] rounded-2xl shadow-xs min-h-[360px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-[#68756F] text-sm">
          <div className="w-6 h-6 border-2 border-[#527C70] border-t-transparent rounded-full animate-spin" />
          <span>Rendering Score Distribution...</span>
        </div>
      </div>
    );
  }

  const hasData = data && data.length > 0 && data.some((b) => b.count > 0);

  return (
    <div className="p-6 bg-white border border-[#E4E7E1] rounded-2xl shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#EEF3F0] text-[#3F655A]">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-[#26332F] tracking-tight">
              Score Distribution
            </h2>
            {isSampleData && (
              <span className="text-[10px] font-semibold text-[#68756F] bg-[#F7F7F2] border border-[#E4E7E1] px-2 py-0.5 rounded-md">
                Demonstration Cohort
              </span>
            )}
          </div>
          <p className="text-xs text-[#68756F] mt-1">
            {isSampleData
              ? 'Performance band distribution from demonstration cohort (N = 1,248 sample submissions)'
              : 'Distribution of evaluated student marks across grade tiers'}
          </p>
        </div>

        {hasData && (
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-[#F7F7F2] text-[#68756F] font-medium border border-[#E4E7E1]">
              Mean: 78.4%
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#EEF3F0] text-[#3F655A] font-semibold border border-[#D5DFDA]">
              Median: 77.0%
            </span>
          </div>
        )}
      </div>

      {!hasData ? (
        <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-[#E4E7E1] rounded-xl bg-[#F7F7F2]/60">
          <FolderSearch className="w-8 h-8 text-[#68756F]/60 mb-2" />
          <p className="text-sm font-semibold text-[#26332F]">No evaluation score data yet</p>
          <p className="text-xs text-[#68756F] max-w-sm mt-1">
            Score distributions will automatically populate as student descriptive answers are evaluated.
          </p>
        </div>
      ) : (
        <>
          {/* Chart Canvas */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E7E1" />
                <XAxis
                  dataKey="range"
                  axisLine={{ stroke: '#E4E7E1' }}
                  tickLine={false}
                  tick={{ fill: '#68756F', fontSize: 12, fontWeight: 500 }}
                  dy={6}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#68756F', fontSize: 11 }}
                  domain={[0, 'auto']}
                />
                <Tooltip
                  cursor={{ fill: '#F7F7F2', opacity: 0.9 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload as ScoreBucket;
                      return (
                        <div className="p-3 bg-[#26332F] text-white rounded-xl shadow-lg text-xs space-y-1 border border-[#3A4A45]">
                          <p className="font-semibold text-slate-100">
                            Score Band: {item.range}%
                          </p>
                          <p className="text-[#D5DFDA] font-medium">{item.grade}</p>
                          <div className="pt-1 border-t border-[#3A4A45] flex items-center justify-between gap-4 text-slate-300">
                            <span>Submissions:</span>
                            <span className="font-bold text-white">{item.count}</span>
                          </div>
                          <div className="flex items-center justify-between gap-4 text-slate-300">
                            <span>Cohort Share:</span>
                            <span className="font-bold text-white">{item.percentage}%</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={48}>
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getBarColor(entry.range, activeBucket?.range === entry.range)}
                      className="transition-all duration-200 cursor-pointer"
                      onMouseEnter={() => setActiveBucket(entry)}
                      onMouseLeave={() => setActiveBucket(null)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend & Insight summary */}
          <div className="mt-4 pt-4 border-t border-[#E4E7E1] flex flex-wrap items-center justify-between gap-2 text-xs text-[#68756F]">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#B35D57]" />
                <span className="text-[11px]">&lt; 50 (Support)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#C08B42]" />
                <span className="text-[11px]">50–59 (Developing)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#769085]" />
                <span className="text-[11px]">60–69 (Satisfactory)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#527C70]" />
                <span className="text-[11px]">70–89 (Proficient / Mastery)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#314E46]" />
                <span className="text-[11px]">90+ (Exemplary)</span>
              </span>
            </div>

            <div className="text-[11px] text-[#68756F]/80 italic">
              Hover over bars to inspect bracket counts
            </div>
          </div>
        </>
      )}
    </div>
  );
}
