'use client';

import { useSwiper } from 'swiper/react';

import styles from './SliderPagination.module.scss';

type SliderPaginationProps = {
  activeDot: number;
  theme?: 'Light' | 'Dark';
};

const SliderPagination = ({ activeDot, theme }: SliderPaginationProps) => {
  const swiper = useSwiper();
  const bullets = swiper?.pagination.bullets;

  return (
    <div className={styles['slider-pagination']}>
      {bullets.map((_: HTMLSpanElement, index: number) => (
        <span
          className={`${styles['slider-pagination__dot']} ${
            theme === 'Dark' && styles['slider-pagination__dot--dark']
          } ${index === activeDot ? styles['slider-pagination__dot--active'] : ''}`}
          key={`pagination-${index}`}
        >
          <span className="sr-only">Go to slide {index}</span>
        </span>
      ))}
    </div>
  );
};

export default SliderPagination;
