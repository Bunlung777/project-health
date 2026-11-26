import type { FullMecEvaluation, PatientAssessmentState } from '@/domain/mec/types';

export interface SafeHisExportPayload {
  schemaVersion: 'WHO-MEC-6TH-TH-1.0';
  exportedAtIso: string;
  clinicalSummary: {
    age: number | null;
    bmi: number | null;
    bmiInterpretation: string;
    bloodPressure: {
      sbp: number | null;
      dbp: number | null;
      isElevated: boolean;
      isSevere: boolean;
    };
    pregnancyStatus: string;
    selectedMethod: string;
    selectedMethodCategory: number;
    recommendedSafeMethods: string[];
  };
}

/**
 * Build an anonymous, audit-safe JSON payload ready for future HIS (JHCIS / HOSxP PCU) API integration.
 * Zero PII (no name, no national ID/HN) is collected or exported.
 */
export function buildSafeHisPayload(
  state: PatientAssessmentState,
  evaluation: FullMecEvaluation
): SafeHisExportPayload {
  const selectedMethodEval = evaluation.methods[state.selectedMethod];

  return {
    schemaVersion: 'WHO-MEC-6TH-TH-1.0',
    exportedAtIso: new Date().toISOString(),
    clinicalSummary: {
      age: typeof state.age === 'number' ? state.age : null,
      bmi: evaluation.bmiInfo.bmi,
      bmiInterpretation: evaluation.bmiInfo.interpretation,
      bloodPressure: {
        sbp: typeof state.sbp === 'number' ? state.sbp : null,
        dbp: typeof state.dbp === 'number' ? state.dbp : null,
        isElevated: evaluation.bpElevatedWarning,
        isSevere: evaluation.bpSevereWarning,
      },
      pregnancyStatus: evaluation.pregnancyStatus.status,
      selectedMethod: state.selectedMethod,
      selectedMethodCategory: selectedMethodEval.finalCategory,
      recommendedSafeMethods: evaluation.recommendedSafeMethods,
    },
  };
}
