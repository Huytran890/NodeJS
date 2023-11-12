import { ReactNode } from 'react';

export const mergeClassName = (val1: string, val2?: string) => {
  return val1 + ' ' + (val2 || '');
};

export interface CustomComponentPros {
  label?: string;
  children?: ReactNode;
  className?: string;
  handle?: () => void;
}
