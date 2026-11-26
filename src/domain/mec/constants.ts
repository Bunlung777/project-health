import type {
  CategoryMeta,
  ContraceptiveMethodId,
  ContraceptiveMethodInfo,
  MecCategory,
} from './types';

export const WIZARD_STEPS = [
  { step: 1, title: 'ขั้นตอนที่ 1', subtitle: 'ข้อมูลทั่วไปและสัญญาณชีพ' },
  { step: 2, title: 'ขั้นตอนที่ 2', subtitle: 'ประเมินการไม่ตั้งครรภ์' },
  { step: 3, title: 'ขั้นตอนที่ 3', subtitle: 'ภาวะเสี่ยงสูง 6 ข้อ' },
  { step: 4, title: 'ขั้นตอนที่ 4', subtitle: 'โรคประจำตัวและยาที่ใช้' },
  { step: 5, title: 'ขั้นตอนที่ 5', subtitle: 'ผลประเมิน WHO MEC' },
  { step: 6, title: 'ขั้นตอนที่ 6', subtitle: 'คำแนะนำทางการแพทย์' },
  { step: 7, title: 'ขั้นตอนที่ 7', subtitle: 'สรุปเวชระเบียนและใบส่งตัว' },
] as const;

export const CONTRACEPTIVE_METHODS: Record<ContraceptiveMethodId, ContraceptiveMethodInfo> = {
  COC: {
    id: 'COC',
    code: 'COC / CHC',
    shortName: 'CHC (ยาคุมรวม/ฉีดรายเดือน)',
    fullNameTh: 'ยาเม็ดคุมกำเนิดชนิดฮอร์โมนรวม / ยาฉีดรายเดือน',
    fullNameEn: 'Combined Oral Contraceptives (COC / CHC)',
    description: 'ประกอบด้วยฮอร์โมนเอสโตรเจนและโปรเจสติน ต้องรับประทานทุกวันในเวลาเดียวกัน',
    specialWarnings: [
      'ควรรับประทานยาเวลาเดียวกันทุกวันเพื่อประสิทธิภาพสูงสุด',
      'ไม่ป้องกันโรคติดต่อทางเพศสัมพันธ์ (STIs)',
      'หากมีอาการปวดศีรษะรุนแรง เจ็บหน้าอก ตาพร่ามัว หรือปวดบวมน่องข้างเดียว ให้หยุดยาและพบแพทย์ทันที',
    ],
  },
  POP: {
    id: 'POP',
    code: 'POP',
    shortName: 'POP (ยาคุมเม็ดเดี่ยว)',
    fullNameTh: 'ยาเม็ดคุมกำเนิดชนิดฮอร์โมนเดี่ยว',
    fullNameEn: 'Progestin-Only Pill (POP)',
    description: 'มีเฉพาะฮอร์โมนโปรเจสติน ปลอดภัยในหญิงให้นมบุตรและผู้ที่มีข้อห้ามใช้เอสโตรเจน',
    specialWarnings: [
      'ต้องรับประทานตรงเวลาทุกวันอย่างเคร่งครัด (คลาดเคลื่อนไม่เกิน 3 ชั่วโมง)',
      'อาจมีเลือดออกกะปริบกะปรอยในช่วงแรกของการใช้ยา',
    ],
  },
  DMPA: {
    id: 'DMPA',
    code: 'DMPA',
    shortName: 'DMPA (ยาฉีด 3 เดือน)',
    fullNameTh: 'ยาฉีดคุมกำเนิดชนิดฮอร์โมนเดี่ยว (ทุก 3 เดือน)',
    fullNameEn: 'Depot Medroxyprogesterone Acetate (DMPA)',
    description: 'ฉีดเข้ากล้ามเนื้อทุก 12 สัปดาห์ (3 เดือน) ประสิทธิภาพสูง ไม่ต้องรับประทานยาทุกวัน',
    specialWarnings: [
      'ควรระวังเรื่องมวลกระดูกบางลงหากใช้นานติดต่อกันเกิน 2 ปี (แนะนำประเมินความเสี่ยงซ้ำ)',
      'อาจทำให้มีเลือดออกกะปริบกะปรอย หรือประจำเดือนขาดหายไปหลังฉีดต่อเนื่อง',
      'หลังหยุดฉีดอาจใช้เวลา 6–12 เดือนกว่าภาวะเจริญพันธุ์จะกลับมาตามปกติ',
    ],
  },
  IMPLANT: {
    id: 'IMPLANT',
    code: 'Implant',
    shortName: 'Implant (ยาฝังคุมกำเนิด)',
    fullNameTh: 'ยาฝังคุมกำเนิดชนิดฮอร์โมนเดี่ยว (3 หรือ 5 ปี)',
    fullNameEn: 'Progestin-only Implant (Etonogestrel / Levonorgestrel)',
    description: 'ฝังหลอดยาใต้ท้องแขน ประสิทธิภาพในการคุมกำเนิดสูงที่สุด (LARC) ออกฤทธิ์นาน 3–5 ปี',
    specialWarnings: [
      'อาจมีประจำเดือนมาไม่สม่ำเสมอ หรือกะปริบกะปรอยได้ ซึ่งเป็นอาการปกติที่ไม่อันตราย',
      'สามารถถอดออกเมื่อต้องการมีบุตร และภาวะเจริญพันธุ์จะกลับคืนมาทันทีหลังถอดยา',
    ],
  },
  CU_IUD: {
    id: 'CU_IUD',
    code: 'Cu-IUD / LNG-IUD',
    shortName: 'Cu-IUD (ห่วงอนามัย)',
    fullNameTh: 'ห่วงอนามัยชนิดห่วงทองแดง / ห่วงอนามัยเคลือบฮอร์โมน',
    fullNameEn: 'Copper-bearing IUD (Cu-IUD) / LNG-IUD',
    description: 'อุปกรณ์ใส่ในโพรงมดลูก ชนิดห่วงทองแดงไม่มีฮอร์โมนใดๆ ออกฤทธิ์นาน 5–10 ปี',
    specialWarnings: [
      'อาจทำให้ปริมาณประจำเดือนมากขึ้นหรือปวดท้องประจำเดือนมากขึ้นในช่วง 3–6 เดือนแรก',
      'ควรตรวจเช็คสายห่วงอนามัยหลังหมดประจำเดือน และไม่ควรใส่หากสงสัยการติดเชื้อในอุ้งเชิงกราน',
    ],
  },
};

export const MEC_CATEGORY_META: Record<MecCategory, CategoryMeta> = {
  1: {
    category: 1,
    titleTh: 'Category 1: ใช้ได้ไม่มีข้อห้าม (Use method in any circumstances)',
    clinicalMeaning: 'ใช้ได้ไม่มีข้อห้าม ปลอดภัยในทุกสภาวะ',
    systemAction: 'เจ้าหน้าที่ รพ.สต. จ่ายยาหรือให้บริการได้ทันที',
    badgeColor: 'bg-[var(--mec-safe-bg)] text-[var(--mec-safe-ink)] border border-[var(--mec-safe-border)]',
    cardBorder: 'border-[var(--mec-safe-border)]',
    cardBg: 'bg-[var(--mec-safe-bg)]',
    textColor: 'text-[var(--mec-safe-ink)]',
    statusLight: 'ระดับ 1 (ใช้ได้ไม่มีข้อห้าม)',
  },
  2: {
    category: 2,
    titleTh: 'Category 2: ข้อดีมากกว่าความเสี่ยง ใช้ได้แต่ควรติดตามผล (Generally use)',
    clinicalMeaning: 'ข้อดีมากกว่าความเสี่ยง ใช้ได้โดยทั่วไป',
    systemAction: 'ให้บริการที่ รพ.สต. ได้ พร้อมให้คำแนะนำและติดตามผลเพิ่มเติม',
    badgeColor: 'bg-[var(--mec-follow-bg)] text-[var(--mec-follow-ink)] border border-[var(--mec-follow-border)]',
    cardBorder: 'border-[var(--mec-follow-border)]',
    cardBg: 'bg-[var(--mec-follow-bg)]',
    textColor: 'text-[var(--mec-follow-ink)]',
    statusLight: 'ระดับ 2 (ใช้ได้ ควรติดตามผล)',
  },
  3: {
    category: 3,
    titleTh: 'Category 3: ความเสี่ยงมากกว่าข้อดี ไม่แนะนำ (Theoretical or proven risks usually outweigh advantages)',
    clinicalMeaning: 'ความเสี่ยงมากกว่าข้อดี ไม่แนะนำ เว้นแต่ไม่มีทางเลือกอื่นและแพทย์ประเมินแล้ว',
    systemAction: 'ส่งต่อปรึกษาแพทย์ หรือปรึกษาแพทย์ทางไกล (Teleconsult) ก่อนให้บริการ',
    badgeColor: 'bg-[var(--mec-caution-bg)] text-[var(--mec-caution-ink)] border border-[var(--mec-caution-border)]',
    cardBorder: 'border-[var(--mec-caution-border)]',
    cardBg: 'bg-[var(--mec-caution-bg)]',
    textColor: 'text-[var(--mec-caution-ink)]',
    statusLight: 'ระดับ 3 (ส่งต่อปรึกษาแพทย์)',
  },
  4: {
    category: 4,
    titleTh: 'Category 4: ห้ามใช้เด็ดขาด เป็นอันตรายต่อสุขภาพ (Unacceptable health risk)',
    clinicalMeaning: 'ห้ามใช้เด็ดขาด (Absolute Contraindication) มีความเสี่ยงอันตรายร้ายแรงต่อสุขภาพ',
    systemAction: 'ห้ามให้บริการวิธีนี้เด็ดขาด พิจารณาทางเลือกอื่นหรือส่งต่อโรงพยาบาลแม่ข่าย',
    badgeColor: 'bg-[var(--mec-danger-bg)] text-[var(--mec-danger-ink)] border border-[var(--mec-danger-border)]',
    cardBorder: 'border-[var(--mec-danger-border)]',
    cardBg: 'bg-[var(--mec-danger-bg)]',
    textColor: 'text-[var(--mec-danger-ink)]',
    statusLight: 'ระดับ 4 (ห้ามใช้เด็ดขาด)',
  },
};

export const PREGNANCY_CHECKLIST_ITEMS = [
  {
    id: 'menses_7_days',
    label: '1. อยู่ในช่วง 7 วันแรกนับจากวันแรกที่มีประจำเดือนปกติ (First 7 days of normal menses)',
  },
  {
    id: 'no_intercourse',
    label: '2. ไม่เคยมีเพศสัมพันธ์เลย ตั้งแต่มีประจำเดือนปกติครั้งล่าสุด, ตั้งแต่คลอดบุตร, หรือตั้งแต่แท้งบุตร',
  },
  {
    id: 'consistent_contraception',
    label: '3. ใช้วิธีคุมกำเนิดที่มีประสิทธิภาพสูงอย่างถูกต้องและสม่ำเสมอมาโดยตลอด',
  },
  {
    id: 'postpartum_4_weeks',
    label: '4. คลอดบุตรมาไม่เกิน 4 สัปดาห์ (Within 4 weeks postpartum)',
  },
  {
    id: 'postabortion_7_days',
    label: '5. เพิ่งแท้งบุตรหรือทำแท้งมาไม่เกิน 7 วัน (Within 7 days post-abortion)',
  },
  {
    id: 'lam_6_months',
    label: '6. คลอดบุตรมาไม่เกิน 6 เดือน ร่วมกับ ให้นมบุตรอย่างเดียว/เกือบทั้งหมด (Exclusive/Nearly exclusive breastfeeding) และยังไม่มีประจำเดือนกลับมาเลย (LAM)',
  },
] as const;

export const THAI_ENUM_LABELS = {
  postpartumPeriod: {
    none: 'ไม่ได้อยู่ในระยะหลังคลอด',
    lt_21_days: 'หลังคลอด < 21 วัน (น้อยกว่า 3 สัปดาห์)',
    '21_to_42_days': 'หลังคลอด 21–42 วัน (< 6 สัปดาห์)',
    gte_6_weeks_bf: 'หลังคลอด ≥ 6 สัปดาห์ (ให้นมบุตร)',
  },
  cirrhosisSeverity: {
    mild_compensated: 'ระยะเริ่มต้น ตับยังทำงานชดเชยได้ (Mild / Compensated)',
    severe_decompensated: 'ระยะรุนแรง / ตับวาย (Severe / Decompensated)',
    unknown: 'ไม่ทราบระดับความรุนแรง (ต้องส่งต่อปรึกษาแพทย์)',
  },
  breastDiseaseType: {
    undiagnosed_mass: 'ก้อนเนื้อที่เต้านมที่ยังไม่ได้รับการวินิจฉัย',
    benign: 'ก้อนเนื้อเต้านมชนิดไม่ใช่เนื้อร้าย/ไม่ใช่มะเร็ง (Benign)',
    cancer: 'มะเร็งเต้านม (Breast Cancer)',
  },
  epilepsyDrugType: {
    enzyme_inducer:
      'ยากันชักกลุ่มกระตุ้นเอนไซม์ตับ (Phenytoin / Carbamazepine / Barbiturate / Primidone / Topiramate / Oxcarbazepine)',
    other_drugs: 'ยากันชักกลุ่มอื่นๆ ที่ไม่ลดฤทธิ์ยาคุมกำเนิด',
    unknown: 'ไม่ทราบชื่อยากันชัก (ต้องส่งต่อปรึกษาแพทย์)',
  },
} as const;
