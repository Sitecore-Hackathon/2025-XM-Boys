import { withDatasourceRendering } from '@constellation4sitecore/enhancers';
import { Field, ImageField, LinkField } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';
import { Text, Link, useSitecoreContext, Image } from '@sitecore-jss/sitecore-jss-nextjs';
import ForgeExternalLinkCard from 'base-components/modules/ExternalLinkCard';
import { ImageProps } from 'base-components/types';
import { getRelativeUrl } from 'helpers/foundation/pages/get-relative-url';

type ExternalLinkCardFields = {
  image: ImageField;
  title: Field<string>;
  subTitle: Field<string>;
  description: Field<string>;
  link: LinkField;
};

type ExternalLinkCardProps = ComponentProps & {
  url: string;
  id: string;
  fields: ExternalLinkCardFields;
};

const ArticleCard = ({ fields, params }: ExternalLinkCardProps) => {
  const { title, subTitle, description, image, link } = fields;
  const blockWidth = params.blockWidth ? `width-${params.blockWidth}` : 'width-1-2';

  const context = useSitecoreContext();
  const isPageEditing = context?.sitecoreContext?.pageEditing ?? false;

  const url = link?.value?.href ?? '#';
  const target = link?.value?.target ?? '_self';
  const isExternal = link?.value?.linktype === 'external';

  const imageProps: ImageProps | null = image?.value?.src
    ? {
        alt: (image?.value?.alt as string) ?? '',
        src: (image?.value?.src as string) ?? '',
      }
    : null;

  const isPreview = context.sitecoreContext.pageState === 'preview';

  return (
    <ForgeExternalLinkCard
      title={<Text field={title} />}
      subTitle={<Text field={subTitle} />}
      description={
        !isPageEditing ? (
          <Text field={description} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Text field={description} />
            <Link field={link} />
          </div>
        )
      }
      image={!isPageEditing ? imageProps : <Image field={image} />}
      url={
        isPageEditing
          ? '#'
          : isExternal
            ? url
            : getRelativeUrl(url, context.sitecoreContext.site?.name, isPreview)
      }
      target={target}
      styleClasses={`${params.styles} ${blockWidth}`}
    />
  );
};

export default withDatasourceRendering()<ExternalLinkCardProps>(ArticleCard);
