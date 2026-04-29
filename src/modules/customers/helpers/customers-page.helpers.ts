import {colors} from '@/modules/styles';

export function getCustomerRowBackgroundColor(index: number): string {
  return index % 2 === 0 ? colors.grayList : colors.white;
}

export function getCustomerRowBackgroundStyle(index: number) {
  return {
    backgroundColor: getCustomerRowBackgroundColor(index),
  };
}

export function isCompanyDocument(document?: string): boolean {
  if (!document) {
    return false;
  }

  return document.length > 11;
}
