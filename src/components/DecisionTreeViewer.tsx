import React from 'react';
import { GitBranch, ArrowRight, CornerDownRight, Check, X, ShieldAlert } from 'lucide-react';
import { CommuteEvaluationResult, CommuteVariables } from '../types/commute';

interface DecisionTreeViewerProps {
  variables: CommuteVariables;
  result: CommuteEvaluationResult;
}

export const DecisionTreeViewer: React.FC<DecisionTreeViewerProps> = ({
  variables,
  result,
}) => {
  const { distance_mi, is_raining, has_bike, has_car, has_ride_share_app } = variables;
  const { hitRule } = result;

  const isRule1Hit = hitRule.ruleNumber === 1;
  const isRule2Hit = hitRule.ruleNumber === 2;
  const isRule3Hit = hitRule.ruleNumber === 3;
  const isRule4Hit = hitRule.ruleNumber === 4;

  const isDistFalsy = !distance_mi || distance_mi <= 0;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-800 gap-2">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
            Continuous Ascending Conditional Evaluation Tree
          </h3>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span> Active Branch
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-slate-600"></span> Skipped / Not Reached
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Node 1: Rule 1 */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            isRule1Hit
              ? 'border-indigo-500 bg-indigo-950/40 shadow-lg shadow-indigo-950/30 ring-1 ring-indigo-500/50'
              : 'border-slate-800 bg-slate-950/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-semibold">
                Rule 1 · if not distance_mi
              </span>
              {isRule1Hit && (
                <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                  ● HIT & TERMINATED
                </span>
              )}
            </div>
            <span className="text-xs font-mono text-slate-400">
              Evaluates: <code className="text-white">not ({distance_mi})</code> &rarr;{' '}
              <strong className={isDistFalsy ? 'text-amber-400' : 'text-slate-300'}>
                {isDistFalsy ? 'True' : 'False'}
              </strong>
            </span>
          </div>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div
              className={`p-2.5 rounded-lg border ${
                isRule1Hit
                  ? 'border-emerald-500/60 bg-emerald-950/40 text-emerald-200'
                  : 'border-slate-800/80 bg-slate-900/40 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 font-semibold">
                  <CornerDownRight className="w-3.5 h-3.5" /> Condition True
                </span>
                <span className="font-bold">print(False)</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-sans">
                Falsy distance triggers immediate exit. Commute = False.
              </p>
            </div>

            <div
              className={`p-2.5 rounded-lg border ${
                !isRule1Hit
                  ? 'border-indigo-500/40 bg-indigo-950/30 text-indigo-200'
                  : 'border-slate-800/80 bg-slate-900/40 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 font-semibold">
                  <ArrowRight className="w-3.5 h-3.5" /> Condition False
                </span>
                <span>Proceed to elif</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-sans">
                Distance is truthy ({distance_mi} &gt; 0). Flow cascades to Rule 2.
              </p>
            </div>
          </div>
        </div>

        {/* Node 2: Rule 2 */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            isRule2Hit
              ? 'border-indigo-500 bg-indigo-950/40 shadow-lg shadow-indigo-950/30 ring-1 ring-indigo-500/50'
              : isRule1Hit
              ? 'border-slate-800/50 bg-slate-950/20 opacity-40'
              : 'border-slate-800 bg-slate-950/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-semibold">
                Rule 2 · elif distance_mi &le; 1
              </span>
              {isRule2Hit && (
                <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                  ● HIT & TERMINATED
                </span>
              )}
            </div>
            <span className="text-xs font-mono text-slate-400">
              Evaluates: <code className="text-white">{distance_mi} &le; 1</code> &rarr;{' '}
              <strong className={distance_mi <= 1 ? 'text-amber-400' : 'text-slate-300'}>
                {distance_mi <= 1 ? 'True' : 'False'}
              </strong>
            </span>
          </div>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div
              className={`p-2.5 rounded-lg border ${
                isRule2Hit
                  ? 'border-emerald-500/60 bg-emerald-950/40 text-emerald-200'
                  : 'border-slate-800/80 bg-slate-900/40 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 font-semibold">
                  <CornerDownRight className="w-3.5 h-3.5" /> Condition True
                </span>
                <span className="font-bold">print(not is_raining)</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-sans">
                {is_raining ? 'Raining -> not True -> False' : 'Clear skies -> not False -> True'}
              </p>
            </div>

            <div
              className={`p-2.5 rounded-lg border ${
                !isRule1Hit && !isRule2Hit
                  ? 'border-indigo-500/40 bg-indigo-950/30 text-indigo-200'
                  : 'border-slate-800/80 bg-slate-900/40 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 font-semibold">
                  <ArrowRight className="w-3.5 h-3.5" /> Condition False
                </span>
                <span>Proceed to Rule 3</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-sans">
                Distance &gt; 1 mi. Cascades to cycling evaluation.
              </p>
            </div>
          </div>
        </div>

        {/* Node 3: Rule 3 */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            isRule3Hit
              ? 'border-indigo-500 bg-indigo-950/40 shadow-lg shadow-indigo-950/30 ring-1 ring-indigo-500/50'
              : isRule1Hit || isRule2Hit
              ? 'border-slate-800/50 bg-slate-950/20 opacity-40'
              : 'border-slate-800 bg-slate-950/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-semibold">
                Rule 3 · elif distance_mi &le; 6
              </span>
              {isRule3Hit && (
                <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                  ● HIT & TERMINATED
                </span>
              )}
            </div>
            <span className="text-xs font-mono text-slate-400">
              Evaluates: <code className="text-white">{distance_mi} &le; 6</code> &rarr;{' '}
              <strong className={distance_mi <= 6 ? 'text-amber-400' : 'text-slate-300'}>
                {distance_mi <= 6 ? 'True' : 'False'}
              </strong>
            </span>
          </div>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div
              className={`p-2.5 rounded-lg border ${
                isRule3Hit
                  ? 'border-emerald-500/60 bg-emerald-950/40 text-emerald-200'
                  : 'border-slate-800/80 bg-slate-900/40 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 font-semibold">
                  <CornerDownRight className="w-3.5 h-3.5" /> Condition True
                </span>
                <span className="font-bold">print(has_bike and not is_raining)</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-sans">
                {has_bike ? 'Bike: True' : 'Bike: False'} &amp;{' '}
                {!is_raining ? 'Dry: True' : 'Rain: False'} &rarr;{' '}
                <strong className={has_bike && !is_raining ? 'text-emerald-400' : 'text-rose-400'}>
                  {has_bike && !is_raining ? 'True' : 'False'}
                </strong>
              </p>
            </div>

            <div
              className={`p-2.5 rounded-lg border ${
                !isRule1Hit && !isRule2Hit && !isRule3Hit
                  ? 'border-indigo-500/40 bg-indigo-950/30 text-indigo-200'
                  : 'border-slate-800/80 bg-slate-900/40 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 font-semibold">
                  <ArrowRight className="w-3.5 h-3.5" /> Condition False
                </span>
                <span>Proceed to else</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-sans">
                Distance &gt; 6 mi. Cascades to motorized long-distance check.
              </p>
            </div>
          </div>
        </div>

        {/* Node 4: Rule 4 (else) */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            isRule4Hit
              ? 'border-indigo-500 bg-indigo-950/40 shadow-lg shadow-indigo-950/30 ring-1 ring-indigo-500/50'
              : 'border-slate-800/50 bg-slate-950/20 opacity-40'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-semibold">
                Rule 4 · else (distance_mi &gt; 6)
              </span>
              {isRule4Hit && (
                <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                  ● HIT & TERMINATED
                </span>
              )}
            </div>
            <span className="text-xs font-mono text-slate-400">
              Evaluates: <code className="text-white">has_car or has_ride_share_app</code>
            </span>
          </div>

          <div className="mt-3 p-3 rounded-lg border border-slate-800/90 bg-slate-900/50 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">
                Action: <span className="text-white font-bold">print(has_car or has_ride_share_app)</span>
              </span>
              <span
                className={`font-bold text-sm ${
                  has_car || has_ride_share_app ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                Output: {has_car || has_ride_share_app ? 'True' : 'False'}
              </span>
            </div>
            <div className="mt-2 text-slate-400 flex items-center gap-2 text-[11px] font-sans">
              <span>Car: {has_car ? 'True' : 'False'}</span>
              <span>·</span>
              <span>Ride-Share App: {has_ride_share_app ? 'True' : 'False'}</span>
              <span>·</span>
              <span>Weather: irrelevant for motorized transit under Rule 4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
