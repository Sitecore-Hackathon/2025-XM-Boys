import { gql } from 'graphql-request';
import config from 'temp/config';
import { LayoutServiceData } from '@sitecore-jss/sitecore-jss-nextjs';
import { createGraphQLClientFactory } from 'lib/graphql-client-factory/create';

type SiteResults = {
  layout: {
    item: {
      homeItemPath: string;
      contentRoot: {
        id: string;
        path: string;
      };
    };
  };
};

export async function getContentRoot(layoutData: LayoutServiceData) {
  const querySite = gql`
    query LayoutQuery($siteName: String!) {
      layout(site: $siteName, routePath: "/", language: "en") {
        item {
          homeItemPath: path
          contentRoot: parent {
            id
            path
            parent {
              path
            }
          }
        }
      }
    }
  `;

  const siteName = layoutData?.sitecore?.context?.site?.name ?? '';

  const graphQLClient = createGraphQLClientFactory(config)();

  const siteInfo = (await graphQLClient.request(querySite, {
    siteName: siteName,
  })) as SiteResults;

  const rootPath = siteInfo?.layout?.item?.contentRoot?.id ?? '';

  return rootPath;
}
