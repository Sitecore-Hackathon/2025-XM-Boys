'use client';

import { createContext, ReactNode } from 'react';

export const HeadingLevelContext = createContext(1);

type HeadingLevelProviderProps = {
  level?: number;
  children: ReactNode;
};

export const HeadingLevelProvider = ({ level = 1, children }: HeadingLevelProviderProps) => (
  <HeadingLevelContext.Provider value={level}>{children}</HeadingLevelContext.Provider>
);
