'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useEvaluation } from '@/context/EvaluationContext';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ScoreBadge } from '@/components/common/ScoreBadge';
import { EmptyState } from '@/components/common/EmptyState';
import { EvaluationModal } from '@/components/dashboard/EvaluationModal';
import { EvaluationItem } from '@/types/evaluation';
import {
  History,
  Search,
  Download,
  Eye,
} from 'lucide-react';

export default function HistoryPage() {
  const router = useRouter();
  const { evaluations, showSampleData, setShowSampleData } = useEvaluation();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [selectedEvaluation, setSelectedEvaluation] = useState<EvaluationItem | null>(null);

  const subjects = useMemo(() => {
    const list = Array.from(new Set(evaluations.map((e) => e.subject)));
    return ['all', ...list];
  }, [evaluations]);

  const filtered = useMemo(() => {
    return evaluations.filter((item) => {
      const matchesStatus =
        statusFilter === 'all' || item.status === statusFilter;
      const matchesSubject =
        subjectFilter === 'all' || item.subject === subjectFilter;

      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.studentName.toLowerCase().includes(q) ||
        item.studentId.toLowerCase().includes(q) ||
        item.assignmentTitle.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q);

      return matchesStatus && matchesSubject && matchesSearch;
    });
  }, [evaluations, statusFilter, subjectFilter, search]);

  const handleExportCSV = () => {
    if (filtered.length === 0) return;

    const headers = ['ID', 'Student Name', 'Student ID', 'Subject', 'Assignment', 'Score', 'Status', 'Submitted At', 'Word Count'];
    const rows = filtered.map((e) => [
      e.id,
      `"${e.studentName.replace(/"/g, '""')}"`,
      e.studentId,
      `"${e.subject.replace(/"/g, '""')}"`,
      `"${e.assignmentTitle.replace(/"/g, '""')}"`,
      e.score,
      e.status,
      `"${e.submittedAt}"`,
      e.wordCount,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `evalwrite_evaluations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#26332F] tracking-tight flex items-center gap-2">
            <History className="w-5 h-5 text-[#527C70]" />
            Submission Evaluation History
          </h2>
          <p className="text-xs text-[#68756F] mt-1">
            Complete audit trail of student descriptive answers, rubric scoring dimensions, and verification status.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={filtered.length === 0}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-[#E4E7E1] text-[#26332F] hover:bg-[#F7F7F2] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-[#68756F]" />
          <span>Export CSV ({filtered.length})</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="p-4 bg-white border border-[#E4E7E1] rounded-2xl shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#68756F] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student, ID, or assignment..."
            className="w-full h-9 pl-9 pr-3 text-xs bg-[#F7F7F2] border border-[#E4E7E1] rounded-lg text-[#26332F] placeholder-[#68756F]/60 focus:outline-none focus:ring-1 focus:ring-[#527C70]"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-[#68756F]">
            <span className="font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 px-2.5 text-xs bg-[#F7F7F2] border border-[#E4E7E1] rounded-lg text-[#26332F] focus:outline-none focus:ring-1 focus:ring-[#527C70]"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Evaluated</option>
              <option value="pending_review">Pending Review</option>
              <option value="flagged">Flagged</option>
            </select>
          </div>

          {/* Subject Filter */}
          <div className="flex items-center gap-1.5 text-xs text-[#68756F]">
            <span className="font-medium">Subject:</span>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="h-9 px-2.5 text-xs bg-[#F7F7F2] border border-[#E4E7E1] rounded-lg text-[#26332F] focus:outline-none focus:ring-1 focus:ring-[#527C70]"
            >
              {subjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub === 'all' ? 'All Subjects' : sub}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white border border-[#E4E7E1] rounded-2xl shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title={evaluations.length === 0 ? "No submission records in history" : "No evaluations matched your search"}
              description={
                evaluations.length === 0
                  ? "As descriptive student responses are submitted and evaluated, they will be archived here for review and export."
                  : "No evaluation records matched your current query or filter criteria. Try resetting filters."
              }
              actionLabel={evaluations.length === 0 ? "Evaluate Answer" : "Reset All Filters"}
              onAction={
                evaluations.length === 0
                  ? () => router.push('/evaluate')
                  : () => {
                      setSearch('');
                      setStatusFilter('all');
                      setSubjectFilter('all');
                    }
              }
              secondaryActionLabel={evaluations.length === 0 && !showSampleData ? "Load Demonstration Records" : undefined}
              onSecondaryAction={() => setShowSampleData(true)}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F7F7F2] border-b border-[#E4E7E1] text-[#68756F] font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Evaluation ID</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Assignment & Subject</th>
                  <th className="py-3 px-4">Word Count</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E7E1]">
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedEvaluation(item)}
                    className="hover:bg-[#F7F7F2]/80 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#68756F]">
                      {item.id}
                    </td>

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

                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-medium text-[#26332F] truncate" title={item.assignmentTitle}>
                        {item.assignmentTitle}
                      </div>
                      <div className="text-[11px] text-[#68756F]">{item.subject}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[#68756F]">
                      {item.wordCount} words
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
                          setSelectedEvaluation(item);
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

        {/* Footer */}
        {filtered.length > 0 && (
          <div className="p-4 border-t border-[#E4E7E1] bg-[#F7F7F2]/40 flex items-center justify-between text-xs text-[#68756F]">
            <span>
              Displaying <strong className="text-[#26332F]">{filtered.length}</strong> of{' '}
              <strong className="text-[#26332F]">{evaluations.length}</strong> records
            </span>
            <span className="font-mono text-[11px] text-[#68756F]">EvalWrite Session Store</span>
          </div>
        )}
      </div>

      {/* Modal */}
      <EvaluationModal
        evaluation={selectedEvaluation}
        onClose={() => setSelectedEvaluation(null)}
      />
    </div>
  );
}
