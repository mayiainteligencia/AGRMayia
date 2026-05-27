import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CHART_COLORS = {
  primary:    '#2D6A4F',
  secondary:  '#52B788',
  tertiary:   '#40916C',
  berry:      '#5C3D8F',
  warning:    '#D97706',
  danger:     '#DC2626',
  info:       '#0284C7',
  muted:      '#9CA3AF',
  lightGreen: '#B7E4C7',
};
