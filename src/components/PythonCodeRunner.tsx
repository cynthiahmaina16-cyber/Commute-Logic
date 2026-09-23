import React, { useState } from 'react';
import { Terminal, Copy, Check, Play, RefreshCw } from 'lucide-react';
import { CommuteVariables, CommuteEvaluationResult } from '../types/commute';
import { generatePythonScript } from '../utils/commuteLogic';

interface PythonCodeRunnerProps {
  variables: CommuteVariables;
  result: CommuteEvaluationResult;
}

export const PythonCodeRunner: React.FC<PythonCodeRunnerProps> = ({
  variables,
  result,
}) => {
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [runTimestamp, setRunTimestamp] = useState<string>('06:12:00.124');

  const { distance_mi, is_raining, has_bike, has_car, has_ride_share_app } = variables;
  const { hitRule, canCommute } = result;

  const scriptCode = generatePythonScript(variables);

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateRun = () => {
    setIsRunning(true);
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now
      .getMilliseconds()
      .toString()
      .padStart(3, '0')}`;
    setTimeout(() => {
      setRunTimestamp(timeStr);
      setIsRunning(false);
    }, 250);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur-md overflow-hidden">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-800 bg-slate-950/70">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <div className="h-3 w-3 rounded-full bg-rose-500/80" />
            <div className="h-3 w-3 rounded-full bg-amber-500/80" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-mono text-slate-300 font-semibold">
            commute_decision.py
          </span>
          <span className="text-[10px] font-mono text-slate-500">Python 3.12</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-md transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleSimulateRun}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors shadow-xs"
          >
            {isRunning ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>Execute</span>
          </button>
        </div>
      </div>

      {/* Code Body with Real-Time Active Line Highlights */}
      <div className="p-4 sm:p-6 bg-slate-950/90 font-mono text-xs sm:text-sm overflow-x-auto leading-relaxed">
        <div className="text-slate-500 mb-2"># --- Step 1: Create the variables ---</div>
        <div className="flex items-center gap-4 py-0.5">
          <span className="text-slate-600 select-none w-6 text-right tabular-nums">1</span>
          <span>
            <span className="text-indigo-400">distance_mi</span> ={' '}
            <span className="text-amber-300 font-semibold">{distance_mi}</span>
          </span>
        </div>
        <div className="flex items-center gap-4 py-0.5">
          <span className="text-slate-600 select-none w-6 text-right tabular-nums">2</span>
          <span>
            <span className="text-indigo-400">is_raining</span> ={' '}
            <span className="text-cyan-300 font-semibold">{is_raining ? 'True' : 'False'}</span>
          </span>
        </div>
        <div className="flex items-center gap-4 py-0.5">
          <span className="text-slate-600 select-none w-6 text-right tabular-nums">3</span>
          <span>
            <span className="text-indigo-400">has_bike</span> ={' '}
            <span className="text-cyan-300 font-semibold">{has_bike ? 'True' : 'False'}</span>
          </span>
        </div>
        <div className="flex items-center gap-4 py-0.5">
          <span className="text-slate-600 select-none w-6 text-right tabular-nums">4</span>
          <span>
            <span className="text-indigo-400">has_car</span> ={' '}
            <span className="text-cyan-300 font-semibold">{has_car ? 'True' : 'False'}</span>
          </span>
        </div>
        <div className="flex items-center gap-4 py-0.5">
          <span className="text-slate-600 select-none w-6 text-right tabular-nums">5</span>
          <span>
            <span className="text-indigo-400">has_ride_share_app</span> ={' '}
            <span className="text-cyan-300 font-semibold">
              {has_ride_share_app ? 'True' : 'False'}
            </span>
          </span>
        </div>

        <div className="text-slate-500 my-3">
          # --- Step 2: Continuous conditional evaluation in ascending order ---
        </div>

        {/* Rule 1 */}
        <div
          className={`rounded-lg transition-colors p-1.5 my-1 ${
            hitRule.ruleNumber === 1
              ? 'bg-emerald-950/50 border border-emerald-500/40 text-white'
              : 'text-slate-300'
          }`}
        >
          <div className="text-slate-500"># Rule 1: Check for falsy distance (e.g., 0)</div>
          <div className="flex items-center gap-4">
            <span className="text-slate-600 select-none w-6 text-right tabular-nums">6</span>
            <span>
              <span className="text-purple-400 font-semibold">if</span>{' '}
              <span className="text-purple-400 font-semibold">not</span> distance_mi:
            </span>
            {hitRule.ruleNumber === 1 && (
              <span className="ml-auto text-[10px] text-emerald-400 font-semibold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                ACTIVE HIT
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 pl-6">
            <span className="text-slate-600 select-none w-6 text-right tabular-nums">7</span>
            <span>
              <span className="text-blue-400">print</span>(
              <span className="text-cyan-300">False</span>)
            </span>
          </div>
        </div>

        {/* Rule 2 */}
        <div
          className={`rounded-lg transition-colors p-1.5 my-1 ${
            hitRule.ruleNumber === 2
              ? 'bg-emerald-950/50 border border-emerald-500/40 text-white'
              : 'text-slate-300'
          }`}
        >
          <div className="text-slate-500"># Rule 2: Less than or equal to 1 mile</div>
          <div className="flex items-center gap-4">
            <span className="text-slate-600 select-none w-6 text-right tabular-nums">8</span>
            <span>
              <span className="text-purple-400 font-semibold">elif</span> distance_mi &lt;={' '}
              <span className="text-amber-300">1</span>:
            </span>
            {hitRule.ruleNumber === 2 && (
              <span className="ml-auto text-[10px] text-emerald-400 font-semibold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                ACTIVE HIT
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 pl-6">
            <span className="text-slate-600 select-none w-6 text-right tabular-nums">9</span>
            <span>
              <span className="text-blue-400">print</span>(
              <span className="text-purple-400 font-semibold">not</span> is_raining)
            </span>
          </div>
        </div>

        {/* Rule 3 */}
        <div
          className={`rounded-lg transition-colors p-1.5 my-1 ${
            hitRule.ruleNumber === 3
              ? 'bg-emerald-950/50 border border-emerald-500/40 text-white'
              : 'text-slate-300'
          }`}
        >
          <div className="text-slate-500">
            # Rule 3: Greater than 1 mile and less than or equal to 6 miles
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-600 select-none w-6 text-right tabular-nums">10</span>
            <span>
              <span className="text-purple-400 font-semibold">elif</span> distance_mi &lt;={' '}
              <span className="text-amber-300">6</span>:
            </span>
            {hitRule.ruleNumber === 3 && (
              <span className="ml-auto text-[10px] text-emerald-400 font-semibold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                ACTIVE HIT
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 pl-6">
            <span className="text-slate-600 select-none w-6 text-right tabular-nums">11</span>
            <span>
              <span className="text-blue-400">print</span>(has_bike{' '}
              <span className="text-purple-400 font-semibold">and not</span> is_raining)
            </span>
          </div>
        </div>

        {/* Rule 4 */}
        <div
          className={`rounded-lg transition-colors p-1.5 my-1 ${
            hitRule.ruleNumber === 4
              ? 'bg-emerald-950/50 border border-emerald-500/40 text-white'
              : 'text-slate-300'
          }`}
        >
          <div className="text-slate-500"># Rule 4: Greater than 6 miles</div>
          <div className="flex items-center gap-4">
            <span className="text-slate-600 select-none w-6 text-right tabular-nums">12</span>
            <span>
              <span className="text-purple-400 font-semibold">else</span>:
            </span>
            {hitRule.ruleNumber === 4 && (
              <span className="ml-auto text-[10px] text-emerald-400 font-semibold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                ACTIVE HIT
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 pl-6">
            <span className="text-slate-600 select-none w-6 text-right tabular-nums">13</span>
            <span>
              <span className="text-blue-400">print</span>(has_car{' '}
              <span className="text-purple-400 font-semibold">or</span> has_ride_share_app)
            </span>
          </div>
        </div>
      </div>

      {/* Terminal REPL Output */}
      <div className="p-4 border-t border-slate-800 bg-black/90 font-mono text-xs">
        <div className="flex items-center justify-between text-slate-500 pb-2 border-b border-slate-800/80 mb-2">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300 font-semibold">STDOUT Terminal</span>
          </div>
          <span className="text-[11px] text-slate-500 tabular-nums">
            Evaluated at {runTimestamp} · Exit code 0
          </span>
        </div>

        <div className="space-y-1">
          <p className="text-slate-400">$ python3 commute_decision.py</p>
          <p
            className={`text-base font-bold tabular-nums pl-2 border-l-2 ${
              canCommute
                ? 'text-emerald-400 border-emerald-500'
                : 'text-rose-400 border-rose-500'
            }`}
          >
            {canCommute ? 'True' : 'False'}
          </p>
          <p className="text-[11px] text-slate-500 pl-2">
            # Triggered by Rule {hitRule.ruleNumber} ({hitRule.title})
          </p>
        </div>
      </div>
    </div>
  );
};
