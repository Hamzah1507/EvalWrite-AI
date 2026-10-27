'use client';

import React, { useState } from 'react';
import { useEvaluation } from '@/context/EvaluationContext';
import { ScoreBadge } from '@/components/common/ScoreBadge';
import {
  FileCheck2,
  Send,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Layers,
  HelpCircle,
  BookOpen,
  Award,
  AlertTriangle,
  Server,
  Save,
  GraduationCap,
} from 'lucide-react';
import { EvaluationItem } from '@/types/evaluation';

export default function EvaluatePage() {
  const { rubrics, addEvaluation } = useEvaluation();

  // Form State
  const [studentName, setStudentName] = useState('Aarav Sharma');
  const [studentId, setStudentId] = useState('STU-2024-089');
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [subject, setSubject] = useState('Modern World History');
  const [questionPrompt, setQuestionPrompt] = useState('');
  const [referenceAnswer, setReferenceAnswer] = useState('');
  const [studentAnswer, setStudentAnswer] = useState('');
  const [maxMarks, setMaxMarks] = useState<number>(100);
  const [selectedRubricId, setSelectedRubricId] = useState(rubrics[0]?.id || 'rubric-1');

  // Execution State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [resultItem, setResultItem] = useState<EvaluationItem | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Word count & read time helpers
  const wordCount = studentAnswer.trim() ? studentAnswer.trim().split(/\s+/).length : 0;
  const charCount = studentAnswer.length;
  const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200));

  const activeRubric = rubrics.find((r) => r.id === selectedRubricId) || rubrics[0];

  const handlePreloadSample = () => {
    setStudentName('Aarav Sharma');
    setStudentId('STU-2024-089');
    setAssignmentTitle('Impact of Industrial Revolution on Urban Sociology');
    setSubject('Modern World History');
    setQuestionPrompt(
      'Explain how the rapid migration toward factory cities in 19th century Britain restructured social hierarchies and family labor dynamics.'
    );
    setReferenceAnswer(
      'Expected key concepts: Agrarian to urban shift, cottage industries vs factory floor, role of women and children, emergence of proletariat vs industrial capitalist class, and early legislative reforms.'
    );
    setStudentAnswer(
      'The industrial boom compelled rural agrarian families into concentrated industrial clusters like Manchester and Birmingham. Rather than home-based cottage industry where family units worked communally, the steam-driven factories fractured domestic patterns. Children and women were recruited extensively into textile mills for lower wages, altering the traditional breadwinner hierarchy. Concurrently, a stark divide emerged between the rising capitalist bourgeoisie and the industrial proletariat, creating sanitary and sociological crises that catalyzed early labor reform legislation.'
    );
    setSelectedRubricId('rubric-1');
    setApiError(null);
    setResultItem(null);
    setIsSaved(false);
  };

  const handleReset = () => {
    setAssignmentTitle('');
    setQuestionPrompt('');
    setReferenceAnswer('');
    setStudentAnswer('');
    setApiError(null);
    setResultItem(null);
    setIsSaved(false);
  };

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentAnswer.trim() || !questionPrompt.trim() || !assignmentTitle.trim()) return;

    setIsSubmitting(true);
    setApiError(null);
    setResultItem(null);
    setIsSaved(false);

    try {
      // Attempt live POST to FastAPI backend endpoint
      const response = await fetch('http://127.0.0.1:8000/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          studentName,
          studentId,
          assignmentTitle,
          subject,
          questionPrompt,
          referenceAnswer,
          studentAnswer,
          rubricId: selectedRubricId,
          maxMarks,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResultItem(data);
      } else {
        // Honest notification: endpoint /api/evaluate is pending on backend
        setApiError(
          `FastAPI responded with HTTP ${response.status}. The evaluation endpoint '/api/evaluate' is pending backend AI engine pipeline wiring.`
        );
      }
    } catch {
      setApiError(
        'Could not reach /api/evaluate on http://127.0.0.1:8000. Backend scoring endpoint is pending configuration.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Provide explicit demonstration output preview so user can inspect the result schema
  const handlePreviewSampleResult = () => {
    const previewResult: EvaluationItem = {
      id: `EVAL-${Math.floor(1000 + Math.random() * 9000)}`,
      studentName: studentName || 'Sample Student',
      studentId: studentId || 'STU-SAMPLE',
      assignmentTitle: assignmentTitle || 'Sample Assignment Evaluation',
      subject,
      submittedAt: 'Just now',
      score: 86,
      status: 'completed',
      rubricName: activeRubric?.title || 'Standard Rubric',
      wordCount,
      questionPrompt,
      studentAnswer,
      referenceAnswer,
      overallFeedback:
        'Demonstrates clear understanding of the primary subject concepts. Paragraph flow is logical, and key cause-and-effect relationships are substantiated.',
      strengths: [
        'Direct alignment with prompt requirements.',
        'Logical structuring and transitional phrasing.',
        'Accurate domain vocabulary throughout.'
      ],
      areasForImprovement: [
        'Could provide deeper empirical evidence or textual citations.',
        'Elaborate on secondary consequences to strengthen conclusion.'
      ],
      coveredConcepts: [
        'Primary causal mechanism',
        'Structural transition dynamics',
        'Sociological role restructuring'
      ],
      missingConcepts: [
        'Specific statutory or legislative citations'
      ],
      criteriaScores: activeRubric?.criteria.map((c) => ({
        ...c,
        score: Math.min(100, Math.max(65, Math.round(c.weight * 2.2 + 10))),
      })) || [],
      isSample: true,
    };

    setResultItem(previewResult);
    setApiError(null);
  };

  const handleSaveResult = () => {
    if (resultItem) {
      addEvaluation(resultItem);
      setIsSaved(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#26332F] tracking-tight flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-[#527C70]" />
            Evaluate Descriptive Answer
          </h2>
          <p className="text-xs text-[#68756F] mt-1">
            Submit student responses for multi-criteria assessment, covered/missing concepts, and actionable feedback.
          </p>
        </div>

        <button
          type="button"
          onClick={handlePreloadSample}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#EEF3F0] text-[#3F655A] hover:bg-[#E2EBE6] border border-[#D5DFDA] transition-colors self-start sm:self-auto"
        >
          <GraduationCap className="w-3.5 h-3.5 text-[#527C70]" />
          <span>Load Sample Submission</span>
        </button>
      </div>

      {/* Main Form & Results Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form (7 cols) */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleEvaluate}
            className="p-6 bg-white border border-[#E4E7E1] rounded-2xl shadow-xs space-y-6"
          >
            {/* Group 1: Assignment & Student Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E4E7E1] text-xs font-bold text-[#26332F] uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-[#527C70]" />
                <span>1. Assignment & Student Metadata</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#26332F] mb-1">
                    Student Full Name <span className="text-[#A84B46]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="e.g. Elena Rostova"
                    className="w-full h-9 px-3 text-xs bg-[#F7F7F2] border border-[#E4E7E1] rounded-lg text-[#26332F] focus:outline-none focus:ring-2 focus:ring-[#527C70]/20 focus:border-[#527C70]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#26332F] mb-1">
                    Student Identifier <span className="text-[#A84B46]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g. STU-2024-114"
                    className="w-full h-9 px-3 text-xs bg-[#F7F7F2] border border-[#E4E7E1] rounded-lg text-[#26332F] focus:outline-none focus:ring-2 focus:ring-[#527C70]/20 focus:border-[#527C70] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#26332F] mb-1">
                    Assignment Title <span className="text-[#A84B46]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={assignmentTitle}
                    onChange={(e) => setAssignmentTitle(e.target.value)}
                    placeholder="e.g. Photosynthesis Electron Transport"
                    className="w-full h-9 px-3 text-xs bg-[#F7F7F2] border border-[#E4E7E1] rounded-lg text-[#26332F] focus:outline-none focus:ring-2 focus:ring-[#527C70]/20 focus:border-[#527C70]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#26332F] mb-1">
                    Subject / Discipline <span className="text-[#A84B46]">*</span>
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-[#F7F7F2] border border-[#E4E7E1] rounded-lg text-[#26332F] focus:outline-none focus:ring-2 focus:ring-[#527C70]/20 focus:border-[#527C70]"
                  >
                    <option value="Modern World History">Modern World History</option>
                    <option value="Cellular Biology">Cellular Biology & Genetics</option>
                    <option value="Philosophy & Ethics">Philosophy & Ethics</option>
                    <option value="Economics">Macroeconomics</option>
                    <option value="Computer Science">Computer Science & Architecture</option>
                    <option value="Literature">Comparative Literature</option>
                  </select>
                </div>
              </div>

              {/* Rubric Picker & Max Marks */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#26332F] mb-1">
                    Grading Rubric <span className="text-[#A84B46]">*</span>
                  </label>
                  <select
                    value={selectedRubricId}
                    onChange={(e) => setSelectedRubricId(e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-[#F7F7F2] border border-[#E4E7E1] rounded-lg text-[#26332F] focus:outline-none focus:ring-2 focus:ring-[#527C70]/20 focus:border-[#527C70]"
                  >
                    {rubrics.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.title} ({r.criteria.length} criteria)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#26332F] mb-1">
                    Max Marks
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={100}
                    value={maxMarks}
                    onChange={(e) => setMaxMarks(Number(e.target.value))}
                    className="w-full h-9 px-3 text-xs bg-[#F7F7F2] border border-[#E4E7E1] rounded-lg text-[#26332F] font-mono text-center"
                  />
                </div>
              </div>
            </div>

            {/* Group 2: Question & Reference Benchmark */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E4E7E1] text-xs font-bold text-[#26332F] uppercase tracking-wider">
                <HelpCircle className="w-4 h-4 text-[#527C70]" />
                <span>2. Prompt & Reference Benchmark</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#26332F] mb-1">
                  Question / Assessment Prompt <span className="text-[#A84B46]">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={questionPrompt}
                  onChange={(e) => setQuestionPrompt(e.target.value)}
                  placeholder="Enter the prompt that student was tasked to answer descriptively..."
                  className="w-full p-3 text-xs bg-[#F7F7F2] border border-[#E4E7E1] rounded-lg text-[#26332F] focus:outline-none focus:ring-2 focus:ring-[#527C70]/20 focus:border-[#527C70] resize-y"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#26332F] mb-1 flex items-center justify-between">
                  <span>Reference Answer / Benchmark Concepts (Optional)</span>
                  <span className="text-[11px] text-[#68756F] font-normal">
                    Used for concept coverage detection
                  </span>
                </label>
                <textarea
                  rows={2}
                  value={referenceAnswer}
                  onChange={(e) => setReferenceAnswer(e.target.value)}
                  placeholder="Outline ideal model answer concepts, terminology, or expected argument steps..."
                  className="w-full p-3 text-xs bg-[#F7F7F2] border border-[#E4E7E1] rounded-lg text-[#26332F] focus:outline-none focus:ring-2 focus:ring-[#527C70]/20 focus:border-[#527C70] resize-y"
                />
              </div>
            </div>

            {/* Group 3: Student Response */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between pb-2 border-b border-[#E4E7E1]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#26332F] uppercase tracking-wider">
                  <FileCheck2 className="w-4 h-4 text-[#527C70]" />
                  <span>3. Student Descriptive Response</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[#68756F] font-mono">
                  <span>{wordCount} words</span>
                  <span>•</span>
                  <span>{charCount} chars</span>
                  <span>•</span>
                  <span>~{estimatedReadTime} min read</span>
                </div>
              </div>

              <div>
                <textarea
                  required
                  rows={8}
                  value={studentAnswer}
                  onChange={(e) => setStudentAnswer(e.target.value)}
                  placeholder="Paste or enter the student's complete descriptive answer text here..."
                  className="w-full p-3.5 text-xs bg-[#F7F7F2] border border-[#E4E7E1] rounded-xl text-[#26332F] focus:outline-none focus:ring-2 focus:ring-[#527C70]/20 focus:border-[#527C70] resize-y font-serif leading-relaxed"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-3 border-t border-[#E4E7E1] flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#68756F] hover:text-[#26332F] hover:bg-[#F7F7F2] rounded-lg border border-transparent hover:border-[#E4E7E1] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Form</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !studentAnswer.trim() || !questionPrompt.trim() || !assignmentTitle.trim()}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#527C70] text-white font-semibold text-xs hover:bg-[#3F655A] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Evaluating Submission...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Evaluate Answer</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Result Area & Rubric Overview (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Rubric Weights Summary Card */}
          <div className="p-5 bg-white border border-[#E4E7E1] rounded-2xl shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#26332F] uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#527C70]" />
                Active Rubric Weights
              </span>
              <span className="text-[11px] font-mono text-[#3F655A] bg-[#EEF3F0] px-2 py-0.5 rounded-md border border-[#D5DFDA] font-semibold">
                {maxMarks} Marks Total
              </span>
            </div>

            <div className="text-xs">
              <p className="font-semibold text-[#26332F]">{activeRubric?.title}</p>
              <p className="text-[#68756F] text-[11px] mt-0.5">{activeRubric?.description}</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#E4E7E1]">
              {activeRubric?.criteria.map((c) => (
                <div key={c.id} className="p-2.5 rounded-lg bg-[#F7F7F2] border border-[#E4E7E1] text-xs">
                  <div className="flex items-center justify-between font-medium text-[#26332F]">
                    <span>{c.name}</span>
                    <span className="font-mono text-[#527C70] font-bold">{c.weight}%</span>
                  </div>
                  <p className="text-[11px] text-[#68756F] mt-0.5">{c.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Results Area */}
          <div className="p-5 bg-white border border-[#E4E7E1] rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#26332F] uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#527C70]" />
                Evaluation Output
              </span>
              {resultItem?.isSample && (
                <span className="text-[10px] font-semibold text-[#68756F] bg-[#F7F7F2] px-2 py-0.5 rounded border border-[#E4E7E1]">
                  Demonstration Preview
                </span>
              )}
            </div>

            {/* Backend Endpoint Notification when endpoint is not yet wired */}
            {apiError && (
              <div className="p-4 rounded-xl bg-[#FBF5EA] border border-[#F2E4CB] text-xs text-[#8B6220] space-y-2">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#B88738] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#8B6220]">Backend Evaluation API Pending</p>
                    <p className="text-[11px] text-[#8B6220] mt-0.5 leading-relaxed">{apiError}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#F2E4CB] flex items-center justify-between">
                  <span className="text-[11px] text-[#8B6220]">Inspect schema output:</span>
                  <button
                    type="button"
                    onClick={handlePreviewSampleResult}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-white text-[#8B6220] border border-[#F2E4CB] rounded-md hover:bg-[#FBF5EA] transition-colors shadow-2xs"
                  >
                    Preview Sample Result Schema
                  </button>
                </div>
              </div>
            )}

            {/* Not evaluated yet empty state */}
            {!resultItem && !apiError && (
              <div className="py-10 px-4 text-center border border-dashed border-[#E4E7E1] rounded-xl bg-[#F7F7F2]/60 space-y-2">
                <Server className="w-8 h-8 text-[#68756F]/60 mx-auto" />
                <p className="text-xs font-semibold text-[#26332F]">No evaluation generated yet</p>
                <p className="text-[11px] text-[#68756F] max-w-xs mx-auto leading-relaxed">
                  Fill in the prompt and student response, then click &quot;Evaluate Answer&quot;. The evaluation engine will score against the rubric dimensions and identify covered concepts.
                </p>
                <button
                  type="button"
                  onClick={handlePreloadSample}
                  className="mt-2 text-xs font-semibold text-[#527C70] hover:text-[#3F655A] underline"
                >
                  Load sample essay to test
                </button>
              </div>
            )}

            {/* Displaying Evaluation Result */}
            {resultItem && (
              <div className="space-y-4 pt-1 text-xs">
                {/* Score & Tier Header */}
                <div className="p-3.5 rounded-xl bg-[#F7F7F2] border border-[#E4E7E1] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#68756F] block">Overall Score</span>
                    <span className="text-2xl font-extrabold text-[#26332F]">{resultItem.score}%</span>
                  </div>
                  <div className="text-right">
                    <ScoreBadge score={resultItem.score} />
                    <span className="text-[10px] text-[#68756F] block mt-1">
                      {Math.round((resultItem.score / 100) * maxMarks)} / {maxMarks} Marks
                    </span>
                  </div>
                </div>

                {/* Concept Coverage Breakdown */}
                {resultItem.coveredConcepts && (
                  <div className="space-y-1.5">
                    <span className="font-semibold text-[#26332F] flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#48735B]" />
                      Detected Covered Concepts
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {resultItem.coveredConcepts.map((c, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-[#EDF4EF] text-[#314E46] border border-[#CDE1D4] text-[10px]">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {resultItem.missingConcepts && (
                  <div className="space-y-1.5">
                    <span className="font-semibold text-[#26332F] flex items-center gap-1 text-[11px]">
                      <AlertCircle className="w-3.5 h-3.5 text-[#B88738]" />
                      Missing / Underdeveloped Concepts
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {resultItem.missingConcepts.map((c, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-[#FBF5EA] text-[#8B6220] border border-[#F2E4CB] text-[10px]">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Criteria Breakdown */}
                <div className="space-y-2 pt-2 border-t border-[#E4E7E1]">
                  <span className="font-semibold text-[#26332F] text-[11px] block">
                    Criteria Marks Breakdown
                  </span>
                  <div className="space-y-2">
                    {resultItem.criteriaScores.map((crit) => (
                      <div key={crit.id} className="p-2 rounded-lg bg-[#F7F7F2] border border-[#E4E7E1] text-[11px] space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-[#26332F]">{crit.name}</span>
                          <span className="font-bold text-[#26332F]">{crit.score}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#EEF3F0] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#527C70] rounded-full"
                            style={{ width: `${crit.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feedback */}
                <div className="p-3 rounded-lg bg-[#F7F7F2] border border-[#E4E7E1] text-[11px] space-y-1">
                  <span className="font-semibold text-[#26332F] block">Feedback Summary</span>
                  <p className="text-[#68756F] leading-relaxed">{resultItem.overallFeedback}</p>
                </div>

                {/* Save to History Button */}
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[10px] text-[#68756F]">
                    {isSaved ? 'Saved to Session History' : 'Save to review later'}
                  </span>
                  <button
                    type="button"
                    onClick={handleSaveResult}
                    disabled={isSaved}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#527C70] text-white font-medium text-xs hover:bg-[#3F655A] disabled:bg-[#48735B] transition-colors shadow-2xs"
                  >
                    {isSaved ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Saved to History</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Save to History</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
