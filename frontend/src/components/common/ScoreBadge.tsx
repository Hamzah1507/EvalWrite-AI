import React from 'react';

interface ScoreBadgeProps {
  score: number; // 0 - 100
  showGrade?: boolean;
}

export function ScoreBadge({ score, showGrade = true }: ScoreBadgeProps) {
  let colorStyles = 'bg-[#EEF3F0] text-[#527C70] border-[#D5DFDA]';
  let grade = 'A';

  if (score >= 90) {
    colorStyles = 'bg-[#EDF4EF] text-[#314E46] border-[#CDE1D4]';
    grade = 'A+';
  } else if (score >= 80) {
    colorStyles = 'bg-[#EEF3F0] text-[#3F655A] border-[#D5DFDA]';
    grade = 'A-';
  } else if (score >= 70) {
    colorStyles = 'bg-[#EEF3F0] text-[#527C70] border-[#D5DFDA]';
    grade = 'B';
  } else if (score >= 60) {
    colorStyles = 'bg-[#FBF5EA] text-[#B88738] border-[#F2E4CB]';
    grade = 'C';
  } else {
    colorStyles = 'bg-[#FBF0EF] text-[#A84B46] border-[#F2D2D0]';
    grade = 'D/F';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${colorStyles}`}
    >
      <span>{score}%</span>
      {showGrade && <span className="opacity-75 font-mono">({grade})</span>}
    </span>
  );
}
