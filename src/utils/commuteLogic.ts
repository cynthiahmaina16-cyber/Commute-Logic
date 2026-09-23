import { CommuteVariables, CommuteEvaluationResult, RuleEvaluation, PresetScenario, CommuteMode } from '../types/commute';

/**
 * Default parameters from the user's Python prompt:
 * distance_mi = 10
 * is_raining = True
 * has_bike = False
 * has_car = False
 * has_ride_share_app = True
 */
export const DEFAULT_COMMUTE_VARIABLES: CommuteVariables = {
  distance_mi: 10,
  is_raining: true,
  has_bike: false,
  has_car: false,
  has_ride_share_app: true,
};

/**
 * Evaluates the commute variables in ascending conditional order,
 * adhering exactly to the Python script execution order.
 */
export function evaluateCommuteLogic(vars: CommuteVariables): CommuteEvaluationResult {
  const { distance_mi, is_raining, has_bike, has_car, has_ride_share_app } = vars;

  // In Python, 0 or 0.0 is falsy, so `not distance_mi` is True when distance is 0 or negative.
  const isDistanceFalsy = !distance_mi || distance_mi <= 0;

  // Rule 1 evaluation
  const rule1Met = isDistanceFalsy;
  const rule1Result = false;
  const rule1: RuleEvaluation = {
    ruleNumber: 1,
    title: 'Falsy Distance Check',
    codeSnippet: 'if not distance_mi:\n    print(False)',
    conditionDescription: `not (${distance_mi}) == ${isDistanceFalsy}`,
    isConditionMet: rule1Met,
    actionExpression: 'print(False)',
    evaluationDetail: isDistanceFalsy
      ? `Distance is ${distance_mi} (falsy in Python). No travel required.`
      : `Distance is ${distance_mi} (truthy in Python). Proceeding to Rule 2.`,
    result: rule1Result,
    isHit: rule1Met,
  };

  // Rule 2 evaluation
  const rule2Met = !rule1Met && distance_mi <= 1;
  const rule2Result = !is_raining;
  const rule2: RuleEvaluation = {
    ruleNumber: 2,
    title: 'Short Distance (Walkable <= 1 mi)',
    codeSnippet: 'elif distance_mi <= 1:\n    print(not is_raining)',
    conditionDescription: `${distance_mi} <= 1 == ${distance_mi <= 1}`,
    isConditionMet: distance_mi <= 1,
    actionExpression: `not is_raining -> not ${is_raining} -> ${rule2Result}`,
    evaluationDetail: distance_mi <= 1
      ? is_raining
        ? `Within 1 mi walking range, but it's raining (is_raining=True). Walking in rain blocked.`
        : `Within 1 mi walking range and dry weather (is_raining=False). Walkable!`
      : `Distance ${distance_mi} > 1 mi. Too far to walk on foot without vehicle. Proceeding to Rule 3.`,
    result: rule2Result,
    isHit: rule2Met,
  };

  // Rule 3 evaluation
  const rule3Met = !rule1Met && !rule2Met && distance_mi <= 6;
  const rule3Result = has_bike && !is_raining;
  const rule3: RuleEvaluation = {
    ruleNumber: 3,
    title: 'Medium Distance (Bicycle Range <= 6 mi)',
    codeSnippet: 'elif distance_mi <= 6:\n    print(has_bike and not is_raining)',
    conditionDescription: `${distance_mi} <= 6 == ${distance_mi <= 6}`,
    isConditionMet: distance_mi <= 6,
    actionExpression: `has_bike (${has_bike}) and not is_raining (${!is_raining}) -> ${rule3Result}`,
    evaluationDetail: distance_mi <= 6
      ? has_bike && !is_raining
        ? `Within 6 mi bike range, rider has a bicycle and weather is clear. Great bike commute!`
        : !has_bike
        ? `Distance is ${distance_mi} mi, but rider has no bicycle (has_bike=False).`
        : `Rider has bicycle, but it's raining (is_raining=True). Unsafe to bike in rain.`
      : `Distance ${distance_mi} > 6 mi. Exceeds standard cycling boundary. Proceeding to Rule 4.`,
    result: rule3Result,
    isHit: rule3Met,
  };

  // Rule 4 evaluation (else)
  const rule4Met = !rule1Met && !rule2Met && !rule3Met;
  const rule4Result = has_car || has_ride_share_app;
  const rule4: RuleEvaluation = {
    ruleNumber: 4,
    title: 'Long Distance (Motorized Transit > 6 mi)',
    codeSnippet: 'else:\n    print(has_car or has_ride_share_app)',
    conditionDescription: `distance_mi > 6 (${distance_mi} > 6)`,
    isConditionMet: distance_mi > 6,
    actionExpression: `has_car (${has_car}) or has_ride_share_app (${has_ride_share_app}) -> ${rule4Result}`,
    evaluationDetail: rule4Result
      ? has_car
        ? `Distance is ${distance_mi} mi. Commuter has personal vehicle (has_car=True). Commute feasible.`
        : `Distance is ${distance_mi} mi. No personal car, but ride-share app available (has_ride_share_app=True). Hail a ride!`
      : `Distance is ${distance_mi} mi. Commuter has neither a car nor ride-share app available. Stranded!`,
    result: rule4Result,
    isHit: rule4Met,
  };

  const allRules = [rule1, rule2, rule3, rule4];
  const hitRule = allRules.find((r) => r.isHit) || rule4;
  const canCommute = hitRule.result;

  // Determine recommended mode
  let recommendedMode: CommuteMode = 'none';
  let modeExplanation = '';
  let distanceZone: 'zero' | 'walking' | 'biking' | 'motorized' = 'motorized';

  if (hitRule.ruleNumber === 1) {
    distanceZone = 'zero';
    recommendedMode = 'none';
    modeExplanation = 'Zero or falsy distance detected. No transit required; staying home.';
  } else if (hitRule.ruleNumber === 2) {
    distanceZone = 'walking';
    if (canCommute) {
      recommendedMode = 'walk';
      modeExplanation = `Short journey (${distance_mi} mi) in pleasant clear weather. Recommended to walk.`;
    } else {
      recommendedMode = 'stranded';
      modeExplanation = `Walkable distance (${distance_mi} mi), but rain makes foot commute unfeasible under Rule 2.`;
    }
  } else if (hitRule.ruleNumber === 3) {
    distanceZone = 'biking';
    if (canCommute) {
      recommendedMode = 'bike';
      modeExplanation = `Medium distance (${distance_mi} mi) with bicycle ready and clear skies. Recommended to cycle.`;
    } else {
      recommendedMode = 'stranded';
      modeExplanation = has_bike
        ? `Bicycle available, but rain blocks cycling under Rule 3.`
        : `Cycling distance (${distance_mi} mi), but no bicycle available.`;
    }
  } else {
    distanceZone = 'motorized';
    if (canCommute) {
      if (has_car) {
        recommendedMode = 'car';
        modeExplanation = `Long-distance highway journey (${distance_mi} mi). Drive personal vehicle.`;
      } else {
        recommendedMode = 'rideshare';
        modeExplanation = `Long-distance journey (${distance_mi} mi). Request ride via ride-share application.`;
      }
    } else {
      recommendedMode = 'stranded';
      modeExplanation = `Long distance (${distance_mi} mi) with no personal vehicle or ride-share app installed.`;
    }
  }

  return {
    canCommute,
    hitRule,
    allRules,
    recommendedMode,
    modeExplanation,
    distanceZone,
  };
}

/**
 * Pre-curated scenarios testing varied boundaries and edge cases.
 */
export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'user-default',
    name: 'Initial Prompt Parameters',
    description: '10 mi, raining, no bike, no car, has ride-share app (Rule 4 triggers True).',
    variables: {
      distance_mi: 10,
      is_raining: true,
      has_bike: false,
      has_car: false,
      has_ride_share_app: true,
    },
    expectedResult: true,
    tags: ['Default', 'Ride-Share', 'Rain'],
  },
  {
    id: 'zero-distance',
    name: 'Falsy Distance (0 mi)',
    description: 'Zero miles evaluates to falsy in Python; Rule 1 immediately prints False.',
    variables: {
      distance_mi: 0,
      is_raining: false,
      has_bike: true,
      has_car: true,
      has_ride_share_app: true,
    },
    expectedResult: false,
    tags: ['Edge Case', 'Falsy', 'Rule 1'],
  },
  {
    id: 'short-sunny-walk',
    name: 'Sunny Short Walk (0.7 mi)',
    description: 'Less than or equal to 1 mi and not raining. Rule 2 evaluates True.',
    variables: {
      distance_mi: 0.7,
      is_raining: false,
      has_bike: false,
      has_car: false,
      has_ride_share_app: false,
    },
    expectedResult: true,
    tags: ['Walking', 'Clear Weather', 'Rule 2'],
  },
  {
    id: 'short-rainy-walk',
    name: 'Rainy Short Walk (0.7 mi)',
    description: 'Within 1 mi but raining. Rule 2 prints not is_raining -> False.',
    variables: {
      distance_mi: 0.7,
      is_raining: true,
      has_bike: false,
      has_car: true,
      has_ride_share_app: true,
    },
    expectedResult: false,
    tags: ['Walking', 'Rain Block', 'Rule 2'],
  },
  {
    id: 'sunny-bike-trip',
    name: 'Cycling Corridor (4.5 mi)',
    description: 'Between 1 and 6 mi with bicycle ready and no rain. Rule 3 evaluates True.',
    variables: {
      distance_mi: 4.5,
      is_raining: false,
      has_bike: true,
      has_car: false,
      has_ride_share_app: false,
    },
    expectedResult: true,
    tags: ['Cycling', 'Clear Weather', 'Rule 3'],
  },
  {
    id: 'rainy-bike-blocked',
    name: 'Biker in Heavy Downpour (4.5 mi)',
    description: 'Between 1 and 6 mi with bike, but rain prevents commute. Rule 3 evaluates False.',
    variables: {
      distance_mi: 4.5,
      is_raining: true,
      has_bike: true,
      has_car: true,
      has_ride_share_app: true,
    },
    expectedResult: false,
    tags: ['Cycling', 'Rain Block', 'Rule 3'],
  },
  {
    id: 'long-highway-car',
    name: 'Suburban Highway Commute (22 mi)',
    description: 'Greater than 6 mi with personal car. Rule 4 evaluates True.',
    variables: {
      distance_mi: 22,
      is_raining: true,
      has_bike: false,
      has_car: true,
      has_ride_share_app: false,
    },
    expectedResult: true,
    tags: ['Highway', 'Personal Car', 'Rule 4'],
  },
  {
    id: 'stranded-long-distance',
    name: 'Stranded in Suburbs (15 mi)',
    description: 'Greater than 6 mi with neither car nor ride-share app. Rule 4 evaluates False.',
    variables: {
      distance_mi: 15,
      is_raining: false,
      has_bike: true,
      has_car: false,
      has_ride_share_app: false,
    },
    expectedResult: false,
    tags: ['Stranded', 'No Motor Transit', 'Rule 4'],
  },
];

/**
 * Generates formatted Python code with current live variables.
 */
export function generatePythonScript(vars: CommuteVariables): string {
  const boolStr = (val: boolean) => (val ? 'True' : 'False');
  return `# --- Step 1: Create the variables ---
distance_mi = ${vars.distance_mi}
is_raining = ${boolStr(vars.is_raining)}
has_bike = ${boolStr(vars.has_bike)}
has_car = ${boolStr(vars.has_car)}
has_ride_share_app = ${boolStr(vars.has_ride_share_app)}

# --- Step 2: Continuous conditional evaluation in ascending order ---

# Rule 1: Check for falsy distance (e.g., 0)
if not distance_mi:
    print(False)

# Rule 2: Less than or equal to 1 mile
elif distance_mi <= 1:
    print(not is_raining)

# Rule 3: Greater than 1 mile and less than or equal to 6 miles
elif distance_mi <= 6:
    print(has_bike and not is_raining)

# Rule 4: Greater than 6 miles
else:
    print(has_car or has_ride_share_app)
`;
}

export interface TruthRow {
  id: string;
  distanceLabel: string;
  distanceVal: number;
  is_raining: boolean;
  has_bike: boolean;
  has_car: boolean;
  has_ride_share_app: boolean;
  activeRule: number;
  output: boolean;
}

/**
 * Generates truth matrix for representative distance tiers across all boolean combinations.
 */
export function generateTruthMatrix(): TruthRow[] {
  const rows: TruthRow[] = [];
  const distanceSamples = [
    { label: '0 mi (Falsy)', val: 0 },
    { label: '0.8 mi (<=1 mi)', val: 0.8 },
    { label: '4.0 mi (<=6 mi)', val: 4.0 },
    { label: '10.0 mi (>6 mi)', val: 10.0 },
  ];

  const rainOptions = [false, true];
  const bikeOptions = [false, true];
  const carOptions = [false, true];
  const rideOptions = [false, true];

  let idCounter = 1;

  for (const dist of distanceSamples) {
    for (const rain of rainOptions) {
      for (const bike of bikeOptions) {
        for (const car of carOptions) {
          for (const ride of rideOptions) {
            // To keep table focused and high-yield, include all meaningful permutations
            // Rule 1 only cares about distance
            // Rule 2 only cares about distance & rain
            // Rule 3 only cares about distance, rain, & bike
            // Rule 4 only cares about distance, car, & ride
            const vars: CommuteVariables = {
              distance_mi: dist.val,
              is_raining: rain,
              has_bike: bike,
              has_car: car,
              has_ride_share_app: ride,
            };
            const result = evaluateCommuteLogic(vars);
            rows.push({
              id: `row-${idCounter++}`,
              distanceLabel: dist.label,
              distanceVal: dist.val,
              is_raining: rain,
              has_bike: bike,
              has_car: car,
              has_ride_share_app: ride,
              activeRule: result.hitRule.ruleNumber,
              output: result.canCommute,
            });
          }
        }
      }
    }
  }

  return rows;
}
