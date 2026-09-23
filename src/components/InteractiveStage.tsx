import React from 'react';
import {
  CheckCircle2,
  XCircle,
  Footprints,
  Bike,
  Car,
  Smartphone,
  CloudRain,
  Sun,
  Home,
  MapPin,
  Compass,
} from 'lucide-react';
import { CommuteEvaluationResult, CommuteVariables } from '../types/commute';
import { WeatherCanvas } from './WeatherCanvas';

interface InteractiveStageProps {
  variables: CommuteVariables;
  result: CommuteEvaluationResult;
}

export const InteractiveStage: React.FC<InteractiveStageProps> = ({
  variables,
  result,
}) => {
  const { distance_mi, is_raining, has_bike, has_car, has_ride_share_app } = variables;
  const { canCommute, hitRule, recommendedMode, modeExplanation } = result;

  // Calculate percentage along distance track (clamped 0 to 100 for 0 to 25 mi)
  const trackPercent = Math.min(100, Math.max(0, (distance_mi / 20) * 100));

  // Determine avatar icon based on recommended mode
  const renderModeIcon = () => {
    switch (recommendedMode) {
      case 'walk':
        return <Footprints className="w-5 h-5 text-emerald-400" />;
      case 'bike':
        return <Bike className="w-5 h-5 text-cyan-400" />;
      case 'car':
        return <Car className="w-5 h-5 text-indigo-400" />;
      case 'rideshare':
        return <Smartphone className="w-5 h-5 text-violet-400" />;
      case 'none':
        return <Home className="w-5 h-5 text-slate-400" />;
      case 'stranded':
      default:
        return <XCircle className="w-5 h-5 text-rose-400" />;
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
      {/* Background Graphic with Measured Scrim and Zero-Broken-Image Fallback */}
      <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-950">
        <img
          src="/src/assets/images/hero_commute_journey_1790169067847.jpg"
          alt="Urban commute corridor showing multi-modal transit"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center opacity-40 mix-blend-luminosity filter transition-opacity duration-500"
          onError={(e) => {
            // Elegant CSS fallback container
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        {/* Measured Scrim for WCAG AA readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30" />

        {/* Rain animation overlay if raining */}
        <WeatherCanvas isRaining={is_raining} />

        {/* Top Floating Status Indicators */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-slate-950/70 border border-slate-800/80 px-2.5 py-1 rounded-md backdrop-blur-md">
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            <span>Target Distance:</span>
            <span className="font-semibold text-white tabular-nums">{distance_mi.toFixed(1)} mi</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-slate-950/70 border border-slate-800/80 px-2.5 py-1 rounded-md backdrop-blur-md">
            {is_raining ? (
              <>
                <CloudRain className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                <span className="text-blue-300">Raining (Active Precip)</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-200">Clear Skies (Dry)</span>
              </>
            )}
          </div>
        </div>

        {/* Central Outcome Banner - Focal Anchor */}
        <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${
                canCommute
                  ? 'border-emerald-500/40 bg-emerald-950/80 text-emerald-400 shadow-lg shadow-emerald-950/50'
                  : 'border-rose-500/40 bg-rose-950/80 text-rose-400 shadow-lg shadow-rose-950/50'
              }`}
            >
              {canCommute ? (
                <CheckCircle2 className="w-7 h-7" />
              ) : (
                <XCircle className="w-7 h-7" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
                <span
                  className={
                    canCommute ? 'text-emerald-400' : 'text-rose-400'
                  }
                >
                  {canCommute ? 'COMMUTE FEASIBLE' : 'COMMUTE BLOCKED'}
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-400 font-mono text-xs">
                  print({canCommute ? 'True' : 'False'})
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {modeExplanation}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg">
            <div className="p-1 rounded bg-slate-800/80">{renderModeIcon()}</div>
            <div className="text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-mono tracking-wider">Active Mode</span>
              <span className="font-semibold text-white capitalize">{recommendedMode}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Distance Zone Corridor */}
      <div className="p-4 sm:p-6 border-t border-slate-800/80 bg-slate-950/60">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
          <span>Continuous Distance Progression (mi)</span>
          <span className="text-indigo-400 font-semibold tabular-nums">Current: {distance_mi} mi</span>
        </div>

        {/* 4-Zone Visual Track */}
        <div className="relative pt-6 pb-2">
          {/* Main Track Background with Zone divisions */}
          <div className="relative h-3 w-full rounded-full bg-slate-800 overflow-hidden flex">
            {/* Zone 1: 0 mi */}
            <div
              style={{ width: '4%' }}
              className="h-full bg-slate-700/80 border-r border-slate-900"
              title="Rule 1: Falsy Distance (0 mi)"
            />
            {/* Zone 2: 0 < d <= 1 mi */}
            <div
              style={{ width: '12%' }}
              className={`h-full border-r border-slate-900 transition-colors ${
                hitRule.ruleNumber === 2
                  ? canCommute ? 'bg-emerald-500/60' : 'bg-rose-500/60'
                  : 'bg-emerald-950/40'
              }`}
              title="Rule 2: Walkable Zone (<= 1 mi)"
            />
            {/* Zone 3: 1 < d <= 6 mi */}
            <div
              style={{ width: '32%' }}
              className={`h-full border-r border-slate-900 transition-colors ${
                hitRule.ruleNumber === 3
                  ? canCommute ? 'bg-cyan-500/60' : 'bg-rose-500/60'
                  : 'bg-cyan-950/40'
              }`}
              title="Rule 3: Cycling Zone (<= 6 mi)"
            />
            {/* Zone 4: > 6 mi */}
            <div
              style={{ width: '52%' }}
              className={`h-full transition-colors ${
                hitRule.ruleNumber === 4
                  ? canCommute ? 'bg-indigo-500/60' : 'bg-rose-500/60'
                  : 'bg-indigo-950/40'
              }`}
              title="Rule 4: Motorized Transit (> 6 mi)"
            />
          </div>

          {/* Active Position Indicator Pin */}
          <div
            className="absolute top-1 transform -translate-x-1/2 transition-all duration-300 pointer-events-none flex flex-col items-center"
            style={{ left: `${Math.max(2, Math.min(98, trackPercent))}%` }}
          >
            <div
              className={`flex items-center justify-center p-1 rounded-full shadow-md ${
                canCommute ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-[10px] font-mono font-bold text-white bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-700 mt-1 whitespace-nowrap tabular-nums">
              {distance_mi} mi
            </span>
          </div>

          {/* Zone Labels */}
          <div className="grid grid-cols-4 gap-1 text-[11px] text-slate-400 mt-6 pt-1 font-mono">
            <div className="text-left border-l-2 border-slate-700 pl-1.5">
              <span className="block text-slate-200 font-semibold">0 mi</span>
              <span className="text-slate-500 text-[10px]">Rule 1 · Falsy</span>
            </div>
            <div className="text-left border-l-2 border-emerald-600/60 pl-1.5">
              <span className="block text-slate-200 font-semibold">0.1 – 1.0 mi</span>
              <span className="text-slate-500 text-[10px]">Rule 2 · Walking</span>
            </div>
            <div className="text-left border-l-2 border-cyan-600/60 pl-1.5">
              <span className="block text-slate-200 font-semibold">1.1 – 6.0 mi</span>
              <span className="text-slate-500 text-[10px]">Rule 3 · Cycling</span>
            </div>
            <div className="text-left border-l-2 border-indigo-600/60 pl-1.5">
              <span className="block text-slate-200 font-semibold">&gt; 6.0 mi</span>
              <span className="text-slate-500 text-[10px]">Rule 4 · Motorized</span>
            </div>
          </div>
        </div>

        {/* Runtime Hit Rule Explanation Callout */}
        <div className="mt-4 p-3.5 rounded-xl border border-slate-800 bg-slate-900/90">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 font-semibold">
                HIT: Rule {hitRule.ruleNumber}
              </span>
              <span className="text-sm font-semibold text-white">
                {hitRule.title}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-400">Condition:</span>
              <code className="text-slate-200 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {hitRule.conditionDescription}
              </code>
            </div>
          </div>

          <div className="mt-2 text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-800/60">
            <div>
              <span className="text-slate-400 font-mono">Evaluation: </span>
              <span className="text-slate-200">{hitRule.evaluationDetail}</span>
            </div>
            <div className="shrink-0 font-mono text-xs">
              <span className="text-slate-400">Yields: </span>
              <span
                className={`font-bold ${
                  canCommute ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {canCommute ? 'True' : 'False'}
              </span>
            </div>
          </div>
        </div>

        {/* Modality Status Matrix Grid */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Walking */}
          <div
            className={`p-3 rounded-lg border transition-all ${
              distance_mi > 0 && distance_mi <= 1
                ? !is_raining
                  ? 'border-emerald-500/50 bg-emerald-950/30'
                  : 'border-rose-500/50 bg-rose-950/30'
                : 'border-slate-800 bg-slate-900/50 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Footprints className="w-3.5 h-3.5 text-slate-400" /> Walk on Foot
              </span>
              <span className="text-[10px] font-mono">
                {distance_mi <= 1 && distance_mi > 0
                  ? !is_raining
                    ? '● READY'
                    : '▲ RAIN'
                  : 'OUT OF RANGE'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Rule 2: &le; 1 mi · dry only</p>
          </div>

          {/* Cycling */}
          <div
            className={`p-3 rounded-lg border transition-all ${
              distance_mi > 1 && distance_mi <= 6
                ? has_bike && !is_raining
                  ? 'border-cyan-500/50 bg-cyan-950/30'
                  : 'border-rose-500/50 bg-rose-950/30'
                : 'border-slate-800 bg-slate-900/50 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Bike className="w-3.5 h-3.5 text-slate-400" /> Bicycle
              </span>
              <span className="text-[10px] font-mono">
                {has_bike ? (is_raining ? '▲ WET' : '● READY') : '○ NO BIKE'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Rule 3: &le; 6 mi · bike + dry</p>
          </div>

          {/* Personal Car */}
          <div
            className={`p-3 rounded-lg border transition-all ${
              distance_mi > 6
                ? has_car
                  ? 'border-indigo-500/50 bg-indigo-950/30'
                  : 'border-slate-800 bg-slate-900/50'
                : 'border-slate-800 bg-slate-900/50 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-slate-400" /> Personal Car
              </span>
              <span className="text-[10px] font-mono">
                {has_car ? '● READY' : '○ NO CAR'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Rule 4: &gt; 6 mi · car or app</p>
          </div>

          {/* Ride Share App */}
          <div
            className={`p-3 rounded-lg border transition-all ${
              distance_mi > 6
                ? has_ride_share_app
                  ? 'border-violet-500/50 bg-violet-950/30'
                  : 'border-slate-800 bg-slate-900/50'
                : 'border-slate-800 bg-slate-900/50 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-slate-400" /> Ride-Share
              </span>
              <span className="text-[10px] font-mono">
                {has_ride_share_app ? '● INSTALLED' : '○ NO APP'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Rule 4: &gt; 6 mi · on-demand</p>
          </div>
        </div>
      </div>
    </div>
  );
};
