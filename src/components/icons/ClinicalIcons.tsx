import React from 'react';

export interface IconProps {
  className?: string;
}

/**
 * Official Public Health Crest / Medical Shield SVG Icon
 * Uniform 1.75px stroke geometry, zero emoji usage.
 */
export function MinistryCrestIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2.5L4.5 5.75V11.5C4.5 16.55 7.7 20.95 12 22.25C16.3 20.95 19.5 16.55 19.5 11.5V5.75L12 2.5Z" />
      <path d="M12 8.25V15.75" />
      <path d="M8.25 12H15.75" />
    </svg>
  );
}

export function BookOpenIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M2 4.5H8.5C10.433 4.5 12 6.067 12 8V19.5C12 18.119 10.881 17 9.5 17H2V4.5Z" />
      <path d="M22 4.5H15.5C13.567 4.5 12 6.067 12 8V19.5C12 18.119 13.119 17 14.5 17H22V4.5Z" />
    </svg>
  );
}

export function RefreshResetIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 12C3 7.03 7.03 3 12 3C15.39 3 18.34 4.87 19.88 7.64" />
      <path d="M20.25 3.75V8H16" />
      <path d="M21 12C21 16.97 16.97 21 12 21C8.61 21 5.66 19.13 4.12 16.36" />
      <path d="M3.75 20.25V16H8" />
    </svg>
  );
}

export function CheckIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 6L9 17L4 12" />
    </svg>
  );
}

export function CheckCircleIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9.25" />
      <path d="M8.5 12.25L10.9 14.65L15.75 9.65" />
    </svg>
  );
}

export function AlertTriangleIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M10.29 3.86L1.82 18A2 2 0 0 0 3.54 21H20.46A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86Z" />
      <path d="M12 9V13.5" />
      <circle cx="12" cy="17" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function BanProhibitedIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9.25" />
      <path d="M5.5 5.5L18.5 18.5" />
    </svg>
  );
}

export function InfoCircleIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9.25" />
      <path d="M12 11.25V16.25" />
      <circle cx="12" cy="8" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function ArrowRightIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 12H19" />
      <path d="M13 6L19 12L13 18" />
    </svg>
  );
}

export function ArrowLeftIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M19 12H5" />
      <path d="M11 6L5 12L11 18" />
    </svg>
  );
}

export function ChevronDownIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 9L12 15L18 9" />
    </svg>
  );
}

export function ChevronUpIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 15L12 9L6 15" />
    </svg>
  );
}

export function PrinterIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 9V3.5H18V9" />
      <path d="M6 18H4.5C3.4 18 2.5 17.1 2.5 16V11C2.5 9.9 3.4 9 4.5 9H19.5C20.6 9 21.5 9.9 21.5 11V16C21.5 17.1 20.6 18 19.5 18H18" />
      <rect x="6" y="14.5" width="12" height="6" />
    </svg>
  );
}

export function DatabaseSaveIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <ellipse cx="12" cy="5.5" rx="8" ry="3" />
      <path d="M4 5.5V12C4 13.66 7.58 15 12 15C16.42 15 20 13.66 20 12V5.5" />
      <path d="M4 12V18.5C4 20.16 7.58 21.5 12 21.5C16.42 21.5 20 20.16 20 18.5V12" />
    </svg>
  );
}

export function HeartPulseIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 12H7.5L10 7.5L13.5 16.5L16 12H21" />
    </svg>
  );
}

export function ShieldCheckIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2.75L4.75 6V11.5C4.75 16.35 7.82 20.6 12 21.85C16.18 20.6 19.25 16.35 19.25 11.5V6L12 2.75Z" />
      <path d="M8.75 12.25L11 14.5L15.5 9.75" />
    </svg>
  );
}

export function FlaskTestIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M9.5 3H14.5" />
      <path d="M10.5 3V8.5L5.2 17.4C4.4 18.7 5.35 20.5 6.9 20.5H17.1C18.65 20.5 19.6 18.7 18.8 17.4L13.5 8.5V3" />
      <path d="M7.5 14.5H16.5" />
    </svg>
  );
}

export function FastForwardIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polygon points="13 19 22 12 13 5 13 19" />
      <polygon points="2 19 11 12 2 5 2 19" />
    </svg>
  );
}

export function DocumentRecordIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M14 2.5H6.5C5.4 2.5 4.5 3.4 4.5 4.5V19.5C4.5 20.6 5.4 21.5 6.5 21.5H17.5C18.6 21.5 19.5 20.6 19.5 19.5V8L14 2.5Z" />
      <path d="M14 2.5V8H19.5" />
      <path d="M8.5 13H15.5" />
      <path d="M8.5 16.5H13.5" />
    </svg>
  );
}
