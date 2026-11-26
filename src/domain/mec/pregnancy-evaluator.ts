import type { PatientAssessmentState, PregnancyEvaluationResult } from './types';

export function evaluatePregnancyStatus(
  state: PatientAssessmentState,
  globalClinicalAlerts: string[]
): PregnancyEvaluationResult {
  if (!state.pregnancyNoneOfSix && state.pregnancyCriteriaSelected.length > 0) {
    return {
      status: 'reasonably_certain_not_pregnant',
      summaryTitle: 'มั่นใจว่าไม่ตั้งครรภ์ (Enter Quick Start)',
      summaryDetail:
        'ผู้รับบริการเข้าเกณฑ์ประเมินการไม่ตั้งครรภ์อย่างน้อย 1 ข้อ สามารถเริ่มให้บริการคุมกำเนิดได้ทันที (Quick Start)',
      requiresBackup7Days: false,
      requiresRepeatUpt2To4Weeks: false,
      requiresEmergencyContraception: false,
      isPregnantStop: false,
    };
  }

  if (state.uptResult === 'positive') {
    globalClinicalAlerts.push(
      'ผลตรวจ UPT เป็นบวก (ตั้งครรภ์): แนะนำการฝากครรภ์ (ANC) และงดจ่ายยาคุมกำเนิดทุกชนิด'
    );
    return {
      status: 'pregnant_anc',
      summaryTitle: 'ผลตรวจปัสสาวะ (UPT) = บวก (ตั้งครรภ์)',
      summaryDetail:
        'ตรวจพบการตั้งครรภ์ ห้ามเริ่มวิธีคุมกำเนิดทุกชนิด แนะนำส่งต่อเข้าคลินิกฝากครรภ์ (ANC) ทันที',
      requiresBackup7Days: false,
      requiresRepeatUpt2To4Weeks: false,
      requiresEmergencyContraception: false,
      isPregnantStop: true,
    };
  }

  if (state.uptResult === 'negative') {
    if (state.unprotectedSex5Days === 'yes') {
      globalClinicalAlerts.push(
        'ผู้รับบริการมีเพศสัมพันธ์ไม่ป้องกันภายใน 5 วันที่ผ่านมา: พิจารณาจ่ายยาคุมกำเนิดฉุกเฉิน (Emergency Contraception) ร่วมกับแนะนำวิธีสำรอง 7 วัน และนัดตรวจ UPT ซ้ำใน 2–4 สัปดาห์'
      );
      return {
        status: 'upt_negative_ec_needed',
        summaryTitle: 'UPT = ลบ (มีเพศสัมพันธ์ไม่ป้องกันใน 5 วันที่ผ่านมา -> พิจารณา EC + วิธีสำรอง 7 วัน)',
        summaryDetail:
          'ไม่สามารถยืนยันการไม่ตั้งครรภ์ 100% -> พิจารณาให้ยาคุมกำเนิดฉุกเฉิน (Emergency Contraception) ร่วมกับเริ่มคุมกำเนิดแบบ Quick Start + ใช้วิธีสำรอง (ถุงยางอนามัย/งดเพศสัมพันธ์) อย่างน้อย 7 วัน + นัดตรวจ UPT ซ้ำใน 2–4 สัปดาห์',
        requiresBackup7Days: true,
        requiresRepeatUpt2To4Weeks: true,
        requiresEmergencyContraception: true,
        isPregnantStop: false,
      };
    }

    globalClinicalAlerts.push(
      'คำแนะนำสำคัญ (Back-up Protection): ให้ใช้วิธีงดมีเพศสัมพันธ์หรือใช้ถุงยางอนามัยควบคู่ไปด้วยอย่างน้อย 7 วันแรกหลังเริ่มคุมกำเนิด และนัดตรวจ UPT ซ้ำใน 2–4 สัปดาห์'
    );
    return {
      status: 'upt_negative_backup_needed',
      summaryTitle: 'UPT = ลบ (แนะนำ Quick Start + วิธีสำรอง 7 วัน + นัดตรวจซ้ำ 2–4 สัปดาห์)',
      summaryDetail:
        'ไม่สามารถยืนยันการไม่ตั้งครรภ์ 100% -> แนะนำเริ่มคุมกำเนิดทันที (Quick Start) ควบคู่กับการใช้วิธีสำรอง (งดมีเพศสัมพันธ์หรือใช้ถุงยางอนามัย) อย่างน้อย 7 วันแรก + นัดผู้รับบริการ 4 (2–4) สัปดาห์เพื่อตรวจ UPT ซ้ำอีกครั้ง',
      requiresBackup7Days: true,
      requiresRepeatUpt2To4Weeks: true,
      requiresEmergencyContraception: false,
      isPregnantStop: false,
    };
  }

  if (!state.pregnancyNoneOfSix && state.pregnancyCriteriaSelected.length === 0 && state.uptResult === 'not_done') {
    return {
      status: 'pending_upt',
      summaryTitle: 'รอการประเมินการไม่ตั้งครรภ์ (ขั้นตอนที่ 2)',
      summaryDetail:
        'กรุณาเลือกเกณฑ์ประเมินการไม่ตั้งครรภ์ 6 ข้อในขั้นตอนที่ 2 หรือเลือก "ไม่มีข้อใดข้างต้นเลย" เพื่อบันทึกผลตรวจปัสสาวะ (UPT)',
      requiresBackup7Days: false,
      requiresRepeatUpt2To4Weeks: false,
      requiresEmergencyContraception: false,
      isPregnantStop: false,
    };
  }

  return {
    status: 'pending_upt',
    summaryTitle: 'รอผลตรวจปัสสาวะ (Urine Pregnancy Test - UPT)',
    summaryDetail:
      'ผู้รับบริการไม่เข้าเกณฑ์ทั้ง 6 ข้อ กรุณาตรวจปัสสาวะ (UPT) เพื่อประเมินภาวะตั้งครรภ์ก่อนดำเนินการต่อ',
    requiresBackup7Days: true,
    requiresRepeatUpt2To4Weeks: true,
    requiresEmergencyContraception: false,
    isPregnantStop: false,
  };
}
