'use client';

import { ReactNode, useState } from 'react';

import { Pagination } from 'swiper/modules';
import { Swiper, SwiperClass } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';

import SliderButton from '../../components/SliderButton';
import SliderPagination from '../../components/SliderPagination';

import 'swiper/css';
import styles from './GenericSlider.module.scss';

export type GenericSlider = {
  children: ReactNode;
  theme?: 'Light' | 'Dark';
};

const GenericSlider = ({ children, theme }: GenericSlider) => {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [displayNavigation, setDisplayNavigation] = useState(false);
  const [activeDot, setActiveDot] = useState(0);

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveDot(
      swiper.pagination.bullets.findIndex((bullet: HTMLSpanElement) =>
        bullet.classList.contains('swiper-pagination-bullet-active')
      )
    );
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const handlePrevButtonClick = (swiper: SwiperType) => {
    swiper.slidePrev();
  };

  const handleNextButtonClick = (swiper: SwiperType) => {
    swiper.slideNext();
  };

  return (
    <div className={`generic-slider`}>
      <Swiper
        spaceBetween={24}
        slidesPerView={1.2}
        breakpoints={{
          768: {
            spaceBetween: 24,
            slidesPerView: 'auto',
          },
        }}
        onSlideChange={handleSlideChange}
        onPaginationUpdate={handleSlideChange}
        onInit={(swiper: SwiperClass) => {
          setDisplayNavigation(!swiper.isBeginning || !swiper.isEnd);
        }}
        modules={[Pagination]}
        pagination={true}
        observer={true}
        observeParents={true}
      >
        {children}
        {displayNavigation && (
          <div className={styles['generic-slider__navigation-container']}>
            <SliderPagination activeDot={activeDot} theme={theme} />
            <div className={styles['generic-slider__arrow-container']}>
              <SliderButton
                isDisabled={isBeginning}
                handleClick={handlePrevButtonClick}
                type="prev"
                label="Slide to the prev slide"
                theme={theme}
              />
              <SliderButton
                isDisabled={isEnd}
                handleClick={handleNextButtonClick}
                type="next"
                label="Slide to the next slide"
                theme={theme}
              />
            </div>
          </div>
        )}
      </Swiper>
    </div>
  );
};

export default GenericSlider;
