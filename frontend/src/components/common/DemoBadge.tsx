import { Sparkles } from 'lucide-react';

interface SampleBadgeProps {
  className?: string;
  label?: string;
}

export function SampleBadge({ className = '', label = 'Demonstration Record' }: SampleBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-slate-100 text-slate-600 border border-slate-200 ${className}`}
    >
      <Sparkles className="w-3 h-3 text-slate-400" />
      <span>{label}</span>
    </span>
  );
}
