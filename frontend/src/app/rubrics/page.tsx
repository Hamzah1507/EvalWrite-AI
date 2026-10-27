'use client';

import React, { useState } from 'react';
import { EmptyState } from '@/components/common/EmptyState';
import { useEvaluation } from '@/context/EvaluationContext';
import { RubricDefinition, RubricCriterion } from '@/types/evaluation';
import {
  Sliders,
  Plus,
  Trash2,
  Calendar,
  Search,
  X,
  Edit2,
  AlertCircle,
  Database,
  Layers,
} from 'lucide-react';

export default function RubricsPage() {
  const { rubrics, addRubric, updateRubric, deleteRubric } = useEvaluation();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRubricId, setEditingRubricId] = useState<string | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formSubject, setFormSubject] = useState('Computer Science');
  const [formDescription, setFormDescription] = useState('');
  const [criteriaList, setCriteriaList] = useState<RubricCriterion[]>([
    {
      id: 'c1',
      name: 'Content Accuracy & Relevance',
      weight: 40,
      description: 'Addresses the core prompt with valid domain assertions.',
    },
    {
      id: 'c2',
      name: 'Conceptual Depth & Synthesis',
      weight: 35,
      description: 'Demonstrates deep analytical grasp rather than superficial recall.',
    },
    {
      id: 'c3',
      name: 'Structure & Coherence',
      weight: 25,
      description: 'Well-ordered paragraphs and logical conceptual flow.',
    },
  ]);

  const totalWeight = criteriaList.reduce((sum, c) => sum + (Number(c.weight) || 0), 0);
  const isBalanced = totalWeight === 100;

  const filteredRubrics = rubrics.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.subject.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingRubricId(null);
    setFormTitle('');
    setFormSubject('Humanities & Social Sciences');
    setFormDescription('');
    setCriteriaList([
      {
        id: `c-1`,
        name: 'Content Accuracy & Relevance',
        weight: 40,
        description: 'Direct alignment with prompt requirements and factual accuracy.',
      },
      {
        id: `c-2`,
        name: 'Critical Depth & Synthesis',
        weight: 35,
        description: 'Analytical depth, conceptual links, and comparative reasoning.',
      },
      {
        id: `c-3`,
        name: 'Structure & Academic Style',
        weight: 25,
        description: 'Paragraph cohesion, logical transitions, and domain diction.',
      },
    ]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rubric: RubricDefinition) => {
    setEditingRubricId(rubric.id);
    setFormTitle(rubric.title);
    setFormSubject(rubric.subject);
    setFormDescription(rubric.description);
    setCriteriaList([...rubric.criteria]);
    setIsModalOpen(true);
  };

  const handleAddCriterion = () => {
    const remaining = Math.max(0, 100 - totalWeight);
    setCriteriaList([
      ...criteriaList,
      {
        id: `c-${Date.now()}`,
        name: 'New Dimension',
        weight: remaining || 10,
        description: 'Evaluation criteria and scoring guidelines.',
      },
    ]);
  };

  const handleRemoveCriterion = (id: string) => {
    if (criteriaList.length <= 1) return;
    setCriteriaList(criteriaList.filter((c) => c.id !== id));
  };

  const handleSaveRubric = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !isBalanced) return;

    if (editingRubricId) {
      updateRubric(editingRubricId, {
        title: formTitle,
        subject: formSubject,
        description: formDescription,
        criteria: criteriaList,
      });
    } else {
      const newRubric: RubricDefinition = {
        id: `rubric-${Date.now()}`,
        title: formTitle,
        subject: formSubject,
        description: formDescription || 'Custom evaluation rubric.',
        criteria: criteriaList,
        createdAt: new Date().toISOString().split('T')[0],
        totalSubmissions: 0,
      };
      addRubric(newRubric);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#26332F] tracking-tight flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#527C70]" />
            Rubric Criteria Builder
          </h2>
          <p className="text-xs text-[#68756F] mt-1">
            Configure multi-criteria assessment dimensions, semantic weighting, and academic benchmarks.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#527C70] text-white font-semibold text-xs hover:bg-[#3F655A] transition-all shadow-xs self-start sm:self-auto active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Rubric</span>
        </button>
      </div>

      {/* Honest Storage Notice Banner */}
      <div className="flex items-center justify-between p-3.5 bg-white border border-[#E4E7E1] rounded-xl text-xs text-[#68756F]">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-[#527C70] shrink-0" />
          <span>
            <strong className="text-[#26332F]">Session Storage:</strong> Created and edited rubrics are preserved in your current browser session. Database synchronization will connect via FastAPI in an upcoming release.
          </span>
        </div>
        <span className="font-mono text-[11px] text-[#68756F] hidden md:inline">Local Memory</span>
      </div>

      {/* Search & Counter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white border border-[#E4E7E1] rounded-2xl shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#68756F] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search rubrics by title or subject..."
            className="w-full h-9 pl-9 pr-3 text-xs bg-[#F7F7F2] border border-[#E4E7E1] rounded-lg text-[#26332F] placeholder-[#68756F]/60 focus:outline-none focus:ring-1 focus:ring-[#527C70]"
          />
        </div>

        <div className="text-xs text-[#68756F] px-2">
          <span>
            Showing <strong className="text-[#26332F]">{filteredRubrics.length}</strong> of{' '}
            <strong className="text-[#26332F]">{rubrics.length}</strong> rubrics
          </span>
        </div>
      </div>

      {/* Rubrics Grid or Empty State */}
      {filteredRubrics.length === 0 ? (
        <EmptyState
          title="No rubrics match your search"
          description={`No rubric criteria matched "${search}". Clear your filter or create a new custom rubric.`}
          actionLabel="Clear Search"
          onAction={() => setSearch('')}
          secondaryActionLabel="Create New Rubric"
          onSecondaryAction={handleOpenCreate}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRubrics.map((rubric) => (
            <div
              key={rubric.id}
              className="p-5 bg-white border border-[#E4E7E1] rounded-2xl shadow-xs hover:border-[#527C70]/40 transition-all hover:shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#EEF3F0] text-[#3F655A] border border-[#D5DFDA]">
                    {rubric.subject}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(rubric)}
                      className="p-1 text-[#68756F] hover:text-[#527C70] rounded transition-colors"
                      title="Edit Rubric"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {rubrics.length > 1 && (
                      <button
                        onClick={() => deleteRubric(rubric.id)}
                        className="p-1 text-[#68756F] hover:text-[#A84B46] rounded transition-colors"
                        title="Delete Rubric"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#26332F] leading-snug">
                    {rubric.title}
                  </h3>
                  <p className="text-xs text-[#68756F] mt-1 line-clamp-2">
                    {rubric.description}
                  </p>
                </div>

                {/* Criteria Weight Tags */}
                <div className="space-y-2 pt-2 border-t border-[#E4E7E1]">
                  <span className="text-[11px] font-semibold text-[#68756F] uppercase tracking-wider block">
                    Weight Distribution (100% Total):
                  </span>
                  <div className="space-y-1.5">
                    {rubric.criteria.map((c) => (
                      <div key={c.id} className="text-xs flex items-center justify-between text-[#26332F]">
                        <span className="truncate pr-2">{c.name}</span>
                        <span className="font-mono font-semibold text-[#527C70] shrink-0">
                          {c.weight}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-[#E4E7E1] flex items-center justify-between text-[11px] text-[#68756F]">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {rubric.createdAt}
                </span>
                <span className="font-medium text-[#26332F]">
                  {rubric.totalSubmissions} evaluations
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Rubric Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#26332F]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-[#E4E7E1] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-[#E4E7E1] bg-[#F7F7F2]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#EEF3F0] text-[#3F655A]">
                  <Sliders className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#26332F]">
                  {editingRubricId ? 'Edit Evaluation Rubric' : 'Create Custom Rubric'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[#68756F] hover:text-[#26332F] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRubric} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#26332F] mb-1">
                    Rubric Title <span className="text-[#A84B46]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Graduate Essay Analysis Rubric"
                    className="w-full h-9 px-3 text-xs bg-[#F7F7F2] border border-[#E4E7E1] rounded-lg text-[#26332F] focus:outline-none focus:ring-1 focus:ring-[#527C70]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#26332F] mb-1">
                    Subject / Discipline
                  </label>
                  <input
                    type="text"
                    required
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    placeholder="e.g. Computer Science & AI"
                    className="w-full h-9 px-3 text-xs bg-[#F7F7F2] border border-[#E4E7E1] rounded-lg text-[#26332F] focus:outline-none focus:ring-1 focus:ring-[#527C70]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#26332F] mb-1">
                  Rubric Description
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Outline the scope and evaluation standards for this rubric..."
                  className="w-full p-2.5 text-xs bg-[#F7F7F2] border border-[#E4E7E1] rounded-lg text-[#26332F] focus:outline-none focus:ring-1 focus:ring-[#527C70]"
                />
              </div>

              {/* Criteria List */}
              <div className="space-y-2 pt-2 border-t border-[#E4E7E1]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#26332F] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#527C70]" />
                    Criteria Dimensions & Weights
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                        isBalanced
                          ? 'bg-[#EDF4EF] text-[#314E46] border border-[#CDE1D4]'
                          : 'bg-[#FBF5EA] text-[#8B6220] border border-[#F2E4CB]'
                      }`}
                    >
                      Sum: {totalWeight}% / 100%
                    </span>
                  </div>
                </div>

                {!isBalanced && (
                  <div className="p-2 rounded-lg bg-[#FBF5EA] border border-[#F2E4CB] text-[#8B6220] text-[11px] flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-[#B88738] shrink-0" />
                    <span>
                      Criteria weights must sum to exactly 100% before saving (currently {totalWeight}%).
                    </span>
                  </div>
                )}

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {criteriaList.map((crit, idx) => (
                    <div
                      key={crit.id}
                      className="p-3 rounded-xl bg-[#F7F7F2] border border-[#E4E7E1] space-y-2 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          required
                          value={crit.name}
                          onChange={(e) => {
                            const updated = [...criteriaList];
                            updated[idx].name = e.target.value;
                            setCriteriaList(updated);
                          }}
                          placeholder="Criterion Name"
                          className="flex-1 h-8 px-2.5 bg-white border border-[#E4E7E1] rounded-md font-medium text-[#26332F] text-xs"
                        />
                        <div className="flex items-center gap-1 w-24">
                          <input
                            type="number"
                            min={1}
                            max={100}
                            required
                            value={crit.weight}
                            onChange={(e) => {
                              const updated = [...criteriaList];
                              updated[idx].weight = Number(e.target.value);
                              setCriteriaList(updated);
                            }}
                            className="w-16 h-8 px-2 bg-white border border-[#E4E7E1] rounded-md font-mono text-center text-xs"
                          />
                          <span className="text-[#68756F] font-bold">%</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveCriterion(crit.id)}
                          className="p-1.5 text-[#68756F] hover:text-[#A84B46] rounded disabled:opacity-30"
                          disabled={criteriaList.length <= 1}
                          title="Remove Dimension"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={crit.description}
                        onChange={(e) => {
                          const updated = [...criteriaList];
                          updated[idx].description = e.target.value;
                          setCriteriaList(updated);
                        }}
                        placeholder="Evaluation instructions or guidance for scorers..."
                        className="w-full h-7 px-2 bg-white border border-[#E4E7E1] rounded-md text-[11px] text-[#68756F]"
                      />
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddCriterion}
                  className="w-full py-2 text-xs font-semibold text-[#527C70] border border-dashed border-[#D5DFDA] rounded-xl hover:bg-[#EEF3F0] transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Another Dimension</span>
                </button>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-[#E4E7E1] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#68756F] hover:text-[#26332F]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isBalanced || !formTitle.trim()}
                  className="px-4 py-2 text-xs font-semibold bg-[#527C70] text-white rounded-lg hover:bg-[#3F655A] disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
                >
                  {editingRubricId ? 'Update Rubric' : 'Save Rubric'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
