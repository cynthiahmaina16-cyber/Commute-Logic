import React from 'react';
import { RotateCcw, Shuffle } from 'lucide-react';

export type ActiveTab = 'simulator' | 'flowchart' | 'code' | 'matrix' | 'testsuite';

interface TopBarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onResetDefaults: () => void;
  onRandomize: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  onResetDefaults,
  onRandomize,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <span className="text-base sm:text-lg font-bold tracking-tight text-white font-sans">
            Commute Logic
          </span>
          <span className="hidden sm:inline text-xs text-slate-500 font-mono">
            v3.8 · conditional evaluator
          </span>
        </div>

        {/* Zone 2: 4-5 clean single-line nav tabs */}
        <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            type="button"
            onClick={() => setActiveTab('simulator')}
            className={`whitespace-nowrap px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors rounded-md ${
              activeTab === 'simulator'
                ? 'bg-slate-800 text-white shadow-xs font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Simulator
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('flowchart')}
            className={`whitespace-nowrap px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors rounded-md ${
              activeTab === 'flowchart'
                ? 'bg-slate-800 text-white shadow-xs font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Decision Tree
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`whitespace-nowrap px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors rounded-md ${
              activeTab === 'code'
                ? 'bg-slate-800 text-white shadow-xs font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Python Trace & REPL
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('matrix')}
            className={`whitespace-nowrap px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors rounded-md ${
              activeTab === 'matrix'
                ? 'bg-slate-800 text-white shadow-xs font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Truth Matrix
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('testsuite')}
            className={`whitespace-nowrap px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors rounded-md ${
              activeTab === 'testsuite'
                ? 'bg-slate-800 text-white shadow-xs font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Test Suite
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRandomize}
            title="Randomize input parameters"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors whitespace-nowrap"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Randomize</span>
          </button>
          <button
            type="button"
            onClick={onResetDefaults}
            title="Reset to original Python prompt values"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors whitespace-nowrap shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Script Defaults</span>
          </button>
        </div>
      </div>
    </header>
  );
};
