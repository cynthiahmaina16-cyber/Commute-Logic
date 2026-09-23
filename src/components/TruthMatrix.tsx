import React, { useState, useMemo } from 'react';
import { Table, Filter, CheckCircle2, XCircle, ArrowUpRight } from 'lucide-react';
import { CommuteVariables } from '../types/commute';
import { generateTruthMatrix, TruthRow } from '../utils/commuteLogic';

interface TruthMatrixProps {
  currentVariables: CommuteVariables;
  onSelectRow: (vars: CommuteVariables) => void;
}

export const TruthMatrix: React.FC<TruthMatrixProps> = ({
  currentVariables,
  onSelectRow,
}) => {
  const [filter, setFilter] = useState<'all' | 'true' | 'false' | 'rain' | 'bike'>('all');
  const [searchDist, setSearchDist] = useState<string>('all');

  const allRows = useMemo(() => generateTruthMatrix(), []);

  const filteredRows = useMemo(() => {
    return allRows.filter((row) => {
      // Distance filter
      if (searchDist !== 'all') {
        if (searchDist === '0' && row.distanceVal !== 0) return false;
        if (searchDist === 'walk' && row.distanceVal !== 0.8) return false;
        if (searchDist === 'bike' && row.distanceVal !== 4.0) return false;
        if (searchDist === 'long' && row.distanceVal !== 10.0) return false;
      }

      // Category filter
      if (filter === 'true') return row.output === true;
      if (filter === 'false') return row.output === false;
      if (filter === 'rain') return row.is_raining === true;
      if (filter === 'bike') return row.has_bike === true;
      return true;
    });
  }, [allRows, filter, searchDist]);

  const totalTrue = allRows.filter((r) => r.output).length;
  const truePercent = ((totalTrue / allRows.length) * 100).toFixed(1);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl backdrop-blur-md p-5 sm:p-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
              Permutation Truth Matrix ({allRows.length} States)
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 font-mono">
            <span>Overall Feasibility:</span>
            <span className="font-semibold text-emerald-400 tabular-nums">
              {totalTrue} / {allRows.length} ({truePercent}%)
            </span>
            <span>·</span>
            <span>Click any row to test in simulator</span>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <Filter className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors ${
                filter === 'all'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilter('true')}
              className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors ${
                filter === 'true'
                  ? 'bg-emerald-950 text-emerald-300 font-semibold border border-emerald-800'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              True ({totalTrue})
            </button>
            <button
              type="button"
              onClick={() => setFilter('false')}
              className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors ${
                filter === 'false'
                  ? 'bg-rose-950 text-rose-300 font-semibold border border-rose-800'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              False ({allRows.length - totalTrue})
            </button>
            <button
              type="button"
              onClick={() => setFilter('rain')}
              className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors ${
                filter === 'rain'
                  ? 'bg-blue-950 text-blue-300 font-semibold border border-blue-800'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Rain Only
            </button>
          </div>

          {/* Distance quick select */}
          <select
            value={searchDist}
            onChange={(e) => setSearchDist(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-mono bg-slate-950 border border-slate-800 text-slate-300 rounded-lg focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Distances</option>
            <option value="0">0 mi (Falsy)</option>
            <option value="walk">0.8 mi (&le; 1 mi)</option>
            <option value="bike">4.0 mi (&le; 6 mi)</option>
            <option value="long">10.0 mi (&gt; 6 mi)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-[440px] rounded-xl border border-slate-800 bg-slate-950/60">
        <table className="w-full text-left text-xs font-mono">
          <thead className="sticky top-0 bg-slate-900 border-b border-slate-800 text-slate-300 z-10">
            <tr>
              <th className="py-2.5 px-3">Distance</th>
              <th className="py-2.5 px-3">is_raining</th>
              <th className="py-2.5 px-3">has_bike</th>
              <th className="py-2.5 px-3">has_car</th>
              <th className="py-2.5 px-3">has_ride_app</th>
              <th className="py-2.5 px-3">Hit Rule</th>
              <th className="py-2.5 px-3 text-right">Result</th>
              <th className="py-2.5 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredRows.map((row) => {
              const isCurrent =
                row.distanceVal === currentVariables.distance_mi &&
                row.is_raining === currentVariables.is_raining &&
                row.has_bike === currentVariables.has_bike &&
                row.has_car === currentVariables.has_car &&
                row.has_ride_share_app === currentVariables.has_ride_share_app;

              return (
                <tr
                  key={row.id}
                  onClick={() =>
                    onSelectRow({
                      distance_mi: row.distanceVal,
                      is_raining: row.is_raining,
                      has_bike: row.has_bike,
                      has_car: row.has_car,
                      has_ride_share_app: row.has_ride_share_app,
                    })
                  }
                  className={`cursor-pointer transition-colors group ${
                    isCurrent
                      ? 'bg-indigo-950/60 font-semibold text-white'
                      : 'hover:bg-slate-900/60 text-slate-300'
                  }`}
                >
                  <td className="py-2 px-3 tabular-nums">
                    <span className="flex items-center gap-1.5">
                      {isCurrent && (
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                      )}
                      {row.distanceLabel}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <span className={row.is_raining ? 'text-blue-400' : 'text-slate-500'}>
                      {row.is_raining ? 'True' : 'False'}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <span className={row.has_bike ? 'text-cyan-400' : 'text-slate-500'}>
                      {row.has_bike ? 'True' : 'False'}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <span className={row.has_car ? 'text-indigo-400' : 'text-slate-500'}>
                      {row.has_car ? 'True' : 'False'}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <span
                      className={
                        row.has_ride_share_app ? 'text-violet-400' : 'text-slate-500'
                      }
                    >
                      {row.has_ride_share_app ? 'True' : 'False'}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                      Rule {row.activeRule}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right">
                    <span
                      className={`inline-flex items-center gap-1 font-bold ${
                        row.output ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {row.output ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" />
                      )}
                      <span>{row.output ? 'True' : 'False'}</span>
                    </span>
                  </td>
                  <td className="py-2 px-3 text-center">
                    <button
                      type="button"
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-white rounded bg-slate-800"
                      title="Load into simulator"
                    >
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
