import React from 'react';
import { LucideIcon, FolderSearch } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon = FolderSearch,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-[#E4E7E1] rounded-2xl bg-white/70 ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-[#EEF3F0] border border-[#D5DFDA] flex items-center justify-center text-[#527C70] mb-4 shadow-xs">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-[#26332F] mb-1.5">{title}</h3>
      <p className="text-sm text-[#68756F] max-w-md leading-relaxed mb-6">{description}</p>
      
      {(actionLabel || secondaryActionLabel) && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-xl bg-[#527C70] text-white hover:bg-[#3F655A] transition-colors shadow-xs active:scale-[0.98]"
            >
              {actionLabel}
            </button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <button
              onClick={onSecondaryAction}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-xl bg-white text-[#26332F] border border-[#E4E7E1] hover:bg-[#F7F7F2] transition-colors shadow-2xs"
            >
              {secondaryActionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
