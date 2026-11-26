export type ContraceptiveMethodId = 'COC' | 'POP' | 'DMPA' | 'IMPLANT' | 'CU_IUD';

export type MecCategory = 1 | 2 | 3 | 4;

export interface ContraceptiveMethodInfo {
  id: ContraceptiveMethodId;
  code: string;
  shortName: string;
  fullNameTh: string;
  fullNameEn: string;
  description: string;
  specialWarnings: string[];
}

export interface CategoryMeta {
  category: MecCategory;
  titleTh: string;
  clinicalMeaning: string;
  systemAction: string;
  badgeColor: string;
  cardBorder: string;
  cardBg: string;
  textColor: string;
  statusLight: string;
}

export interface PatientAssessmentState {
  // Step 1: Demographics & Vitals
  patientName: string;
  hnOrCid: string;
  age: number | '';
  weightKg: number | '';
  heightCm: number | '';
  sbp: number | '';
  dbp: number | '';
  lmpDate: string;
  smokingStatus: 'none' | 'smoker';
  cigarettesPerDay: number | '';

  // Step 2: Pregnancy Exclusion
  pregnancyCriteriaSelected: string[];
  pregnancyNoneOfSix: boolean;
  uptResult: 'not_done' | 'negative' | 'positive';
  unprotectedSex5Days: 'no' | 'yes' | '';

  // Step 3: High-Risk Red Flags (6 items)
  redFlagMigraineAura: boolean;
  redFlagBreastCancer: boolean;
  redFlagVteStrokeIhd: boolean;
  redFlagSevereHypertension: boolean;
  redFlagUnexplainedBleedingOrPid: boolean;
  redFlagPostpartum: boolean;
  postpartumPeriod: 'none' | 'lt_21_days' | '21_to_42_days' | 'gte_6_weeks_bf';
  redFlagHeavySmokingOver35: boolean;
  redFlagEnzymeInducingDrugs: boolean;
  redFlagNone: boolean;

  // Step 4: Co-morbidities & Medications
  noComorbidities: boolean;

  // Hypertension
  hasHypertension: boolean;
  htnLevel: 'lt_160_90' | 'gte_160_90';
  htnVascularStrokeTia: boolean;
  htnVascularMiIhd: boolean;
  htnVascularDvt: boolean;
  htnVascularPe: boolean;

  // Diabetes
  hasDiabetes: boolean;
  dmOver20Years: boolean;
  dmVascularDisease: boolean;
  dmNephropathy: boolean;
  dmRetinopathy: boolean;
  dmNeuropathy: boolean;
  dmNoComplications: boolean;

  // Dyslipidemia
  hasDyslipidemia: boolean;
  dlpAgeOver35: boolean;
  dlpDiabetes: boolean;
  dlpHypertension: boolean;
  dlpSmoking: boolean;
  dlpNoRiskFactors: boolean;

  // CKD
  hasCkd: boolean;

  // Migraine
  hasMigraine: boolean;
  migraineType: 'with_aura' | 'without_aura_lt_35' | 'without_aura_gte_35';

  // SLE
  hasSle: boolean;

  // DVT
  hasDvt: boolean;

  // Stroke
  hasStroke: boolean;

  // Viral Hepatitis
  hasViralHepatitisCarrier: boolean;

  // Cirrhosis
  hasCirrhosis: boolean;
  cirrhosisSeverity: 'mild_compensated' | 'severe_decompensated' | 'unknown';

  // Breast mass / cancer
  hasBreastDisease: boolean;
  breastDiseaseType: 'undiagnosed_mass' | 'benign' | 'cancer';

  // Epilepsy
  hasEpilepsy: boolean;
  epilepsyDrugType: 'enzyme_inducer' | 'other_drugs' | 'unknown';

  // Rifampicin / TB
  hasRifampicin: boolean;

  // Other & Drug allergy
  otherDiseases: string;
  hasDrugAllergy: 'none' | 'yes';
  drugAllergyDetail: string;

  // Selected method in Step 5/6
  selectedMethod: ContraceptiveMethodId;
}

export interface RuleTriggerReason {
  sourceStep: string;
  conditionTitle: string;
  category: MecCategory;
  reasonText: string;
  actionNotice?: string;
}

export interface MethodEvaluationResult {
  methodId: ContraceptiveMethodId;
  finalCategory: MecCategory;
  reasons: RuleTriggerReason[];
  teleconsultRequired: boolean;
}

export interface BmiCalculationResult {
  bmi: number | null;
  interpretation: string;
  isObeseGte30: boolean;
  badgeClass: string;
}

export interface PregnancyEvaluationResult {
  status:
    | 'reasonably_certain_not_pregnant'
    | 'upt_negative_backup_needed'
    | 'upt_negative_ec_needed'
    | 'pregnant_anc'
    | 'pending_upt';
  summaryTitle: string;
  summaryDetail: string;
  requiresBackup7Days: boolean;
  requiresRepeatUpt2To4Weeks: boolean;
  requiresEmergencyContraception: boolean;
  isPregnantStop: boolean;
}

export interface FullMecEvaluation {
  bmiInfo: BmiCalculationResult;
  bpElevatedWarning: boolean;
  bpSevereWarning: boolean;
  pregnancyStatus: PregnancyEvaluationResult;
  methods: Record<ContraceptiveMethodId, MethodEvaluationResult>;
  recommendedSafeMethods: ContraceptiveMethodId[];
  globalClinicalAlerts: string[];
}

export type ApplyRuleFn = (
  methodId: ContraceptiveMethodId,
  category: MecCategory,
  sourceStep: string,
  conditionTitle: string,
  reasonText: string,
  actionNotice?: string
) => void;
