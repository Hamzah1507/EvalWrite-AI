'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { EvaluationItem } from '@/types/evaluation';
import { StatusBadge } from '../common/StatusBadge';
import { ScoreBadge } from '../common/ScoreBadge';
import { EvaluationModal } from './EvaluationModal';
import { EmptyState } from '../common/EmptyState';
import {
  FileCheck,
  Search,
  Eye,
  ArrowUpRight,
  BookOpen,
} from 'lucide-react';

interface RecentEvaluationsTableProps {
  evaluations: EvaluationItem[];
  searchQuery?: string;
  onLoadSampleData?: () => void;
}

export function RecentEvaluationsTable({
  evaluations,
  searchQuery = '',
  onLoadSampleData,
}: RecentEvaluationsTableProps) {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<EvaluationItem | null>(null);
  const [localSearch, setLocalSearch] = useState<string>('');

  const activeSearch = searchQuery || localSearch;

  const filteredEvaluations = useMemo(() => {
    return evaluations.filter((item) => {
      const matchesStatus =
        selectedStatus === 'all' || item.status === selectedStatus;

      const q = activeSearch.toLowerCase().trim();
      const matchesQuery =
        !q ||
        item.studentName.toLowerCase().includes(q) ||
        item.studentId.toLowerCase().includes(q) ||
        item.assignmentTitle.toLowerCase().includes(q) ||
        item.subject.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q);

      return matchesStatus && matchesQuery;
    });
  }, [evaluations, selectedStatus, activeSearch]);

  const statusTabs: { id: string; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: evaluations.length },
    {
      id: 'completed',
      label: 'Evaluated',
      count: evaluations.filter((e) => e.status === 'completed').length,
    },
    {
      id: 'pending_review',
      label: 'Pending',
      count: evaluations.filter((e) => e.status === 'pending_review').length,
    },
    {
      id: 'flagged',
      label: 'Flagged',
      count: evaluations.filter((e) => e.status === 'flagged').length,
    },
  ];

  return (
    <>
      <div className="bg-white border border-[#E4E7E1] rounded-2xl shadow-xs overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-5 border-b border-[#E4E7E1] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#EEF3F0] text-[#3F655A]">
                <FileCheck className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-[#26332F] tracking-tight">
                Recent Evaluations
              </h2>
            </div>
            <p className="text-xs text-[#68756F] mt-0.5">
              Evaluated student responses with rubric scores and criteria breakdown
            </p>
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#F7F7F2] p-1 rounded-xl border border-[#E4E7E1]">
            {statusTabs.map((tab) => {
              const isActive = selectedStatus === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedStatus(tab.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    isActive
                      ? 'bg-white text-[#3F655A] font-semibold shadow-2xs border border-[#E4E7E1]'
                      : 'text-[#68756F] hover:text-[#26332F]'
                  }`}
                >
                  {tab.label}
                  <span
                    className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                      isActive ? 'bg-[#EEF3F0] text-[#3F655A]' : 'bg-[#E4E7E1] text-[#68756F]'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Local Search for table when TopNav isn't focused */}
        <div className="px-5 py-2.5 bg-[#F7F7F2]/60 border-b border-[#E4E7E1] flex items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-[#68756F] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Filter by student, ID, or subject..."
              className="w-full h-8 pl-8 pr-3 text-xs bg-white border border-[#E4E7E1] rounded-lg text-[#26332F] placeholder-[#68756F]/60 focus:outline-none focus:ring-1 focus:ring-[#527C70]"
            />
          </div>

          <Link
            href="/history"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-[#527C70] hover:text-[#3F655A] transition-colors"
          >
            <span>View All in History</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Table / Empty State */}
        {filteredEvaluations.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title={evaluations.length === 0 ? "No evaluations recorded yet" : "No evaluations match search"}
              description={
                evaluations.length === 0
                  ? "Evaluate your first student answer to generate rubric scores, concept breakdowns, and feedback."
                  : activeSearch
                  ? `No submissions match "${activeSearch}". Try adjusting your keywords or clearing the filter.`
                  : "There are currently no evaluations under this status filter."
              }
              actionLabel={evaluations.length === 0 ? "Evaluate Answer" : activeSearch ? 'Clear Search' : undefined}
              onAction={
                evaluations.length === 0
                  ? () => router.push('/evaluate')
                  : () => setLocalSearch('')
              }
              secondaryActionLabel={evaluations.length === 0 && onLoadSampleData ? "Load Demonstration Records" : undefined}
              onSecondaryAction={onLoadSampleData}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F7F7F2] border-b border-[#E4E7E1] text-[#68756F] font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Student & ID</th>
                  <th className="py-3 px-4">Subject & Assignment</th>
                  <th className="py-3 px-4">Word Count</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E7E1]">
                {filteredEvaluations.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="hover:bg-[#F7F7F2]/80 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-[#26332F] group-hover:text-[#527C70] transition-colors">
                          {item.studentName}
                        </span>
                        {item.isSample && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#EEF3F0] text-[#3F655A] font-mono border border-[#D5DFDA]">
                            Sample
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-[#68756F]">{item.studentId}</div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-medium text-[#26332F] truncate" title={item.assignmentTitle}>
                        {item.assignmentTitle}
                      </div>
                      <div className="text-[11px] text-[#68756F] flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-[#68756F]" />
                        <span>{item.subject}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-[#68756F] font-mono">
                      {item.wordCount} w
                    </td>

                    <td className="py-3.5 px-4">
                      <ScoreBadge score={item.score} />
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={item.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-[#68756F] text-[11px] whitespace-nowrap">
                      {item.submittedAt}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedItem(item);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#527C70] hover:text-[#3F655A] hover:bg-[#EEF3F0] rounded-lg transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Footer */}
        {filteredEvaluations.length > 0 && (
          <div className="p-4 border-t border-[#E4E7E1] bg-[#F7F7F2]/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#68756F]">
            <span>
              Showing <strong className="text-[#26332F]">{filteredEvaluations.length}</strong> of{' '}
              <strong className="text-[#26332F]">{evaluations.length}</strong> evaluations
            </span>

            <Link
              href="/evaluate"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#527C70] text-white font-medium text-xs hover:bg-[#3F655A] transition-colors shadow-2xs"
            >
              <span>+ Evaluate New Answer</span>
            </Link>
          </div>
        )}
      </div>

      {/* Modal Details */}
      <EvaluationModal
        evaluation={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </>
  );
}
