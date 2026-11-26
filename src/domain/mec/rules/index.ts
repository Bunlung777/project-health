import { calculateBmi } from '../bmi';
import { evaluatePregnancyStatus } from '../pregnancy-evaluator';
import type {
  ContraceptiveMethodId,
  FullMecEvaluation,
  MecCategory,
  MethodEvaluationResult,
  PatientAssessmentState,
} from '../types';
import { applyComorbidityRules } from './comorbidities';
import { applyRedFlagRules } from './red-flags';
import { applyVitalAgeSmokingRules } from './vital-age-smoking';

export function evaluateWhoMec(state: PatientAssessmentState): FullMecEvaluation {
  const bmiInfo = calculateBmi(state.weightKg, state.heightCm);
  const sbpNum = typeof state.sbp === 'number' ? state.sbp : 0;
  const dbpNum = typeof state.dbp === 'number' ? state.dbp : 0;

  const bpElevatedWarning = sbpNum >= 140 || dbpNum >= 90;
  const bpSevereWarning = sbpNum >= 160 || dbpNum >= 100;

  const methods: Record<ContraceptiveMethodId, MethodEvaluationResult> = {
    COC: { methodId: 'COC', finalCategory: 1, reasons: [], teleconsultRequired: false },
    POP: { methodId: 'POP', finalCategory: 1, reasons: [], teleconsultRequired: false },
    DMPA: { methodId: 'DMPA', finalCategory: 1, reasons: [], teleconsultRequired: false },
    IMPLANT: { methodId: 'IMPLANT', finalCategory: 1, reasons: [], teleconsultRequired: false },
    CU_IUD: { methodId: 'CU_IUD', finalCategory: 1, reasons: [], teleconsultRequired: false },
  };

  const globalClinicalAlerts: string[] = [];

  function applyRule(
    methodId: ContraceptiveMethodId,
    category: MecCategory,
    sourceStep: string,
    conditionTitle: string,
    reasonText: string,
    actionNotice?: string
  ) {
    const target = methods[methodId];
    if (category > target.finalCategory) {
      target.finalCategory = category;
    }
    if (category >= 2) {
      const isDuplicate = target.reasons.some(
        (r) => r.conditionTitle === conditionTitle && r.category === category
      );
      if (!isDuplicate) {
        target.reasons.push({
          sourceStep,
          conditionTitle,
          category,
          reasonText,
          actionNotice,
        });
      }
    }
    if (category === 3) {
      target.teleconsultRequired = true;
    }
  }

  // Step 1: Vitals, BMI, BP & Smoking
  applyVitalAgeSmokingRules(
    state,
    bmiInfo,
    bpElevatedWarning,
    bpSevereWarning,
    applyRule,
    globalClinicalAlerts
  );

  // Step 2: Pregnancy Exclusion
  const pregnancyStatus = evaluatePregnancyStatus(state, globalClinicalAlerts);

  // Step 3: High-Risk Red Flags
  applyRedFlagRules(state, bpSevereWarning, applyRule, globalClinicalAlerts);

  // Step 4: Co-morbidities & Medications
  applyComorbidityRules(state, bpElevatedWarning, applyRule, globalClinicalAlerts);

  const allMethodIds: ContraceptiveMethodId[] = ['COC', 'POP', 'DMPA', 'IMPLANT', 'CU_IUD'];
  const recommendedSafeMethods = pregnancyStatus.isPregnantStop
    ? []
    : allMethodIds.filter((id) => methods[id].finalCategory <= 2);

  return {
    bmiInfo,
    bpElevatedWarning,
    bpSevereWarning,
    pregnancyStatus,
    methods,
    recommendedSafeMethods,
    globalClinicalAlerts,
  };
}
