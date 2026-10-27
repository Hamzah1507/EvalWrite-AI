import React from 'react';
import { EvaluationStatus } from '@/types/evaluation';
import { CheckCircle2, Clock, AlertTriangle, Loader2 } from 'lucide-react';

interface StatusBadgeProps {
  status: EvaluationStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const configs = {
    completed: {
      label: 'Evaluated',
      bg: 'bg-[#EDF4EF] text-[#48735B] border-[#CDE1D4]',
      icon: CheckCircle2,
      dot: 'bg-[#48735B]',
    },
    pending_review: {
      label: 'Pending Review',
      bg: 'bg-[#FBF5EA] text-[#B88738] border-[#F2E4CB]',
      icon: Clock,
      dot: 'bg-[#B88738]',
    },
    flagged: {
      label: 'Flagged for Human',
      bg: 'bg-[#FBF0EF] text-[#A84B46] border-[#F2D2D0]',
      icon: AlertTriangle,
      dot: 'bg-[#A84B46]',
    },
    processing: {
      label: 'NLP Scoring...',
      bg: 'bg-[#EEF3F0] text-[#3F655A] border-[#D5DFDA]',
      icon: Loader2,
      dot: 'bg-[#527C70]',
    },
  };

  const config = configs[status] || configs.completed;
  const Icon = config.icon;
  const isSm = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-full ${config.bg} ${
        isSm ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <Icon className={`w-3.5 h-3.5 ${status === 'processing' ? 'animate-spin' : ''}`} />
      <span>{config.label}</span>
    </span>
  );
}
