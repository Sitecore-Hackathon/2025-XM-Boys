'use client';

import { ReactNode, useContext } from 'react';

import { HeadingLevelContext } from './HeadingLevelProvider';

type SectionProps = {
  children: ReactNode;
};

const Section = ({ children }: SectionProps) => {
  const level = useContext(HeadingLevelContext);
  return <HeadingLevelContext.Provider value={level + 1}>{children}</HeadingLevelContext.Provider>;
};

export default Section;
