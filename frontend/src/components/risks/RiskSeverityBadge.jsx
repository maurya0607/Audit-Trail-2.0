import React from 'react';
import { getRiskSeverity } from '../../utils/helpers';

export default function RiskSeverityBadge({ score }) {
  const meta = getRiskSeverity(score);
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${meta.color}`}>
      {meta.label} ({score}/100)
    </span>
  );
}
