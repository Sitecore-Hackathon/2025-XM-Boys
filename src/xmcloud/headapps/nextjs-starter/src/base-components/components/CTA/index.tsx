'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';

import { isReactNode } from '../../helpers/utils';
import { LinkProps } from '../../types';

import styles from './CTA.module.scss';

type CTAProps = {
  link: LinkProps | ReactNode;
  $primary?: boolean;
  theme?: 'Light' | 'Dark';
};

const CTA = ({ link, $primary, theme }: CTAProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [ctaTheme, setCtaTheme] = useState<'Light' | 'Dark'>(theme || 'Light');

  const getDistanceToRoot = (element: HTMLElement | null) => {
    let distance = 0;
    while (element) {
      distance++;
      element = element.parentElement;
    }
    return distance;
  };

  useEffect(() => {
    if (ref.current) {
      const closestDarkTheme = ref.current.closest('.dark-theme');
      const closestLightTheme = ref.current.closest('.light-theme');

      const darkThemeDistance = getDistanceToRoot(closestDarkTheme as HTMLElement);
      const lightThemeDistance = getDistanceToRoot(closestLightTheme as HTMLElement);

      if (darkThemeDistance < lightThemeDistance) {
        setCtaTheme('Light');
      } else if (lightThemeDistance < darkThemeDistance) {
        setCtaTheme('Dark');
      }
    }
  }, [theme]);

  return (
    <span
      className={`${styles['cta-anchor__container']} ${$primary ? styles['cta-anchor__container--primary'] : styles['cta-anchor__container--secondary']} ${ctaTheme === 'Dark' ? styles['cta-anchor__container--dark-theme'] : ''}`}
      ref={ref}
    >
      {isReactNode(link) ? (
        link
      ) : (
        <a href={link.href} target={link.target}>
          {link.label}
        </a>
      )}
    </span>
  );
};

export default CTA;
