'use client';

import { createRef, ReactNode, useEffect, useState } from 'react';

import { SwiperSlide } from 'swiper/react';

import Heading from '../../common/MarkUp/Heading';
import { HeadingLevelProvider } from '../../common/MarkUp/HeadingLevelProvider';
import Section from '../../common/MarkUp/Section';
import CTA from '../../components/CTA';
import RTF from '../../components/RTF';
import HTMLElementWrapper from '../../helpers/HTMLElementWrapper';
import { isReactNode } from '../../helpers/utils';
import { LinkProps } from '../../types';
import GenericSlider from '../GenericSlider';
import styles from './FlexibleContainer.module.scss';

export type FlexibleContainerProps = {
  heading: string | ReactNode;
  description?: string | ReactNode;
  link?: LinkProps | ReactNode | null;
  isEditing?: boolean;
  isSlider?: boolean;
  children?: ReactNode;
  variant?: 'default' | 'withHeading' | 'withHeadingAndButton' | 'withHeadingAndTrailingButton';
  theme?: 'Light' | 'Dark';
  styleClasses?: string;
};

const FlexibleContainer = ({
  heading,
  description,
  link,
  isEditing = false,
  children,
  variant,
  theme,
  styleClasses = '',
  isSlider = false,
}: FlexibleContainerProps) => {
  const elementsRef = createRef<HTMLDivElement>();
  const [sliderCards, setSliderCards] = useState<ReactNode[]>([]);
  const [sliderLoaded, setSliderLoaded] = useState(false);

  const getCardRow = (): ReactNode => {
    if (!children) {
      return <></>;
    }

    if (isReactNode(children) && isEditing) {
      return children;
    }

    if (isReactNode(children) && !isEditing) {
      if (sliderLoaded && isSlider) {
        if (sliderCards.length > 0) {
          return <GenericSlider theme={theme}>{sliderCards}</GenericSlider>;
        }

        return <>No Cards</>;
      }

      if (!isSlider) {
        return children;
      }

      return <></>;
    }

    if (!isReactNode(children)) {
      const getArticleCards = (): ReactNode => {
        return children;
      };

      if (isSlider) {
        <GenericSlider theme={theme}>{getArticleCards()}</GenericSlider>;
      }

      return getArticleCards();
    }

    return <></>;
  };

  const descriptionContent = description ? (
    <div className={styles['flexible-container__description']}>
      <RTF content={description} />
    </div>
  ) : null;

  useEffect(() => {
    if (isSlider) {
      const elements = elementsRef.current?.children || [];

      if (elements.length > 0) {
        setSliderCards(
          Array.from(elements).map((element: Element | null, index: number) => {
            if (!element) {
              return;
            }

            const widthClassName = Array.from(element.classList).find((name) =>
              name.includes('width')
            );

            return (
              <SwiperSlide
                key={index}
                className={`${styles[`flexible-container__swiper-slide--${widthClassName}`]} `}
              >
                <HTMLElementWrapper
                  element={element as HTMLElement}
                  className={styles['flexible-container__element']}
                />
              </SwiperSlide>
            );
          })
        );
      }

      setSliderLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSlider]);

  return (
    <HeadingLevelProvider level={variant === 'default' ? 1 : 2}>
      <div
        className={`${styles['flexible-container']} ${styleClasses} ${
          theme === 'Dark' ? `dark-theme ${styles['flexible-container--dark']}` : 'light-theme'
        }
        ${isSlider && !isEditing ? styles['flexible-container--editing-slider'] : ''}
        `}
      >
        {variant === 'withHeading' && (
          <div className={styles['flexible-container__content-container']}>
            <div className={styles['flexible-container__header-container']}>
              <Heading className={styles['flexible-container__heading']}>{heading}</Heading>
              {descriptionContent}
            </div>
          </div>
        )}
        {variant === 'withHeadingAndButton' && (
          <div className={styles['flexible-container__content-container']}>
            <div className={styles['flexible-container__header-container']}>
              <Heading className={styles['flexible-container__heading']}>{heading}</Heading>
              {descriptionContent}
            </div>
            {link && (
              <div className={styles['flexible-container__cta-container']}>
                <CTA link={link} $primary theme={theme} />
              </div>
            )}
          </div>
        )}

        {variant === 'withHeadingAndTrailingButton' && (
          <div className={styles['flexible-container__content-container']}>
            <div className={styles['flexible-container__header-container']}>
              <Heading className={styles['flexible-container__heading']}>{heading}</Heading>
              {descriptionContent}
            </div>
          </div>
        )}

        {children && (
          <section className={`${styles['flexible-container__elements-container']} `}>
            <Section>
              <div className={styles['flexible-container__hidden-elements']} ref={elementsRef}>
                {children}
              </div>
              {getCardRow()}
            </Section>
          </section>
        )}
        {link && variant === 'withHeadingAndTrailingButton' && (
          <div className={styles['flexible-container__cta-container']}>
            <CTA link={link} $primary theme={theme} />
          </div>
        )}
      </div>
    </HeadingLevelProvider>
  );
};

export default FlexibleContainer;
