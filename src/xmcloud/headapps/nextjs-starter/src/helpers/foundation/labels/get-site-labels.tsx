import { LayoutServiceData } from '@sitecore-jss/sitecore-jss-nextjs';
import { LabelService } from '@constellation4sitecore/labels';
type Obj = {
  [key: string]: unknown;
};

async function getSiteLabels<T extends Obj>(
  layoutData: LayoutServiceData,
  labelTemplateId: string
) {
  const service = new LabelService(layoutData);
  return await service.getLabelsForView<T>(labelTemplateId);
}

export { getSiteLabels };
