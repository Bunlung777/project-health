import type { PatientAssessmentState } from '@/domain/mec/types';

export const CLINICAL_BOUNDS = {
  age: { min: 10, max: 65, label: 'อายุ (10–65 ปี)' },
  weightKg: { min: 20, max: 300, label: 'น้ำหนัก (20–300 kg)' },
  heightCm: { min: 100, max: 230, label: 'ส่วนสูง (100–230 cm)' },
  sbp: { min: 50, max: 300, label: 'ความดันตัวบน SBP (50–300 mmHg)' },
  dbp: { min: 30, max: 200, label: 'ความดันตัวล่าง DBP (30–200 mmHg)' },
  cigarettesPerDay: { min: 0, max: 100, label: 'จำนวนบุหรี่ (0–100 มวน/วัน)' },
  maxTextLength: 250,
} as const;

/**
 * Sanitize free-text user input to prevent XSS / HTML injection / control characters
 * when rendering or exporting to external HIS systems.
 */
export function sanitizeTextInput(input: unknown, maxLength: number = CLINICAL_BOUNDS.maxTextLength): string {
  if (typeof input !== 'string') {
    return '';
  }
  return input
    .replace(/[\u0000-\u001F\u007F]/g, '') // Strip ASCII control characters
    .replace(/[<>]/g, '') // Strip angle brackets to prevent tag injection
    .slice(0, maxLength);
}

/**
 * Safely parse numeric inputs with finite check and non-negative enforcement.
 */
export function parseSafeNumericInput(raw: string | number | ''): number | '' {
  if (raw === '' || raw === null || raw === undefined) {
    return '';
  }
  const num = typeof raw === 'number' ? raw : Number(raw);
  if (!Number.isFinite(num) || num < 0) {
    return '';
  }
  return num;
}

/**
 * Validate clinical physiological bounds and return human-readable Thai warnings
 * if any vital sign or demographic value is out of normal clinical range.
 */
export function validateClinicalBounds(state: PatientAssessmentState): string[] {
  const warnings: string[] = [];

  if (typeof state.age === 'number') {
    if (state.age < CLINICAL_BOUNDS.age.min || state.age > CLINICAL_BOUNDS.age.max) {
      warnings.push(`ค่าอายุ (${state.age} ปี) อยู่นอกเกณฑ์วัยเจริญพันธุ์มาตรฐาน (${CLINICAL_BOUNDS.age.min}–${CLINICAL_BOUNDS.age.max} ปี)`);
    }
  }

  if (typeof state.weightKg === 'number') {
    if (state.weightKg < CLINICAL_BOUNDS.weightKg.min || state.weightKg > CLINICAL_BOUNDS.weightKg.max) {
      warnings.push(`ค่าน้ำหนัก (${state.weightKg} kg) อยู่นอกขอบเขตมาตรฐาน (${CLINICAL_BOUNDS.weightKg.min}–${CLINICAL_BOUNDS.weightKg.max} kg)`);
    }
  }

  if (typeof state.heightCm === 'number') {
    if (state.heightCm < CLINICAL_BOUNDS.heightCm.min || state.heightCm > CLINICAL_BOUNDS.heightCm.max) {
      warnings.push(`ค่าส่วนสูง (${state.heightCm} cm) อยู่นอกขอบเขตมาตรฐาน (${CLINICAL_BOUNDS.heightCm.min}–${CLINICAL_BOUNDS.heightCm.max} cm)`);
    }
  }

  if (typeof state.sbp === 'number' && typeof state.dbp === 'number') {
    if (state.dbp >= state.sbp) {
      warnings.push(
        `ค่าความดันโลหิตตัวล่าง (DBP ${state.dbp} mmHg) สูงกว่าหรือเท่ากับตัวบน (SBP ${state.sbp} mmHg) กรุณาตรวจสอบค่าความดันโลหิตอีกครั้ง`
      );
    }
  }

  return warnings;
}
