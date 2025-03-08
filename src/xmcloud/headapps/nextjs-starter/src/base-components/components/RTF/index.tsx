'use client';

import { ReactNode, useEffect, useRef } from 'react';

import { isReactNode } from '../../helpers/utils';

import styles from './RTF.module.scss';

type RTFProps = {
  content?: string | ReactNode;
};

const RTF = ({ content }: RTFProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const createMarkup = (__html: string) => {
    return { __html };
  };

  useEffect(() => {
    if (containerRef.current) {
      const elementsWithAttribute = containerRef.current.querySelectorAll('[padding-left]');
      Array.from(elementsWithAttribute).forEach((htmlElement) => {
        const paddingLeft = htmlElement.getAttribute('padding-left');
        if (paddingLeft) {
          htmlElement.setAttribute('style', `padding-left: ${paddingLeft}`);
        }
      });
    }
  }, [content]);

  return (
    <div ref={containerRef} className={styles['rtf__container']}>
      {isReactNode(content) ? (
        content
      ) : (
        <div dangerouslySetInnerHTML={createMarkup(content as string)} />
      )}
    </div>
  );
};

export default RTF;
