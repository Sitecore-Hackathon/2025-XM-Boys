import { Placeholder } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';
import { withDatasourceRendering } from '@constellation4sitecore/enhancers';

const PageHeaderStructure = ({ rendering, params }: ComponentProps) => {
  const phAlertBannerKey = `page-alert-banner-section-${params.DynamicPlaceholderId}`;
  const phPageHeaderKey = `page-header-section-${params.DynamicPlaceholderId}`;

  return (
    <>
      <Placeholder name={phAlertBannerKey} rendering={rendering} />
      <Placeholder name={phPageHeaderKey} rendering={rendering} />
    </>
  );
};

export default withDatasourceRendering()<ComponentProps>(PageHeaderStructure);
