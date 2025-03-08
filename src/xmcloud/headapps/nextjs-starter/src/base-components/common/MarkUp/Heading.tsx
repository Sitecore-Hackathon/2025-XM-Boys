'use client';

import { useContext } from 'react';

import { HeadingLevelContext } from './HeadingLevelProvider';

const Heading = ({ ...props }) => {
  const level = Math.min(6, useContext(HeadingLevelContext));
  const HeadingElement = `h${level}` as keyof JSX.IntrinsicElements;
  return <HeadingElement {...props} />;
};

export default Heading;
