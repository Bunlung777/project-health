import type { BmiCalculationResult } from './types';

export function calculateBmi(weightKg: number | '', heightCm: number | ''): BmiCalculationResult {
  if (
    typeof weightKg !== 'number' ||
    typeof heightCm !== 'number' ||
    !Number.isFinite(weightKg) ||
    !Number.isFinite(heightCm) ||
    weightKg <= 0 ||
    heightCm <= 0
  ) {
    return {
      bmi: null,
      interpretation: 'รอระบุน้ำหนักและส่วนสูง',
      isObeseGte30: false,
      badgeClass: 'bg-slate-100 text-slate-600 border-slate-300',
    };
  }

  const heightM = heightCm / 100;
  const bmiVal = Number((weightKg / (heightM * heightM)).toFixed(1));

  if (!Number.isFinite(bmiVal) || bmiVal <= 0) {
    return {
      bmi: null,
      interpretation: 'ข้อมูลไม่ถูกต้อง',
      isObeseGte30: false,
      badgeClass: 'bg-slate-100 text-slate-600 border-slate-300',
    };
  }

  if (bmiVal < 18.5) {
    return {
      bmi: bmiVal,
      interpretation: 'น้ำหนักต่ำกว่าเกณฑ์ (ผอม)',
      isObeseGte30: false,
      badgeClass: 'bg-sky-100 text-sky-800 border-sky-300',
    };
  }
  if (bmiVal < 23.0) {
    return {
      bmi: bmiVal,
      interpretation: 'น้ำหนักปกติ (สมส่วน)',
      isObeseGte30: false,
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    };
  }
  if (bmiVal < 25.0) {
    return {
      bmi: bmiVal,
      interpretation: 'น้ำหนักเกิน (ท้วม)',
      isObeseGte30: false,
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
    };
  }
  if (bmiVal < 30.0) {
    return {
      bmi: bmiVal,
      interpretation: 'โรคอ้วนระดับ 1 (BMI 25.0–29.9)',
      isObeseGte30: false,
      badgeClass: 'bg-amber-200 text-amber-900 border-amber-400',
    };
  }
  return {
    bmi: bmiVal,
    interpretation: 'โรคอ้วนระดับรุนแรง / โรคอ้วน Grade 1-2 (BMI ≥ 30)',
    isObeseGte30: true,
    badgeClass: 'bg-amber-300 text-amber-950 border-amber-500 font-semibold',
  };
}
