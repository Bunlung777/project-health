'use client';

import React from 'react';
import {
  CONTRACEPTIVE_METHODS,
  ContraceptiveMethodId,
  FullMecEvaluation,
  MEC_CATEGORY_META,
  MecCategory,
  PatientAssessmentState,
  PREGNANCY_CHECKLIST_ITEMS,
  THAI_ENUM_LABELS,
} from '@/domain/mec';
import { SafeHisExportPayload } from '@/lib/security/pii-masking';
import {
  AlertTriangleIcon,
  ArrowRightIcon,
  BanProhibitedIcon,
  BookOpenIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronUpIcon,
  DatabaseSaveIcon,
  InfoCircleIcon,
  MinistryCrestIcon,
  PrinterIcon,
} from '@/components/icons/ClinicalIcons';

export function CategoryStatusIcon({
  category,
  className = 'w-4 h-4 shrink-0',
}: {
  category: MecCategory;
  className?: string;
}) {
  if (category <= 2) {
    return <CheckCircleIcon className={className} />;
  }
  if (category === 3) {
    return <AlertTriangleIcon className={className} />;
  }
  return <BanProhibitedIcon className={className} />;
}

interface StandardReferenceSectionProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function StandardReferenceSection({ isOpen, onToggle }: StandardReferenceSectionProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <section className="gov-sheet overflow-hidden mb-6 no-print">
      <div className="flex items-center justify-between gap-4 px-6 py-4 bg-[var(--gov-primary-subtle)] border-b border-[var(--gov-border)]">
        <div className="flex items-center gap-3">
          <BookOpenIcon className="w-5 h-5 text-[var(--gov-primary)] shrink-0" />
          <h2 className="text-base sm:text-lg font-bold text-[var(--gov-ink)]">
            ตารางมาตรฐานอ้างอิง: WHO Medical Eligibility Criteria (MEC) 6th Edition
          </h2>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--gov-primary)] px-3.5 py-1.5 rounded-lg bg-white border border-[var(--gov-primary-border)] cursor-pointer"
        >
          <span>ปิดตารางอ้างอิง</span>
          <ChevronUpIcon className="w-4 h-4" />
        </button>
      </div>

      <div className="divide-y divide-[var(--gov-border)] text-base bg-white">
        <div className="p-6">
          <h3 className="text-base font-bold text-[var(--gov-ink)] mb-3">
            1. เกณฑ์ความปลอดภัยทางการแพทย์ 4 ระดับ (WHO MEC Categories)
          </h3>
          <div className="overflow-x-auto border border-[var(--gov-border)] rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--gov-surface-muted)] border-b border-[var(--gov-border)] text-[var(--gov-ink)] text-sm">
                  <th className="py-3 px-4 font-bold w-36">ระดับ (Category)</th>
                  <th className="py-3 px-4 font-bold">ความหมายทางคลินิก</th>
                  <th className="py-3 px-4 font-bold">แนวทางปฏิบัติสำหรับ รพ.สต.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--gov-border)] text-[15px]">
                <tr>
                  <td className="py-3 px-4 font-bold text-[var(--mec-safe-ink)]">Category 1</td>
                  <td className="py-3 px-4 text-[var(--gov-ink)] font-medium">
                    ใช้ได้ไม่มีข้อห้าม{' '}
                    <span className="font-normal text-[var(--gov-ink-secondary)]">
                      (ปลอดภัยในทุกสภาวะ)
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm font-bold bg-[var(--mec-safe-bg)] text-[var(--mec-safe-ink)] border border-[var(--mec-safe-border)]">
                      <CheckCircleIcon className="w-4 h-4" />
                      <span>จ่ายยา / ให้บริการได้ทันที</span>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-[var(--mec-follow-ink)]">Category 2</td>
                  <td className="py-3 px-4 text-[var(--gov-ink)] font-medium">
                    ข้อดีมากกว่าความเสี่ยง{' '}
                    <span className="font-normal text-[var(--gov-ink-secondary)]">
                      (ใช้ได้โดยทั่วไป แต่ควรติดตามผล)
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm font-bold bg-[var(--mec-follow-bg)] text-[var(--mec-follow-ink)] border border-[var(--mec-follow-border)]">
                      <CheckCircleIcon className="w-4 h-4" />
                      <span>ให้บริการได้ พร้อมให้คำแนะนำติดตามอาการ</span>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-[var(--mec-caution-ink)]">Category 3</td>
                  <td className="py-3 px-4 text-[var(--gov-ink)] font-medium">
                    ความเสี่ยงมากกว่าข้อดี{' '}
                    <span className="font-normal text-[var(--gov-ink-secondary)]">
                      (ไม่แนะนำให้ใช้ เว้นแต่แพทย์ประเมินแล้ว)
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm font-bold bg-[var(--mec-caution-bg)] text-[var(--mec-caution-ink)] border border-[var(--mec-caution-border)]">
                      <AlertTriangleIcon className="w-4 h-4" />
                      <span>ส่งต่อปรึกษาแพทย์ / Teleconsult</span>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-[var(--mec-danger-ink)]">Category 4</td>
                  <td className="py-3 px-4 text-[var(--gov-ink)] font-medium">
                    ห้ามใช้เด็ดขาด{' '}
                    <span className="font-normal text-[var(--gov-ink-secondary)]">
                      (มีความเสี่ยงอันตรายร้ายแรงต่อสุขภาพ)
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm font-bold bg-[var(--mec-danger-bg)] text-[var(--mec-danger-ink)] border border-[var(--mec-danger-border)]">
                      <BanProhibitedIcon className="w-4 h-4" />
                      <span>ห้ามให้บริการเด็ดขาด / ส่งต่อ รพ.</span>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-base font-bold text-[var(--gov-ink)] mb-3">
            2. คำนิยามวิธีการคุมกำเนิดทั้ง 5 วิธีในระบบ
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-[var(--gov-border)] border border-[var(--gov-border)] rounded-lg overflow-hidden">
            {Object.values(CONTRACEPTIVE_METHODS).map((m) => (
              <div key={m.id} className="p-4 bg-white">
                <div className="font-bold text-[var(--gov-primary)] text-base">{m.code}</div>
                <div className="font-bold text-[var(--gov-ink)] text-sm mt-1">{m.fullNameTh}</div>
                <div className="text-xs text-[var(--gov-ink-secondary)] mt-1">{m.fullNameEn}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface MecResultsGridProps {
  evaluation: FullMecEvaluation;
  selectedMethod: ContraceptiveMethodId;
  onSelectMethod: (id: ContraceptiveMethodId) => void;
}

export function MecResultsGrid({ evaluation, selectedMethod, onSelectMethod }: MecResultsGridProps) {
  const methodOrder: ContraceptiveMethodId[] = ['COC', 'POP', 'DMPA', 'IMPLANT', 'CU_IUD'];

  if (evaluation.pregnancyStatus.isPregnantStop) {
    return (
      <div className="p-5 rounded-lg bg-[var(--mec-danger-bg)] border border-[var(--mec-danger-border)] text-[var(--mec-danger-ink)] flex items-start gap-3.5">
        <BanProhibitedIcon className="w-6 h-6 shrink-0 mt-0.5" />
        <div>
          <div className="font-bold text-lg">
            ผลตรวจปัสสาวะ (UPT) เป็นบวก (ตั้งครรภ์) — งดให้บริการวิธีคุมกำเนิดทุกชนิด
          </div>
          <p className="text-base mt-1 text-[var(--gov-ink)]">
            แนวทางปฏิบัติ: แนะนำให้คำปรึกษาและส่งต่อผู้รับบริการเข้าคลินิกฝากครรภ์ (ANC) ทันที
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-[var(--gov-border-strong)] rounded-lg overflow-hidden bg-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-[var(--gov-border)]">
        {methodOrder.map((methodId) => {
          const info = CONTRACEPTIVE_METHODS[methodId];
          const res = evaluation.methods[methodId];
          const cat = res.finalCategory;
          const meta = MEC_CATEGORY_META[cat];
          const isSelected = selectedMethod === methodId;

          return (
            <button
              key={methodId}
              type="button"
              onClick={() => onSelectMethod(methodId)}
              className={`text-left p-5 transition-colors flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-[var(--gov-primary-subtle)] shadow-[inset_0_4px_0_0_var(--gov-primary)]'
                  : 'bg-white hover:bg-[var(--gov-surface-muted)]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-lg font-bold text-[var(--gov-ink)]">{info.code}</span>
                  {isSelected && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-[var(--gov-theme-pink)] text-[var(--gov-ink)] border border-[var(--gov-theme-pink-border)] no-print">
                      กำลังดูข้อมูล
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-[var(--gov-ink-secondary)] mt-1">
                  {info.fullNameTh}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-[var(--gov-border)]">
                <div>
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold ${meta.badgeColor}`}
                  >
                    <CategoryStatusIcon category={cat} className="w-4 h-4" />
                    <span>Category {cat}</span>
                  </span>
                </div>

                <div className="text-[15px] font-bold mt-2.5 text-[var(--gov-ink)]">
                  {cat === 1 && 'จ่ายยา / ให้บริการได้ทันที'}
                  {cat === 2 && 'ใช้ได้ (ควรติดตามผล)'}
                  {cat === 3 && 'ส่งต่อปรึกษาแพทย์'}
                  {cat === 4 && 'ห้ามใช้วิธีนี้เด็ดขาด'}
                </div>

                <div className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--gov-primary)] no-print">
                  <span>{isSelected ? 'แสดงคำแนะนำด้านล่าง' : 'กดดูเหตุผลทางคลินิก'}</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface ClinicalGuidancePanelProps {
  evaluation: FullMecEvaluation;
  selectedMethod: ContraceptiveMethodId;
  onSelectMethod: (id: ContraceptiveMethodId) => void;
}

export function ClinicalGuidancePanel({
  evaluation,
  selectedMethod,
  onSelectMethod,
}: ClinicalGuidancePanelProps) {
  if (evaluation.pregnancyStatus.isPregnantStop) {
    return (
      <div className="border border-[var(--mec-danger-border)] bg-[var(--mec-danger-bg)] rounded-lg p-6 text-[var(--mec-danger-ink)] flex items-start gap-3.5">
        <BanProhibitedIcon className="w-6 h-6 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-lg font-bold">
            ยุติการคัดกรองวิธีคุมกำเนิดเนื่องจากตรวจพบการตั้งครรภ์ (UPT Positive)
          </h3>
          <p className="text-base mt-1 text-[var(--gov-ink)]">
            แนวทางปฏิบัติ: ให้คำปรึกษาและส่งต่อผู้รับบริการเข้าคลินิกฝากครรภ์ (ANC) ตามมาตรฐานหน่วยบริการปฐมภูมิ
          </p>
        </div>
      </div>
    );
  }

  const methodInfo = CONTRACEPTIVE_METHODS[selectedMethod];
  const methodEval = evaluation.methods[selectedMethod];
  const cat = methodEval.finalCategory;
  const meta = MEC_CATEGORY_META[cat];

  return (
    <div className="border border-[var(--gov-border-strong)] rounded-lg bg-white divide-y divide-[var(--gov-border)] print-avoid-break">
      {/* Header Row */}
      <div className="p-6 flex flex-wrap items-center justify-between gap-4 bg-[var(--gov-surface-muted)]">
        <div>
          <h3 className="text-xl font-bold text-[var(--gov-ink)]">
            {methodInfo.shortName} — {methodInfo.fullNameTh}
          </h3>
          <p className="text-[15px] text-[var(--gov-ink-secondary)] mt-1">{methodInfo.description}</p>
        </div>
        <span
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-base font-bold ${meta.badgeColor}`}
        >
          <CategoryStatusIcon category={cat} className="w-5 h-5" />
          <span>WHO MEC Category {cat}</span>
        </span>
      </div>

      {/* Clinical Verdict Banner */}
      <div className={`px-6 py-4 flex items-start gap-3.5 ${meta.cardBg} ${meta.textColor}`}>
        <CategoryStatusIcon category={cat} className="w-6 h-6 shrink-0 mt-0.5" />
        <div>
          <div className="text-lg font-bold">{meta.titleTh}</div>
          <div className="text-base font-semibold mt-1 text-[var(--gov-ink)]">
            การดำเนินการของเจ้าหน้าที่ รพ.สต.: {meta.systemAction}
          </div>
        </div>
      </div>

      {/* Category 4 or 3 Contraindication / Risk Reasons */}
      {cat >= 3 && (
        <div className="p-6 space-y-4">
          <h4 className="font-bold text-[var(--gov-ink)] text-lg">
            {cat === 4
              ? 'เหตุผลทางการแพทย์ที่ห้ามใช้วิธีนี้ (Absolute Contraindications):'
              : 'สาเหตุความเสี่ยงที่ต้องส่งต่อปรึกษาแพทย์ (Clinical Risk Factors):'}
          </h4>
          <ul className="space-y-4 text-base text-[var(--gov-ink)]">
            {methodEval.reasons
              .filter((r) => r.category >= 3)
              .map((r, idx) => (
                <li
                  key={idx}
                  className="p-4 rounded-lg bg-[var(--gov-surface-muted)] border border-[var(--gov-border)] space-y-1.5"
                >
                  <div className="font-bold text-[var(--mec-danger-ink)] text-base">
                    {idx + 1}. {r.conditionTitle} (Category {r.category})
                  </div>
                  <p className="text-[15px] text-[var(--gov-ink)] leading-relaxed">
                    {r.reasonText}
                  </p>
                  {r.actionNotice && (
                    <div className="pt-1 text-sm font-bold text-[var(--mec-caution-ink)] flex items-center gap-2">
                      <InfoCircleIcon className="w-4 h-4 shrink-0" />
                      <span>คำแนะนำการจัดการ: {r.actionNotice}</span>
                    </div>
                  )}
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* Category 1 or 2 Follow-up Reasons & Special Warnings */}
      {cat <= 2 && (
        <div className="p-6 space-y-5">
          {methodEval.reasons.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="font-bold text-[var(--gov-ink)] text-lg">
                ประเด็นทางคลินิกที่ควรติดตามผลเพิ่มเติม (Category 2):
              </h4>
              <ul className="list-disc pl-6 space-y-2 text-base text-[var(--gov-ink)]">
                {methodEval.reasons.map((r, idx) => (
                  <li key={idx}>
                    <strong>{r.conditionTitle}:</strong>{' '}
                    <span className="text-[var(--gov-ink-secondary)]">{r.reasonText}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-2.5">
            <h4 className="font-bold text-[var(--gov-ink)] text-lg">
              คำแนะนำการให้บริการและข้อควรระวังสำหรับผู้รับบริการ ({methodInfo.code}):
            </h4>
            <ul className="list-disc pl-6 space-y-2 text-base text-[var(--gov-ink-secondary)]">
              {methodInfo.specialWarnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
              {evaluation.pregnancyStatus.requiresBackup7Days && (
                <li className="font-bold text-[var(--mec-caution-ink)]">
                  ต้องใช้วิธีสำรอง (งดมีเพศสัมพันธ์หรือใช้ถุงยางอนามัย) ควบคู่ไปด้วยอย่างน้อย 7 วันแรก และนัดตรวจปัสสาวะ (UPT) ซ้ำใน 2–4 สัปดาห์
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Recommended Safe Alternatives (When current method is Category 3 or 4) */}
      {cat >= 3 && (
        <div className="p-6 bg-[var(--mec-safe-bg)] space-y-3">
          <h4 className="font-bold text-[var(--mec-safe-ink)] text-lg flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 shrink-0" />
            <span>วิธีทางเลือกที่ปลอดภัยและให้บริการได้ที่ รพ.สต. (Category 1 และ Category 2):</span>
          </h4>
          {evaluation.recommendedSafeMethods.length > 0 ? (
            <>
              <p className="text-base font-bold text-[var(--gov-ink)]">
                {evaluation.recommendedSafeMethods
                  .map(
                    (id) =>
                      `${CONTRACEPTIVE_METHODS[id].shortName} (Category ${evaluation.methods[id].finalCategory})`
                  )
                  .join(' , ')}
              </p>
              <div className="flex flex-wrap gap-3 pt-1 no-print">
                {evaluation.recommendedSafeMethods.map((altId) => (
                  <button
                    key={altId}
                    type="button"
                    onClick={() => onSelectMethod(altId)}
                    className="gov-btn-secondary"
                  >
                    <CheckCircleIcon className="w-4 h-4 text-[var(--mec-safe-ink)]" />
                    <span>
                      กดดู {CONTRACEPTIVE_METHODS[altId].shortName} (Category{' '}
                      {evaluation.methods[altId].finalCategory})
                    </span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p className="text-base text-[var(--gov-ink)]">
              แนะนำวิธีคุมกำเนิดแบบไม่ใช้ฮอร์โมน เช่น ถุงยางอนามัย หรือส่งต่อปรึกษาแพทย์เฉพาะทาง
            </p>
          )}
        </div>
      )}
    </div>
  );
}

interface WireframeMedicalRecordProps {
  state: PatientAssessmentState;
  evaluation: FullMecEvaluation;
  onSelectMethod: (id: ContraceptiveMethodId) => void;
  onPrint: () => void;
  onMockSaveHis: () => void;
  hisSavedPayload: SafeHisExportPayload | null;
}

export function WireframeMedicalRecord({
  state,
  evaluation,
  onSelectMethod,
  onPrint,
  onMockSaveHis,
  hisSavedPayload,
}: WireframeMedicalRecordProps) {
  const { bmiInfo, pregnancyStatus } = evaluation;
  const enteredCriteria = PREGNANCY_CHECKLIST_ITEMS.filter((item) =>
    state.pregnancyCriteriaSelected.includes(item.id)
  );

  const hasDmComplications =
    state.dmOver20Years ||
    state.dmVascularDisease ||
    state.dmNephropathy ||
    state.dmRetinopathy ||
    state.dmNeuropathy;

  const hasHtnVascular =
    state.htnVascularStrokeTia ||
    state.htnVascularMiIhd ||
    state.htnVascularDvt ||
    state.htnVascularPe;

  const comorbidityLabels: string[] = [];
  if (state.noComorbidities) {
    comorbidityLabels.push('ปฏิเสธโรคประจำตัว');
  } else {
    if (state.hasHypertension) {
      const htnVascText = hasHtnVascular ? ' ร่วมกับโรคหลอดเลือด' : '';
      comorbidityLabels.push(
        `ความดันโลหิตสูง (${
          state.htnLevel === 'gte_160_90' ? '≥ 160/90 mmHg' : '140–159/90–99 mmHg'
        }${htnVascText})`
      );
    }
    if (state.hasDiabetes) {
      comorbidityLabels.push(
        `เบาหวาน (${
          hasDmComplications ? 'มีภาวะแทรกซ้อนทางหลอดเลือด/เป็นนานเกิน 20 ปี' : 'ไม่มีภาวะแทรกซ้อน'
        })`
      );
    }
    if (state.hasDyslipidemia) {
      comorbidityLabels.push(
        `ภาวะไขมันในเลือดสูง (${
          state.dlpNoRiskFactors ? 'ไม่มีปัจจัยเสี่ยงร่วม' : 'มีปัจจัยเสี่ยงร่วม'
        })`
      );
    }
    if (state.hasCkd) comorbidityLabels.push('โรคไตเรื้อรัง (CKD)');
    if (state.hasMigraine) {
      const migLabel =
        state.migraineType === 'with_aura'
          ? 'ชนิดมีออร่า (Aura)'
          : Number(state.age) >= 35
          ? 'ชนิดไม่มีออร่า (อายุ ≥ 35 ปี)'
          : 'ชนิดไม่มีออร่า (อายุ < 35 ปี)';
      comorbidityLabels.push(`ไมเกรน (${migLabel})`);
    }
    if (state.hasSle) comorbidityLabels.push('โรคพุ่มพวง (SLE)');
    if (state.hasDvt) comorbidityLabels.push('ลิ่มเลือดอุดตันในหลอดเลือดดำลึก (DVT)');
    if (state.hasStroke) comorbidityLabels.push('โรคหลอดเลือดสมองตีบ/แตก (Stroke)');
    if (state.hasViralHepatitisCarrier) comorbidityLabels.push('พาหะไวรัสตับอักเสบ/ตับอักเสบเรื้อรัง');
    if (state.hasCirrhosis) {
      comorbidityLabels.push(
        `โรคตับแข็ง (${THAI_ENUM_LABELS.cirrhosisSeverity[state.cirrhosisSeverity]})`
      );
    }
    if (state.hasBreastDisease) {
      comorbidityLabels.push(
        `โรคเต้านม (${THAI_ENUM_LABELS.breastDiseaseType[state.breastDiseaseType]})`
      );
    }
    if (state.hasEpilepsy) {
      comorbidityLabels.push(
        `โรคลมชัก (${THAI_ENUM_LABELS.epilepsyDrugType[state.epilepsyDrugType]})`
      );
    }
    if (state.hasRifampicin) comorbidityLabels.push('รับประทานยารักษาวัณโรค (Rifampicin)');
    if (state.otherDiseases.trim()) comorbidityLabels.push(`อื่นๆ: ${state.otherDiseases}`);
    if (comorbidityLabels.length === 0) comorbidityLabels.push('ไม่ได้ระบุโรคประจำตัว');
  }

  return (
    <div className="gov-sheet overflow-hidden print-container divide-y divide-[var(--gov-border)]">
      {/* Official Document Header (#E8BFCB Department of Health Pink Book Theme) */}
      <div className="px-6 py-5 bg-[var(--gov-theme-pink)] flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-white text-[var(--gov-primary)] border border-[var(--gov-theme-pink-border)] flex items-center justify-center shrink-0 mt-0.5">
            <MinistryCrestIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--gov-ink)]">
              แบบบันทึกการคัดกรองและใบส่งต่อผู้รับบริการวางแผนครอบครัว (รพ.สต.)
            </h2>
            <p className="text-sm text-[var(--gov-ink-secondary)] font-medium mt-0.5">
              ระบบสนับสนุนการตัดสินใจเลือกวิธีคุมกำเนิดสำหรับหน่วยบริการปฐมภูมิ | มาตรฐาน WHO MEC (6th Edition)
            </p>
          </div>
        </div>
        <div className="text-right text-sm text-[var(--gov-ink-secondary)] shrink-0">
          <div className="font-bold text-[var(--gov-ink)]">เอกสารราชการ / เวชระเบียน</div>
          <div>รหัสมาตรฐาน: WHO-MEC-6TH</div>
        </div>
      </div>

      {/* ส่วนที่ 1: ข้อมูลทั่วไปและสัญญาณชีพ */}
      <section className="p-6 print-avoid-break">
        <h3 className="text-base font-bold text-[var(--gov-primary)] pb-2.5 mb-4 border-b border-[var(--gov-border)]">
          ส่วนที่ 1: ข้อมูลทั่วไปและสัญญาณชีพ
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-base">
          <div>
            <div className="text-sm text-[var(--gov-ink-secondary)]">อายุผู้รับบริการ</div>
            <div className="font-bold text-lg text-[var(--gov-ink)] mt-0.5">
              {state.age !== '' ? `${state.age} ปี` : 'ไม่ได้ระบุ'}
            </div>
          </div>
          <div>
            <div className="text-sm text-[var(--gov-ink-secondary)]">ความดันโลหิต (SBP / DBP)</div>
            <div
              className={`font-bold text-lg mt-0.5 ${
                evaluation.bpElevatedWarning ? 'text-[var(--mec-danger-ink)]' : 'text-[var(--gov-ink)]'
              }`}
            >
              {state.sbp !== '' && state.dbp !== ''
                ? `${state.sbp} / ${state.dbp} mmHg`
                : 'ไม่ได้ระบุ'}
            </div>
          </div>
          <div>
            <div className="text-sm text-[var(--gov-ink-secondary)]">น้ำหนัก / ส่วนสูง / ดัชนีมวลกาย</div>
            <div className="font-bold text-base text-[var(--gov-ink)] mt-0.5">
              {state.weightKg || '-'} kg / {state.heightCm || '-'} cm{' '}
              <div className="text-[var(--gov-primary)] text-sm font-bold">
                BMI: {bmiInfo.bmi ?? '-'} kg/m² ({bmiInfo.interpretation})
              </div>
            </div>
          </div>
          <div>
            <div className="text-sm text-[var(--gov-ink-secondary)]">ประจำเดือนล่าสุด (LMP) / สูบบุหรี่</div>
            <div className="font-bold text-base text-[var(--gov-ink)] mt-0.5">
              LMP: {state.lmpDate || '-'}
              <div className="text-sm font-semibold text-[var(--gov-ink-secondary)]">
                {state.smokingStatus === 'smoker'
                  ? `สูบบุหรี่ (${state.cigarettesPerDay || 1} มวน/วัน)`
                  : 'ไม่สูบบุหรี่'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ส่วนที่ 2: เกณฑ์ประเมินการไม่ตั้งครรภ์ */}
      <section className="p-6 print-avoid-break">
        <h3 className="text-base font-bold text-[var(--gov-primary)] pb-2.5 mb-4 border-b border-[var(--gov-border)]">
          ส่วนที่ 2: เกณฑ์ประเมินการไม่ตั้งครรภ์ (Pregnancy Exclusion Checklist)
        </h3>
        <div className="space-y-3 text-base">
          <div className="flex items-start gap-3">
            <span
              className={`inline-flex items-center justify-center w-5 h-5 rounded border mt-1 shrink-0 ${
                !state.pregnancyNoneOfSix && enteredCriteria.length > 0
                  ? 'bg-[var(--gov-primary)] border-[var(--gov-primary)] text-white'
                  : 'border-[var(--gov-border-strong)] bg-white'
              }`}
            >
              {!state.pregnancyNoneOfSix && enteredCriteria.length > 0 && (
                <CheckIcon className="w-3.5 h-3.5" />
              )}
            </span>
            <div>
              <span className="font-bold text-[var(--gov-ink)]">
                เข้าเกณฑ์อย่างน้อย 1 ข้อใน 6 ข้อ (มั่นใจว่าไม่ตั้งครรภ์ — เริ่มคุมกำเนิดได้ทันที)
              </span>
              {!state.pregnancyNoneOfSix && enteredCriteria.length > 0 && (
                <ul className="text-sm text-[var(--gov-ink-secondary)] list-disc pl-5 mt-1 space-y-1">
                  {enteredCriteria.map((c) => (
                    <li key={c.id}>{c.label}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span
              className={`inline-flex items-center justify-center w-5 h-5 rounded border mt-1 shrink-0 ${
                state.pregnancyNoneOfSix || enteredCriteria.length === 0
                  ? 'bg-[var(--gov-primary)] border-[var(--gov-primary)] text-white'
                  : 'border-[var(--gov-border-strong)] bg-white'
              }`}
            >
              {(state.pregnancyNoneOfSix || enteredCriteria.length === 0) && (
                <CheckIcon className="w-3.5 h-3.5" />
              )}
            </span>
            <div>
              <span className="font-bold text-[var(--gov-ink)]">
                ไม่เข้าเกณฑ์ทั้ง 6 ข้อ ({pregnancyStatus.summaryTitle})
              </span>
              <p className="text-sm text-[var(--gov-ink-secondary)] mt-0.5">
                {pregnancyStatus.summaryDetail}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ส่วนที่ 3: แบบคัดกรองภาวะเสี่ยงสูง & โรคร่วม */}
      <section className="p-6 print-avoid-break">
        <h3 className="text-base font-bold text-[var(--gov-primary)] pb-2.5 mb-4 border-b border-[var(--gov-border)]">
          ส่วนที่ 3: ภาวะเสี่ยงสูง (High-Risk Red Flags) และประวัติโรคประจำตัว
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[15px]">
          {[
            {
              checked: !state.redFlagNone && state.redFlagPostpartum,
              label: `1. ภาวะหลังคลอดบุตร / ให้นมบุตร (${
                !state.redFlagNone && state.redFlagPostpartum
                  ? THAI_ENUM_LABELS.postpartumPeriod[state.postpartumPeriod]
                  : 'ไม่มี'
              })`,
            },
            {
              checked:
                (!state.redFlagNone && state.redFlagHeavySmokingOver35) ||
                (state.smokingStatus === 'smoker' &&
                  Number(state.age) >= 35 &&
                  Number(state.cigarettesPerDay) >= 15),
              label: '2. สูบบุหรี่ ≥ 15 มวน/วัน ร่วมกับอายุ ≥ 35 ปี',
            },
            {
              checked:
                (!state.redFlagNone && state.redFlagMigraineAura) ||
                (!state.noComorbidities &&
                  state.hasMigraine &&
                  state.migraineType === 'with_aura'),
              label: '3. ปวดศีรษะไมเกรนชนิดมีออร่า (Migraine with Aura)',
            },
            {
              checked:
                (!state.redFlagNone &&
                  (state.redFlagVteStrokeIhd || state.redFlagBreastCancer)) ||
                (!state.noComorbidities &&
                  (state.hasDvt ||
                    state.hasStroke ||
                    hasHtnVascular ||
                    (state.hasCirrhosis &&
                      state.cirrhosisSeverity === 'severe_decompensated') ||
                    (state.hasBreastDisease && state.breastDiseaseType === 'cancer'))),
              label:
                '4. ลิ่มเลือดอุดตัน (DVT/PE) / โรคหลอดเลือดสมอง / หัวใจขาดเลือด / ตับแข็งรุนแรง / มะเร็งเต้านม',
            },
            {
              checked: !state.redFlagNone && state.redFlagUnexplainedBleedingOrPid,
              label: '5. เลือดออกผิดปกติทางช่องคลอดโดยไม่ทราบสาเหตุ หรือสงสัยติดเชื้อในอุ้งเชิงกราน',
            },
            {
              checked:
                evaluation.bpSevereWarning ||
                (!state.redFlagNone &&
                  (state.redFlagEnzymeInducingDrugs || state.redFlagSevereHypertension)) ||
                (!state.noComorbidities &&
                  (state.hasRifampicin ||
                    (state.hasEpilepsy && state.epilepsyDrugType === 'enzyme_inducer') ||
                    (state.hasHypertension && state.htnLevel === 'gte_160_90'))),
              label:
                '6. รับประทานยากันชักกลุ่มกระตุ้นเอนไซม์ตับ, ยาต้านวัณโรค (Rifampicin) หรือความดันโลหิตสูง ≥ 160/100 mmHg',
            },
          ].map((rf, idx) => (
            <div key={idx} className="flex items-start gap-2.5">
              <span
                className={`inline-flex items-center justify-center w-5 h-5 rounded border mt-0.5 shrink-0 ${
                  rf.checked
                    ? 'bg-[var(--mec-danger-ink)] border-[var(--mec-danger-ink)] text-white'
                    : 'border-[var(--gov-border-strong)] bg-white'
                }`}
              >
                {rf.checked && <CheckIcon className="w-3.5 h-3.5" />}
              </span>
              <span className={rf.checked ? 'font-bold text-[var(--mec-danger-ink)]' : 'text-[var(--gov-ink)]'}>
                {rf.label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-[var(--gov-border)] grid grid-cols-1 md:grid-cols-2 gap-4 text-[15px]">
          <div>
            <span className="font-bold text-[var(--gov-ink)]">โรคประจำตัวและยาที่ใช้ประจำ:</span>{' '}
            <span className="text-[var(--gov-ink-secondary)]">{comorbidityLabels.join(' | ')}</span>
          </div>
          <div>
            <span className="font-bold text-[var(--gov-ink)]">ประวัติการแพ้ยา:</span>{' '}
            <span
              className={
                state.hasDrugAllergy === 'yes'
                  ? 'font-bold text-[var(--mec-danger-ink)]'
                  : 'text-[var(--gov-ink-secondary)]'
              }
            >
              {state.hasDrugAllergy === 'yes'
                ? `มีประวัติแพ้ยา (${state.drugAllergyDetail || 'ไม่ระบุชื่อยา'})`
                : 'ปฏิเสธประวัติแพ้ยา'}
            </span>
          </div>
        </div>
      </section>

      {/* ส่วนที่ 4: ผลการประเมินความปลอดภัยตามเกณฑ์ WHO MEC */}
      <section className="p-6 print-avoid-break">
        <h3 className="text-base font-bold text-[var(--gov-primary)] pb-2.5 mb-4 border-b border-[var(--gov-border)]">
          ส่วนที่ 4: ผลการประเมินความปลอดภัยตามเกณฑ์ WHO MEC (5 วิธี)
        </h3>
        <MecResultsGrid
          evaluation={evaluation}
          selectedMethod={state.selectedMethod}
          onSelectMethod={onSelectMethod}
        />
      </section>

      {/* ส่วนที่ 5: รายละเอียดและคำแนะนำทางการแพทย์ */}
      <section className="p-6 print-avoid-break">
        <h3 className="text-base font-bold text-[var(--gov-primary)] pb-2.5 mb-4 border-b border-[var(--gov-border)]">
          ส่วนที่ 5: รายละเอียดและคำแนะนำทางการแพทย์สำหรับวิธีที่เลือก
        </h3>
        <ClinicalGuidancePanel
          evaluation={evaluation}
          selectedMethod={state.selectedMethod}
          onSelectMethod={onSelectMethod}
        />
      </section>

      {/* Print Signature Block */}
      <section className="hidden print:grid grid-cols-2 gap-8 p-6 text-sm print-avoid-break">
        <div className="space-y-6">
          <div>
            <strong>สรุปวิธีคุมกำเนิดที่พิจารณา:</strong>{' '}
            {CONTRACEPTIVE_METHODS[state.selectedMethod].fullNameTh} (WHO MEC Category{' '}
            {evaluation.methods[state.selectedMethod].finalCategory})
          </div>
          <div>
            วันที่ประเมิน: ........................ / ........................ / ........................
          </div>
        </div>
        <div className="text-center space-y-6">
          <div>
            ลงชื่อ ........................................................................... ผู้คัดกรอง / ผู้ให้บริการ
          </div>
          <div>
            (...........................................................................) ตำแหน่ง พยาบาลเวชปฏิบัติ / เจ้าหน้าที่สาธารณสุข
          </div>
        </div>
      </section>

      {hisSavedPayload && (
        <section className="p-6 bg-[var(--mec-safe-bg)] text-[var(--mec-safe-ink)] space-y-2.5 no-print">
          <div className="font-bold text-base flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 shrink-0" />
            <span>สร้างชุดข้อมูลมาตรฐานพร้อมส่งออกไปยังระบบเวชระเบียน HIS (JHCIS / HOSxP PCU) เรียบร้อยแล้ว</span>
          </div>
          <pre className="text-xs bg-[var(--gov-ink)] text-white p-4 rounded-lg overflow-x-auto font-mono">
            {JSON.stringify(hisSavedPayload, null, 2)}
          </pre>
        </section>
      )}

      {/* Official Document Action Footer */}
      <div className="px-6 py-4 bg-[var(--gov-surface-muted)] flex flex-wrap items-center justify-end gap-3 no-print">
        <button type="button" onClick={onMockSaveHis} className="gov-btn-secondary">
          <DatabaseSaveIcon className="w-4 h-4" />
          <span>สร้างข้อมูลส่งออกระบบ HIS</span>
        </button>
        <button type="button" onClick={onPrint} className="gov-btn-primary">
          <PrinterIcon className="w-4 h-4" />
          <span>พิมพ์ใบสรุปเวชระเบียน / ใบส่งตัว (A4)</span>
        </button>
      </div>
    </div>
  );
}
