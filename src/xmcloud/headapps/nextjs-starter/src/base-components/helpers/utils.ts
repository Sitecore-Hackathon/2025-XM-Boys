import { ReactNode, isValidElement, LazyExoticComponent } from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any */
const isLazyComponent = (value: unknown): value is LazyExoticComponent<any> => {
  return (
    typeof value === 'object' &&
    value !== null &&
    /* eslint-disable @typescript-eslint/no-explicit-any */
    (value as any).$$typeof === Symbol.for('react.lazy')
  );
};

// Improved isReactNode function
export const isReactNode = (value: unknown): value is ReactNode => {
  // Check if it's a valid React element
  if (isValidElement(value)) {
    return true;
  }

  // Check if it's a React.lazy component
  if (isLazyComponent(value)) {
    return true;
  }

  // Handle primitives that are valid React nodes
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return false;
  }

  // Handle null or undefined, which are valid React nodes
  if (value === null || value === undefined) {
    return true;
  }

  // Check if it's an array, and validate each element as a React node
  if (Array.isArray(value)) {
    return value.every(isReactNode);
  }

  return false;
};

export const pxToRem = (px: number) => `${px / 16}rem`;

export const convertDate = (date: string) => {
  const originalDate: Date = new Date(date);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZone: 'UTC',
  };

  return new Intl.DateTimeFormat('en-US', options).format(originalDate);
};
