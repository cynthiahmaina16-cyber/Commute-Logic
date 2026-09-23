/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { CommuteVariables } from './types/commute';
import {
  DEFAULT_COMMUTE_VARIABLES,
  evaluateCommuteLogic,
} from './utils/commuteLogic';
import { TopBar, ActiveTab } from './components/TopBar';
import { InteractiveStage } from './components/InteractiveStage';
import { VariablesControlDeck } from './components/VariablesControlDeck';
import { DecisionTreeViewer } from './components/DecisionTreeViewer';
import { PythonCodeRunner } from './components/PythonCodeRunner';
import { TruthMatrix } from './components/TruthMatrix';
import { ScenarioTestSuite } from './components/ScenarioTestSuite';
import { Code2, GitFork, Sparkles, BookOpen } from 'lucide-react';

export default function App() {
  const [variables, setVariables] = useState<CommuteVariables>(
    DEFAULT_COMMUTE_VARIABLES
  );
  const [activeTab, setActiveTab] = useState<ActiveTab>('simulator');

  const result = useMemo(() => evaluateCommuteLogic(variables), [variables]);

  const handleResetDefaults = () => {
    setVariables(DEFAULT_COMMUTE_VARIABLES);
  };

  const handleRandomize = () => {
    const randomDistances = [0, 0.5, 0.8, 1.0, 2.5, 4.0, 6.0, 8.5, 10.0, 15.0, 22.0];
    const randDist =
      randomDistances[Math.floor(Math.random() * randomDistances.length)];
    setVariables({
      distance_mi: randDist,
      is_raining: Math.random() > 0.5,
      has_bike: Math.random() > 0.5,
      has_car: Math.random() > 0.5,
      has_ride_share_app: Math.random() > 0.5,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* 3-Zone Standard Top Navigation Bar */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetDefaults={handleResetDefaults}
        onRandomize={handleRandomize}
      />

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Intro Kicker & Summary Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-900">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <span>Python Commute Evaluator</span>
              <span aria-hidden="true">·</span>
              <span>Ascending Conditional Logic</span>
              <span aria-hidden="true">·</span>
              <span className="text-indigo-400 font-semibold">
                Status: {result.canCommute ? 'Commutable' : 'Non-Commutable'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
              Multi-Modal Travel Decision Engine
            </h1>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-mono text-slate-400">Current Trigger:</span>
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-indigo-300">
              Rule {result.hitRule.ruleNumber}: {result.hitRule.title}
            </span>
          </div>
        </div>

        {/* Tab 1: Primary Simulator View */}
        {activeTab === 'simulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Zone: Visual Simulation Stage (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <InteractiveStage variables={variables} result={result} />

              {/* Inline Quick Logic Summary Callout */}
              <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-300 mb-2">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  <span>ALGORITHM SPECIFICATION</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-400">
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60">
                    <span className="font-semibold text-slate-200 block font-mono text-[11px]">
                      Rule 1 · not distance_mi
                    </span>
                    <span className="text-[11px]">
                      Falsy distance (0) prints <code className="text-rose-400">False</code>.
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60">
                    <span className="font-semibold text-slate-200 block font-mono text-[11px]">
                      Rule 2 · &le; 1 mile
                    </span>
                    <span className="text-[11px]">
                      Walkable if <code className="text-cyan-400">not is_raining</code>.
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60">
                    <span className="font-semibold text-slate-200 block font-mono text-[11px]">
                      Rule 3 · &le; 6 miles
                    </span>
                    <span className="text-[11px]">
                      Bikeable if <code className="text-cyan-400">has_bike and not is_raining</code>.
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/60">
                    <span className="font-semibold text-slate-200 block font-mono text-[11px]">
                      Rule 4 · else (&gt; 6 mi)
                    </span>
                    <span className="text-[11px]">
                      Motorized if <code className="text-cyan-400">has_car or has_ride_share_app</code>.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Zone: Variable Control Deck (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <VariablesControlDeck
                variables={variables}
                onChange={setVariables}
              />

              {/* Live Python STDOUT Quick Card */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                    <Code2 className="w-3.5 h-3.5 text-emerald-400" /> Live Script Evaluation
                  </span>
                  <span className="text-[11px]">STDOUT</span>
                </div>
                <div className="p-3 rounded-lg bg-black/80 border border-slate-800">
                  <div className="text-slate-500 mb-1">$ python commute.py</div>
                  <div
                    className={`text-lg font-bold ${
                      result.canCommute ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {result.canCommute ? 'True' : 'False'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Decision Tree View */}
        {activeTab === 'flowchart' && (
          <div className="space-y-6">
            <DecisionTreeViewer variables={variables} result={result} />
            <VariablesControlDeck
              variables={variables}
              onChange={setVariables}
            />
          </div>
        )}

        {/* Tab 3: Python Trace & REPL */}
        {activeTab === 'code' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7">
              <PythonCodeRunner variables={variables} result={result} />
            </div>
            <div className="lg:col-span-5">
              <VariablesControlDeck
                variables={variables}
                onChange={setVariables}
              />
            </div>
          </div>
        )}

        {/* Tab 4: Truth Matrix */}
        {activeTab === 'matrix' && (
          <TruthMatrix
            currentVariables={variables}
            onSelectRow={(vars) => {
              setVariables(vars);
              setActiveTab('simulator');
            }}
          />
        )}

        {/* Tab 5: Test Suite */}
        {activeTab === 'testsuite' && (
          <ScenarioTestSuite
            currentVariables={variables}
            onSelectScenario={(vars) => {
              setVariables(vars);
              setActiveTab('simulator');
            }}
          />
        )}
      </main>

      {/* Clean Unboxed Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Commute Logic Engine</span>
            <span aria-hidden="true">·</span>
            <span>Ascending conditional evaluation simulator</span>
          </div>

          <div className="flex items-center gap-3">
            <span>Distance Thresholds: 0 · 1 · 6 mi</span>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={handleResetDefaults}
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Reset to Prompt Defaults
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
