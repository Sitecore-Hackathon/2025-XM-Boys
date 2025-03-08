import { withDatasourceRendering } from '@constellation4sitecore/enhancers';
import {
  ComponentRendering,
  Field,
  Link,
  LinkField,
  Placeholder,
  RichText,
  Text,
  useSitecoreContext,
} from '@sitecore-jss/sitecore-jss-nextjs';
import ForgeFlexibleContainer from 'base-components/modules/FlexibleContainer';
import { LinkProps } from 'base-components/types';
import { PageEditorMessage } from 'components/sxa/PageEditorMessage';
import { getLinkText } from 'helpers/foundation/links/get-link-text';
import { ComponentProps } from 'lib/component-props';

type FlexibleContainerFields = {
  heading: Field<string>;
  description: Field<string>;
  link: LinkField;
  rendering: ComponentRendering;
};

type FlexibleContainerProps = ComponentProps & {
  fields: FlexibleContainerFields;
};

type FlexibleContainerVariants = {
  variantParams: {
    variant: 'default' | 'withHeading' | 'withHeadingAndButton' | 'withHeadingAndTrailingButton';
  };
};

const BaseFlexibleContainer = ({
  fields,
  params,
  rendering,
  variantParams,
}: FlexibleContainerProps & FlexibleContainerVariants) => {
  const { heading, description, link } = fields;

  const displayRotatingSlider = '1' === params.displayRotatingSlider;

  const theme = params?.colorTheme ? (params.colorTheme as 'Light' | 'Dark') : 'Light';
  const { variant } = variantParams;

  const context = useSitecoreContext();
  const isPageEditing = context.sitecoreContext.pageEditing ?? false;
  const isPreview = context.sitecoreContext.pageState === 'preview';
  const isExternal = link?.value?.linktype === 'external';
  const url = link?.value?.href ?? '';

  const linkProps: LinkProps | null = link?.value?.href
    ? {
        label: link?.value?.text
          ? link.value.text
          : isExternal
          ? link?.value?.href ?? ''
          : getLinkText(link),
        href: isExternal
          ? url
          : isPreview
          ? `${url}?sc_site=${context.sitecoreContext?.site?.name ?? ''}`
          : url,
        target: link.value.target,
      }
    : null;

  const phKey = `flexible-container-items-${params.DynamicPlaceholderId}`;

  return (
    <>
      {isPageEditing && variant === 'default' ? (
        <PageEditorMessage type="info" title="Flexible Container" message="Default Variant" />
      ) : null}
      <ForgeFlexibleContainer
        heading={<Text field={heading} />}
        description={<RichText field={description} />}
        link={isPageEditing ? <Link field={link} /> : linkProps}
        isEditing={isPageEditing}
        variant={variant}
        theme={theme}
        styleClasses={params.styles}
        isSlider={displayRotatingSlider}
      >
        <Placeholder name={phKey} rendering={rendering} />
      </ForgeFlexibleContainer>
    </>
  );
};

const _Default = (props: FlexibleContainerProps & FlexibleContainerVariants) => {
  return <BaseFlexibleContainer {...props} variantParams={{ variant: 'default' }} />;
};

const _FlexibleContainerWithHeading = (
  props: FlexibleContainerProps & FlexibleContainerVariants
) => {
  return <BaseFlexibleContainer {...props} variantParams={{ variant: 'withHeading' }} />;
};

const _FlexibleContainerWithHeadingAndButton = (
  props: FlexibleContainerProps & FlexibleContainerVariants
) => {
  return <BaseFlexibleContainer {...props} variantParams={{ variant: 'withHeadingAndButton' }} />;
};

const _FlexibleContainerWithHeadingAndTrailingButton = (
  props: FlexibleContainerProps & FlexibleContainerVariants
) => {
  return (
    <BaseFlexibleContainer {...props} variantParams={{ variant: 'withHeadingAndTrailingButton' }} />
  );
};

export const WithHeading = withDatasourceRendering()<FlexibleContainerProps>(
  _FlexibleContainerWithHeading
);

export const WithHeadingAndButton = withDatasourceRendering()<FlexibleContainerProps>(
  _FlexibleContainerWithHeadingAndButton
);

export const WithHeadingAndTrailingButton = withDatasourceRendering()<FlexibleContainerProps>(
  _FlexibleContainerWithHeadingAndTrailingButton
);

export const Default = withDatasourceRendering()<FlexibleContainerProps>(_Default);
