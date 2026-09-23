import React from 'react';
import {
  CloudRain,
  Sun,
  Bike,
  Car,
  Smartphone,
  Gauge,
  Sliders,
} from 'lucide-react';
import { CommuteVariables } from '../types/commute';

interface VariablesControlDeckProps {
  variables: CommuteVariables;
  onChange: (updated: CommuteVariables) => void;
}

export const VariablesControlDeck: React.FC<VariablesControlDeckProps> = ({
  variables,
  onChange,
}) => {
  const { distance_mi, is_raining, has_bike, has_car, has_ride_share_app } = variables;

  const setVariable = <K extends keyof CommuteVariables>(
    key: K,
    val: CommuteVariables[K]
  ) => {
    onChange({ ...variables, [key]: val });
  };

  const quickDistances = [
    { label: '0 mi (Falsy)', value: 0 },
    { label: '0.8 mi (Walk)', value: 0.8 },
    { label: '3.5 mi (Bike)', value: 3.5 },
    { label: '10.0 mi (Prompt)', value: 10 },
    { label: '22.0 mi (Highway)', value: 22 },
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
            Step 1 · Variable Configuration
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">
          5 runtime inputs
        </span>
      </div>

      <div className="space-y-6">
        {/* Variable 1: distance_mi */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="distance-slider"
              className="text-xs font-mono font-medium text-slate-300 flex items-center gap-1.5"
            >
              <Gauge className="w-3.5 h-3.5 text-indigo-400" />
              <span>distance_mi</span>
              <span className="text-slate-500 text-[10px]">float/int</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max="30"
                step="0.1"
                value={distance_mi}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setVariable('distance_mi', isNaN(val) ? 0 : Math.max(0, val));
                }}
                className="w-20 px-2 py-1 text-right text-sm font-mono font-semibold text-white bg-slate-950 border border-slate-800 rounded-md focus:outline-none focus:border-indigo-500 tabular-nums"
              />
              <span className="text-xs text-slate-400 font-mono">mi</span>
            </div>
          </div>

          {/* Slider */}
          <div className="pt-1">
            <input
              id="distance-slider"
              type="range"
              min="0"
              max="25"
              step="0.5"
              value={distance_mi}
              onChange={(e) => setVariable('distance_mi', parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {quickDistances.map((qd) => (
              <button
                key={qd.label}
                type="button"
                onClick={() => setVariable('distance_mi', qd.value)}
                className={`px-2.5 py-1 text-[11px] font-mono rounded-md border transition-all ${
                  distance_mi === qd.value
                    ? 'border-indigo-500 bg-indigo-950/80 text-indigo-200 font-semibold'
                    : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {qd.label}
              </button>
            ))}
          </div>
        </div>

        {/* Binary Toggles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Variable 2: is_raining */}
          <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-medium text-slate-300">
                is_raining
              </span>
              <span className="text-[10px] font-mono text-slate-500">bool</span>
            </div>

            <button
              type="button"
              onClick={() => setVariable('is_raining', !is_raining)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${
                is_raining
                  ? 'border-blue-500/60 bg-blue-950/40 text-blue-200'
                  : 'border-amber-500/50 bg-amber-950/30 text-amber-200'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-medium">
                {is_raining ? (
                  <CloudRain className="w-4 h-4 text-blue-400" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-400" />
                )}
                <span>{is_raining ? 'Precipitation' : 'Dry Skies'}</span>
              </div>
              <span className="text-xs font-mono font-bold">
                {is_raining ? 'True' : 'False'}
              </span>
            </button>
          </div>

          {/* Variable 3: has_bike */}
          <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-medium text-slate-300">
                has_bike
              </span>
              <span className="text-[10px] font-mono text-slate-500">bool</span>
            </div>

            <button
              type="button"
              onClick={() => setVariable('has_bike', !has_bike)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${
                has_bike
                  ? 'border-cyan-500/60 bg-cyan-950/40 text-cyan-200'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-medium">
                <Bike className="w-4 h-4 text-cyan-400" />
                <span>{has_bike ? 'Bike Ready' : 'No Bicycle'}</span>
              </div>
              <span className="text-xs font-mono font-bold">
                {has_bike ? 'True' : 'False'}
              </span>
            </button>
          </div>

          {/* Variable 4: has_car */}
          <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-medium text-slate-300">
                has_car
              </span>
              <span className="text-[10px] font-mono text-slate-500">bool</span>
            </div>

            <button
              type="button"
              onClick={() => setVariable('has_car', !has_car)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${
                has_car
                  ? 'border-indigo-500/60 bg-indigo-950/40 text-indigo-200'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-medium">
                <Car className="w-4 h-4 text-indigo-400" />
                <span>{has_car ? 'Car in Garage' : 'No Vehicle'}</span>
              </div>
              <span className="text-xs font-mono font-bold">
                {has_car ? 'True' : 'False'}
              </span>
            </button>
          </div>

          {/* Variable 5: has_ride_share_app */}
          <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-medium text-slate-300">
                has_ride_share_app
              </span>
              <span className="text-[10px] font-mono text-slate-500">bool</span>
            </div>

            <button
              type="button"
              onClick={() => setVariable('has_ride_share_app', !has_ride_share_app)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${
                has_ride_share_app
                  ? 'border-violet-500/60 bg-violet-950/40 text-violet-200'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-medium">
                <Smartphone className="w-4 h-4 text-violet-400" />
                <span>{has_ride_share_app ? 'App Installed' : 'No App'}</span>
              </div>
              <span className="text-xs font-mono font-bold">
                {has_ride_share_app ? 'True' : 'False'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
