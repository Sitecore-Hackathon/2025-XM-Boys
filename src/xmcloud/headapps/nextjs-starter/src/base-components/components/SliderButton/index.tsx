'use client';

import { useSwiper } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';

import PrevArrowIcon from '../../assets/icons/back-arrow.svg?react';
import NextArrowIcon from '../../assets/icons/next-arrow.svg?react';

import styles from './SliderButton.module.scss';

type SliderButtonProps = {
  isDisabled: boolean;
  handleClick: (swiper: SwiperType) => void;
  label: string;
  type: 'prev' | 'next';
  theme?: 'Light' | 'Dark';
};

export default function SliderButton({
  isDisabled,
  handleClick,
  label,
  type,
  theme,
}: SliderButtonProps) {
  const swiper = useSwiper();

  return (
    <button
      className={styles['slider-button']}
      onClick={() => handleClick(swiper)}
      disabled={isDisabled}
    >
      <span className="sr-only">{label}</span>
      {type === 'prev' && (
        <PrevArrowIcon
          className={`${styles['slider-button__prev-icon']} ${
            theme === 'Dark' && styles['slider-button__prev-icon--dark']
          } ${isDisabled && styles['slider-button__icon--disabled']}`}
        />
      )}
      {type === 'next' && (
        <NextArrowIcon
          className={`${styles['slider-button__next-icon']} ${
            theme === 'Dark' && styles['slider-button__next-icon--dark']
          } ${isDisabled && styles['slider-button__icon--disabled']}`}
        />
      )}
    </button>
  );
}
