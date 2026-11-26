import type { ApplyRuleFn, BmiCalculationResult, PatientAssessmentState } from '../types';

export function applyVitalAgeSmokingRules(
  state: PatientAssessmentState,
  bmiInfo: BmiCalculationResult,
  bpElevatedWarning: boolean,
  bpSevereWarning: boolean,
  applyRule: ApplyRuleFn,
  globalClinicalAlerts: string[]
): void {
  const ageNum = typeof state.age === 'number' ? state.age : 0;
  const sbpNum = typeof state.sbp === 'number' ? state.sbp : 0;
  const dbpNum = typeof state.dbp === 'number' ? state.dbp : 0;
  const cigsNum = typeof state.cigarettesPerDay === 'number' ? state.cigarettesPerDay : 0;

  // Properly gate Step 3 & Step 4 flags so stale flags never leak when redFlagNone/noComorbidities is checked
  const isSmoker =
    state.smokingStatus === 'smoker' || (!state.redFlagNone && state.redFlagHeavySmokingOver35);
  const hasHtnAny =
    bpElevatedWarning ||
    (!state.redFlagNone && state.redFlagSevereHypertension) ||
    (!state.noComorbidities && state.hasHypertension);
  const hasDmAny = !state.noComorbidities && state.hasDiabetes;

  // 1. BMI >= 30 check
  if (bmiInfo.isObeseGte30) {
    const otherRiskFactors: string[] = [];
    if (ageNum >= 35) otherRiskFactors.push('อายุ ≥ 35 ปี');
    if (isSmoker) otherRiskFactors.push('สูบบุหรี่');
    if (hasHtnAny) otherRiskFactors.push('ความดันโลหิตสูง');
    if (hasDmAny) otherRiskFactors.push('เบาหวาน');

    if (otherRiskFactors.length > 0) {
      const joinedFactors = otherRiskFactors.join(', ');
      applyRule(
        'COC',
        3,
        'ส่วนที่ 1: ดัชนีมวลกาย (BMI ≥ 30) ร่วมกับปัจจัยเสี่ยง',
        `ภาวะอ้วน (BMI ${bmiInfo.bmi} kg/m²) ร่วมกับ (${joinedFactors})`,
        'เพราะน้ำหนักตัวที่มากร่วมกับปัจจัยเสี่ยงอื่นจะยิ่งเพิ่มความเสี่ยงทำให้เกิดลิ่มเลือดอุดตันในหลอดเลือด',
        'ส่งต่อปรึกษาแพทย์ หรือ ปรึกษาแพทย์ทางไกล (Teleconsult)'
      );
      applyRule(
        'POP',
        2,
        'ส่วนที่ 1: ดัชนีมวลกาย (BMI ≥ 30) ร่วมกับปัจจัยเสี่ยง',
        `ภาวะอ้วน (BMI ${bmiInfo.bmi} kg/m²) ร่วมกับ (${joinedFactors})`,
        'ใช้ได้อย่างปลอดภัย แต่ควรติดตามน้ำหนักตัวและปัจจัยเสี่ยงทางหลอดเลือด'
      );
      applyRule(
        'DMPA',
        2,
        'ส่วนที่ 1: ดัชนีมวลกาย (BMI ≥ 30) ร่วมกับปัจจัยเสี่ยง',
        `ภาวะอ้วน (BMI ${bmiInfo.bmi} kg/m²) ร่วมกับ (${joinedFactors})`,
        'ใช้ได้ แต่ควรติดตามเรื่องน้ำหนักตัวที่อาจเพิ่มขึ้นจากยาฉีดคุมกำเนิด'
      );
      applyRule(
        'IMPLANT',
        2,
        'ส่วนที่ 1: ดัชนีมวลกาย (BMI ≥ 30) ร่วมกับปัจจัยเสี่ยง',
        `ภาวะอ้วน (BMI ${bmiInfo.bmi} kg/m²) ร่วมกับ (${joinedFactors})`,
        'ใช้ได้อย่างปลอดภัยและมีประสิทธิภาพสูงในผู้ที่มีภาวะอ้วน'
      );
    } else {
      applyRule(
        'COC',
        2,
        'ส่วนที่ 1: ดัชนีมวลกาย (BMI ≥ 30)',
        `ภาวะอ้วน (BMI ${bmiInfo.bmi} kg/m²) โดยไม่มีปัจจัยเสี่ยงอื่นร่วม`,
        'น้ำหนักตัวมากเพิ่มความเสี่ยงลิ่มเลือดอุดตันเล็กน้อย สามารถใช้ได้แต่ควรติดตามผล'
      );
    }
  }

  // 2. Direct Blood Pressure evaluation from Step 1 Vitals (Unconditional so severe/elevated BP is never bypassed!)
  if (bpElevatedWarning) {
    globalClinicalAlerts.push(
      `ตรวจพบความดันโลหิตสูง (${sbpNum}/${dbpNum} mmHg): แนะนำนั่งพักอย่างน้อย 15 นาที แล้ววัดความดันซ้ำ หากคงค่าเดิมให้สงสัยว่าเป็นความดันโลหิตสูง`
    );

    if (bpSevereWarning || sbpNum >= 160 || dbpNum >= 90) {
      if (sbpNum >= 160 || dbpNum >= 100) {
        applyRule(
          'COC',
          4,
          'ส่วนที่ 1: สัญญาณชีพความดันโลหิตสูงรุนแรง (≥ 160/100 mmHg)',
          `ความดันโลหิตสูงรุนแรงจากสัญญาณชีพ (${sbpNum}/${dbpNum} mmHg)`,
          'ฮอร์โมนเอสโตรเจนในยาคุมจะส่งผลให้ ความดันโลหิตสูงขึ้นอีก และ ทำให้เลือดแข็งตัวง่ายขึ้น ซึ่งจะไปซ้ำเติมหลอดเลือดที่กำลังมีปัญหา และเพิ่มความเสี่ยงรุนแรงต่อการเกิด เส้นเลือดสมองตีบ/แตก หรือ หัวใจวายเฉียบพลัน ได้'
        );
        applyRule(
          'POP',
          2,
          'ส่วนที่ 1: สัญญาณชีพความดันโลหิตสูงรุนแรง',
          `ความดันโลหิตสูงรุนแรง (${sbpNum}/${dbpNum} mmHg)`,
          'ทางเลือกที่ใช้ได้ปลอดภัย แต่ควรส่งต่อพบแพทย์เพื่อควบคุมความดันโลหิตควบคู่กัน'
        );
        applyRule(
          'IMPLANT',
          2,
          'ส่วนที่ 1: สัญญาณชีพความดันโลหิตสูงรุนแรง',
          `ความดันโลหิตสูงรุนแรง (${sbpNum}/${dbpNum} mmHg)`,
          'ทางเลือกที่ใช้ได้ปลอดภัย แต่ควรส่งต่อพบแพทย์เพื่อควบคุมความดันโลหิตควบคู่กัน'
        );
        applyRule(
          'DMPA',
          3,
          'ส่วนที่ 1: สัญญาณชีพความดันโลหิตสูงรุนแรง',
          `ความดันโลหิตสูงรุนแรง (${sbpNum}/${dbpNum} mmHg)`,
          'ความดันโลหิตสูงรุนแรง หากเลือกวิธี DMPA ควรอยู่ในดุลยพินิจของแพทย์',
          'ส่งต่อปรึกษาแพทย์ หรือ ปรึกษาแพทย์ทางไกล (Teleconsult)'
        );
      } else {
        // SBP 140-159 or DBP 90-99
        applyRule(
          'COC',
          3,
          'ส่วนที่ 1: สัญญาณชีพความดันโลหิตสูง (140–159 / 90–99 mmHg)',
          `ความดันโลหิตสูงจากสัญญาณชีพ (${sbpNum}/${dbpNum} mmHg)`,
          'ฮอร์โมนเอสโตรเจนอาจทำให้ความดันโลหิตสูงขึ้นและเพิ่มความเสี่ยงต่อโรคหลอดเลือดสมองและหัวใจ จึงไม่แนะนำให้ใช้',
          'ส่งต่อปรึกษาแพทย์ หรือ ปรึกษาแพทย์ทางไกล (Teleconsult)'
        );
        applyRule(
          'DMPA',
          2,
          'ส่วนที่ 1: สัญญาณชีพความดันโลหิตสูง (140–159 / 90–99 mmHg)',
          `ความดันโลหิตสูงจากสัญญาณชีพ (${sbpNum}/${dbpNum} mmHg)`,
          'ใช้ได้โดยควรตรวจติดตามระดับความดันโลหิตอย่างสม่ำเสมอ'
        );
      }
    }
  }

  // 3. Smoking check in Step 1
  if (state.smokingStatus === 'smoker') {
    const cigsLabel =
      state.cigarettesPerDay === '' ? 'ไม่ระบุจำนวน' : `${cigsNum} มวน/วัน`;

    if (ageNum < 35) {
      applyRule(
        'COC',
        2,
        'ส่วนที่ 1: การสูบบุหรี่',
        `สูบบุหรี่ (${cigsLabel}) และอายุน้อยกว่า 35 ปี`,
        'การสูบบุหรี่เพิ่มความเสี่ยงต่อระบบหลอดเลือด แต่ในผู้ที่อายุน้อยกว่า 35 ปียังสามารถใช้ได้โดยควรแนะนำให้ลด/เลิกบุหรี่'
      );
    } else if (ageNum >= 35 && cigsNum < 15) {
      applyRule(
        'COC',
        3,
        'ส่วนที่ 1: การสูบบุหรี่',
        `อายุ ≥ 35 ปี (${ageNum} ปี) และสูบบุหรี่ < 15 มวน/วัน (${cigsLabel})`,
        'อายุ 35 ปีขึ้นไปร่วมกับการสูบบุหรี่ เพิ่มความเสี่ยงต่อการเกิดโรคหลอดเลือดหัวใจและหลอดเลือดสมองตีบ',
        'ส่งต่อปรึกษาแพทย์ หรือ ปรึกษาแพทย์ทางไกล (Teleconsult)'
      );
    } else if (ageNum >= 35 && cigsNum >= 15) {
      applyRule(
        'COC',
        4,
        'ส่วนที่ 1: การสูบบุหรี่',
        `อายุ ≥ 35 ปี (${ageNum} ปี) และสูบบุหรี่หนัก ≥ 15 มวน/วัน (${cigsLabel})`,
        'บุหรี่ทำให้หลอดเลือดอักเสบและเกร็งตัวง่ายอยู่แล้ว ฮอร์โมนในยาคุมจะยิ่งเร่งให้ เลือดข้นและแข็งตัวเป็นก้อนง่ายขึ้น ยิ่งประกอบกับอายุ 35 ปีขึ้นไปร่วมกับสูบบุหรี่หนัก (15 มวน/วันขึ้นไป) จะส่งผลอันตรายมากขึ้นและ เสี่ยงต่อการเกิดเส้นเลือดสมองตีบ (อัมพฤกษ์/อัมพาต) หรือหัวใจวายเฉียบพลันสูงมาก'
      );
    }
  }
}
