'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  evaluateWhoMec,
  INITIAL_ASSESSMENT_STATE,
  PatientAssessmentState,
} from '@/domain/mec';
import {
  parseSafeNumericInput,
  sanitizeTextInput,
  validateClinicalBounds,
} from '@/lib/validation/assessment-validator';
import { buildSafeHisPayload, SafeHisExportPayload } from '@/lib/security/pii-masking';

const TEXT_FIELDS: (keyof PatientAssessmentState)[] = [
  'patientName',
  'hnOrCid',
  'lmpDate',
  'otherDiseases',
  'drugAllergyDetail',
];

const NUMERIC_FIELDS: (keyof PatientAssessmentState)[] = [
  'age',
  'weightKg',
  'heightCm',
  'sbp',
  'dbp',
  'cigarettesPerDay',
];

/**
 * Synchronize dependent clinical flags across Step 1, Step 3, and Step 4
 * so there is never a disagreement between UI state and clinical engine evaluation.
 */
function synchronizeCrossStepState(next: PatientAssessmentState): PatientAssessmentState {
  const synced = { ...next };
  const ageNum = typeof synced.age === 'number' ? synced.age : 0;
  const sbpNum = typeof synced.sbp === 'number' ? synced.sbp : 0;
  const dbpNum = typeof synced.dbp === 'number' ? synced.dbp : 0;
  const cigsNum = typeof synced.cigarettesPerDay === 'number' ? synced.cigarettesPerDay : 0;

  // 1. Sync heavy smoking >= 15/day and age >= 35
  if (synced.smokingStatus === 'smoker') {
    const isHeavyOver35 = ageNum >= 35 && cigsNum >= 15;
    synced.redFlagHeavySmokingOver35 = isHeavyOver35;
    if (isHeavyOver35) {
      synced.redFlagNone = false;
    }
  } else {
    synced.redFlagHeavySmokingOver35 = false;
  }

  // 2. Sync blood pressure from Step 1 vitals -> Step 3 & Step 4 Hypertension level
  if (sbpNum >= 160 || dbpNum >= 100) {
    synced.redFlagSevereHypertension = true;
    synced.redFlagNone = false;
    synced.htnLevel = 'gte_160_90';
  } else if (sbpNum >= 140 || dbpNum >= 90) {
    if (!synced.hasHypertension) {
      synced.htnLevel = 'lt_160_90';
    }
  }

  // 3. Sync Migraine Aura flag from Step 3
  if (synced.redFlagMigraineAura && !synced.redFlagNone) {
    synced.hasMigraine = true;
    synced.migraineType = 'with_aura';
  }

  // 4. Sync Dyslipidemia "ไม่มีภาวะ/โรคร่วม" checkbox state with its 4 risk flags
  const hasDlpRisk =
    synced.dlpAgeOver35 ||
    ageNum >= 35 ||
    synced.dlpDiabetes ||
    synced.hasDiabetes ||
    synced.dlpHypertension ||
    synced.hasHypertension ||
    sbpNum >= 140 ||
    dbpNum >= 90 ||
    synced.dlpSmoking ||
    synced.smokingStatus === 'smoker';

  synced.dlpNoRiskFactors = !hasDlpRisk;

  // 5. Sync Diabetes complications with "ไม่มีภาวะ/โรคร่วม" (including DVT / Stroke cross-check per PDF Page 12)
  if (synced.hasDiabetes && (synced.hasDvt || synced.hasStroke)) {
    synced.dmVascularDisease = true;
  }
  const hasDmComp =
    synced.dmOver20Years ||
    synced.dmVascularDisease ||
    synced.dmNephropathy ||
    synced.dmRetinopathy ||
    synced.dmNeuropathy;
  synced.dmNoComplications = !hasDmComp;

  return synced;
}

export function useAssessmentWizard() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showStandardRef, setShowStandardRef] = useState<boolean>(false);
  const [state, setState] = useState<PatientAssessmentState>(() =>
    synchronizeCrossStepState(INITIAL_ASSESSMENT_STATE)
  );
  const [showBackupPopup, setShowBackupPopup] = useState<boolean>(false);
  const [hisSavedPayload, setHisSavedPayload] = useState<SafeHisExportPayload | null>(null);

  const evaluation = useMemo(() => evaluateWhoMec(state), [state]);
  const clinicalWarnings = useMemo(() => validateClinicalBounds(state), [state]);

  const updateState = useCallback(
    <K extends keyof PatientAssessmentState>(key: K, value: PatientAssessmentState[K]) => {
      setState((prev) => {
        let safeValue: PatientAssessmentState[K] = value;

        if (TEXT_FIELDS.includes(key) && typeof value === 'string') {
          safeValue = sanitizeTextInput(value) as PatientAssessmentState[K];
        } else if (NUMERIC_FIELDS.includes(key)) {
          safeValue = parseSafeNumericInput(value as number | '') as PatientAssessmentState[K];
        }

        const COMORBIDITY_TOGGLE_KEYS: (keyof PatientAssessmentState)[] = [
          'hasHypertension',
          'hasDiabetes',
          'hasDyslipidemia',
          'hasCkd',
          'hasMigraine',
          'hasSle',
          'hasDvt',
          'hasStroke',
          'hasViralHepatitisCarrier',
          'hasCirrhosis',
          'hasBreastDisease',
          'hasEpilepsy',
          'hasRifampicin',
        ];

        const updated = { ...prev, [key]: safeValue };
        if (COMORBIDITY_TOGGLE_KEYS.includes(key) && safeValue === true) {
          updated.noComorbidities = false;
        } else if (key === 'noComorbidities' && safeValue === true) {
          updated.hasHypertension = false;
          updated.hasDiabetes = false;
          updated.hasDyslipidemia = false;
          updated.hasCkd = false;
          updated.hasMigraine = false;
          updated.hasSle = false;
          updated.hasDvt = false;
          updated.hasStroke = false;
          updated.hasViralHepatitisCarrier = false;
          updated.hasCirrhosis = false;
          updated.hasBreastDisease = false;
          updated.hasEpilepsy = false;
          updated.hasRifampicin = false;
        }
        if (key === 'age') {
          const nextAge = typeof updated.age === 'number' ? updated.age : 0;
          updated.dlpAgeOver35 = nextAge >= 35;
          if (updated.migraineType !== 'with_aura') {
            updated.migraineType = nextAge >= 35 ? 'without_aura_gte_35' : 'without_aura_lt_35';
          }
        }
        if (key === 'hasMigraine' && safeValue === true && updated.migraineType !== 'with_aura') {
          const nextAge = typeof updated.age === 'number' ? updated.age : 0;
          updated.migraineType = nextAge >= 35 ? 'without_aura_gte_35' : 'without_aura_lt_35';
        }
        if (key === 'hasDiabetes') {
          updated.dlpDiabetes = Boolean(safeValue);
        }
        if (key === 'hasHypertension') {
          const nextSbp = typeof updated.sbp === 'number' ? updated.sbp : 0;
          const nextDbp = typeof updated.dbp === 'number' ? updated.dbp : 0;
          updated.dlpHypertension = Boolean(safeValue) || nextSbp >= 140 || nextDbp >= 90;
        }
        if (key === 'smokingStatus') {
          updated.dlpSmoking = safeValue === 'smoker';
        }
        if (key === 'hasDyslipidemia' && safeValue === true) {
          const nextAge = typeof updated.age === 'number' ? updated.age : 0;
          const nextSbp = typeof updated.sbp === 'number' ? updated.sbp : 0;
          const nextDbp = typeof updated.dbp === 'number' ? updated.dbp : 0;
          updated.dlpAgeOver35 = nextAge >= 35;
          updated.dlpDiabetes = updated.hasDiabetes;
          updated.dlpHypertension = updated.hasHypertension || nextSbp >= 140 || nextDbp >= 90;
          updated.dlpSmoking = updated.smokingStatus === 'smoker';
        }
        if (key === 'sbp' || key === 'dbp') {
          const nextSbp = typeof updated.sbp === 'number' ? updated.sbp : 0;
          const nextDbp = typeof updated.dbp === 'number' ? updated.dbp : 0;
          if (nextSbp >= 140 || nextDbp >= 90) {
            updated.hasHypertension = true;
            updated.noComorbidities = false;
            updated.htnLevel = nextSbp >= 160 || nextDbp >= 100 ? 'gte_160_90' : 'lt_160_90';
            updated.dlpHypertension = true;
          } else {
            updated.dlpHypertension = updated.hasHypertension;
          }
        }
        return synchronizeCrossStepState(updated);
      });
      setHisSavedPayload(null);
    },
    []
  );

  const mutateState = useCallback(
    (updater: (prev: PatientAssessmentState) => PatientAssessmentState) => {
      setState((prev) => synchronizeCrossStepState(updater(prev)));
      setHisSavedPayload(null);
    },
    []
  );

  const resetForm = useCallback(() => {
    setState(synchronizeCrossStepState(INITIAL_ASSESSMENT_STATE));
    setHisSavedPayload(null);
    setCurrentStep(1);
  }, []);

  const handleMockSaveHis = useCallback(() => {
    const payload = buildSafeHisPayload(state, evaluation);
    setHisSavedPayload(payload);
  }, [state, evaluation]);

  return {
    currentStep,
    setCurrentStep,
    showStandardRef,
    setShowStandardRef,
    state,
    updateState,
    mutateState,
    evaluation,
    clinicalWarnings,
    showBackupPopup,
    setShowBackupPopup,
    hisSavedPayload,
    handleMockSaveHis,
    resetForm,
  };
}
