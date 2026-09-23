export interface CommuteVariables {
  distance_mi: number;
  is_raining: boolean;
  has_bike: boolean;
  has_car: boolean;
  has_ride_share_app: boolean;
}

export type CommuteMode = 'none' | 'walk' | 'bike' | 'car' | 'rideshare' | 'stranded';

export interface RuleEvaluation {
  ruleNumber: 1 | 2 | 3 | 4;
  title: string;
  codeSnippet: string;
  conditionDescription: string;
  isConditionMet: boolean;
  actionExpression: string;
  evaluationDetail: string;
  result: boolean;
  isHit: boolean; // Whether this rule actually fired and determined the outcome
}

export interface CommuteEvaluationResult {
  canCommute: boolean;
  hitRule: RuleEvaluation;
  allRules: RuleEvaluation[];
  recommendedMode: CommuteMode;
  modeExplanation: string;
  distanceZone: 'zero' | 'walking' | 'biking' | 'motorized';
}

export interface PresetScenario {
  id: string;
  name: string;
  description: string;
  variables: CommuteVariables;
  expectedResult: boolean;
  tags: string[];
}
