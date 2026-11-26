'use client';

import React, { useEffect, useRef } from 'react';
import {
  CONTRACEPTIVE_METHODS,
  ContraceptiveMethodId,
  MecCategory,
  PREGNANCY_CHECKLIST_ITEMS,
  THAI_ENUM_LABELS,
} from '@/domain/mec';
import { useAssessmentWizard } from '@/hooks/useAssessmentWizard';

const STEP_TITLES = [
  '',
  'ดำเนินการต่อ (ขั้นที่ 2: การคัดกรองการตั้งครรภ์)',
  'ดำเนินการต่อ (ขั้นที่ 3: สัญญาณเตือน)',
  'ดำเนินการต่อ (ขั้นที่ 4: โรคและยา)',
  'ดูตารางผล 5 วิธี (ขั้นที่ 5)',
  'ดูคำแนะนำคลินิก (ขั้นที่ 6)',
  'เสร็จสิ้นและเริ่มเคสใหม่',
] as const;

const STEP_NAV = [
  { step: 1, title: 'ข้อมูลทั่วไป' },
  { step: 2, title: 'การตั้งครรภ์' },
  { step: 3, title: 'สัญญาณเตือน' },
  { step: 4, title: 'โรคและยา' },
  { step: 5, title: 'ตาราง 5 วิธี' },
  { step: 6, title: 'คำแนะนำคลินิก' },
] as const;

function MaterialIcon({ name, className = 'w-5 h-5' }: { name: string; className?: string }) {
  switch (name) {
    case 'local_hospital':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-8.5-2h3v-3.5H17v-3h-3.5V7h-3v3.5H7v3h3.5V17z" />
        </svg>
      );
    case 'restart_alt':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 5V2L8 6l4 4V7c3.31 0 6 2.69 6 6 0 2.97-2.17 5.43-5 5.91v2.02c3.95-.49 7-3.85 7-7.93 0-4.42-3.58-8-8-8zm-6 8c0-1.65.67-3.15 1.76-4.24l-1.42-1.42C4.9 8.79 4 10.79 4 13c0 4.08 3.05 7.44 7 7.93v-2.02c-2.83-.48-5-2.94-5-5.91z" />
        </svg>
      );
    case 'menu_book':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z" />
        </svg>
      );
    case 'badge':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20 7h-5V4c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM9 12c.83 0 1.5.67 1.5 1.5S9.83 15 9 15s-1.5-.67-1.5-1.5S8.17 12 9 12zm3 6H6v-.75c0-1 2-1.5 3-1.5s3 .5 3 1.5V18zm1-9h-2V4h2v5zm5 7.5h-4V15h4v1.5zm0-3h-4V12h4v1.5z" />
        </svg>
      );
    case 'monitor_heart':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M15.11 12.45L14 10.24l-3.11 6.21c-.16.34-.51.55-.89.55s-.73-.21-.89-.55L7.38 13H2v-2h6c.38 0 .72.21.89.55L10 13.76l3.11-6.21c.34-.68 1.45-.68 1.79 0L16.62 11H22v2h-6c-.38 0-.72-.21-.89-.55z" />
        </svg>
      );
    case 'check_circle':
    case 'verified':
    case 'verified_user':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      );
    case 'shield':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
        </svg>
      );
    case 'info':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
        </svg>
      );
    case 'warning':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
        </svg>
      );
    case 'block':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z" />
        </svg>
      );
    case 'colorize':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20.71 5.63l-2.34-2.34a.996.996 0 00-1.41 0l-3.12 3.12-1.93-1.91-1.41 1.41 1.42 1.42L3 16.25V21h4.75l8.92-8.92 1.42 1.42 1.41-1.41-1.92-1.92 3.12-3.12c.4-.4.4-1.03.01-1.42zM6.92 19L5 17.08l8.06-8.06 1.92 1.92L6.92 19z" />
        </svg>
      );
    case 'calendar_month':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z" />
        </svg>
      );
    case 'pill':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M4.22 11.29l7.07-7.07a6 6 0 018.49 8.49l-7.07 7.07a6 6 0 01-8.49-8.49zm1.41 1.41a4 4 0 005.66 5.66l2.83-2.83-5.66-5.66-2.83 2.83z" />
        </svg>
      );
    case 'vaccines':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19.5 3.5L18 2l-1.5 1.5L15 2l-1.41 1.41 1.5 1.5-2.12 2.12-1.41-1.41-1.41 1.41 1.41 1.41-6.36 6.36c-.78.78-.78 2.05 0 2.83l.71.71-2.42 2.42 1.41 1.41 2.42-2.42.71.71c.78.78 2.05.78 2.83 0l6.36-6.36 1.41 1.41 1.41-1.41-1.41-1.41 2.12-2.12 1.5 1.5L22 9l-1.5-1.5L22 6l-2.5-2.5z" />
        </svg>
      );
    case 'water_drop':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z" />
        </svg>
      );
    case 'fact_check':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM10 17H5v-2h5v2zm0-4H5v-2h5v2zm0-4H5V7h5v2zm4.82 6L12 12.16l1.41-1.41 1.41 1.42L17.99 9l1.42 1.42L14.82 15z" />
        </svg>
      );
    case 'bolt':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66l.1-.16L13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15L11 21z" />
        </svg>
      );
    case 'chevron_left':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      );
    case 'chevron_right':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
        </svg>
      );
    case 'arrow_back':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
        </svg>
      );
    case 'arrow_forward':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
        </svg>
      );
    case 'close':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      );
    case 'print':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" />
        </svg>
      );
    case 'save':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
        </svg>
      );
    default:
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}

function getCategoryStyle(cat: MecCategory) {
  if (cat === 1) {
    return {
      pillClass: 'bg-[#E7F3ED] text-[#16563C]',
      boxClass: 'bg-[#F2F8F5] border-[#d6ebdF] text-[#16563C]',
      shortText: 'MEC Cat 1',
      titleText: 'Category 1: ใช้ได้ปลอดภัยสูง (ไม่มีข้อห้าม)',
      actionText: 'เจ้าหน้าที่ รพ.สต. จ่ายยา/ให้บริการได้ทันที',
      iconName: 'verified',
    };
  }
  if (cat === 2) {
    return {
      pillClass: 'bg-[#F1F7F9] text-[#1A505D]',
      boxClass: 'bg-[#F1F7F9] border-[#d3e5eb] text-[#1A505D]',
      shortText: 'MEC Cat 2',
      titleText: 'Category 2: ข้อดีมากกว่าความเสี่ยง (ใช้ได้แต่ควรติดตามผล)',
      actionText: 'ให้บริการที่ รพ.สต. ได้ พร้อมให้คำแนะนำเพิ่มเติม',
      iconName: 'check_circle',
    };
  }
  if (cat === 3) {
    return {
      pillClass: 'bg-[#FCF7F0] text-[#7D490D]',
      boxClass: 'bg-[#FCF7F0] border-[#f5e3cd] text-[#7D490D]',
      shortText: 'MEC Cat 3',
      titleText: 'Category 3: ไม่แนะนำให้ใช้ / ไม่ควรใช้วิธีนี้ (ความเสี่ยงมากกว่าประโยชน์ / ควรหลีกเลี่ยง)',
      actionText: 'ส่งต่อปรึกษาแพทย์ หรือ ปรึกษาแพทย์ทางไกล (Teleconsult)',
      iconName: 'warning',
    };
  }
  return {
    pillClass: 'bg-[#FDF3F3] text-[#8F1D1D]',
    boxClass: 'bg-[#FDF3F3] border-[#fbd4d4] text-[#8F1D1D]',
    shortText: 'MEC Cat 4',
    titleText: 'Category 4: ห้ามใช้วิธีนี้โดยเด็ดขาด (Absolute Contraindication)',
    actionText: 'ห้ามให้บริการวิธีนี้เด็ดขาด / ส่งต่อ รพ.ชุมชน',
    iconName: 'block',
  };
}

export default function ContraceptiveDecisionSupportPage() {
  const {
    currentStep,
    setCurrentStep,
    showStandardRef,
    setShowStandardRef,
    state,
    updateState,
    mutateState,
    evaluation,
    showBackupPopup,
    setShowBackupPopup,
    hisSavedPayload,
    handleMockSaveHis,
    resetForm,
  } = useAssessmentWizard();

  const stepperContainerRef = useRef<HTMLDivElement | null>(null);
  const stepNavRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  const updateStepperScrollState = () => {
    const container = stepperContainerRef.current;
    if (!container) return;
    setCanScrollLeft(container.scrollLeft > 6);
    setCanScrollRight(
      container.scrollLeft + container.clientWidth < container.scrollWidth - 6
    );
  };

  const scrollStepperBy = (delta: number) => {
    const container = stepperContainerRef.current;
    if (!container) return;
    container.scrollBy({ left: delta, behavior: 'smooth' });
  };

  useEffect(() => {
    const container = stepperContainerRef.current;
    const activeNav = stepNavRefs.current[currentStep];
    if (container && activeNav) {
      const targetLeft =
        activeNav.offsetLeft - container.clientWidth / 2 + activeNav.offsetWidth / 2;
      container.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
      setTimeout(updateStepperScrollState, 250);
    }
    window.scrollTo({ top: 0 });
  }, [currentStep]);

  const age = typeof state.age === 'number' ? state.age : 28;
  const sbp = typeof state.sbp === 'number' ? state.sbp : 118;
  const dbp = typeof state.dbp === 'number' ? state.dbp : 76;
  const cigs = typeof state.cigarettesPerDay === 'number' ? state.cigarettesPerDay : 0;
  const bmi = evaluation.bmiInfo.bmi ?? 22.0;

  const rfChecked =
    !state.redFlagNone &&
    (state.redFlagMigraineAura ||
      state.redFlagBreastCancer ||
      state.redFlagVteStrokeIhd ||
      state.redFlagSevereHypertension ||
      state.redFlagUnexplainedBleedingOrPid ||
      (state.redFlagPostpartum && state.postpartumPeriod !== 'none') ||
      state.redFlagHeavySmokingOver35 ||
      state.redFlagEnzymeInducingDrugs);

  const anyPreg = !state.pregnancyNoneOfSix && state.pregnancyCriteriaSelected.length > 0;

  const goToStep = (step: number) => {
    if (step < 1 || step > 6) return;
    setCurrentStep(step);
  };

  const selectMethodAndGoStep6 = (methodId: ContraceptiveMethodId) => {
    updateState('selectedMethod', methodId);
    setCurrentStep(6);
  };

  const handleNextStep = () => {
    if (
      currentStep === 2 &&
      !anyPreg &&
      state.uptResult === 'negative' &&
      state.unprotectedSex5Days !== 'yes'
    ) {
      setShowBackupPopup(true);
      return;
    }

    // Step 3 Red Flags acts as a short cut directly to Step 5 (PDF Page 18)
    if (currentStep === 3 && rfChecked) {
      goToStep(5);
      return;
    }

    if (currentStep < 6) {
      goToStep(currentStep + 1);
    } else {
      handleResetFormAll();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  const handleResetFormAll = () => {
    if (window.confirm('ต้องการล้างข้อมูลเพื่อเริ่มประเมินเคสผู้รับบริการรายใหม่หรือไม่?')) {
      resetForm();
    }
  };

  const handleTogglePreg = (id: string) => {
    mutateState((prev) => {
      const exists = prev.pregnancyCriteriaSelected.includes(id);
      const nextList = exists
        ? prev.pregnancyCriteriaSelected.filter((item) => item !== id)
        : [...prev.pregnancyCriteriaSelected, id];
      return {
        ...prev,
        pregnancyCriteriaSelected: nextList,
        pregnancyNoneOfSix: nextList.length === 0,
        uptResult:
          nextList.length === 0 && prev.uptResult === 'not_done' ? 'negative' : prev.uptResult,
      };
    });
  };

  // BMI labels matching HTML script
  const bmiSubText =
    bmi < 18.5
      ? 'น้อยกว่าเกณฑ์'
      : bmi <= 22.9
      ? 'ปกติ (18.5-22.9)'
      : bmi <= 24.9
      ? 'น้ำหนักเกิน'
      : bmi < 30
      ? 'โรคอ้วนระดับ 1'
      : 'โรคอ้วน ≥ 30';

  const liveBmiLabelText =
    bmi < 18.5
      ? `BMI: ${bmi} kg/m² (น้อยกว่าเกณฑ์)`
      : bmi <= 22.9
      ? `BMI: ${bmi} kg/m² (สมส่วน)`
      : bmi <= 24.9
      ? `BMI: ${bmi} kg/m² (น้ำหนักเกิน)`
      : bmi < 30
      ? `BMI: ${bmi} kg/m² (โรคอ้วนระดับ 1)`
      : `BMI: ${bmi} kg/m² (โรคอ้วน ≥ 30 เสี่ยงหลอดเลือด)`;

  // BP labels matching HTML script
  const bpIsStage2 = sbp >= 160 || dbp >= 100;
  const bpIsStage1 = !bpIsStage2 && (sbp >= 140 || dbp >= 90);

  const bpSubText = bpIsStage2
    ? 'HT Stage 2 (สูงมาก)'
    : bpIsStage1
    ? 'HT Stage 1 (สูง)'
    : 'ปกติ Normo';

  const liveBpLabelText = bpIsStage2
    ? `BP: ${sbp}/${dbp} mmHg (สูงระดับ 2 ห้ามใช้ COC Cat 4)`
    : bpIsStage1
    ? `BP: ${sbp}/${dbp} mmHg (สูงระดับ 1 Cat 3 COC)`
    : `ความดันโลหิต: ${sbp}/${dbp} mmHg (ปกติ)`;

  // Smoking labels matching spec
  const isHeavySmokerOver35 = state.smokingStatus === 'smoker' && age >= 35 && cigs >= 15;
  const isLightSmokerOver35 = state.smokingStatus === 'smoker' && age >= 35 && cigs < 15;
  const isSmokerUnder35 = state.smokingStatus === 'smoker' && age < 35;

  const smkSummaryText =
    state.smokingStatus === 'none'
      ? 'ไม่สูบ'
      : state.cigarettesPerDay === ''
      ? 'สูบ (ไม่ระบุมวน/วัน)'
      : `สูบ ${cigs} มวน/วัน`;

  const smkSubText =
    state.smokingStatus === 'none'
      ? 'เสี่ยงต่ำ'
      : isHeavySmokerOver35
      ? 'COC(4) POP(1) DMPA(1) Implant(1) Cu-IUD(1)'
      : isLightSmokerOver35
      ? 'COC(3) POP(1) DMPA(1) Implant(1) Cu-IUD(1)'
      : 'COC(2) POP(1) DMPA(1) Implant(1) Cu-IUD(1)';

  const allMethodsCat1 = (
    ['COC', 'POP', 'DMPA', 'IMPLANT', 'CU_IUD'] as ContraceptiveMethodId[]
  ).every((m) => evaluation.methods[m].finalCategory === 1);

  const selectedMethodEval = evaluation.methods[state.selectedMethod];
  const selectedMethodInfo = CONTRACEPTIVE_METHODS[state.selectedMethod];
  const selectedMethodCatStyle = getCategoryStyle(selectedMethodEval.finalCategory);

  return (
    <div className="bg-[#faf5f6] text-[#28161c] antialiased min-h-screen flex flex-col pb-24 selection:bg-[#ffbdca] selection:text-[#7e1339]">
      {/* Mobile Sticky App Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#f0dce2] px-3.5 py-2.5 shadow-2xs no-print">
        <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#fff0f3] text-[#9e2d50] flex items-center justify-center border border-[#ffd5e1] shrink-0">
              <MaterialIcon name="local_hospital" className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-[14px] font-bold text-[#28161c] truncate leading-tight tracking-tight">
                  คุมกำเนิด รพ.สต.
                </h1>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#ffe8ed] text-[#9e2d50] shrink-0">
                  ปฐมภูมิ
                </span>
              </div>
              <span className="text-[11px] text-[#765660] truncate">WHO MEC 6th Edition</span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              className="w-8 h-8 rounded-lg border border-[#e5ccd3] bg-white text-[#564145] hover:bg-[#fff0f3] flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
              onClick={handleResetFormAll}
              title="ล้างข้อมูล"
              type="button"
            >
              <MaterialIcon name="restart_alt" className="w-[18px] h-[18px] text-[#765660]" />
            </button>
            <button
              className="h-8 px-2.5 rounded-lg border border-[#f0dce2] bg-[#fff0f3] text-[#9e2d50] text-[12px] font-bold flex items-center gap-1 transition-colors active:scale-95 cursor-pointer"
              onClick={() => setShowStandardRef(true)}
              type="button"
            >
              <MaterialIcon name="menu_book" className="w-4 h-4" />
              <span>MEC</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Stepper (Horizontal Scrollable Tabs with Scroll Affordance & Progress Track) */}
      <nav className="w-full bg-white border-b border-[#f0dce2] px-2 pt-1.5 pb-2 sticky top-[53px] z-30 shadow-2xs no-print">
        <div className="max-w-md mx-auto">
          {/* Top micro indicator showing current step & swipe/scroll hint */}
          <div className="flex items-center justify-between px-1.5 pb-1 text-[10.5px] text-[#765660]">
            <span className="font-bold text-[#9e2d50]">
              ขั้นตอนที่ {currentStep} / 6: {STEP_NAV[currentStep - 1]?.title}
            </span>
            <span className="flex items-center gap-0.5 text-[#897175]">
              <span>เลื่อนดูขั้นตอนซ้าย-ขวา</span>
              <MaterialIcon name="chevron_right" className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="relative flex items-center">
            {/* Left Scroll Button + Fade */}
            {canScrollLeft && (
              <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center bg-gradient-to-r from-white via-white/95 to-transparent pr-2">
                <button
                  type="button"
                  onClick={() => scrollStepperBy(-160)}
                  aria-label="เลื่อนขั้นตอนไปทางซ้าย"
                  className="w-7 h-7 rounded-full bg-[#fff0f3] border border-[#ffbdca] text-[#9e2d50] shadow-xs flex items-center justify-center active:scale-95 cursor-pointer"
                >
                  <MaterialIcon name="chevron_left" className="w-4 h-4" />
                </button>
              </div>
            )}

            <div
              ref={stepperContainerRef}
              onScroll={updateStepperScrollState}
              className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth px-1 w-full"
              id="stepper-container"
            >
              {STEP_NAV.map((item) => {
                const isActive = item.step === currentStep;
                const isCompleted = item.step < currentStep;
                return (
                  <button
                    key={item.step}
                    ref={(el) => {
                      stepNavRefs.current[item.step] = el;
                    }}
                    className={
                      isActive
                        ? 'step-nav-item flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#fff0f3] border border-[#ffbdca] text-[#9e2d50] shrink-0 min-h-[44px] transition-all cursor-pointer'
                        : isCompleted
                        ? 'step-nav-item flex items-center gap-1.5 px-3 py-2 rounded-xl bg-transparent border border-transparent text-[#16563C] shrink-0 min-h-[44px] transition-all hover:bg-[#fff7f9] cursor-pointer'
                        : 'step-nav-item flex items-center gap-1.5 px-3 py-2 rounded-xl bg-transparent border border-transparent text-[#564145] shrink-0 min-h-[44px] transition-all hover:bg-[#fff7f9] cursor-pointer'
                    }
                    id={`step-nav-${item.step}`}
                    onClick={() => goToStep(item.step)}
                    type="button"
                  >
                    <span
                      className={
                        isActive
                          ? 'w-6 h-6 rounded-full bg-[#9e2d50] text-white flex items-center justify-center text-[12px] font-bold shrink-0'
                          : isCompleted
                          ? 'w-6 h-6 rounded-full bg-[#E7F3ED] text-[#16563C] flex items-center justify-center text-[12px] font-bold shrink-0'
                          : 'w-6 h-6 rounded-full bg-[#f3d2da] text-[#564145] flex items-center justify-center text-[12px] font-bold shrink-0'
                      }
                      id={`step-icon-${item.step}`}
                    >
                      {isCompleted ? '✓' : item.step}
                    </span>
                    <span
                      className={
                        isActive
                          ? 'text-[12px] font-bold whitespace-nowrap text-[#9e2d50]'
                          : isCompleted
                          ? 'text-[12px] font-semibold whitespace-nowrap text-[#28161c]'
                          : 'text-[12px] font-medium whitespace-nowrap text-[#564145]'
                      }
                      id={`step-title-${item.step}`}
                    >
                      {item.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right Scroll Button + Fade */}
            {canScrollRight && (
              <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center bg-gradient-to-l from-white via-white/95 to-transparent pl-2">
                <button
                  type="button"
                  onClick={() => scrollStepperBy(160)}
                  aria-label="เลื่อนขั้นตอนไปทางขวา"
                  className="w-7 h-7 rounded-full bg-[#fff0f3] border border-[#ffbdca] text-[#9e2d50] shadow-xs flex items-center justify-center active:scale-95 cursor-pointer"
                >
                  <MaterialIcon name="chevron_right" className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* 6-Segment Step Progress Bar */}
          <div className="grid grid-cols-6 gap-1 px-1 pt-1.5">
            {STEP_NAV.map((item) => (
              <div
                key={item.step}
                className={`h-1 rounded-full transition-colors ${
                  item.step < currentStep
                    ? 'bg-[#16563C]'
                    : item.step === currentStep
                    ? 'bg-[#9e2d50]'
                    : 'bg-[#f3d2da]'
                }`}
              />
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Screen Content Wrapper (~390px viewport centered) */}
      <div className="w-full max-w-md mx-auto px-3.5 pt-3.5 flex flex-col gap-3.5 flex-1">
        {/* Case Summary Collapsible / Mobile Card */}
        <section className="w-full bg-[#fff0f3] rounded-2xl border border-[#f5cbd6] p-3 shadow-2xs no-print">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#f3d2da]">
            <div className="flex items-center gap-1.5 min-w-0">
              <MaterialIcon name="badge" className="w-[18px] h-[18px] text-[#9e2d50] text-[18px]" />
              <span className="text-[12.5px] font-bold text-[#28161c]">
                สรุปข้อมูลผู้รับบริการ
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-[#9e2d50] border border-[#ffd5e1] shrink-0">
              พว. ชนิดา
            </span>
          </div>

          {/* Compact 2-col or Horizontal Scroll Vitals */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/90 p-2 rounded-xl border border-[#f8e0e6] shadow-2xs">
              <span className="text-[10px] text-[#564145] block">อายุ</span>
              <span
                className="text-[15px] font-bold text-[#28161c] leading-tight block"
                id="summary-age"
              >
                {age} ปี
              </span>
              <span
                className="text-[9.5px] text-[#16563C] font-semibold block leading-snug"
                id="summary-age-sub"
              >
                {age >= 35 ? '≥ 35 ปี เฝ้าระวัง' : 'เจริญพันธุ์'}
              </span>
            </div>

            <div className="bg-white/90 p-2 rounded-xl border border-[#f8e0e6] shadow-2xs">
              <span className="text-[10px] text-[#564145] block">BMI</span>
              <span
                className="text-[15px] font-bold text-[#28161c] leading-tight block"
                id="summary-bmi"
              >
                {bmi.toFixed(1)}
              </span>
              <span
                className="text-[9.5px] text-[#16563C] font-semibold block leading-snug"
                id="summary-bmi-sub"
              >
                {bmiSubText}
              </span>
            </div>

            <div className="bg-white/90 p-2 rounded-xl border border-[#f8e0e6] shadow-2xs">
              <span className="text-[10px] text-[#564145] block">ความดัน (BP)</span>
              <span
                className="text-[15px] font-bold text-[#28161c] leading-tight block"
                id="summary-bp"
              >
                {sbp}/{dbp}
              </span>
              <span
                className={
                  bpIsStage2
                    ? 'text-[9.5px] text-[#ba1a1a] font-bold block leading-snug'
                    : bpIsStage1
                    ? 'text-[9.5px] text-[#7D490D] font-bold block leading-snug'
                    : 'text-[9.5px] text-[#16563C] font-semibold block leading-snug'
                }
                id="summary-bp-sub"
              >
                {bpSubText}
              </span>
            </div>

            <div className="bg-white/90 p-2 rounded-xl border border-[#f8e0e6] shadow-2xs">
              <span className="text-[10px] text-[#564145] block">บุหรี่</span>
              <span
                className="text-[13px] font-bold text-[#28161c] leading-tight block"
                id="summary-smoking"
              >
                {smkSummaryText}
              </span>
              <span
                className={
                  state.smokingStatus === 'none'
                    ? 'text-[9.5px] text-[#16563C] font-semibold block leading-snug'
                    : isHeavySmokerOver35
                    ? 'text-[9.5px] text-[#ba1a1a] font-bold block leading-snug'
                    : 'text-[9.5px] text-[#7D490D] font-medium block leading-snug'
                }
                id="summary-smoking-sub"
              >
                {smkSubText}
              </span>
            </div>

            <div className="bg-white/90 p-2 rounded-xl border border-[#f8e0e6] shadow-2xs">
              <span className="text-[10px] text-[#564145] block">ตั้งครรภ์</span>
              <span
                className="text-[13px] font-bold text-[#16563C] leading-tight block"
                id="summary-preg"
              >
                {anyPreg
                  ? 'ผ่านเกณฑ์'
                  : state.uptResult === 'positive'
                  ? 'ตั้งครรภ์'
                  : 'ตรวจ UPT'}
              </span>
              <span className="text-[9.5px] text-[#564145] block leading-snug">
                {anyPreg ? 'Quick Start ได้' : state.uptResult === 'negative' ? 'UPT = ลบ' : 'รอตรวจ'}
              </span>
            </div>

            <div className="bg-white/90 p-2 rounded-xl border border-[#f8e0e6] shadow-2xs">
              <span className="text-[10px] text-[#564145] block">Red Flags</span>
              <span
                className={
                  rfChecked
                    ? 'text-[13px] font-bold text-[#ba1a1a] leading-tight block'
                    : 'text-[13px] font-bold text-[#16563C] leading-tight block'
                }
                id="summary-rf"
              >
                {rfChecked ? 'ตรวจพบ!' : 'ไม่พบ'}
              </span>
              <span className="text-[9.5px] text-[#16563C] font-semibold block leading-snug">
                {rfChecked ? 'มีข้อห้าม Cat 4' : 'ปลอดภัยเริ่มใช้'}
              </span>
            </div>
          </div>
        </section>

        {/* STEP CONTAINER */}
        <main className="w-full flex flex-col gap-4">
          {/* ================= STEP 1: ข้อมูลทั่วไป ================= */}
          {currentStep === 1 && (
            <section className="step-panel flex flex-col gap-3.5" id="step-panel-1">
              <div className="bg-white rounded-2xl border border-[#f0dce2] p-4 shadow-sm flex flex-col gap-4">
                {/* Panel Header */}
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#f3d2da]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#fff0f3] text-[#9e2d50] flex items-center justify-center font-bold text-[15px] border border-[#ffd5e1] shrink-0">
                      1
                    </div>
                    <div>
                      <h2 className="text-[15px] font-bold text-[#28161c] leading-snug">
                        ข้อมูลทั่วไปและสัญญาณชีพ
                      </h2>
                      <p className="text-[11px] text-[#564145]">
                        General Info &amp; Vitals คัดกรองเบื้องต้น
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#fff0f3] text-[#9e2d50] border border-[#f5cbd6] shrink-0">
                    รพ.สต.
                  </span>
                </div>

                {/* Age, LMP & Smoking Fields */}
                <div className="space-y-3.5">
                  <div>
                    <label
                      className="block text-[12.5px] font-bold text-[#28161c] mb-1"
                      htmlFor="input-age"
                    >
                      อายุผู้รับบริการ (ปีบริบูรณ์) <span className="text-[#ba1a1a]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        className="w-full h-11 px-3.5 pr-12 rounded-xl border border-[#dcbfc4] bg-white text-[#28161c] text-[15px] font-semibold focus:outline-none focus:ring-2 focus:ring-[#9e2d50]"
                        id="input-age"
                        max={60}
                        min={10}
                        onChange={(e) =>
                          updateState('age', e.target.value === '' ? '' : Number(e.target.value))
                        }
                        type="number"
                        value={state.age}
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[13px] text-[#897175]">
                        ปี
                      </span>
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-[12.5px] font-bold text-[#28161c] mb-1"
                      htmlFor="input-lmp"
                    >
                      วันแรกของประจำเดือนรอบล่าสุด (LMP) <span className="text-[#ba1a1a]">*</span>
                    </label>
                    <input
                      className="w-full h-11 px-3.5 rounded-xl border border-[#dcbfc4] bg-white text-[#28161c] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#9e2d50]"
                      id="input-lmp"
                      onChange={(e) => updateState('lmpDate', e.target.value)}
                      type="date"
                      value={state.lmpDate}
                    />
                  </div>

                  <div>
                    <label className="block text-[12.5px] font-bold text-[#28161c] mb-1.5">
                      การสูบบุหรี่
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <label
                        className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer min-h-[44px] transition-colors ${
                          state.smokingStatus === 'none'
                            ? 'border-[#9e2d50] bg-[#fff0f3]'
                            : 'border-[#dcbfc4] bg-white'
                        }`}
                      >
                        <input
                          checked={state.smokingStatus === 'none'}
                          className="w-4 h-4 accent-[#9e2d50] shrink-0"
                          id="input-smoking-none"
                          name="smoking-status"
                          onChange={() =>
                            mutateState((prev) => ({
                              ...prev,
                              smokingStatus: 'none',
                              cigarettesPerDay: '',
                              redFlagHeavySmokingOver35: false,
                            }))
                          }
                          type="radio"
                        />
                        <span className="text-[13.5px] font-bold text-[#28161c]">ไม่สูบ</span>
                      </label>

                      <label
                        className={`flex items-center gap-2 p-2.5 px-3 rounded-xl border cursor-pointer min-h-[44px] transition-colors ${
                          state.smokingStatus === 'smoker'
                            ? 'border-[#9e2d50] bg-[#fff0f3]'
                            : 'border-[#dcbfc4] bg-white'
                        }`}
                      >
                        <input
                          checked={state.smokingStatus === 'smoker'}
                          className="w-4 h-4 accent-[#9e2d50] shrink-0"
                          id="input-smoking-yes"
                          name="smoking-status"
                          onChange={() =>
                            mutateState((prev) => ({
                              ...prev,
                              smokingStatus: 'smoker',
                              cigarettesPerDay:
                                prev.cigarettesPerDay === '' ? 1 : prev.cigarettesPerDay,
                            }))
                          }
                          type="radio"
                        />
                        <span className="text-[13.5px] font-bold text-[#28161c] shrink-0">
                          สูบ (ระบุ)
                        </span>
                        <input
                          aria-label="จำนวนบุหรี่ (มวน/วัน)"
                          className="w-20 h-9 px-2 rounded-lg border border-[#dcbfc4] bg-white text-[13.5px] font-bold text-[#28161c] text-center focus:outline-none focus:ring-2 focus:ring-[#9e2d50]"
                          id="input-cigarettes"
                          max={100}
                          min={0}
                          onChange={(e) => {
                            const raw = e.target.value;
                            mutateState((prev) => ({
                              ...prev,
                              smokingStatus: 'smoker',
                              cigarettesPerDay: raw === '' ? '' : Number(raw),
                            }));
                          }}
                          onFocus={() => {
                            if (state.smokingStatus !== 'smoker') {
                              mutateState((prev) => ({
                                ...prev,
                                smokingStatus: 'smoker',
                              }));
                            }
                          }}
                          placeholder="จำนวน"
                          type="number"
                          value={state.smokingStatus === 'smoker' ? state.cigarettesPerDay : ''}
                        />
                        <span className="text-[12px] text-[#564145] shrink-0">มวน/วัน</span>
                      </label>
                    </div>

                    {state.smokingStatus === 'smoker' && (
                      <div
                        className={`mt-2 p-3 rounded-xl border space-y-1.5 text-[11.5px] ${
                          isHeavySmokerOver35
                            ? 'bg-[#FDF3F3] border-[#fbd4d4] text-[#8F1D1D]'
                            : 'bg-[#FDF4E7] border-[#f3d9b1] text-[#7D490D]'
                        }`}
                        id="hint-smoking"
                      >
                        <div className="font-bold">
                          ผลประเมิน: {smkSubText}
                        </div>
                        {isSmokerUnder35 && (
                          <div className="leading-snug">
                            เหตุผล: การสูบบุหรี่เพิ่มความเสี่ยงต่อระบบหลอดเลือด แต่ในผู้ที่อายุน้อยกว่า 35 ปียังสามารถใช้ได้โดยควรแนะนำให้ลด/เลิกบุหรี่
                          </div>
                        )}
                        {isLightSmokerOver35 && (
                          <div className="leading-snug space-y-1">
                            <div>
                              เหตุผล: อายุ 35 ปีขึ้นไปร่วมกับการสูบบุหรี่ เพิ่มความเสี่ยงต่อการเกิดโรคหลอดเลือดหัวใจและหลอดเลือดสมองตีบ
                            </div>
                            <div className="font-bold text-[#9e2d50]">
                              แจ้งเตือน (เมื่อเลือก COC): ส่งต่อปรึกษาแพทย์ หรือ ปรึกษาแพทย์ทางไกล (Teleconsult)
                            </div>
                          </div>
                        )}
                        {isHeavySmokerOver35 && (
                          <div className="leading-snug space-y-1.5">
                            <div className="font-bold text-[#ba1a1a]">
                              CAT 4: ห้ามใช้วิธี COC โดยเด็ดขาด
                            </div>
                            <div>
                              เหตุผล: บุหรี่ทำให้หลอดเลือดอักเสบและเกร็งตัวง่ายอยู่แล้ว
                              ฮอร์โมนในยาคุมจะยิ่งเร่งให้เลือดข้นและแข็งตัวเป็นก้อนง่ายขึ้น
                              ยิ่งประกอบกับอายุ 35 ปีขึ้นไปร่วมกับสูบบุหรี่หนัก (15 มวน/วันขึ้นไป)
                              จะส่งผลอันตรายมากขึ้นและเสี่ยงต่อการเกิดเส้นเลือดสมองตีบ
                              (อัมพฤกษ์/อัมพาต) หรือหัวใจวายเฉียบพลันสูงมาก
                            </div>
                            <button
                              className="px-2.5 py-1 rounded-lg bg-[#ba1a1a] text-white text-[11px] font-bold cursor-pointer hover:bg-[#991515] transition-colors"
                              onClick={() => selectMethodAndGoStep6('COC')}
                              type="button"
                            >
                              ดูผลส่วนที่ 5 (CAT 4)
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Vitals Card: 2x2 Grid */}
                <div className="p-3.5 rounded-xl bg-[#fff7f9] border border-[#f5cbd6] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[#9e2d50]">
                      <MaterialIcon name="monitor_heart" className="w-[18px] h-[18px] text-[18px]" />
                      <span className="text-[13px] font-bold text-[#28161c]">
                        สัญญาณชีพ &amp; ดัชนีมวลกาย
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label
                        className="block text-[11px] font-semibold text-[#564145] mb-1"
                        htmlFor="input-weight"
                      >
                        น้ำหนัก (กก.)
                      </label>
                      <div className="relative">
                        <input
                          className="w-full h-10 px-2.5 pr-8 rounded-lg border border-[#dcbfc4] bg-white text-[14px] font-bold text-[#28161c] focus:outline-none focus:ring-2 focus:ring-[#9e2d50]"
                          id="input-weight"
                          onChange={(e) =>
                            updateState(
                              'weightKg',
                              e.target.value === '' ? '' : Number(e.target.value)
                            )
                          }
                          step="0.5"
                          type="number"
                          value={state.weightKg}
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-[#897175]">
                          กก.
                        </span>
                      </div>
                    </div>

                    <div>
                      <label
                        className="block text-[11px] font-semibold text-[#564145] mb-1"
                        htmlFor="input-height"
                      >
                        ส่วนสูง (ซม.)
                      </label>
                      <div className="relative">
                        <input
                          className="w-full h-10 px-2.5 pr-8 rounded-lg border border-[#dcbfc4] bg-white text-[14px] font-bold text-[#28161c] focus:outline-none focus:ring-2 focus:ring-[#9e2d50]"
                          id="input-height"
                          onChange={(e) =>
                            updateState(
                              'heightCm',
                              e.target.value === '' ? '' : Number(e.target.value)
                            )
                          }
                          type="number"
                          value={state.heightCm}
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-[#897175]">
                          ซม.
                        </span>
                      </div>
                    </div>

                    <div>
                      <label
                        className="block text-[11px] font-semibold text-[#564145] mb-1"
                        htmlFor="input-sbp"
                      >
                        BP บน (SBP)
                      </label>
                      <div className="relative">
                        <input
                          className="w-full h-10 px-2.5 pr-11 rounded-lg border border-[#dcbfc4] bg-white text-[14px] font-bold text-[#28161c] focus:outline-none focus:ring-2 focus:ring-[#9e2d50]"
                          id="input-sbp"
                          onChange={(e) =>
                            updateState('sbp', e.target.value === '' ? '' : Number(e.target.value))
                          }
                          type="number"
                          value={state.sbp}
                        />
                        <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] text-[#897175]">
                          mmHg
                        </span>
                      </div>
                    </div>

                    <div>
                      <label
                        className="block text-[11px] font-semibold text-[#564145] mb-1"
                        htmlFor="input-dbp"
                      >
                        BP ล่าง (DBP)
                      </label>
                      <div className="relative">
                        <input
                          className="w-full h-10 px-2.5 pr-11 rounded-lg border border-[#dcbfc4] bg-white text-[14px] font-bold text-[#28161c] focus:outline-none focus:ring-2 focus:ring-[#9e2d50]"
                          id="input-dbp"
                          onChange={(e) =>
                            updateState('dbp', e.target.value === '' ? '' : Number(e.target.value))
                          }
                          type="number"
                          value={state.dbp}
                        />
                        <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] text-[#897175]">
                          mmHg
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Alert Badges */}
                  <div className="space-y-2 pt-1 border-t border-[#f5cbd6]/60">
                    <div
                      className={`flex items-center gap-2 p-2 rounded-lg border ${
                        bmi >= 25
                          ? 'bg-[#fef9c3] border-[#fde047]'
                          : 'bg-white border-[#f0dce2]'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-[12px] shrink-0 ${
                          bmi >= 30
                            ? 'bg-[#FDF4E7] text-[#7D490D]'
                            : 'bg-[#E7F3ED] text-[#16563C]'
                        }`}
                        id="card-bmi-icon"
                      >
                        {bmi >= 30 ? '!' : '✓'}
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span
                          className="text-[11.5px] font-bold text-[#28161c] leading-snug"
                          id="live-bmi-label"
                        >
                          {liveBmiLabelText}
                        </span>
                        {bmi >= 30 &&
                        (age >= 35 ||
                          state.smokingStatus === 'smoker' ||
                          bpIsStage1 ||
                          bpIsStage2 ||
                          (!state.noComorbidities &&
                            (state.hasHypertension || state.hasDiabetes))) ? (
                          <div className="mt-1 pt-1 border-t border-[#f3d9b1] text-[10.5px] text-[#7D490D] space-y-1">
                            <div className="font-bold">
                              ผลประเมิน: COC(3) POP(2) DMPA(2) Implant(2) Cu-IUD(1)
                            </div>
                            <div className="font-bold text-[#9e2d50]">
                              CAT 3 : ไม่แนะนำ/ไม่ควรใช้วิธี COC (ส่งต่อปรึกษาแพทย์ หรือ Teleconsult)
                            </div>
                            <div>
                              <strong>เหตุผล:</strong>{' '}
                              เพราะน้ำหนักตัวที่มากร่วมกับปัจจัยเสี่ยงอื่นจะยิ่งเพิ่มความเสี่ยงทำให้เกิดลิ่มเลือดอุดตันในหลอดเลือด
                            </div>
                            <button
                              className="px-2.5 py-1 rounded-lg bg-[#9e2d50] text-white text-[10.5px] font-bold cursor-pointer hover:bg-[#852442] transition-colors"
                              onClick={() => selectMethodAndGoStep6('COC')}
                              type="button"
                            >
                              ดูผลส่วนที่ 5 (CAT 3)
                            </button>
                          </div>
                        ) : bmi >= 30 ? (
                          <span className="text-[10.5px] text-[#7D490D] font-semibold leading-snug">
                            ผลประเมิน: COC(2) POP(1) DMPA(1) Implant(1) Cu-IUD(1)
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex items-start gap-2 p-2 rounded-lg bg-white border border-[#f0dce2]">
                      <div
                        className={
                          bpIsStage2
                            ? 'w-6 h-6 rounded-md bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center font-bold text-[12px] shrink-0'
                            : bpIsStage1
                            ? 'w-6 h-6 rounded-md bg-[#FDF4E7] text-[#7D490D] flex items-center justify-center font-bold text-[12px] shrink-0'
                            : 'w-6 h-6 rounded-md bg-[#E7F3ED] text-[#16563C] flex items-center justify-center font-bold text-[12px] shrink-0'
                        }
                        id="card-bp-icon"
                      >
                        {bpIsStage2 || bpIsStage1 ? '!' : '✓'}
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span
                          className="text-[11.5px] font-bold text-[#28161c] leading-snug"
                          id="live-bp-label"
                        >
                          {liveBpLabelText}
                        </span>
                        {(bpIsStage2 || bpIsStage1) && (
                          <div className="mt-1 space-y-1 text-[10.5px]">
                            <div className="text-[#ba1a1a] font-semibold">
                              ความดันโลหิตสูง แนะนำนั่งพัก อย่างน้อย 15 นาที แล้ววัดความดันซ้ำ แล้วถ้าคงค่าเดิมให้สงสัยว่าเป็นความดันโลหิตสูง
                            </div>
                            {bpIsStage2 ? (
                              <div className="p-2 rounded-lg bg-[#FDF3F3] border border-[#fbd4d4] text-[#8F1D1D] space-y-1">
                                <div className="font-bold">
                                  ผลประเมิน: COC(4) POP(2) DMPA(3) Implant(2) Cu-IUD(1)
                                </div>
                                <div>
                                  <strong>เหตุผล (CAT 4 COC):</strong> ฮอร์โมนเอสโตรเจนในยาคุมจะส่งผลให้ความดันโลหิตสูงขึ้นอีก และทำให้เลือดแข็งตัวง่ายขึ้น ซึ่งจะไปซ้ำเติมหลอดเลือดที่กำลังมีปัญหา และเพิ่มความเสี่ยงรุนแรงต่อการเกิดเส้นเลือดสมองตีบ/แตก หรือหัวใจวายเฉียบพลันได้
                                </div>
                                <div className="font-bold text-[#7D490D]">
                                  แจ้งเตือน (เมื่อเลือก DMPA): ส่งต่อปรึกษาแพทย์ หรือ ปรึกษาแพทย์ทางไกล (Teleconsult)
                                </div>
                              </div>
                            ) : (
                              <div className="p-2 rounded-lg bg-[#FDF4E7] border border-[#f3d9b1] text-[#7D490D] space-y-1">
                                <div className="font-bold">
                                  ผลประเมิน: COC(3) POP(1) DMPA(2) Implant(1) Cu-IUD(1)
                                </div>
                                <div className="font-bold text-[#9e2d50]">
                                  แจ้งเตือน (เมื่อเลือก COC): ส่งต่อปรึกษาแพทย์ หรือ ปรึกษาแพทย์ทางไกล (Teleconsult)
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Postpartum Status Large Tap Cards */}
                <div>
                  <label className="block text-[12.5px] font-bold text-[#28161c] mb-2">
                    ภาวะหลังคลอดและการให้นมบุตร
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-[#f0dce2] bg-[#fffcfc] active:bg-[#fff0f3] cursor-pointer min-h-[44px]">
                      <input
                        checked={!state.redFlagPostpartum || state.postpartumPeriod === 'none'}
                        className="w-4 h-4 accent-[#9e2d50]"
                        name="postpartum-status"
                        onChange={() =>
                          mutateState((prev) => ({
                            ...prev,
                            redFlagPostpartum: false,
                            postpartumPeriod: 'none',
                          }))
                        }
                        type="radio"
                        value="none"
                      />
                      <span className="text-[13px] font-bold text-[#28161c]">
                        ไม่ได้เพิ่งคลอดบุตร / ปกติ
                      </span>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-xl border border-[#f0dce2] bg-[#fffcfc] active:bg-[#fff0f3] cursor-pointer min-h-[44px]">
                      <input
                        checked={
                          state.redFlagPostpartum && state.postpartumPeriod === '21_to_42_days'
                        }
                        className="w-4 h-4 accent-[#9e2d50]"
                        name="postpartum-status"
                        onChange={() =>
                          mutateState((prev) => ({
                            ...prev,
                            redFlagNone: false,
                            redFlagPostpartum: true,
                            postpartumPeriod: '21_to_42_days',
                          }))
                        }
                        type="radio"
                        value="bf"
                      />
                      <span className="text-[13px] font-bold text-[#28161c]">
                        ให้นมบุตร (คลอด &lt; 6 สัปดาห์ / 21–42 วัน)
                      </span>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-xl border border-[#f0dce2] bg-[#fffcfc] active:bg-[#fff0f3] cursor-pointer min-h-[44px]">
                      <input
                        checked={
                          state.redFlagPostpartum && state.postpartumPeriod === 'lt_21_days'
                        }
                        className="w-4 h-4 accent-[#9e2d50]"
                        name="postpartum-status"
                        onChange={() =>
                          mutateState((prev) => ({
                            ...prev,
                            redFlagNone: false,
                            redFlagPostpartum: true,
                            postpartumPeriod: 'lt_21_days',
                          }))
                        }
                        type="radio"
                        value="bottle"
                      />
                      <span className="text-[13px] font-bold text-[#28161c]">
                        หลังคลอด &lt; 21 วัน (&lt; 3 สัปดาห์)
                      </span>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-xl border border-[#f0dce2] bg-[#fffcfc] active:bg-[#fff0f3] cursor-pointer min-h-[44px]">
                      <input
                        checked={
                          state.redFlagPostpartum && state.postpartumPeriod === 'gte_6_weeks_bf'
                        }
                        className="w-4 h-4 accent-[#9e2d50]"
                        name="postpartum-status"
                        onChange={() =>
                          mutateState((prev) => ({
                            ...prev,
                            redFlagNone: false,
                            redFlagPostpartum: true,
                            postpartumPeriod: 'gte_6_weeks_bf',
                          }))
                        }
                        type="radio"
                        value="bf6w"
                      />
                      <span className="text-[13px] font-bold text-[#28161c]">
                        ให้นมบุตร (หลังคลอด ≥ 6 สัปดาห์)
                      </span>
                    </label>

                    {state.redFlagPostpartum && state.postpartumPeriod !== 'none' && (
                      <div className="p-3 rounded-xl bg-[#FDF3F3] border border-[#fbd4d4] text-[#8F1D1D] text-[11.5px] space-y-1">
                        {state.postpartumPeriod === 'lt_21_days' && (
                          <>
                            <div className="font-bold">
                              ผลประเมิน: COC(4) ห้ามใช้เด็ดขาด • แนะนำ Implant, DMPA, POP
                            </div>
                            <div>
                              เหตุผล: ช่วง &lt; 21 วันหลังคลอด มีความเสี่ยงต่อการเกิดลิ่มเลือดอุดตัน (VTE) สูงตามธรรมชาติ และฮอร์โมนเอสโตรเจนกดการสร้างน้ำนม
                            </div>
                          </>
                        )}
                        {state.postpartumPeriod === '21_to_42_days' && (
                          <>
                            <div className="font-bold">
                              ผลประเมิน: COC(4) ตัดออกจากระบบทันที • แนะนำ POP, DMPA, Implant
                            </div>
                            <div>
                              เหตุผล: ให้นมบุตรหลังคลอด &lt; 6 สัปดาห์ ฮอร์โมนเอสโตรเจนกดการสร้างน้ำนมและเพิ่มความเสี่ยงลิ่มเลือดอุดตัน
                            </div>
                          </>
                        )}
                        {state.postpartumPeriod === 'gte_6_weeks_bf' && (
                          <>
                            <div className="font-bold text-[#7D490D]">
                              ผลประเมิน: COC(3) หลีกเลี่ยง COC • แนะนำ POP, DMPA, Implant หรือ Cu-IUD
                            </div>
                            <div className="text-[#7D490D]">
                              เหตุผล: ฮอร์โมนเอสโตรเจนในยาคุมรวมลดปริมาณและคุณภาพน้ำนมแม่
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Safety Callout Green Alert */}
                <div className="p-3 rounded-xl bg-[#F2F8F5] border border-[#cbe5d7] flex items-start gap-2 text-[#16563C] text-[12px] leading-snug">
                  <MaterialIcon name="check_circle" className="w-[18px] h-[18px] text-[18px] shrink-0 text-[#16563C]" />
                  <span>
                    สัญญาณชีพและดัชนีมวลกายของผู้รับบริการได้รับการประมวลผลตามเกณฑ์มาตรฐาน WHO MEC
                    อัตโนมัติ
                  </span>
                </div>
              </div>
            </section>
          )}

          {/* ================= STEP 2: การคัดกรองไม่ตั้งครรภ์ ================= */}
          {currentStep === 2 && (
            <section className="step-panel flex flex-col gap-3.5" id="step-panel-2">
              <div className="bg-white rounded-2xl border border-[#f0dce2] p-4 shadow-sm flex flex-col gap-3.5">
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#f3d2da]">
                  <div className="w-8 h-8 rounded-xl bg-[#fff0f3] text-[#9e2d50] flex items-center justify-center font-bold text-[15px] border border-[#ffd5e1] shrink-0">
                    2
                  </div>
                  <div>
                    <h2 className="text-[15px] font-bold text-[#28161c]">
                      คัดกรองการไม่ตั้งครรภ์ 6 ข้อ
                    </h2>
                    <p className="text-[11px] text-[#564145]">
                      อย่างน้อย 1 ข้อเป็นจริง = มั่นใจว่าไม่ตั้งครรภ์
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {[
                    {
                      id: 'menses_7_days',
                      ckId: 'ck-p1',
                      title: '1. ประจำเดือนมาปกติภายใน 7 วันที่ผ่านมา',
                      sub: 'First 7 days of normal menses',
                    },
                    {
                      id: 'no_intercourse',
                      ckId: 'ck-p2',
                      title: '2. ไม่เคยมีเพศสัมพันธ์เลยนับตั้งแต่รอบเดือนล่าสุด / หลังคลอด / หลังแท้ง',
                      sub: 'ไม่มีโอกาสสัมผัสอสุจิหรือปฏิสนธิ',
                    },
                    {
                      id: 'consistent_contraception',
                      ckId: 'ck-p3',
                      title: '3. ใช้วิธีคุมกำเนิดที่มีประสิทธิภาพสูงอย่างถูกต้องและสม่ำเสมอมาโดยตลอด',
                      sub: 'กินยาตรงเวลา / ยาฉีดยังไม่หมดฤทธิ์',
                    },
                    {
                      id: 'postpartum_4_weeks',
                      ckId: 'ck-p4',
                      title: '4. คลอดบุตรมาไม่เกิน 4 สัปดาห์ (Within 4 weeks postpartum)',
                      sub: 'รังไข่ยังไม่กลับมาทำงานตามรอบปกติ',
                    },
                    {
                      id: 'postabortion_7_days',
                      ckId: 'ck-p5',
                      title: '5. เพิ่งแท้งบุตรหรือทำแท้งมาไม่เกิน 7 วัน (Within 7 days post-abortion)',
                      sub: 'สามารถเริ่มวิธีคุมกำเนิดรอบใหม่ได้ทันที',
                    },
                    {
                      id: 'lam_6_months',
                      ckId: 'ck-p6',
                      title: '6. คลอดบุตรไม่เกิน 6 เดือน + ให้นมบุตรอย่างเดียว + ยังไม่มีประจำเดือนกลับมาเลย',
                      sub: 'เกณฑ์ Lactational Amenorrhea Method (LAM)',
                    },
                  ].map((item) => {
                    const checked =
                      !state.pregnancyNoneOfSix &&
                      state.pregnancyCriteriaSelected.includes(item.id);
                    return (
                      <label
                        key={item.id}
                        className="flex items-start gap-2.5 p-3 rounded-xl border border-[#f0dce2] bg-[#fffcfc] active:bg-[#fff7f9] cursor-pointer min-h-[44px]"
                      >
                        <input
                          checked={checked}
                          className="w-4 h-4 mt-0.5 accent-[#9e2d50] shrink-0"
                          id={item.ckId}
                          onChange={() => handleTogglePreg(item.id)}
                          type="checkbox"
                        />
                        <div>
                          <strong className="text-[13px] text-[#28161c] block">{item.title}</strong>
                          <span className="text-[11px] text-[#564145]">{item.sub}</span>
                        </div>
                      </label>
                    );
                  })}

                  <label className="flex items-start gap-2.5 p-3 rounded-xl border border-[#f0dce2] bg-[#fffcfc] active:bg-[#fff7f9] cursor-pointer min-h-[44px]">
                    <input
                      checked={
                        state.pregnancyNoneOfSix || state.pregnancyCriteriaSelected.length === 0
                      }
                      className="w-4 h-4 mt-0.5 accent-[#9e2d50] shrink-0"
                      onChange={(e) =>
                        mutateState((prev) => ({
                          ...prev,
                          pregnancyNoneOfSix: e.target.checked,
                          pregnancyCriteriaSelected: e.target.checked
                            ? []
                            : prev.pregnancyCriteriaSelected,
                          uptResult:
                            e.target.checked && prev.uptResult === 'not_done'
                              ? 'negative'
                              : prev.uptResult,
                        }))
                      }
                      type="checkbox"
                    />
                    <div>
                      <strong className="text-[13px] text-[#28161c] block">
                        ไม่ใช่ทั้ง 6 ข้อ (ตรวจปัสสาวะประเมินภาวะตั้งครรภ์ UPT)
                      </strong>
                      <span className="text-[11px] text-[#564145]">
                        หากไม่เข้าเกณฑ์ทั้ง 6 ข้อ ให้ระบุผลตรวจปัสสาวะ UPT ด้านล่าง
                      </span>
                    </div>
                  </label>
                </div>

                {/* UPT Evaluation Section when None of 6 is selected */}
                {!anyPreg && (
                  <div className="p-3.5 rounded-xl bg-[#fff7f9] border border-[#f5cbd6] space-y-2.5 text-[12px]">
                    <strong className="text-[#9e2d50] block">
                      ผลตรวจปัสสาวะประเมินภาวะตั้งครรภ์ (Urine Pregnancy Test - UPT):
                    </strong>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="flex items-center gap-2 p-2.5 rounded-xl border border-[#dcbfc4] bg-white cursor-pointer">
                        <input
                          checked={state.uptResult === 'negative'}
                          className="w-4 h-4 accent-[#9e2d50]"
                          name="upt-res"
                          onChange={() => updateState('uptResult', 'negative')}
                          type="radio"
                        />
                        <span className="font-bold text-[#28161c]">ผลเป็นลบ (Negative)</span>
                      </label>
                      <label className="flex items-center gap-2 p-2.5 rounded-xl border border-[#dcbfc4] bg-white cursor-pointer">
                        <input
                          checked={state.uptResult === 'positive'}
                          className="w-4 h-4 accent-[#ba1a1a]"
                          name="upt-res"
                          onChange={() => updateState('uptResult', 'positive')}
                          type="radio"
                        />
                        <span className="font-bold text-[#ba1a1a]">ผลเป็นบวก (Positive)</span>
                      </label>
                    </div>

                    {state.uptResult === 'positive' && (
                      <div className="p-2.5 rounded-lg bg-[#FDF3F3] border border-[#fbd4d4] text-[#8F1D1D] text-[11.5px] font-bold">
                        ผลตรวจเป็นบวก (ตั้งครรภ์) ➔ แนะนำการฝากครรภ์ (ANC) และงดจ่ายยาคุมกำเนิดทุกชนิด
                      </div>
                    )}

                    {state.uptResult === 'negative' && (
                      <div className="space-y-2 pt-1">
                        <div className="p-2 rounded-lg bg-[#FCF7F0] border border-[#f5e3cd] text-[11.5px] text-[#7D490D] font-bold">
                          แจ้งเตือน: ไม่สามารถยืนยันการไม่ตั้งครรภ์ 100% — ประเมินเพศสัมพันธ์ช่วง 5 วันที่ผ่านมา:
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <label className="flex items-center gap-2 p-2 rounded-lg border border-[#dcbfc4] bg-white cursor-pointer">
                            <input
                              checked={state.unprotectedSex5Days === 'no'}
                              className="w-4 h-4 accent-[#9e2d50]"
                              name="sex5d"
                              onChange={() => {
                                updateState('unprotectedSex5Days', 'no');
                                setShowBackupPopup(true);
                              }}
                              type="radio"
                            />
                            <span className="text-[11.5px]">ไม่มีเพศสัมพันธ์ใน 5 วัน</span>
                          </label>
                          <label className="flex items-center gap-2 p-2 rounded-lg border border-[#dcbfc4] bg-white cursor-pointer">
                            <input
                              checked={state.unprotectedSex5Days === 'yes'}
                              className="w-4 h-4 accent-[#9e2d50]"
                              name="sex5d"
                              onChange={() => updateState('unprotectedSex5Days', 'yes')}
                              type="radio"
                            />
                            <span className="text-[11.5px]">มีเพศสัมพันธ์ไม่ป้องกันใน 5 วัน</span>
                          </label>
                        </div>
                        {state.unprotectedSex5Days === 'yes' ? (
                          <div className="p-2.5 rounded-lg bg-[#FDF3F3] border border-[#fbd4d4] text-[#8F1D1D] text-[11.5px] space-y-1">
                            <div className="font-bold">
                              ผลประเมิน: พิจารณาให้ ยาคุมกำเนิดฉุกเฉิน (Emergency Contraception)
                            </div>
                            <div>
                              ร่วมกับใช้วิธีสำรอง (งดมีเพศสัมพันธ์หรือใช้ถุงยางอนามัย) อย่างน้อย 7 วันแรก และนัดตรวจ UPT ซ้ำใน 4 (2–4) สัปดาห์
                            </div>
                          </div>
                        ) : (
                          <div className="p-2.5 rounded-lg bg-[#FCF7F0] border border-[#f5e3cd] text-[#7D490D] text-[11.5px] space-y-1">
                            <div className="font-bold">
                              ผลประเมิน: ใช้วิธีสำรอง (Back-up protection) อย่างน้อย 7 วันแรก + นัดตรวจ UPT ซ้ำใน 4 (2–4) สัปดาห์
                            </div>
                            <button
                              className="px-2.5 py-1 rounded-lg bg-[#9e2d50] text-white text-[11px] font-bold cursor-pointer"
                              onClick={() => setShowBackupPopup(true)}
                              type="button"
                            >
                              แสดง Popup คำแนะนำวิธีสำรอง
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div
                  className={
                    anyPreg
                      ? 'p-3 rounded-xl bg-[#F2F8F5] border border-[#cbe5d7] flex items-start gap-2 text-[#16563C] text-[12px] leading-snug'
                      : 'p-3 rounded-xl bg-[#FCF7F0] border border-[#f5e3cd] flex items-start gap-2 text-[#7D490D] text-[12px] leading-snug'
                  }
                  id="preg-result-box"
                >
                  <MaterialIcon name={anyPreg ? 'check_circle' : 'info'} className="w-[18px] h-[18px] text-[18px] shrink-0" />
                  <span id="preg-result-text">
                    <strong>{evaluation.pregnancyStatus.summaryTitle}:</strong>{' '}
                    {evaluation.pregnancyStatus.summaryDetail}
                  </span>
                </div>
              </div>
            </section>
          )}

          {/* ================= STEP 3: สัญญาณเตือน (Red Flags) ================= */}
          {currentStep === 3 && (
            <section className="step-panel flex flex-col gap-3.5" id="step-panel-3">
              <div className="bg-white rounded-2xl border border-[#f0dce2] p-4 shadow-sm flex flex-col gap-3.5">
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#f3d2da]">
                  <div className="w-8 h-8 rounded-xl bg-[#fff0f3] text-[#ba1a1a] flex items-center justify-center font-bold text-[15px] border border-[#ffd5e1] shrink-0">
                    3
                  </div>
                  <div>
                    <h2 className="text-[15px] font-bold text-[#28161c]">
                      คัดกรองภาวะเสี่ยงสูง (Red Flags 6 ข้อ)
                    </h2>
                    <p className="text-[11px] text-[#564145]">
                      หากพบข้อใดข้อหนึ่ง จะเป็นข้อห้ามใช้เด็ดขาด (Cat 4)
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {/* 1. ไมเกรนมีออร่า */}
                  <div className="p-3 rounded-xl border border-[#f0dce2] bg-[#fffcfc] space-y-2">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        checked={!state.redFlagNone && state.redFlagMigraineAura}
                        className="w-4 h-4 mt-0.5 accent-[#ba1a1a] shrink-0"
                        id="rf-1"
                        onChange={(e) =>
                          mutateState((prev) => ({
                            ...prev,
                            redFlagNone: false,
                            redFlagMigraineAura: e.target.checked,
                          }))
                        }
                        type="checkbox"
                      />
                      <strong className="text-[12.5px] text-[#ba1a1a] block">
                        1. ไมเกรนชนิดที่มีแสงวาบ (Migraine with Aura)
                      </strong>
                    </label>
                    {!state.redFlagNone && state.redFlagMigraineAura && (
                      <div className="p-2.5 rounded-lg bg-[#FDF3F3] border border-[#fbd4d4] text-[#8F1D1D] text-[11.5px] space-y-1">
                        <div>
                          • <strong>ความเสี่ยงสำคัญ:</strong> เสี่ยงต่อการเกิด Ischemic Stroke (หลอดเลือดสมองอุดตัน) สูงขึ้นมากหากใช้ยาคุมที่มีเอสโตรเจน
                        </div>
                        <div>
                          • <strong>ข้อห้าม (Category 4):</strong> ห้ามใช้ยาคุมชนิดรวมทุกรูปแบบ (COC)
                        </div>
                        <div className="text-[#16563C]">
                          • <strong>ทางเลือกที่ใช้ได้ปลอดภัย (Category 1):</strong> ห่วงอนามัยชนิดห่วงทองแดง (Copper IUD)
                        </div>
                        <div className="text-[#7D490D] font-semibold">
                          • ถ้าต้องการใช้วิธี POP, DMPA, Implant ควรอยู่ในดุลยพินิจของแพทย์
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2. มะเร็งเต้านมปัจจุบัน */}
                  <div className="p-3 rounded-xl border border-[#f0dce2] bg-[#fffcfc] space-y-2">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        checked={!state.redFlagNone && state.redFlagBreastCancer}
                        className="w-4 h-4 mt-0.5 accent-[#ba1a1a] shrink-0"
                        id="rf-2"
                        onChange={(e) =>
                          mutateState((prev) => ({
                            ...prev,
                            redFlagNone: false,
                            redFlagBreastCancer: e.target.checked,
                          }))
                        }
                        type="checkbox"
                      />
                      <strong className="text-[12.5px] text-[#ba1a1a] block">
                        2. มะเร็งเต้านมในปัจจุบัน (Current Breast Cancer)
                      </strong>
                    </label>
                    {!state.redFlagNone && state.redFlagBreastCancer && (
                      <div className="p-2.5 rounded-lg bg-[#FDF3F3] border border-[#fbd4d4] text-[#8F1D1D] text-[11.5px] space-y-1">
                        <div>
                          • <strong>ความเสี่ยงสำคัญ:</strong> ฮอร์โมนในยาคุมจะกระตุ้นการเจริญเติบโตของเซลล์มะเร็งเต้านม
                        </div>
                        <div>
                          • <strong>ข้อห้าม (Category 4):</strong> ห้ามใช้ฮอร์โมนคุมกำเนิดทุกชนิด (COC, POP, DMPA, Implant)
                        </div>
                        <div className="text-[#16563C]">
                          • <strong>ทางเลือกที่ใช้ได้ปลอดภัย (Category 1):</strong> ห่วงอนามัยชนิดห่วงทองแดง (Copper IUD) หรือวิธีคุมกำเนิดแบบไม่ใช้ฮอร์โมน (เช่น ถุงยางอนามัย, ทำหมัน)
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 3. ลิ่มเลือดอุดตัน / หลอดเลือดสมอง / หัวใจ */}
                  <div className="p-3 rounded-xl border border-[#f0dce2] bg-[#fffcfc] space-y-2">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        checked={!state.redFlagNone && state.redFlagVteStrokeIhd}
                        className="w-4 h-4 mt-0.5 accent-[#ba1a1a] shrink-0"
                        id="rf-3"
                        onChange={(e) =>
                          mutateState((prev) => ({
                            ...prev,
                            redFlagNone: false,
                            redFlagVteStrokeIhd: e.target.checked,
                          }))
                        }
                        type="checkbox"
                      />
                      <strong className="text-[12.5px] text-[#ba1a1a] block">
                        3. ลิ่มเลือดอุดตัน / หลอดเลือดสมอง / หัวใจ (DVT / PE / Stroke / IHD)
                      </strong>
                    </label>
                    {!state.redFlagNone && state.redFlagVteStrokeIhd && (
                      <div className="p-2.5 rounded-lg bg-[#FDF3F3] border border-[#fbd4d4] text-[#8F1D1D] text-[11.5px] space-y-1">
                        <div>
                          • <strong>ความเสี่ยงสำคัญ:</strong> เสี่ยงต่อการเกิดลิ่มเลือดอุดตันหลอดเลือดซ้ำจนเป็นอันตรายถึงแก่ชีวิต
                        </div>
                        <div>
                          • <strong>ข้อห้าม (Category 4):</strong> ห้ามใช้ยาคุมชนิดฮอร์โมนรวมทุกชนิด (COC)
                        </div>
                        <div className="text-[#16563C]">
                          • <strong>ทางเลือกที่ใช้ได้ปลอดภัย:</strong> Copper IUD (ต้องประเมินเรื่องยาละลายลิ่มเลือดร่วมด้วย)
                        </div>
                        <div className="text-[#7D490D] font-semibold">
                          • ถ้าต้องการใช้วิธี POP, DMPA, Implant ควรอยู่ในดุลยพินิจของแพทย์
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 4. ความดันโลหิตสูงรุนแรง >= 160/100 */}
                  <div className="p-3 rounded-xl border border-[#f0dce2] bg-[#fffcfc] space-y-2">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        checked={
                          (!state.redFlagNone && state.redFlagSevereHypertension) ||
                          evaluation.bpSevereWarning
                        }
                        className="w-4 h-4 mt-0.5 accent-[#ba1a1a] shrink-0"
                        id="rf-4"
                        onChange={(e) =>
                          mutateState((prev) => ({
                            ...prev,
                            redFlagNone: false,
                            redFlagSevereHypertension: e.target.checked,
                          }))
                        }
                        type="checkbox"
                      />
                      <strong className="text-[12.5px] text-[#ba1a1a] block">
                        4. ความดันโลหิตสูงรุนแรง (Severe Hypertension: SBP ≥ 160 หรือ DBP ≥ 100 mmHg)
                      </strong>
                    </label>
                    {((!state.redFlagNone && state.redFlagSevereHypertension) ||
                      evaluation.bpSevereWarning) && (
                      <div className="p-2.5 rounded-lg bg-[#FDF3F3] border border-[#fbd4d4] text-[#8F1D1D] text-[11.5px] space-y-1">
                        <div>
                          • <strong>ความเสี่ยงสำคัญ:</strong> เสี่ยงต่อ Stroke, Myocardial Infarction (กล้ามเนื้อหัวใจตาย) และหลอดเลือดแตก/อุดตัน
                        </div>
                        <div>
                          • <strong>ข้อห้าม (Category 4):</strong> ห้ามใช้ยาคุมชนิดฮอร์โมนรวมทุกชนิด (COC)
                        </div>
                        <div>
                          • <strong>ข้อควรปฏิบัติทันที:</strong> ให้นั่งพัก 10–15 นาที แล้ววัดความดันซ้ำ หากยังสูงอยู่ ห้ามจ่ายยาคุมชนิดรวม (COC)
                        </div>
                        <div className="text-[#16563C]">
                          • <strong>ทางเลือกที่ใช้ได้ปลอดภัย (Category 1/2):</strong> ยาฝังคุมกำเนิด (Implant), ยาคุมฮอร์โมนเดี่ยว (POP), ห่วงอนามัยชนิดห่วงทองแดง (Copper IUD)
                        </div>
                        <div className="text-[#7D490D] font-semibold">
                          • ถ้าเลือกวิธี DMPA ควรอยู่ในดุลยพินิจของแพทย์ • การส่งต่อ: ส่งต่อพบแพทย์เพื่อพิจารณา ปรับ/รับยาลดความดันโลหิต
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 5. เลือดออกผิดปกติทางช่องคลอดไม่ทราบสาเหตุ */}
                  <div className="p-3 rounded-xl border border-[#f0dce2] bg-[#fffcfc] space-y-2">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        checked={!state.redFlagNone && state.redFlagUnexplainedBleedingOrPid}
                        className="w-4 h-4 mt-0.5 accent-[#ba1a1a] shrink-0"
                        id="rf-5"
                        onChange={(e) =>
                          mutateState((prev) => ({
                            ...prev,
                            redFlagNone: false,
                            redFlagUnexplainedBleedingOrPid: e.target.checked,
                          }))
                        }
                        type="checkbox"
                      />
                      <strong className="text-[12.5px] text-[#ba1a1a] block">
                        5. เลือดออกผิดปกติทางช่องคลอดโดยไม่ทราบสาเหตุ (Unexplained Vaginal Bleeding)
                      </strong>
                    </label>
                    {!state.redFlagNone && state.redFlagUnexplainedBleedingOrPid && (
                      <div className="p-2.5 rounded-lg bg-[#FDF3F3] border border-[#fbd4d4] text-[#8F1D1D] text-[11.5px] space-y-1">
                        <div>
                          • <strong>ความเสี่ยงสำคัญ:</strong> อาจเป็นอาการแสดงของ มะเร็งปากมดลูก, มะเร็งโพรงมดลูก, การตั้งครรภ์นอกมดลูก (Ectopic Pregnancy) หรือการติดเชื้อรุนแรง
                        </div>
                        <div>
                          • <strong>ข้อห้าม (Category 4/3):</strong> ห้ามใส่ห่วงอนามัย (IUD) ทุกชนิดเด็ดขาด และหลีกเลี่ยงการเริ่มฮอร์โมนชนิดยาว (DMPA / Implant) จนกว่าจะหาสาเหตุพบ
                        </div>
                        <div>
                          • <strong>ข้อควรปฏิบัติ &amp; การส่งต่อ:</strong> ตรวจตั้งครรภ์ (UPT) เบื้องต้น และต้องส่งต่อพบสูตินรีแพทย์เพื่อตรวจทางสูตินรีเวช (Pelvic Exam / Ultrasound) หาสาเหตุของการเลือดออกก่อนเสมอ
                        </div>
                        <div className="text-[#16563C]">
                          • <strong>วิธีคุมกำเนิดชั่วคราว:</strong> แนะนำใช้ถุงยางอนามัยในระหว่างรอผลการตรวจหาสาเหตุ
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 6. หลังคลอดบุตร (Postpartum Period) */}
                  <div className="p-3 rounded-xl border border-[#f0dce2] bg-[#fffcfc] space-y-2">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        checked={!state.redFlagNone && state.redFlagPostpartum}
                        className="w-4 h-4 mt-0.5 accent-[#ba1a1a] shrink-0"
                        id="rf-6"
                        onChange={(e) =>
                          mutateState((prev) => ({
                            ...prev,
                            redFlagNone: false,
                            redFlagPostpartum: e.target.checked,
                            postpartumPeriod: e.target.checked ? 'lt_21_days' : 'none',
                          }))
                        }
                        type="checkbox"
                      />
                      <strong className="text-[12.5px] text-[#ba1a1a] block">
                        6. หลังคลอดบุตร (Postpartum Period): &lt; 21 วัน / 21–42 วัน / ≥ 6 สัปดาห์
                      </strong>
                    </label>

                    {!state.redFlagNone && state.redFlagPostpartum && (
                      <div className="space-y-2 pt-1">
                        <div className="grid grid-cols-3 gap-1.5">
                          {[
                            { val: 'lt_21_days' as const, label: '< 21 วัน' },
                            { val: '21_to_42_days' as const, label: '21–42 วัน' },
                            { val: 'gte_6_weeks_bf' as const, label: '≥ 6 สัปดาห์' },
                          ].map((p) => (
                            <button
                              key={p.val}
                              type="button"
                              onClick={() => updateState('postpartumPeriod', p.val)}
                              className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border cursor-pointer ${
                                state.postpartumPeriod === p.val
                                  ? 'bg-[#9e2d50] text-white border-[#9e2d50]'
                                  : 'bg-white text-[#28161c] border-[#dcbfc4]'
                              }`}
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>
                        <div className="p-2.5 rounded-lg bg-[#FDF3F3] border border-[#fbd4d4] text-[#8F1D1D] text-[11.5px] space-y-1">
                          <div>
                            • <strong>ความเสี่ยงสำคัญ:</strong> ช่วง &lt; 21 วันหลังคลอดมีความเสี่ยงลิ่มเลือดอุดตัน (VTE) สูงตามธรรมชาติ และฮอร์โมนเอสโตรเจนกดการสร้างน้ำนม (Suppression of Lactation)
                          </div>
                          <div>
                            • <strong>ข้อห้าม:</strong>{' '}
                            {state.postpartumPeriod === 'lt_21_days' &&
                              'ช่วง < 21 วันหลังคลอด: Category 4 ห้ามใช้ยาคุมชนิดฮอร์โมนรวมทุกชนิด (COC) (ไม่ว่าจะให้นมบุตรหรือไม่ก็ตาม)'}
                            {state.postpartumPeriod === '21_to_42_days' &&
                              'ช่วง 21–42 วันหลังคลอด (ให้/ไม่ให้นมบุตร): Category 3/4 ยังคงหลีกเลี่ยงยาคุมชนิดฮอร์โมนรวม (COC)'}
                            {state.postpartumPeriod === 'gte_6_weeks_bf' &&
                              'ช่วงหลัง 42 วันหลังคลอด (6 สัปดาห์) (ให้นมบุตร): Category 3 ยังคงหลีกเลี่ยงยาคุมชนิดฮอร์โมนรวม (COC)'}
                          </div>
                          <div className="text-[#16563C]">
                            • <strong>วิธีที่แนะนำ:</strong> ยาฝังคุมกำเนิด (Implant), ยาฉีด (DMPA), หรือยาคุมฮอร์โมนเดี่ยว (POP)
                            {state.postpartumPeriod === 'gte_6_weeks_bf' ? ' หรือห่วงอนามัย (Cu-IUD)' : ''}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 7. ไม่มีภาวะเสี่ยงสูง */}
                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-[#f0dce2] bg-[#fffcfc] active:bg-[#fff7f9] cursor-pointer min-h-[44px]">
                    <input
                      checked={state.redFlagNone}
                      className="w-4 h-4 accent-[#16563C] shrink-0"
                      onChange={(e) =>
                        mutateState((prev) => ({
                          ...prev,
                          redFlagNone: e.target.checked,
                          redFlagMigraineAura: false,
                          redFlagBreastCancer: false,
                          redFlagVteStrokeIhd: false,
                          redFlagSevereHypertension: false,
                          redFlagUnexplainedBleedingOrPid: false,
                          redFlagPostpartum: false,
                          postpartumPeriod: 'none',
                          redFlagHeavySmokingOver35: false,
                          redFlagEnzymeInducingDrugs: false,
                        }))
                      }
                      type="checkbox"
                    />
                    <strong className="text-[12.5px] text-[#16563C] block">
                      7. ไม่มีภาวะเสี่ยงสูงข้างต้น
                    </strong>
                  </label>
                </div>

                <div
                  className={
                    rfChecked
                      ? 'p-3 rounded-xl bg-[#FDF3F3] border border-[#fbd4d4] flex flex-col gap-2 text-[#8F1D1D] text-[12px]'
                      : 'p-3 rounded-xl bg-[#F2F8F5] border border-[#cbe5d7] flex items-center justify-between text-[#16563C] text-[12px]'
                  }
                  id="rf-status-box"
                >
                  <div className="flex items-center justify-between gap-2 w-full">
                    <div className="flex items-center gap-2">
                      <MaterialIcon name="shield" className="w-[18px] h-[18px] text-[18px]" />
                      <span id="rf-status-text">
                        {rfChecked ? (
                          <>
                            <strong>เตือน:</strong> พบภาวะเสี่ยงสูงเร่งด่วน! ข้อห้ามใช้ (Cat 4)
                          </>
                        ) : (
                          <>
                            <strong>ผลการตรวจ:</strong> ไม่พบภาวะเสี่ยงสูง
                          </>
                        )}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-[#cbe5d7] shrink-0">
                      {rfChecked ? 'พบความเสี่ยง' : 'ปลอดภัย'}
                    </span>
                  </div>
                  {rfChecked && (
                    <button
                      className="w-full py-2 px-3 rounded-lg bg-[#ba1a1a] hover:bg-[#991515] text-white font-bold text-[12px] cursor-pointer transition-colors"
                      onClick={() => goToStep(5)}
                      type="button"
                    >
                      พบภาวะเสี่ยงสูง (Short cut) ➔ ข้ามไปดูผลประเมิน 5 วิธี (ขั้นตอนที่ 5)
                    </button>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* ================= STEP 4: โรคและยา ================= */}
          {currentStep === 4 && (
            <section className="step-panel flex flex-col gap-3.5" id="step-panel-4">
              <div className="bg-white rounded-2xl border border-[#f0dce2] p-4 shadow-sm flex flex-col gap-3.5">
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#f3d2da]">
                  <div className="w-8 h-8 rounded-xl bg-[#fff0f3] text-[#9e2d50] flex items-center justify-center font-bold text-[15px] border border-[#ffd5e1] shrink-0">
                    4
                  </div>
                  <div>
                    <h2 className="text-[15px] font-bold text-[#28161c]">
                      โรคประจำตัวและการใช้ยา
                    </h2>
                    <p className="text-[11px] text-[#564145]">
                      ตรวจผลกระทบต่อระดับฮอร์โมนและข้อห้ามใช้
                    </p>
                  </div>
                </div>

                {/* ไม่มีโรคประจำตัว */}
                <label className="flex items-start gap-2.5 p-3 rounded-xl border border-[#f0dce2] bg-[#fffcfc] active:bg-[#fff7f9] cursor-pointer min-h-[44px]">
                  <input
                    checked={state.noComorbidities}
                    className="w-4 h-4 mt-0.5 accent-[#9e2d50] shrink-0"
                    onChange={(e) => {
                      const checked = e.target.checked;
                      updateState('noComorbidities', checked);
                      if (checked) {
                        setTimeout(() => {
                          document
                            .getElementById('allergy-section')
                            ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 50);
                      }
                    }}
                    type="checkbox"
                  />
                  <div>
                    <strong className="text-[12.5px] text-[#28161c] block">ไม่มีโรคประจำตัว</strong>
                    <span className="text-[11px] text-[#564145]">
                      หากเลือกข้อนี้ ระบบจะล้างโรคประจำตัวและข้ามไปที่ประวัติแพ้ยาด้านล่าง
                    </span>
                  </div>
                </label>

                <div className="space-y-2">
                  {/* ความดันโลหิตสูง */}
                    <div className="p-3 rounded-xl border border-[#f0dce2] bg-[#fffcfc] space-y-2">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          checked={state.hasHypertension}
                          className="w-4 h-4 mt-0.5 accent-[#9e2d50] shrink-0"
                          onChange={(e) => updateState('hasHypertension', e.target.checked)}
                          type="checkbox"
                        />
                        <strong className="text-[12.5px] text-[#28161c] block">
                          ความดันโลหิตสูง (BP ปัจจุบัน: {sbp}/{dbp} mmHg)
                        </strong>
                      </label>
                      {state.hasHypertension && (
                        <div className="pl-6 space-y-1.5 text-[11.5px]">
                          <label className="flex items-center gap-2">
                            <input
                              checked={state.htnLevel === 'lt_160_90'}
                              className="w-4 h-4 accent-[#9e2d50]"
                              name="htn-lvl"
                              onChange={() => updateState('htnLevel', 'lt_160_90')}
                              type="radio"
                            />
                            <span>&lt; 160/90 (SBP 140–159 หรือ DBP 90–99)</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              checked={state.htnLevel === 'gte_160_90'}
                              className="w-4 h-4 accent-[#9e2d50]"
                              name="htn-lvl"
                              onChange={() => updateState('htnLevel', 'gte_160_90')}
                              type="radio"
                            />
                            <span>≥ 160/90 mmHg</span>
                          </label>
                          <div className="pt-1 font-bold text-[#9e2d50]">
                            มีโรคร่วมหลอดเลือด (Vascular disease):
                          </div>
                          {[
                            {
                              k: 'htnVascularStrokeTia' as const,
                              l: 'โรคหลอดเลือดสมองตีบ/แตก (Stroke/TIA)',
                            },
                            {
                              k: 'htnVascularMiIhd' as const,
                              l: 'โรคกล้ามเนื้อหัวใจขาดเลือด (MI/IHD)',
                            },
                            {
                              k: 'htnVascularDvt' as const,
                              l: 'ลิ่มเลือดอุดตันในหลอดเลือดดำลึก (DVT)',
                            },
                            { k: 'htnVascularPe' as const, l: 'ลิ่มเลือดอุดตันในปอด (PE)' },
                          ].map((v) => (
                            <label key={v.k} className="flex items-center gap-2">
                              <input
                                checked={state[v.k]}
                                className="w-4 h-4 accent-[#9e2d50]"
                                onChange={(e) => updateState(v.k, e.target.checked)}
                                type="checkbox"
                              />
                              <span>{v.l}</span>
                            </label>
                          ))}
                          {state.htnVascularStrokeTia ||
                          state.htnVascularMiIhd ||
                          state.htnVascularDvt ||
                          state.htnVascularPe ? (
                            <div className="p-2.5 rounded-lg bg-[#FDF3F3] border border-[#fbd4d4] text-[#8F1D1D] space-y-1 mt-1">
                              <div className="font-bold">
                                ผลประเมิน: COC(4) POP(2) DMPA(3) Implant(2) Cu-IUD(1)
                              </div>
                              <div>
                                เหตุผล: หลอดเลือดเดิมมีภาวะเสื่อมและตีบอยู่แล้ว พอได้รับฮอร์โมนในยาคุมรวมจะยิ่งทำให้เลือดข้นและแข็งตัวง่ายขึ้น เสี่ยงต่อการเกิดอัมพฤกษ์/หัวใจวายซ้ำซ้อนขึ้นมาอย่างทันที
                              </div>
                              <div className="font-bold text-[#7D490D]">
                                แจ้งเตือน (เมื่อเลือก DMPA): ส่งต่อปรึกษาแพทย์ หรือ ปรึกษาแพทย์ทางไกล (Teleconsult)
                              </div>
                            </div>
                          ) : state.htnLevel === 'gte_160_90' || bpIsStage2 ? (
                            <div className="p-2.5 rounded-lg bg-[#FDF3F3] border border-[#fbd4d4] text-[#8F1D1D] space-y-1 mt-1">
                              <div className="font-bold">
                                ผลประเมิน: COC(4) POP(2) DMPA(3) Implant(2) Cu-IUD(1)
                              </div>
                              <div>
                                เหตุผล: ฮอร์โมนเอสโตรเจนในยาคุมจะส่งผลให้ความดันโลหิตสูงขึ้นอีก และทำให้เลือดแข็งตัวง่ายขึ้น ซึ่งจะไปซ้ำเติมหลอดเลือดที่กำลังมีปัญหา และเพิ่มความเสี่ยงรุนแรงต่อการเกิดเส้นเลือดสมองตีบ/แตก หรือหัวใจวายเฉียบพลันได้
                              </div>
                              <div className="font-bold text-[#7D490D]">
                                แจ้งเตือน (เมื่อเลือก DMPA): ส่งต่อปรึกษาแพทย์ หรือ ปรึกษาแพทย์ทางไกล (Teleconsult)
                              </div>
                            </div>
                          ) : (
                            <div className="p-2.5 rounded-lg bg-[#FDF4E7] border border-[#f3d9b1] text-[#7D490D] space-y-1 mt-1">
                              <div className="font-bold">
                                ผลประเมิน: COC(3) POP(1) DMPA(2) Implant(1) Cu-IUD(1)
                              </div>
                              <div className="font-bold text-[#9e2d50]">
                                แจ้งเตือน (เมื่อเลือก COC): ส่งต่อปรึกษาแพทย์ หรือ ปรึกษาแพทย์ทางไกล (Teleconsult)
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* เบาหวาน */}
                    <div className="p-3 rounded-xl border border-[#f0dce2] bg-[#fffcfc] space-y-2">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          checked={state.hasDiabetes}
                          className="w-4 h-4 mt-0.5 accent-[#9e2d50] shrink-0"
                          id="cm-dm"
                          onChange={(e) => updateState('hasDiabetes', e.target.checked)}
                          type="checkbox"
                        />
                        <strong className="text-[12.5px] text-[#28161c] block">
                          โรคเบาหวาน (DM)
                        </strong>
                      </label>
                      {state.hasDiabetes && (
                        <div className="pl-6 space-y-1.5 text-[11.5px]">
                          {[
                            { k: 'dmOver20Years' as const, l: 'เป็นเบาหวานเกิน 20 ปี' },
                            {
                              k: 'dmVascularDisease' as const,
                              l: 'มีโรคร่วมหลอดเลือด (Vascular disease)',
                            },
                            { k: 'dmNephropathy' as const, l: 'ภาวะไตเสื่อม/ไตวาย (Nephropathy)' },
                            { k: 'dmRetinopathy' as const, l: 'ภาวะจอตาเสื่อม (Retinopathy)' },
                            {
                              k: 'dmNeuropathy' as const,
                              l: 'ภาวะเส้นประสาทเสื่อม/อักเสบ (Neuropathy)',
                            },
                          ].map((d) => (
                            <label key={d.k} className="flex items-center gap-2">
                              <input
                                checked={state[d.k]}
                                className="w-4 h-4 accent-[#9e2d50]"
                                onChange={(e) => updateState(d.k, e.target.checked)}
                                type="checkbox"
                              />
                              <span>{d.l}</span>
                            </label>
                          ))}
                          <label className="flex items-center gap-2 pt-0.5 text-[#16563C] font-semibold">
                            <input
                              checked={state.dmNoComplications}
                              className="w-4 h-4 accent-[#16563C]"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  mutateState((prev) => ({
                                    ...prev,
                                    dmOver20Years: false,
                                    dmVascularDisease: false,
                                    dmNephropathy: false,
                                    dmRetinopathy: false,
                                    dmNeuropathy: false,
                                    dmNoComplications: true,
                                  }));
                                }
                              }}
                              type="checkbox"
                            />
                            <span>ไม่มีภาวะ/โรคร่วม</span>
                          </label>
                          {!state.dmNoComplications ? (
                            <div className="p-2.5 rounded-lg bg-[#FDF3F3] border border-[#fbd4d4] text-[#8F1D1D] space-y-1 mt-1">
                              <div className="font-bold">
                                ผลประเมิน: COC(3/4) POP(2) DMPA(3) Implant(2) Cu-IUD(1)
                              </div>
                              <div>
                                เหตุผล: เนื่องจากฮอร์โมนในยาคุมจะไปเพิ่มความเสี่ยงต่อการเกิดอัมพฤกษ์ อัมพาต หัวใจวาย และลิ่มเลือดอุดตันตลอดจนซ้ำเติมภาวะหลอดเลือดที่เสื่อมอยู่แล้ว จึงอันตรายและไม่แนะนำให้ใช้
                              </div>
                              {state.dmOver20Years && (
                                <div>
                                  เหตุผลเฉพาะประเด็น (เป็นเบาหวานเกิน 20 ปี): ถึงแม้ผู้รับบริการจะรู้สึกแข็งแรงดี หรือยังไม่เคยตรวจพบภาวะไตเสื่อม จอตาเสื่อม หรือชาปลายมือปลายเท้าก็ตาม แต่ในทางการแพทย์ ระยะเวลาการเป็นเบาหวานที่ยาวนานเกิน 20 ปี ส่งผลให้หลอดเลือดฝอยทั่วร่างกายผ่านการเสื่อมสภาพสะสมมาอย่างต่อเนื่องซึ่งจะเร่งให้เกิดภาวะแทรกซ้อนรุนแรงได้
                                </div>
                              )}
                              <div className="font-bold text-[#7D490D]">
                                แจ้งเตือน (CAT 3): ส่งต่อปรึกษาแพทย์ หรือ ปรึกษาแพทย์ทางไกล (Teleconsult)
                              </div>
                            </div>
                          ) : (
                            <div className="p-2.5 rounded-lg bg-[#F2F8F5] border border-[#cbe5d7] text-[#16563C] font-bold mt-1">
                              ผลประเมิน: COC(2) POP(2) DMPA(2) Implant(2) Cu-IUD(1)
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* ภาวะไขมันในเลือดสูง */}
                    <div className="p-3 rounded-xl border border-[#f0dce2] bg-[#fffcfc] space-y-2">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          checked={state.hasDyslipidemia}
                          className="w-4 h-4 mt-0.5 accent-[#9e2d50] shrink-0"
                          onChange={(e) => updateState('hasDyslipidemia', e.target.checked)}
                          type="checkbox"
                        />
                        <strong className="text-[12.5px] text-[#28161c] block">
                          ภาวะไขมันในเลือดสูง
                        </strong>
                      </label>
                      {state.hasDyslipidemia && (
                        <div className="pl-6 space-y-1.5 text-[11.5px]">
                          {[
                            { k: 'dlpAgeOver35' as const, l: 'อายุ ≥ 35 ปี (จากข้อด้านบน)' },
                            { k: 'dlpDiabetes' as const, l: 'เบาหวาน (จากข้อด้านบน)' },
                            { k: 'dlpHypertension' as const, l: 'ความดันโลหิตสูง (จากข้อด้านบน)' },
                            { k: 'dlpSmoking' as const, l: 'สูบบุหรี่ (จากข้อด้านบน)' },
                          ].map((dl) => (
                            <label key={dl.k} className="flex items-center gap-2">
                              <input
                                checked={state[dl.k]}
                                className="w-4 h-4 accent-[#9e2d50]"
                                onChange={(e) => updateState(dl.k, e.target.checked)}
                                type="checkbox"
                              />
                              <span>{dl.l}</span>
                            </label>
                          ))}
                          <label className="flex items-center gap-2 pt-0.5 text-[#16563C] font-semibold">
                            <input
                              checked={state.dlpNoRiskFactors}
                              className="w-4 h-4 accent-[#16563C]"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  mutateState((prev) => ({
                                    ...prev,
                                    dlpAgeOver35: false,
                                    dlpDiabetes: false,
                                    dlpHypertension: false,
                                    dlpSmoking: false,
                                    dlpNoRiskFactors: true,
                                  }));
                                }
                              }}
                              type="checkbox"
                            />
                            <span>ไม่มีภาวะ/โรคร่วม</span>
                          </label>
                          {!state.dlpNoRiskFactors ? (
                            <div className="p-2.5 rounded-lg bg-[#FDF3F3] border border-[#fbd4d4] text-[#8F1D1D] space-y-1 mt-1">
                              <div className="font-bold">
                                ผลประเมิน: COC(3/4) POP(2) DMPA(3) Implant(2) Cu-IUD(1)
                              </div>
                              <div>
                                เหตุผล: ไขมันในเลือดสูง ส่งผลให้เกิดหลอดเลือดตีบ/อุดตันได้ง่ายอยู่แล้ว ฮอร์โมนในยาคุมจะไปกระตุ้นให้ไขมันในเลือดเพิ่มขึ้นเมื่อรวมกับปัจจัยเสี่ยงอื่นๆ จะทำให้เสี่ยงต่อการเกิดอัมพฤกษ์ อัมพาต หรือหัวใจวายเฉียบพลัน สูงกว่าคนทั่วไปหลายเท่าตัว
                              </div>
                              <div className="font-bold text-[#7D490D]">
                                แจ้งเตือน (CAT 3): ส่งต่อปรึกษาแพทย์ หรือ ปรึกษาแพทย์ทางไกล (Teleconsult)
                              </div>
                            </div>
                          ) : (
                            <div className="p-2.5 rounded-lg bg-[#F2F8F5] border border-[#cbe5d7] text-[#16563C] font-bold mt-1">
                              ผลประเมิน: COC(2) POP(2) DMPA(2) Implant(2) Cu-IUD(1)
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* โรคไตเรื้อรัง (CKD) */}
                    <div className="p-3 rounded-xl border border-[#f0dce2] bg-[#fffcfc] space-y-2">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          checked={state.hasCkd}
                          className="w-4 h-4 mt-0.5 accent-[#9e2d50] shrink-0"
                          onChange={(e) => updateState('hasCkd', e.target.checked)}
                          type="checkbox"
                        />
                        <strong className="text-[12.5px] text-[#28161c] block">
                          โรคไตเรื้อรัง (CKD)
                        </strong>
                      </label>
                      {state.hasCkd && (
                        <div className="p-2.5 rounded-lg bg-[#FDF3F3] border border-[#fbd4d4] text-[#8F1D1D] text-[11.5px] space-y-1">
                          <div className="font-bold">
                            ผลประเมิน: COC(3/4) POP(1/2) DMPA(1/2) Implant(1/2) Cu-IUD(1)
                          </div>
                          <div>
                            เหตุผล: โรคไตเรื้อรังส่งผลให้หลอดเลือดเสื่อมและมีความดันโลหิตสูงอยู่แล้ว ฮอร์โมนในยาคุมรวมจะยิ่งทำให้ความดันโลหิตสูงขึ้น และกระตุ้นให้เลือดข้นแข็งตัวเป็นก้อนง่ายขึ้น เสี่ยงต่อลิ่มเลือดอุดตันซ้ำซ้อน
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ปวดศีรษะไมเกรน */}
                    <div className="p-3 rounded-xl border border-[#f0dce2] bg-[#fffcfc] space-y-2">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          checked={state.hasMigraine}
                          className="w-4 h-4 mt-0.5 accent-[#9e2d50] shrink-0"
                          onChange={(e) => updateState('hasMigraine', e.target.checked)}
                          type="checkbox"
                        />
                        <strong className="text-[12.5px] text-[#28161c] block">
                          ปวดศีรษะไมเกรน (Migraine)
                        </strong>
                      </label>
                      {state.hasMigraine && (
                        <div className="pl-6 space-y-1.5 text-[11.5px]">
                          {[
                            { val: 'with_aura' as const, l: 'มีออร่า (Aura)' },
                            {
                              val: 'without_aura_lt_35' as const,
                              l: 'ไม่มีออร่า + อายุ < 35 ปี',
                            },
                            {
                              val: 'without_aura_gte_35' as const,
                              l: 'ไม่มีออร่า + อายุ ≥ 35 ปี',
                            },
                          ].map((m) => (
                            <label key={m.val} className="flex items-center gap-2">
                              <input
                                checked={state.migraineType === m.val}
                                className="w-4 h-4 accent-[#9e2d50]"
                                name="mig-type"
                                onChange={() => updateState('migraineType', m.val)}
                                type="radio"
                              />
                              <span>{m.l}</span>
                            </label>
                          ))}
                          {state.migraineType === 'with_aura' ? (
                            <div className="p-2.5 rounded-lg bg-[#FDF3F3] border border-[#fbd4d4] text-[#8F1D1D] space-y-1 mt-1">
                              <div className="font-bold">
                                ผลประเมิน: COC(4) POP(3) DMPA(3) Implant(3) Cu-IUD(1)
                              </div>
                              <div>
                                เหตุผล: อาการ Aura (เช่น ตาพร่ามัว เห็นแสงวูบวาบ ซิกแซก หรือชาตามมือ/หน้าก่อนปวดหัว) เกิดจากภาวะหลอดเลือดในสมองหดเกร็งชั่วคราว ผลของฮอร์โมนในยาคุมรวมจะทำให้เลือดข้นแข็งตัวง่ายขึ้น เมื่อนำมารวมกับภาวะหลอดเลือดสมองที่หดเกร็งอยู่แล้ว จะเกิดความเสี่ยงทำให้เกิดอัมพฤกษ์/อัมพาตจากเส้นเลือดสมองตีบอุดตัน (Ischemic Stroke) สูงขึ้นอย่างมาก
                              </div>
                              <div className="font-bold text-[#7D490D]">
                                แจ้งเตือน (CAT 3): ส่งต่อปรึกษาแพทย์ หรือ ปรึกษาแพทย์ทางไกล (Teleconsult)
                              </div>
                            </div>
                          ) : state.migraineType === 'without_aura_lt_35' ? (
                            <div className="p-2.5 rounded-lg bg-[#FDF4E7] border border-[#f3d9b1] text-[#7D490D] space-y-1 mt-1">
                              <div className="font-bold">
                                ผลประเมิน: COC(3) POP(2) DMPA(2) Implant(2) Cu-IUD(1)
                              </div>
                              <div className="font-bold text-[#9e2d50]">
                                แจ้งเตือน (CAT 3): ส่งต่อปรึกษาแพทย์ หรือ ปรึกษาแพทย์ทางไกล (Teleconsult)
                              </div>
                            </div>
                          ) : (
                            <div className="p-2.5 rounded-lg bg-[#FDF3F3] border border-[#fbd4d4] text-[#8F1D1D] space-y-1 mt-1">
                              <div className="font-bold">
                                ผลประเมิน: COC(4) POP(2) DMPA(2) Implant(2) Cu-IUD(1)
                              </div>
                              <div>
                                เหตุผล: เนื่องจากความเสื่อมของหลอดเลือดตามอายุที่มากขึ้นร่วมกับผลของฮอร์โมนในยาคุมจะเพิ่มความเสี่ยงต่อเส้นเลือดสมองตีบมากขึ้น
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* โรคพุ่มพวง (SLE) */}
                    <div className="p-3 rounded-xl border border-[#f0dce2] bg-[#fffcfc] space-y-2">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          checked={state.hasSle}
                          className="w-4 h-4 mt-0.5 accent-[#9e2d50] shrink-0"
                          onChange={(e) => updateState('hasSle', e.target.checked)}
                          type="checkbox"
                        />
                        <strong className="text-[12.5px] text-[#28161c] block">
                          โรคพุ่มพวง (SLE)
                        </strong>
                      </label>
                      {state.hasSle && (
                        <div className="p-2.5 rounded-lg bg-[#FDF3F3] border border-[#fbd4d4] text-[#8F1D1D] text-[11.5px] space-y-1">
                          <div className="font-bold">
                            ผลประเมิน: COC(4) POP(3) DMPA(3) Implant(3) Cu-IUD(1)
                          </div>
                          <div>
                            เหตุผล: ผู้ป่วย SLE ส่วนใหญ่มีสารสร้างลิ่มเลือดอุดตันในร่างกายอยู่แล้ว ฮอร์โมนในยาคุมรวมจะไปกระตุ้นให้เลือดข้นและแข็งตัวง่ายขึ้น เสี่ยงต่อการเกิดเส้นเลือดสมองตีบ (อัมพฤกษ์/อัมพาต) หรือลิ่มเลือดอุดตันในปอด นอกจากนั้นฮอร์โมนยังมีฤทธิ์กระตุ้นระบบภูมิคุ้มกันที่ผิดปกติ อาจส่งผลให้อาการของโรคพุ่มพวงกำเริบรุนแรงขึ้น หรือทำให้ไตอักเสบแย่ลง
                          </div>
                          <div className="font-bold text-[#7D490D]">
                            แจ้งเตือน (CAT 3): ส่งต่อปรึกษาแพทย์ หรือ ปรึกษาแพทย์ทางไกล (Teleconsult)
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ลิ่มเลือดอุดตันในหลอดเลือดดำลึก (DVT) */}
                    <div className="p-3 rounded-xl border border-[#f0dce2] bg-[#fffcfc] space-y-2">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          checked={state.hasDvt}
                          className="w-4 h-4 mt-0.5 accent-[#9e2d50] shrink-0"
                          onChange={(e) => updateState('hasDvt', e.target.checked)}
                          type="checkbox"
                        />
                        <strong className="text-[12.5px] text-[#28161c] block">
                          ลิ่มเลือดอุดตันในหลอดเลือดดำลึก (DVT)
                        </strong>
                      </label>
                      {state.hasDvt && (
                        <div className="p-2.5 rounded-lg bg-[#FDF3F3] border border-[#fbd4d4] text-[#8F1D1D] text-[11.5px] space-y-1">
                          <div className="font-bold">
                            ผลประเมิน: COC(4) POP(2) DMPA({state.hasDiabetes ? '3 (ร่วมกับเบาหวาน)' : '2'}) Implant(2) Cu-IUD(1)
                          </div>
                          <div>
                            เหตุผล: ฮอร์โมนในยาคุมรวมจะไปกระตุ้นให้เลือดข้นและแข็งตัวเป็นก้อนง่ายขึ้น หากมีประวัติลิ่มเลือดอุดตันอยู่แล้ว จะยิ่งเสี่ยงให้ลิ่มเลือดหลุดไปอุดที่ปอดจนอันตรายถึงชีวิต จึงห้ามใช้เด็ดขาด
                          </div>
                        </div>
                      )}
                    </div>

                    {/* โรคหลอดเลือดสมองตีบ/แตก (Stroke) */}
                    <div className="p-3 rounded-xl border border-[#f0dce2] bg-[#fffcfc] space-y-2">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          checked={state.hasStroke}
                          className="w-4 h-4 mt-0.5 accent-[#9e2d50] shrink-0"
                          onChange={(e) => updateState('hasStroke', e.target.checked)}
                          type="checkbox"
                        />
                        <strong className="text-[12.5px] text-[#28161c] block">
                          โรคหลอดเลือดสมองตีบ/แตก (Stroke)
                        </strong>
                      </label>
                      {state.hasStroke && (
                        <div className="p-2.5 rounded-lg bg-[#FDF3F3] border border-[#fbd4d4] text-[#8F1D1D] text-[11.5px] space-y-1">
                          <div className="font-bold">
                            ผลประเมิน: COC(4) POP(3) DMPA(3) Implant(3) Cu-IUD(1)
                          </div>
                          <div>
                            เหตุผล: ฮอร์โมนในยาคุมรวมกระตุ้นการแข็งตัวของเลือดและทำให้เลือดข้นแข็งตัวง่าย เพิ่มความเสี่ยงต่อการเกิด Stroke ซ้ำสูงขึ้นอย่างมาก
                          </div>
                          <div className="font-bold text-[#7D490D]">
                            แจ้งเตือน (CAT 3): ส่งต่อปรึกษาแพทย์ หรือ ปรึกษาแพทย์ทางไกล (Teleconsult)
                          </div>
                        </div>
                      )}
                    </div>

                    {/* พาหะไวรัสตับอักเสบ */}
                    <div className="p-3 rounded-xl border border-[#f0dce2] bg-[#fffcfc] space-y-2">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          checked={state.hasViralHepatitisCarrier}
                          className="w-4 h-4 mt-0.5 accent-[#9e2d50] shrink-0"
                          onChange={(e) => updateState('hasViralHepatitisCarrier', e.target.checked)}
                          type="checkbox"
                        />
                        <strong className="text-[12.5px] text-[#28161c] block">
                          พาหะไวรัสตับอักเสบ / ตับอักเสบเรื้อรังจากไวรัส
                        </strong>
                      </label>
                      {state.hasViralHepatitisCarrier && (
                        <div className="p-2.5 rounded-lg bg-[#F2F8F5] border border-[#cbe5d7] text-[#16563C] text-[11.5px] font-bold">
                          ผลประเมิน: COC(1) POP(1) DMPA(1) Implant(1) Cu-IUD(1)
                        </div>
                      )}
                    </div>

                    {/* โรคตับแข็ง */}
                    <div className="p-3 rounded-xl border border-[#f0dce2] bg-[#fffcfc] space-y-2">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          checked={state.hasCirrhosis}
                          className="w-4 h-4 mt-0.5 accent-[#9e2d50] shrink-0"
                          onChange={(e) => updateState('hasCirrhosis', e.target.checked)}
                          type="checkbox"
                        />
                        <strong className="text-[12.5px] text-[#28161c] block">
                          โรคตับแข็ง (Cirrhosis)
                        </strong>
                      </label>
                      {state.hasCirrhosis && (
                        <div className="pl-6 space-y-1.5 text-[11.5px]">
                          {[
                            { val: 'mild_compensated' as const, l: 'Mild (Compensated)' },
                            { val: 'severe_decompensated' as const, l: 'Severe (Decompensated)' },
                            { val: 'unknown' as const, l: 'ไม่ทราบ' },
                          ].map((c) => (
                            <label key={c.val} className="flex items-center gap-2">
                              <input
                                checked={state.cirrhosisSeverity === c.val}
                                className="w-4 h-4 accent-[#9e2d50]"
                                name="cirr-sev"
                                onChange={() => updateState('cirrhosisSeverity', c.val)}
                                type="radio"
                              />
                              <span>{c.l}</span>
                            </label>
                          ))}
                          {state.cirrhosisSeverity === 'mild_compensated' ? (
                            <div className="p-2.5 rounded-lg bg-[#F2F8F5] border border-[#cbe5d7] text-[#16563C] font-bold mt-1">
                              ผลประเมิน: COC(1) POP(1) DMPA(1) Implant(1) Cu-IUD(1)
                            </div>
                          ) : state.cirrhosisSeverity === 'severe_decompensated' ? (
                            <div className="p-2.5 rounded-lg bg-[#FDF3F3] border border-[#fbd4d4] text-[#8F1D1D] space-y-1 mt-1">
                              <div className="font-bold">
                                ผลประเมิน: COC(4) POP(3) DMPA(3) Implant(3) Cu-IUD(1)
                              </div>
                              <div>
                                เหตุผล: เซลล์ตับเสียสภาพอย่างรุนแรง ไม่สามารถขจัดฮอร์โมนในยาคุมได้ ทำให้ฮอร์โมนคั่ง ส่งผลเสียต่อร่างกาย และฮอร์โมนยังไปซ้ำเติมกระบวนการสร้างโปรตีนและการแข็งตัวของเลือดที่ตับสร้างอยู่แล้วให้แย่ลง
                              </div>
                              <div className="font-bold text-[#7D490D]">
                                แจ้งเตือน (CAT 3): ส่งต่อปรึกษาแพทย์ หรือ ปรึกษาแพทย์ทางไกล (Teleconsult)
                              </div>
                            </div>
                          ) : (
                            <div className="p-2.5 rounded-lg bg-[#FDF4E7] border border-[#f3d9b1] text-[#7D490D] font-bold mt-1">
                              แจ้งเตือน: ส่งต่อปรึกษาแพทย์ หรือ ปรึกษาแพทย์ทางไกล (Teleconsult) เพื่อพิจารณาภาวะตับแข็งและเลือกวิธีการที่เหมาะสม
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* โรคก้อนเนื้อที่เต้านม */}
                    <div className="p-3 rounded-xl border border-[#f0dce2] bg-[#fffcfc] space-y-2">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          checked={state.hasBreastDisease}
                          className="w-4 h-4 mt-0.5 accent-[#9e2d50] shrink-0"
                          onChange={(e) => updateState('hasBreastDisease', e.target.checked)}
                          type="checkbox"
                        />
                        <strong className="text-[12.5px] text-[#28161c] block">
                          โรคก้อนเนื้อที่เต้านม
                        </strong>
                      </label>
                      {state.hasBreastDisease && (
                        <div className="pl-6 space-y-1.5 text-[11.5px]">
                          {[
                            {
                              val: 'undiagnosed_mass' as const,
                              l: 'ก้อนเนื้อที่ยังไม่ได้รับการวินิจฉัย',
                            },
                            {
                              val: 'benign' as const,
                              l: 'ก้อนเต้านมที่ไม่ใช่เนื้อร้าย/มะเร็ง',
                            },
                            { val: 'cancer' as const, l: 'มะเร็งเต้านม' },
                          ].map((b) => (
                            <label key={b.val} className="flex items-center gap-2">
                              <input
                                checked={state.breastDiseaseType === b.val}
                                className="w-4 h-4 accent-[#9e2d50]"
                                name="breast-type"
                                onChange={() => updateState('breastDiseaseType', b.val)}
                                type="radio"
                              />
                              <span>{b.l}</span>
                            </label>
                          ))}
                          {state.breastDiseaseType === 'undiagnosed_mass' ? (
                            <div className="p-2.5 rounded-lg bg-[#F2F8F5] border border-[#cbe5d7] text-[#16563C] font-bold mt-1">
                              ผลประเมิน: COC(2) POP(2) DMPA(2) Implant(2) Cu-IUD(1)
                            </div>
                          ) : state.breastDiseaseType === 'benign' ? (
                            <div className="p-2.5 rounded-lg bg-[#F2F8F5] border border-[#cbe5d7] text-[#16563C] font-bold mt-1">
                              ผลประเมิน: COC(1) POP(1) DMPA(1) Implant(1) Cu-IUD(1)
                            </div>
                          ) : (
                            <div className="p-2.5 rounded-lg bg-[#FDF3F3] border border-[#fbd4d4] text-[#8F1D1D] space-y-1 mt-1">
                              <div className="font-bold">
                                ผลประเมิน: COC(4) POP(4) DMPA(4) Implant(4) Cu-IUD(1)
                              </div>
                              <div>
                                เหตุผล: ฮอร์โมนที่มีอยู่ในยาคุมทุกชนิดทั้งยากิน ยาฉีด และยาฝัง เป็นตัวเร่งการเจริญเติบโตของเซลล์มะเร็งเต้านมได้
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* โรคลมชัก (ยากันชัก) */}
                    <div className="p-3 rounded-xl border border-[#f0dce2] bg-[#fffcfc] space-y-2">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          checked={state.hasEpilepsy}
                          className="w-4 h-4 mt-0.5 accent-[#9e2d50] shrink-0"
                          id="cm-epi"
                          onChange={(e) => updateState('hasEpilepsy', e.target.checked)}
                          type="checkbox"
                        />
                        <strong className="text-[12.5px] text-[#28161c] block">
                          โรคลมชัก : ระบุยาที่ทานเพื่อป้องกันชัก
                        </strong>
                      </label>
                      {state.hasEpilepsy && (
                        <div className="pl-6 space-y-1.5 text-[11.5px]">
                          {[
                            {
                              val: 'enzyme_inducer' as const,
                              l: 'Phenytoin / Carbamazepine / Barbiturate / Primidone / Topiramate / Oxcarbazepine',
                            },
                            { val: 'other_drugs' as const, l: 'ยาอื่นๆ ที่ไม่ใช่ข้อด้านบน' },
                            { val: 'unknown' as const, l: 'ไม่ทราบ' },
                          ].map((ep) => (
                            <label key={ep.val} className="flex items-center gap-2">
                              <input
                                checked={state.epilepsyDrugType === ep.val}
                                className="w-4 h-4 accent-[#9e2d50]"
                                name="epi-type"
                                onChange={() => updateState('epilepsyDrugType', ep.val)}
                                type="radio"
                              />
                              <span>{ep.l}</span>
                            </label>
                          ))}
                          {state.epilepsyDrugType === 'enzyme_inducer' ? (
                            <div className="p-2.5 rounded-lg bg-[#FDF4E7] border border-[#f3d9b1] text-[#7D490D] space-y-1 mt-1">
                              <div className="font-bold">
                                ผลประเมิน: COC(3) POP(3) DMPA(1) Implant(2) Cu-IUD(1)
                              </div>
                              <div>
                                เหตุผล: ยากันชักข้างต้นจะไปลดฤทธิ์ของยาคุมกำเนิด ทำให้มีความเสี่ยงในการตั้งครรภ์
                              </div>
                              <div className="font-bold text-[#9e2d50]">
                                แจ้งเตือน (CAT 3): ส่งต่อปรึกษาแพทย์ หรือ ปรึกษาแพทย์ทางไกล (Teleconsult)
                              </div>
                            </div>
                          ) : state.epilepsyDrugType === 'other_drugs' ? (
                            <div className="p-2.5 rounded-lg bg-[#F2F8F5] border border-[#cbe5d7] text-[#16563C] font-bold mt-1">
                              ผลประเมิน: COC(1) POP(1) DMPA(1) Implant(1) Cu-IUD(1)
                            </div>
                          ) : (
                            <div className="p-2.5 rounded-lg bg-[#FDF4E7] border border-[#f3d9b1] text-[#7D490D] font-bold mt-1">
                              แจ้งเตือน: ส่งต่อปรึกษาแพทย์ หรือ ปรึกษาแพทย์ทางไกล (Teleconsult) เพื่อพิจารณาเรื่องยากันชักและเลือกวิธีการคุมกำเนิดที่เหมาะสม
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* ยารักษาวัณโรค Rifampicin */}
                    <div className="p-3 rounded-xl border border-[#f0dce2] bg-[#fffcfc] space-y-2">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          checked={state.hasRifampicin}
                          className="w-4 h-4 mt-0.5 accent-[#9e2d50] shrink-0"
                          id="cm-rif"
                          onChange={(e) => updateState('hasRifampicin', e.target.checked)}
                          type="checkbox"
                        />
                        <strong className="text-[12.5px] text-[#28161c] block">
                          ยารักษาวัณโรค Rifampicin
                        </strong>
                      </label>
                      {state.hasRifampicin && (
                        <div className="p-2.5 rounded-lg bg-[#FDF4E7] border border-[#f3d9b1] text-[#7D490D] text-[11.5px] space-y-1">
                          <div className="font-bold">
                            ผลประเมิน: COC(3) POP(3) DMPA(1) Implant(2) Cu-IUD(1)
                          </div>
                          <div>
                            เหตุผล: ยา Rifampicin เร่งการสลายฮอร์โมนของยาคุมในเลือดอย่างรวดเร็ว ส่งผลให้ประสิทธิภาพการคุมกำเนิดลดลงอย่างมากจนเสี่ยงต่อการตั้งครรภ์ไม่พึงประสงค์ได้
                          </div>
                          <div className="font-bold text-[#9e2d50]">
                            แจ้งเตือน (CAT 3): ส่งต่อปรึกษาแพทย์ หรือ ปรึกษาแพทย์ทางไกล (Teleconsult)
                          </div>
                        </div>
                      )}
                    </div>

                    {/* โรคประจำตัวอื่นๆ */}
                    <div className="p-3 rounded-xl border border-[#f0dce2] bg-[#fffcfc] space-y-1.5">
                      <label className="block text-[12px] font-bold text-[#28161c]">
                        โรคประจำตัวอื่นๆ (ระบุ):
                      </label>
                      <input
                        className="w-full h-10 px-3 rounded-lg border border-[#dcbfc4] bg-white text-[13px]"
                        onChange={(e) => updateState('otherDiseases', e.target.value)}
                        placeholder="ระบุโรคประจำตัวอื่นๆ"
                        type="text"
                        value={state.otherDiseases}
                      />
                    </div>
                </div>

                {/* ประวัติการแพ้ยา */}
                <div
                  className="p-3 rounded-xl border border-[#f0dce2] bg-[#fffcfc] space-y-2"
                  id="allergy-section"
                >
                  <strong className="text-[12.5px] text-[#28161c] block">ประวัติการแพ้ยา:</strong>
                  <div className="flex items-center gap-4 text-[12px]">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        checked={state.hasDrugAllergy === 'none'}
                        className="w-4 h-4 accent-[#9e2d50]"
                        name="allergy"
                        onChange={() => updateState('hasDrugAllergy', 'none')}
                        type="radio"
                      />
                      <span>ไม่มี</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        checked={state.hasDrugAllergy === 'yes'}
                        className="w-4 h-4 accent-[#9e2d50]"
                        name="allergy"
                        onChange={() => updateState('hasDrugAllergy', 'yes')}
                        type="radio"
                      />
                      <span>มี (ระบุ)</span>
                    </label>
                  </div>
                  {state.hasDrugAllergy === 'yes' && (
                    <input
                      className="w-full h-10 px-3 rounded-lg border border-[#dcbfc4] bg-white text-[13px]"
                      onChange={(e) => updateState('drugAllergyDetail', e.target.value)}
                      placeholder="ระบุชื่อยาที่แพ้"
                      type="text"
                      value={state.drugAllergyDetail}
                    />
                  )}
                </div>

                <div className="p-3 rounded-xl bg-[#fff0f3] border border-[#ffd5e1] text-[#9e2d50] text-[12px] flex items-center gap-2">
                  <MaterialIcon name="info" className="w-[18px] h-[18px] text-[18px] shrink-0" />
                  <span>
                    {state.noComorbidities
                      ? 'ไม่มีประวัติการใช้ยาเหนี่ยวนำเอนไซม์หรือโรคแทรกซ้อน'
                      : 'บันทึกข้อมูลโรคประจำตัวและยาที่ใช้เรียบร้อยแล้ว กดดำเนินการต่อเพื่อดูตารางผล 5 วิธี'}
                  </span>
                </div>
              </div>
            </section>
          )}

          {/* ================= STEP 5: ตารางผล 5 วิธี (Mobile Stacked Cards & Matrix) ================= */}
          {currentStep === 5 && (
            <section className="step-panel flex flex-col gap-3.5" id="step-panel-5">
              {/* Title Banner */}
              <div className="bg-white rounded-2xl border border-[#f0dce2] p-4 shadow-sm flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-[#fff0f3] text-[#9e2d50] text-[10.5px] font-bold">
                    รพ.สต. ปฐมภูมิ
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#E7F3ED] text-[#16563C] text-[10.5px] font-bold">
                    {allMethodsCat1
                      ? 'MEC Cat 1 ครบทั้ง 5 วิธี'
                      : `วิธีปลอดภัย (Cat 1-2): ${evaluation.recommendedSafeMethods.length} วิธี`}
                  </span>
                </div>
                <h2 className="text-[16px] font-bold text-[#28161c] leading-tight">
                  ผลการประเมินความปลอดภัย 5 วิธี
                </h2>
                <p className="text-[11.5px] text-[#564145]">
                  เกณฑ์มาตรฐาน WHO MEC 6th Edition (Worst-Category Wins)
                </p>
              </div>

              {/* 5 Mobile Method Cards Stacked */}
              <div className="flex flex-col gap-3">
                {/* 1. Implant (Featured LARC) */}
                {(() => {
                  const cat = evaluation.methods.IMPLANT.finalCategory;
                  const st = getCategoryStyle(cat);
                  return (
                    <div className="bg-white rounded-2xl border-2 border-[#9e2d50] shadow-sm p-4 relative overflow-hidden flex flex-col gap-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl bg-[#9e2d50] text-white flex items-center justify-center shrink-0">
                            <MaterialIcon name="colorize" className="w-[18px] h-[18px] text-[22px]" />
                          </div>
                          <div>
                            <h3 className="text-[15px] font-bold text-[#9e2d50] leading-snug">
                              ยาฝังคุมกำเนิด (Implant)
                            </h3>
                            <p className="text-[11px] text-[#564145]">1 หรือ 2 หลอดใต้ผิวหนัง</p>
                          </div>
                        </div>
                        <span className="px-2 py-1 rounded-lg text-[10.5px] font-bold bg-[#9e2d50] text-white shrink-0">
                          แนะนำสูง (LARC)
                        </span>
                      </div>
                      <div
                        className={`p-2.5 rounded-xl border flex items-center justify-between ${st.boxClass}`}
                      >
                        <div className="flex items-center gap-1.5">
                          <MaterialIcon name={st.iconName} className="w-[18px] h-[18px] text-[16px]" />
                          <span className="text-[12px] font-bold">{st.titleText}</span>
                        </div>
                        <span className="text-[11px] font-bold shrink-0">&gt; 99.9% ผลลัพธ์</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[12px] py-1 border-y border-[#f8e4eb]">
                        <div>
                          <span className="text-[#564145] text-[11px] block">ระยะคุ้มครอง:</span>
                          <span className="font-bold text-[#28161c]">3 ปี หรือ 5 ปี</span>
                        </div>
                        <div>
                          <span className="text-[#564145] text-[11px] block">ความต่อเนื่อง:</span>
                          <span className="font-bold text-[#16563C]">ไม่ต้องกังวลเรื่องลืม</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#564145] bg-[#fff9fa] p-2.5 rounded-xl border border-[#fae6ec]">
                        <strong className="text-[#28161c]">จุดเด่น รพ.สต.:</strong>{' '}
                        ประสิทธิภาพสูงสุด ถอดแล้วเจริญพันธุ์กลับมาเร็ว ให้บริการได้โดยเจ้าหน้าที่ผ่านการอบรม
                      </p>
                      <button
                        className="w-full h-11 rounded-xl bg-[#9e2d50] hover:bg-[#852442] text-white text-[13px] font-bold flex items-center justify-center gap-1 transition-colors active:scale-[0.99] cursor-pointer"
                        onClick={() => selectMethodAndGoStep6('IMPLANT')}
                        type="button"
                      >
                        <span>คำแนะนำและวิธีเริ่มยา</span>
                        <MaterialIcon name="chevron_right" className="w-[18px] h-[18px] text-[16px]" />
                      </button>
                    </div>
                  );
                })()}

                {/* 2. COC */}
                {(() => {
                  const cat = evaluation.methods.COC.finalCategory;
                  const st = getCategoryStyle(cat);
                  return (
                    <div className="bg-white rounded-2xl border border-[#f0dce2] shadow-2xs p-4 flex flex-col gap-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-[#fff0f3] text-[#9e2d50] flex items-center justify-center border border-[#ffd5e1] shrink-0">
                            <MaterialIcon name="calendar_month" className="w-[18px] h-[18px] text-[20px]" />
                          </div>
                          <div>
                            <h3 className="text-[14.5px] font-bold text-[#28161c] leading-snug">
                              ยาเม็ดคุมกำเนิดฮอร์โมนรวม (COC)
                            </h3>
                            <p className="text-[11px] text-[#564145]">Combined Oral Pills</p>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10.5px] font-bold shrink-0 ${st.pillClass}`}
                        >
                          {st.shortText}
                        </span>
                      </div>
                      <div
                        className={`p-2.5 rounded-xl border flex flex-col gap-1 text-[11.5px] ${st.boxClass}`}
                      >
                        <div className="font-bold">{st.titleText}</div>
                        <div className="text-[11px]">{st.actionText}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[12px] bg-[#fff7f9] p-2.5 rounded-xl border border-[#f8e4eb]">
                        <div>
                          <span className="text-[#564145] text-[10.5px] block">ระยะเวลา:</span>
                          <span className="font-bold text-[#28161c]">รายเดือน (ทานทุกวัน)</span>
                        </div>
                        <div>
                          <span className="text-[#564145] text-[10.5px] block">ประสิทธิภาพ:</span>
                          <span className="font-bold text-[#16563C]">93% (Typical use)</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#564145]">
                        รอบเดือนมาสม่ำเสมอ ลดอาการปวดประจำเดือน ต้องรับประทานตรงเวลาทุกวัน
                      </p>
                      <button
                        className="w-full h-10 rounded-xl bg-[#fff0f3] text-[#9e2d50] hover:bg-[#ffe1e8] text-[12.5px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        onClick={() => selectMethodAndGoStep6('COC')}
                        type="button"
                      >
                        <span>คำแนะนำและวิธีเริ่มยา</span>
                        <MaterialIcon name="chevron_right" className="w-[18px] h-[18px] text-[16px]" />
                      </button>
                    </div>
                  );
                })()}

                {/* 3. POP */}
                {(() => {
                  const cat = evaluation.methods.POP.finalCategory;
                  const st = getCategoryStyle(cat);
                  return (
                    <div className="bg-white rounded-2xl border border-[#f0dce2] shadow-2xs p-4 flex flex-col gap-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-[#fff0f3] text-[#9e2d50] flex items-center justify-center border border-[#ffd5e1] shrink-0">
                            <MaterialIcon name="pill" className="w-[18px] h-[18px] text-[20px]" />
                          </div>
                          <div>
                            <h3 className="text-[14.5px] font-bold text-[#28161c] leading-snug">
                              ยาคุมกำเนิดฮอร์โมนเดี่ยว (POP)
                            </h3>
                            <p className="text-[11px] text-[#564145]">Progestogen-Only Pills</p>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10.5px] font-bold shrink-0 ${st.pillClass}`}
                        >
                          {st.shortText}
                        </span>
                      </div>
                      <div
                        className={`p-2.5 rounded-xl border flex flex-col gap-1 text-[11.5px] ${st.boxClass}`}
                      >
                        <div className="font-bold">{st.titleText}</div>
                        <div className="text-[11px]">{st.actionText}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[12px] bg-[#fff7f9] p-2.5 rounded-xl border border-[#f8e4eb]">
                        <div>
                          <span className="text-[#564145] text-[10.5px] block">ระยะเวลา:</span>
                          <span className="font-bold text-[#28161c]">รายเดือน (ทานทุกวัน)</span>
                        </div>
                        <div>
                          <span className="text-[#564145] text-[10.5px] block">ประสิทธิภาพ:</span>
                          <span className="font-bold text-[#16563C]">91% (Typical use)</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#564145]">
                        ไม่มีเอสโตรเจน ปลอดภัยต่อหญิงให้นมบุตร ไม่กระทบปริมาณน้ำนม ต้องทานเวลาเดิม
                      </p>
                      <button
                        className="w-full h-10 rounded-xl bg-[#fff0f3] text-[#9e2d50] hover:bg-[#ffe1e8] text-[12.5px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        onClick={() => selectMethodAndGoStep6('POP')}
                        type="button"
                      >
                        <span>คำแนะนำและวิธีเริ่มยา</span>
                        <MaterialIcon name="chevron_right" className="w-[18px] h-[18px] text-[16px]" />
                      </button>
                    </div>
                  );
                })()}

                {/* 4. DMPA */}
                {(() => {
                  const cat = evaluation.methods.DMPA.finalCategory;
                  const st = getCategoryStyle(cat);
                  return (
                    <div className="bg-white rounded-2xl border border-[#f0dce2] shadow-2xs p-4 flex flex-col gap-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-[#fff0f3] text-[#9e2d50] flex items-center justify-center border border-[#ffd5e1] shrink-0">
                            <MaterialIcon name="vaccines" className="w-[18px] h-[18px] text-[20px]" />
                          </div>
                          <div>
                            <h3 className="text-[14.5px] font-bold text-[#28161c] leading-snug">
                              ยาฉีดคุมกำเนิดฮอร์โมนเดี่ยว (DMPA)
                            </h3>
                            <p className="text-[11px] text-[#564145]">Injectable ทุก 3 เดือน</p>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10.5px] font-bold shrink-0 ${st.pillClass}`}
                        >
                          {st.shortText}
                        </span>
                      </div>
                      <div
                        className={`p-2.5 rounded-xl border flex flex-col gap-1 text-[11.5px] ${st.boxClass}`}
                      >
                        <div className="font-bold">{st.titleText}</div>
                        <div className="text-[11px]">{st.actionText}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[12px] bg-[#fff7f9] p-2.5 rounded-xl border border-[#f8e4eb]">
                        <div>
                          <span className="text-[#564145] text-[10.5px] block">ระยะเวลา:</span>
                          <span className="font-bold text-[#28161c]">3 เดือน ต่อเข็ม</span>
                        </div>
                        <div>
                          <span className="text-[#564145] text-[10.5px] block">ประสิทธิภาพ:</span>
                          <span className="font-bold text-[#16563C]">96% (Typical use)</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#564145]">
                        ไม่ต้องจำกินยาทุกวัน นัดฉีดทุก 12 สัปดาห์ อาจมีประจำเดือนกะปริดกะปรอยหรือขาดหาย
                        <span className="block text-[#7D490D] font-semibold mt-0.5">
                          คำเตือนพิเศษ: ควรระวังเรื่องมวลกระดูกบางลงหากใช้นานต่อเนื่อง &gt; 2 ปี
                        </span>
                      </p>
                      <button
                        className="w-full h-10 rounded-xl bg-[#fff0f3] text-[#9e2d50] hover:bg-[#ffe1e8] text-[12.5px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        onClick={() => selectMethodAndGoStep6('DMPA')}
                        type="button"
                      >
                        <span>คำแนะนำและวิธีเริ่มยา</span>
                        <MaterialIcon name="chevron_right" className="w-[18px] h-[18px] text-[16px]" />
                      </button>
                    </div>
                  );
                })()}

                {/* 5. Cu-IUD */}
                {(() => {
                  const cat = evaluation.methods.CU_IUD.finalCategory;
                  const st = getCategoryStyle(cat);
                  return (
                    <div className="bg-white rounded-2xl border border-[#f0dce2] shadow-2xs p-4 flex flex-col gap-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-[#fff0f3] text-[#9e2d50] flex items-center justify-center border border-[#ffd5e1] shrink-0">
                            <MaterialIcon name="water_drop" className="w-[18px] h-[18px] text-[20px]" />
                          </div>
                          <div>
                            <h3 className="text-[14.5px] font-bold text-[#28161c] leading-snug">
                              ห่วงอนามัยหุ้มทองแดง (Cu-IUD)
                            </h3>
                            <p className="text-[11px] text-[#564145]">Copper IUD ไร้ฮอร์โมน</p>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10.5px] font-bold shrink-0 ${st.pillClass}`}
                        >
                          {st.shortText}
                        </span>
                      </div>
                      <div
                        className={`p-2.5 rounded-xl border flex flex-col gap-1 text-[11.5px] ${st.boxClass}`}
                      >
                        <div className="font-bold">{st.titleText}</div>
                        <div className="text-[11px]">{st.actionText}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[12px] bg-[#fff7f9] p-2.5 rounded-xl border border-[#f8e4eb]">
                        <div>
                          <span className="text-[#564145] text-[10.5px] block">ระยะเวลา:</span>
                          <span className="font-bold text-[#28161c]">5 - 10 ปี</span>
                        </div>
                        <div>
                          <span className="text-[#564145] text-[10.5px] block">ประสิทธิภาพ:</span>
                          <span className="font-bold text-[#16563C]">&gt; 99.2%</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#564145]">
                        ไร้ฮอร์โมนรบกวนร่างกาย ประสิทธิภาพยาวนาน หาก รพ.สต. ไม่มีผู้ชำนาญการส่งต่อ รพช.
                      </p>
                      <button
                        className="w-full h-10 rounded-xl bg-[#fff0f3] text-[#9e2d50] hover:bg-[#ffe1e8] text-[12.5px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        onClick={() => selectMethodAndGoStep6('CU_IUD')}
                        type="button"
                      >
                        <span>คำแนะนำและวิธีเริ่มยา</span>
                        <MaterialIcon name="chevron_right" className="w-[18px] h-[18px] text-[16px]" />
                      </button>
                    </div>
                  );
                })()}
              </div>

              {/* Mobile Responsive WHO MEC Factor Breakdown Card */}
              <div className="bg-white rounded-2xl border border-[#f0dce2] p-4 shadow-sm flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <MaterialIcon name="fact_check" className="w-[18px] h-[18px] text-[#9e2d50] text-[20px]" />
                  <h4 className="text-[13.5px] font-bold text-[#28161c]">
                    สรุปรายปัจจัย WHO MEC 6th Ed.
                  </h4>
                </div>
                <div className="space-y-2 text-[12px]">
                  <div className="p-2.5 rounded-xl bg-[#fff7f9] border border-[#f5cbd6] flex items-center justify-between">
                    <span className="text-[#564145]">อายุ ({age} ปี)</span>
                    <span className="px-2 py-0.5 rounded font-bold bg-[#E7F3ED] text-[#16563C] text-[10.5px]">
                      {age >= 35 ? 'เฝ้าระวังร่วมกับปัจจัยอื่น' : 'Cat 1 ทุกวิธี'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#fff7f9] border border-[#f5cbd6] flex items-center justify-between">
                    <span className="text-[#564145]">
                      ความดัน ({sbp}/{dbp} mmHg)
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded font-bold text-[10.5px] ${
                        bpIsStage2
                          ? 'bg-[#FDF3F3] text-[#8F1D1D]'
                          : bpIsStage1
                          ? 'bg-[#FCF7F0] text-[#7D490D]'
                          : 'bg-[#E7F3ED] text-[#16563C]'
                      }`}
                    >
                      {bpIsStage2
                        ? 'COC Cat 4 / DMPA Cat 3'
                        : bpIsStage1
                        ? 'COC Cat 3 / DMPA Cat 2'
                        : 'Cat 1 ทุกวิธี'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#fff7f9] border border-[#f5cbd6] flex items-center justify-between">
                    <span className="text-[#564145]">
                      BMI ({bmi.toFixed(1)} • {bmiSubText})
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded font-bold text-[10.5px] ${
                        bmi >= 30
                          ? 'bg-[#FCF7F0] text-[#7D490D]'
                          : 'bg-[#E7F3ED] text-[#16563C]'
                      }`}
                    >
                      {bmi >= 30 ? 'COC Cat 2/3' : 'Cat 1 ทุกวิธี'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#fff7f9] border border-[#f5cbd6] flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[#564145]">ประวัติสูบบุหรี่ ({smkSummaryText})</span>
                    <span
                      className={`px-2 py-0.5 rounded font-bold text-[10.5px] ${
                        state.smokingStatus === 'none'
                          ? 'bg-[#E7F3ED] text-[#16563C]'
                          : isHeavySmokerOver35
                          ? 'bg-[#FDF3F3] text-[#8F1D1D]'
                          : 'bg-[#FCF7F0] text-[#7D490D]'
                      }`}
                    >
                      {state.smokingStatus === 'none' ? 'Cat 1 ทุกวิธี' : smkSubText}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ================= STEP 6: คำแนะนำคลินิก ================= */}
          {currentStep === 6 && (
            <section className="step-panel flex flex-col gap-3.5" id="step-panel-6">
              <div className="bg-white rounded-2xl border border-[#f0dce2] p-4 shadow-sm flex flex-col gap-3.5">
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#f3d2da] no-print">
                  <div className="w-8 h-8 rounded-xl bg-[#fff0f3] text-[#9e2d50] flex items-center justify-center font-bold text-[15px] border border-[#ffd5e1] shrink-0">
                    6
                  </div>
                  <div>
                    <h2 className="text-[15px] font-bold text-[#28161c]">
                      คำแนะนำคลินิก &amp; บันทึกเวชระเบียน
                    </h2>
                    <p className="text-[11px] text-[#564145]">
                      Clinical Guidance &amp; Case Record
                    </p>
                  </div>
                </div>

                {/* Clinical Guidance Box for Selected Method (Cat 1-4) */}
                <div className={`p-3.5 rounded-xl border space-y-2 ${selectedMethodCatStyle.boxClass}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 font-bold text-[13px]">
                      <MaterialIcon name={selectedMethodCatStyle.iconName} className="w-[18px] h-[18px] text-[18px]" />
                      <span>เมื่อคลิกเลือก: {selectedMethodInfo.shortName}</span>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white/90 border border-current shrink-0">
                      {selectedMethodCatStyle.shortText}
                    </span>
                  </div>

                  <div className="text-[12.5px] font-bold">{selectedMethodCatStyle.titleText}</div>
                  <div className="text-[11.5px] font-semibold">
                    แนวทางปฏิบัติ: {selectedMethodCatStyle.actionText}
                  </div>

                  {selectedMethodEval.finalCategory === 3 && (
                    <div className="p-2.5 rounded-lg bg-white/90 text-[#9e2d50] text-[11.5px] font-bold">
                      • แจ้งเตือนระบบ: ส่งต่อปรึกษาแพทย์ หรือ ปรึกษาแพทย์ทางไกล (Teleconsult)
                    </div>
                  )}

                  {selectedMethodEval.reasons.length > 0 && (
                    <div className="p-2.5 rounded-lg bg-white/90 text-[#28161c] text-[11.5px] space-y-1">
                      <strong className="block text-[#9e2d50]">• ข้อห้ามใช้ / เหตุผล:</strong>
                      {selectedMethodEval.reasons.map((r, idx) => (
                        <div key={idx}>
                          - <strong>{r.conditionTitle} (Cat {r.category}):</strong> {r.reasonText}
                          {r.actionNotice && (
                            <span className="block text-[#9e2d50] font-bold mt-0.5">
                              ({r.actionNotice})
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedMethodEval.finalCategory >= 3 && (
                    <div className="p-2.5 rounded-lg bg-white/90 text-[#16563C] text-[11.5px]">
                      <strong>• วิธีทางเลือกที่แนะนำ (Cat 1, Cat 2):</strong>{' '}
                      {evaluation.recommendedSafeMethods.length > 0
                        ? evaluation.recommendedSafeMethods
                            .map(
                              (id) =>
                                `${CONTRACEPTIVE_METHODS[id].code} (Cat ${evaluation.methods[id].finalCategory})`
                            )
                            .join(', ')
                        : 'ถุงยางอนามัย หรือส่งต่อพบแพทย์'}
                    </div>
                  )}
                </div>

                {evaluation.globalClinicalAlerts.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-[#FCF7F0] border border-[#f5e3cd] text-[#7D490D] text-[11.5px] space-y-1">
                    <strong className="block text-[#9e2d50]">• ข้อควรระวังและการแจ้งเตือนเพิ่มเติม:</strong>
                    {evaluation.globalClinicalAlerts.map((alertText, idx) => (
                      <div key={idx}>- {alertText}</div>
                    ))}
                  </div>
                )}

                {/* Quick Start Protocol */}
                <div className="p-3.5 rounded-xl bg-[#fff7f9] border border-[#f5cbd6] space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[#9e2d50] font-bold text-[13px]">
                    <MaterialIcon name="bolt" className="w-[18px] h-[18px] text-[18px]" />
                    <span>แนวทาง Quick Start ({evaluation.pregnancyStatus.summaryTitle}):</span>
                  </div>
                  <p className="text-[11.5px] text-[#564145] leading-relaxed">
                    {evaluation.pregnancyStatus.summaryDetail}
                  </p>
                </div>

                {/* Mobile Medical Record Card */}
                <div className="rounded-xl border border-[#dcbfc4] p-3.5 bg-white space-y-3 text-[12px] print-container">
                  <div className="flex justify-between items-center pb-2 border-b border-[#f0dce2]">
                    <strong className="text-[13px] text-[#28161c]">แบบบันทึกการส่งมอบบริการ</strong>
                    <span className="text-[10px] text-[#897175]">สปสช.-รพ.สต.-FP01</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[#564145]">
                    <div>
                      อายุ:{' '}
                      <strong className="text-[#28161c] block" id="rec-age">
                        {age} ปี
                      </strong>
                    </div>
                    <div>
                      ความดัน:{' '}
                      <strong className="text-[#28161c] block" id="rec-bp">
                        {sbp}/{dbp} mmHg
                      </strong>
                    </div>
                    <div>
                      BMI:{' '}
                      <strong className="text-[#28161c] block">
                        {bmi.toFixed(1)} kg/m² ({bmiSubText})
                      </strong>
                    </div>
                    <div>
                      หลังคลอด:{' '}
                      <strong className="text-[#28161c] block">
                        {state.redFlagPostpartum
                          ? THAI_ENUM_LABELS.postpartumPeriod[state.postpartumPeriod]
                          : 'ปกติ'}
                      </strong>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#F2F8F5] border border-[#cbe5d7] space-y-2">
                    <strong className="text-[#16563C] text-[12.5px] block">
                      วิธีที่ผู้รับบริการตัดสินใจเลือก (คลิกสลับเพื่อดูคำแนะนำ):
                    </strong>
                    <div className="space-y-1.5">
                      {(
                        [
                          {
                            id: 'IMPLANT' as const,
                            label: 'ยาฝังคุมกำเนิด (Implant 3 ปี) - แนะนำ LARC',
                          },
                          { id: 'COC' as const, label: 'ยาเม็ดฮอร์โมนรวม (COC)' },
                          { id: 'POP' as const, label: 'ยาคุมฮอร์โมนเดี่ยว (POP)' },
                          { id: 'DMPA' as const, label: 'ยาฉีดคุมกำเนิด (DMPA)' },
                          { id: 'CU_IUD' as const, label: 'ห่วงอนามัยทองแดง (Cu-IUD)' },
                        ]
                      ).map((opt) => {
                        const cat = evaluation.methods[opt.id].finalCategory;
                        const st = getCategoryStyle(cat);
                        return (
                          <label
                            key={opt.id}
                            className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white border border-[#cbe5d7] cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <input
                                checked={state.selectedMethod === opt.id}
                                className="accent-[#9e2d50]"
                                name="final-method"
                                onChange={() => updateState('selectedMethod', opt.id)}
                                type="radio"
                              />
                              <span
                                className={
                                  state.selectedMethod === opt.id
                                    ? 'font-bold text-[#16563C] text-[12px]'
                                    : 'text-[12px] text-[#28161c]'
                                }
                              >
                                {opt.label}
                              </span>
                            </div>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${st.pillClass}`}
                            >
                              Cat {cat}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 no-print">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="h-10 px-3 rounded-xl bg-[#9e2d50] text-white font-bold text-[12px] flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <MaterialIcon name="print" className="w-[18px] h-[18px] text-[16px]" />
                      <span>พิมพ์ใบสรุป/ส่งตัว</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleMockSaveHis}
                      className="h-10 px-3 rounded-xl bg-[#fff0f3] text-[#9e2d50] border border-[#ffbdca] font-bold text-[12px] flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <MaterialIcon name="save" className="w-[18px] h-[18px] text-[16px]" />
                      <span>บันทึกลงระบบ HIS</span>
                    </button>
                  </div>

                  {hisSavedPayload && (
                    <div className="p-2.5 rounded-lg bg-[#E7F3ED] border border-[#cbe5d7] text-[#16563C] text-[11px] no-print">
                      บันทึกข้อมูลส่งออกระบบ HIS (JHCIS / HOSxP) เรียบร้อยแล้ว
                    </div>
                  )}

                  <div className="pt-2 text-right">
                    <span className="block text-[11px] text-[#564145]">
                      ผู้ให้คำปรึกษา: พว. ชนิดา สุขสมบัติ
                    </span>
                    <span className="text-[10px] text-[#897175]">พยาบาลวิชาชีพชำนาญการ</span>
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>

        {/* Mobile Medical Footer */}
        <footer className="w-full text-center py-3 text-[11px] text-[#765660] space-y-1 no-print">
          <div>สำนักอนามัยการเจริญพันธุ์ กรมอนามัย กระทรวงสาธารณสุข</div>
          <div className="text-[10px] text-[#897175]">
            สมุดบันทึกสุขภาพแม่และเด็ก (สมุดสีชมพู) • WHO MEC 6th Ed.
          </div>
        </footer>
      </div>

      {/* Mobile Ergonomic Sticky Bottom Bar (Thumb Zone) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#f0dce2] px-3.5 py-2.5 shadow-lg no-print">
        <div className="max-w-md mx-auto flex items-center gap-2">
          <button
            className="h-12 w-12 rounded-xl border border-[#e5ccd3] bg-white text-[#564145] hover:bg-[#fff0f3] flex items-center justify-center shrink-0 active:scale-95 transition-all cursor-pointer"
            id="btn-prev"
            onClick={handlePrevStep}
            style={{ display: currentStep === 1 ? 'none' : 'flex' }}
            title="ย้อนกลับ"
            type="button"
          >
            <MaterialIcon name="arrow_back" className="w-[18px] h-[18px] text-[20px]" />
          </button>
          <button
            className="flex-1 h-12 px-4 rounded-xl bg-[#9e2d50] hover:bg-[#852442] active:scale-[0.98] text-white font-bold text-[13.5px] flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
            id="btn-next"
            onClick={handleNextStep}
            type="button"
          >
            <span className="truncate" id="btn-next-text">
              {STEP_TITLES[currentStep] || 'ถัดไป'}
            </span>
            <MaterialIcon name="arrow_forward" className="w-[18px] h-[18px] text-[18px] shrink-0" />
          </button>
        </div>
      </div>

      {/* Back-up Protection Popup (When UPT = Negative and no unprotected sex in 5 days) */}
      {showBackupPopup && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 backdrop-blur-xs no-print">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl flex flex-col gap-3.5 border border-[#f0dce2]">
            <div className="flex items-center gap-2 pb-2 border-b border-[#f3d2da]">
              <MaterialIcon name="verified_user" className="w-[18px] h-[18px] text-[#9e2d50] text-[20px]" />
              <h3 className="text-[15px] font-bold text-[#28161c]">
                คำแนะนำการใช้วิธีสำรอง (Back-up Protection)
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-[#FCF7F0] border border-[#f5e3cd] text-[#7D490D] text-[12px] space-y-1.5">
              <p>
                ให้ใช้วิธีงดมีเพศสัมพันธ์หรือใช้ถุงยางอนามัยควบคู่ไปด้วยอย่างน้อย 7 วันแรก หลังเริ่มคุมกำเนิด
              </p>
              <p>
                และนัดผู้รับบริการ 4 (2–4) สัปดาห์เพื่อตรวจ Urine Pregnancy Test (UPT) ซ้ำอีกครั้งเพื่อยืนยันการไม่ตั้งครรภ์อย่างแน่นอน
              </p>
            </div>
            <button
              className="w-full h-11 rounded-xl bg-[#9e2d50] text-white font-bold text-[13px] active:scale-95 transition-all cursor-pointer"
              onClick={() => {
                setShowBackupPopup(false);
                goToStep(3);
              }}
              type="button"
            >
              รับทราบและดำเนินการต่อ
            </button>
          </div>
        </div>
      )}

      {/* WHO MEC Legend Modal (Mobile Friendly) */}
      {showStandardRef && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 backdrop-blur-xs transition-opacity no-print"
          id="mec-modal"
        >
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl flex flex-col gap-3.5 max-h-[85vh] overflow-y-auto border border-[#f0dce2]">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#f3d2da]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#9e2d50] text-white flex items-center justify-center font-bold text-[14px]">
                  <MaterialIcon name="menu_book" className="w-[18px] h-[18px] text-[16px]" />
                </div>
                <h3 className="text-[15px] font-bold text-[#28161c]">เกณฑ์ WHO MEC 6th Edition</h3>
              </div>
              <button
                className="w-8 h-8 rounded-lg hover:bg-[#fff0f3] flex items-center justify-center text-[#564145] cursor-pointer"
                onClick={() => setShowStandardRef(false)}
                type="button"
              >
                <MaterialIcon name="close" className="w-[18px] h-[18px] text-[20px]" />
              </button>
            </div>
            <div className="flex flex-col gap-2.5 text-[12px]">
              <div className="p-3 rounded-xl bg-[#fff7f9] border border-[#f5cbd6] text-[#28161c] space-y-1">
                <strong className="block font-bold text-[#9e2d50]">
                  1. ใช้มาตรฐานอ้างอิง: WHO Medical Eligibility Criteria (MEC) (6th ed.)
                </strong>
                <span>
                  แกนหลักของระบบใช้เกณฑ์ WHO MEC for Contraceptive Use ซึ่งจัดกลุ่มความปลอดภัยไว้ 4 ระดับ:
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#F2F8F5] border border-[#d6ebdF] text-[#16563C]">
                <strong className="block font-bold">
                  Category 1: ใช้ได้ไม่มีข้อห้าม (Use method in any circumstances)
                </strong>
                <span>Green Light (Cat 1–2): เจ้าหน้าที่จ่ายยา/ให้บริการที่ รพ.สต. ได้เลยทันที</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F1F7F9] border border-[#d3e5eb] text-[#1A505D]">
                <strong className="block font-bold">
                  Category 2: ข้อดีมากกว่าความเสี่ยง ใช้ได้แต่ควรติดตามผล (Generally use)
                </strong>
                <span>Green Light (Cat 1–2): ให้บริการที่ รพ.สต. ได้เลย พร้อมให้คำแนะนำเพิ่มเติม</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FCF7F0] border border-[#f5e3cd] text-[#7D490D]">
                <strong className="block font-bold">
                  Category 3: ความเสี่ยงมากกว่าข้อดี ไม่แนะนำ เว้นแต่ไม่มีทางเลือกอื่นและแพทย์ประเมินแล้ว (Theoretical or proven risks usually outweigh advantages)
                </strong>
                <span>Yellow Alert (Cat 3): ส่งต่อปรึกษาแพทย์ Telemedicine / ทบทวนพิเศษก่อนให้บริการ</span>
              </div>
              <div className="p-3 rounded-xl bg-[#FDF3F3] border border-[#fbd4d4] text-[#8F1D1D]">
                <strong className="block font-bold">
                  Category 4: ห้ามใช้เด็ดขาด เป็นอันตรายต่อชีวิต/สุขภาพ (Unacceptable health risk)
                </strong>
                <span>Red Stop (Cat 4): ห้ามให้บริการวิธีนี้เด็ดขาด ระบบจะกรองออกทันที / ส่งต่อ รพ.ชุมชน</span>
              </div>
              <div className="p-3 rounded-xl bg-[#fffcfc] border border-[#f0dce2] text-[#28161c] space-y-1">
                <strong className="block font-bold text-[#9e2d50]">คำนิยามวิธีการคุมกำเนิด:</strong>
                <div>• <strong>COC/CHC:</strong> ยาเม็ดคุมกำเนิดชนิดรวม (Combined Oral Contraceptives)</div>
                <div>• <strong>DMPA:</strong> ยาฉีดคุมกำเนิดชนิดฮอร์โมนเดี่ยว (Depot Medroxyprogesterone Acetate)</div>
                <div>• <strong>Implant:</strong> ยาฝังคุมกำเนิด (Progestin-only Implant - Etonogestrel / Levonorgestrel)</div>
                <div>• <strong>POP:</strong> ยาเม็ดคุมกำเนิดชนิดฮอร์โมนเดี่ยว (Progestin-Only Pill)</div>
                <div>• <strong>Cu-IUD / LNG-IUD:</strong> ห่วงอนามัยชนิดห่วงทองแดง / ห่วงอนามัยเคลือบฮอร์โมน</div>
              </div>
            </div>
            <button
              className="w-full h-11 mt-1 rounded-xl bg-[#9e2d50] text-white font-bold text-[13px] active:scale-95 transition-all cursor-pointer"
              onClick={() => setShowStandardRef(false)}
              type="button"
            >
              เข้าใจแล้ว
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
