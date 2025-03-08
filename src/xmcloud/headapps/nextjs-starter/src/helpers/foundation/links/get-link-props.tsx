import { LinkField } from '@sitecore-jss/sitecore-jss-nextjs';
import { LinkProps } from 'src/base-components/types';
const getLinkProps = (linkField: LinkField) => {
  const linkProps: LinkProps | null = linkField?.value?.href
    ? {
        href: linkField?.value?.href ?? '',
        target: linkField?.value?.target,
        label: linkField?.value?.text ?? '',
      }
    : null;
  return linkProps;
};

export { getLinkProps };
