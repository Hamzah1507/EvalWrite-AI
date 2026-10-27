'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  EvaluationItem,
  RubricDefinition,
  BackendCapabilities,
} from '@/types/evaluation';
import { mockRecentEvaluations, mockRubrics } from '@/data/mockData';

interface EvaluationContextType {
  evaluations: EvaluationItem[];
  addEvaluation: (item: EvaluationItem) => void;
  rubrics: RubricDefinition[];
  addRubric: (rubric: RubricDefinition) => void;
  updateRubric: (id: string, rubric: Partial<RubricDefinition>) => void;
  deleteRubric: (id: string) => void;
  showSampleData: boolean;
  setShowSampleData: (show: boolean) => void;
  backendStatus: BackendCapabilities;
}

const EvaluationContext = createContext<EvaluationContextType | undefined>(undefined);

export function EvaluationProvider({ children }: { children: React.ReactNode }) {
  const [showSampleData, setShowSampleData] = useState<boolean>(true);
  const [userEvaluations, setUserEvaluations] = useState<EvaluationItem[]>([]);
  const [rubrics, setRubrics] = useState<RubricDefinition[]>(mockRubrics);
  const [backendStatus, setBackendStatus] = useState<BackendCapabilities>({
    apiHealth: 'checking',
    nlpEngine: 'not_implemented',
    database: 'session_only',
    endpoint: 'http://127.0.0.1:8000',
  });

  useEffect(() => {
    let isCancelled = false;

    async function probeBackend() {
      try {
        const res = await fetch('http://127.0.0.1:8000/health', {
          method: 'GET',
          headers: { Accept: 'application/json' },
        });

        if (!isCancelled) {
          setBackendStatus({
            apiHealth: res.ok ? 'connected' : 'offline',
            nlpEngine: 'not_implemented',
            database: 'session_only',
            endpoint: 'http://127.0.0.1:8000',
          });
        }
      } catch {
        if (!isCancelled) {
          setBackendStatus({
            apiHealth: 'offline',
            nlpEngine: 'not_implemented',
            database: 'session_only',
            endpoint: 'http://127.0.0.1:8000',
          });
        }
      }
    }

    void probeBackend();
    const interval = setInterval(probeBackend, 30000);
    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, []);

  const addEvaluation = (item: EvaluationItem) => {
    setUserEvaluations((prev) => [item, ...prev]);
  };

  const addRubric = (newRubric: RubricDefinition) => {
    setRubrics((prev) => [newRubric, ...prev]);
  };

  const updateRubric = (id: string, updated: Partial<RubricDefinition>) => {
    setRubrics((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updated } : r))
    );
  };

  const deleteRubric = (id: string) => {
    setRubrics((prev) => prev.filter((r) => r.id !== id));
  };

  // Combine user evaluations with sample data if demonstration mode is enabled
  const displayedEvaluations = showSampleData
    ? [...userEvaluations, ...mockRecentEvaluations]
    : userEvaluations;

  return (
    <EvaluationContext.Provider
      value={{
        evaluations: displayedEvaluations,
        addEvaluation,
        rubrics,
        addRubric,
        updateRubric,
        deleteRubric,
        showSampleData,
        setShowSampleData,
        backendStatus,
      }}
    >
      {children}
    </EvaluationContext.Provider>
  );
}

export function useEvaluation() {
  const context = useContext(EvaluationContext);
  if (!context) {
    throw new Error('useEvaluation must be used within an EvaluationProvider');
  }
  return context;
}
