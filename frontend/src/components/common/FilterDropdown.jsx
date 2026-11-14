import React from 'react';
import { Filter } from 'lucide-react';

export default function FilterDropdown({ options, selected, onSelect, label = 'Filter' }) {
  return (
    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60 overflow-x-auto no-scrollbar">
      {options.map((opt) => {
        const val = typeof opt === 'string' ? opt : opt.id;
        const name = typeof opt === 'string' ? opt : opt.label;
        const isActive = selected === val;
        return (
          <button
            key={val}
            onClick={() => onSelect(val)}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              isActive
                ? 'bg-white dark:bg-slate-900 text-cyan-700 dark:text-cyan-400 shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {name}
          </button>
        );
      })}
    </div>
  );
}
