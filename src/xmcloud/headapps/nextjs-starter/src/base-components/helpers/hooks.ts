'use client';

import { useEffect, useState, useRef } from 'react';

type UseHeadsObserverProps = {
  selector: string;
};

export const useHeadsObserver = ({ selector }: UseHeadsObserverProps) => {
  const observer = useRef<IntersectionObserver | null>(null);
  const [activeIds, setActiveIds] = useState<{ h2: string | null; h3: string | null }>({
    h2: null,
    h3: null,
  });

  useEffect(() => {
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry?.isIntersecting) {
          if (entry.target.tagName === 'H2') {
            setActiveIds({ h2: entry.target.id, h3: null });
          } else if (entry.target.tagName === 'H3') {
            const elements = document.querySelectorAll(selector);
            const h3Index = Array.from(elements).findIndex((elem) => elem.id === entry.target.id);

            for (let i = h3Index - 1; i >= 0; i--) {
              if (elements[i].tagName === 'H2') {
                setActiveIds({ h2: elements[i].id, h3: entry.target.id });
                break;
              }
            }
          }
        }
      });
    };

    observer.current = new IntersectionObserver(handleObserver, {
      rootMargin: '0% 0% -90% 0px',
    });

    const elements = document.querySelectorAll(selector);
    elements.forEach((elem) => observer.current?.observe(elem));

    return () => observer.current?.disconnect();
  }, [selector]);

  return { activeIds };
};
