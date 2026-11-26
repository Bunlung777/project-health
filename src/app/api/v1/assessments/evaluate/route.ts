import { NextResponse } from 'next/server';
import { evaluateWhoMec, INITIAL_ASSESSMENT_STATE, PatientAssessmentState } from '@/domain/mec';
import {
  parseSafeNumericInput,
  sanitizeTextInput,
  validateClinicalBounds,
} from '@/lib/validation/assessment-validator';
import { buildSafeHisPayload } from '@/lib/security/pii-masking';

/**
 * POST /api/v1/assessments/evaluate
 * Server-side WHO MEC (6th Edition) evaluation & anonymous HIS export payload endpoint.
 * Zero PII (no name, no national ID/HN) is accepted or stored.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<PatientAssessmentState>;

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request payload' },
        { status: 400 }
      );
    }

    const sanitizedState: PatientAssessmentState = {
      ...INITIAL_ASSESSMENT_STATE,
      ...body,
      lmpDate: sanitizeTextInput(body.lmpDate ?? '', 100),
      otherDiseases: sanitizeTextInput(body.otherDiseases ?? '', 250),
      drugAllergyDetail: sanitizeTextInput(body.drugAllergyDetail ?? '', 250),
      age: parseSafeNumericInput(body.age ?? ''),
      weightKg: parseSafeNumericInput(body.weightKg ?? ''),
      heightCm: parseSafeNumericInput(body.heightCm ?? ''),
      sbp: parseSafeNumericInput(body.sbp ?? ''),
      dbp: parseSafeNumericInput(body.dbp ?? ''),
      cigarettesPerDay: parseSafeNumericInput(body.cigarettesPerDay ?? ''),
    };

    const clinicalWarnings = validateClinicalBounds(sanitizedState);
    const evaluation = evaluateWhoMec(sanitizedState);
    const hisPayload = buildSafeHisPayload(sanitizedState, evaluation);

    return NextResponse.json({
      success: true,
      clinicalWarnings,
      evaluation,
      hisPayload,
    });
  } catch {
    return NextResponse.json(
      { error: 'Unable to process assessment evaluation request.' },
      { status: 500 }
    );
  }
}
