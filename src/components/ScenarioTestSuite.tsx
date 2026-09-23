import React, { useState } from 'react';
import { CheckCircle2, Play, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { CommuteVariables, PresetScenario } from '../types/commute';
import { PRESET_SCENARIOS, evaluateCommuteLogic } from '../utils/commuteLogic';

interface ScenarioTestSuiteProps {
  onSelectScenario: (vars: CommuteVariables) => void;
  currentVariables: CommuteVariables;
}

export const ScenarioTestSuite: React.FC<ScenarioTestSuiteProps> = ({
  onSelectScenario,
  currentVariables,
}) => {
  const [suiteResults, setSuiteResults] = useState<{
    [id: string]: { passed: boolean; actualResult: boolean; hitRuleNumber: number };
  }>(() => {
    const init: { [id: string]: { passed: boolean; actualResult: boolean; hitRuleNumber: number } } = {};
    for (const sc of PRESET_SCENARIOS) {
      const evalRes = evaluateCommuteLogic(sc.variables);
      init[sc.id] = {
        passed: evalRes.canCommute === sc.expectedResult,
        actualResult: evalRes.canCommute,
        hitRuleNumber: evalRes.hitRule.ruleNumber,
      };
    }
    return init;
  });

  const [isRunning, setIsRunning] = useState(false);

  const handleRunAll = () => {
    setIsRunning(true);
    setTimeout(() => {
      const nextResults: {
        [id: string]: { passed: boolean; actualResult: boolean; hitRuleNumber: number };
      } = {};
      for (const sc of PRESET_SCENARIOS) {
        const evalRes = evaluateCommuteLogic(sc.variables);
        nextResults[sc.id] = {
          passed: evalRes.canCommute === sc.expectedResult,
          actualResult: evalRes.canCommute,
          hitRuleNumber: evalRes.hitRule.ruleNumber,
        };
      }
      setSuiteResults(nextResults);
      setIsRunning(false);
    }, 200);
  };

  const allPassed = Object.values(suiteResults).every((r) => r.passed);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
              Scenario Test Suite & Invariant Verification
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated regression validation of all conditional branches against expected Python prints.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {Object.values(suiteResults).filter((r) => r.passed).length} /{' '}
              {PRESET_SCENARIOS.length} Invariants Passed
            </span>
          </div>

          <button
            type="button"
            onClick={handleRunAll}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors whitespace-nowrap shadow-xs"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>{isRunning ? 'Running...' : 'Re-verify Suite'}</span>
          </button>
        </div>
      </div>

      {/* Grid of Scenarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PRESET_SCENARIOS.map((scenario) => {
          const res = suiteResults[scenario.id];
          const isCurrentlyActive =
            currentVariables.distance_mi === scenario.variables.distance_mi &&
            currentVariables.is_raining === scenario.variables.is_raining &&
            currentVariables.has_bike === scenario.variables.has_bike &&
            currentVariables.has_car === scenario.variables.has_car &&
            currentVariables.has_ride_share_app === scenario.variables.has_ride_share_app;

          return (
            <div
              key={scenario.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                isCurrentlyActive
                  ? 'border-indigo-500 bg-indigo-950/30 ring-1 ring-indigo-500/50'
                  : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-white font-sans">
                    {scenario.name}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-mono">
                    <span className="text-slate-400">Yields:</span>
                    <span
                      className={`font-bold ${
                        scenario.expectedResult ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {scenario.expectedResult ? 'True' : 'False'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mb-3">{scenario.description}</p>

                {/* Variable chips */}
                <div className="flex flex-wrap gap-1.5 mb-3 text-[10px] font-mono text-slate-300">
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                    d={scenario.variables.distance_mi}mi
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                    rain={scenario.variables.is_raining ? 'T' : 'F'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                    bike={scenario.variables.has_bike ? 'T' : 'F'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                    car={scenario.variables.has_car ? 'T' : 'F'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                    app={scenario.variables.has_ride_share_app ? 'T' : 'F'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                    Rule {res ? res.hitRuleNumber : '?'}
                  </span>
                  {res && res.passed && (
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Invariant Verified
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onSelectScenario(scenario.variables)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
                >
                  <span>Load</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Mode Showcase Cards (Integrating generated images) */}
      <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Bicycle Transit Showcase */}
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row">
          <div className="relative h-28 sm:h-auto sm:w-1/3 shrink-0 bg-slate-900 overflow-hidden">
            <img
              src="/src/assets/images/mode_bicycle_transit_1790169079669.jpg"
              alt="Commuter bicycle ready for urban transit"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div className="p-3.5 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-400">
              <span>Rule 3 Subsystem</span>
              <span>·</span>
              <span>1 to 6 Miles</span>
            </div>
            <h4 className="text-xs font-semibold text-white mt-0.5">
              Active Bicycle Commute Boundary
            </h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Requires both equipment availability (<code className="text-slate-300">has_bike</code>) and dry weather (<code className="text-slate-300">not is_raining</code>).
            </p>
          </div>
        </div>

        {/* Rideshare Vehicle Showcase */}
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row">
          <div className="relative h-28 sm:h-auto sm:w-1/3 shrink-0 bg-slate-900 overflow-hidden">
            <img
              src="/src/assets/images/mode_rideshare_vehicle_1790169090473.jpg"
              alt="Electric rideshare vehicle arriving in rain"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div className="p-3.5 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-[11px] font-mono text-violet-400">
              <span>Rule 4 Subsystem</span>
              <span>·</span>
              <span>&gt; 6 Miles</span>
            </div>
            <h4 className="text-xs font-semibold text-white mt-0.5">
              Motorized Transit Fallback
            </h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Feasible if either <code className="text-slate-300">has_car</code> or <code className="text-slate-300">has_ride_share_app</code> is True, weather-agnostic.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
