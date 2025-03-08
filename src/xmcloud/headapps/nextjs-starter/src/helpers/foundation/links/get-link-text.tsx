import { LinkField } from '@sitecore-jss/sitecore-jss-nextjs';

export const getLinkText = (link: LinkField): string => {
  if (link?.value?.text) {
    return link.value.text;
  }

  const href = link?.value?.href ?? '';

  if (!href || !href.includes('/')) {
    return '';
  }

  const toParse = href.split('/').pop() ?? '';

  return toParse ? toParse.replaceAll('-', ' ') : '';
};
