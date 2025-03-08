'use client';

import { ReactNode } from 'react';

import Heading from '../../common/MarkUp/Heading';

import RTF from '../../components/RTF';
import { isReactNode } from '../../helpers/utils';
import { ImageProps } from '../../types';

import styles from './ExternalLinkCard.module.scss';

export type ExternalLinkCardProps = {
  image: ImageProps | ReactNode;
  subTitle: string | ReactNode;
  title: string | ReactNode;
  description: string | ReactNode;
  url: string;
  target: string | undefined;
  styleClasses?: string;
};

const ExternalLinkCard = ({
  image,
  subTitle,
  title,
  description,
  url,
  target,
  styleClasses = '',
}: ExternalLinkCardProps) => {
  let srcPrimaryImage = '';
  if (!isReactNode(image) && image?.src)
    srcPrimaryImage = image.src.replace('cm', 'xmcloudcm.localhost'); // CHANGE THIS TO YOUR CM_HOST URL

  const imageValidation = (): boolean => {
    if (!image) {
      return true;
    }
    return false;
  };

  return (
    <a
      className={`${styles['external-link-card__container']} ${styleClasses}`}
      href={url}
      target={target ?? ''}
    >
      {image && (
        <>
          {isReactNode(image)
            ? image && (
                <picture className={styles['external-link-card__primary-image-wrapper']}>
                  {image}
                </picture>
              )
            : image?.src !== '' && (
                <picture className={styles['external-link-card__primary-image-wrapper']}>
                  <img src={srcPrimaryImage} alt={image?.alt ?? ''} loading="lazy" />
                </picture>
              )}
        </>
      )}
      <div
        className={`${styles['external-link-card__content-container']} ${imageValidation() ? styles['external-link-card__content-container--top-border'] : ''}`}
      >
        {subTitle && <div className={styles['external-link-card__category']}>{subTitle}</div>}
        {title && <Heading className={styles['external-link-card__heading']}>{title}</Heading>}
        {description && (
          <div className={styles['external-link-card__description']}>
            <RTF content={description} />
          </div>
        )}
      </div>
    </a>
  );
};

export default ExternalLinkCard;
