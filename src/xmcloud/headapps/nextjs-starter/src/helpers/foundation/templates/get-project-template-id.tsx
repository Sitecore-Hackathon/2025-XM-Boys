import { constants, LayoutServiceData } from '@sitecore-jss/sitecore-jss-nextjs';
import { GraphQLRequestClient } from '@sitecore-jss/sitecore-jss-nextjs/graphql';

import { gql } from 'graphql-request';
import { createGraphQLClientFactory } from 'lib/graphql-client-factory/create';
import config from 'temp/config';

type SearchResults = {
  search: {
    results: [
      {
        id: string;
        name: string;
        parent: {
          name: string;
        };
      }
    ];
  };
};

type TemplateSearchResults = {
  search: {
    results: [
      {
        id: string;
        name: string;
        template: {
          name: string;
          id: string;
        };
      }
    ];
  };
};

type SiteResults = {
  layout: {
    item: {
      homeItemPath: string;
      contentRoot: {
        id: string;
        path: string;
        parent: {
          path: string;
        };
      };
    };
  };
};

const getProjectTemplateIdForEdge = async (
  client: GraphQLRequestClient,
  templateName: string
): Promise<string | null> => {
  const projectTemplateFolderId = '{825B30B4-B40B-422E-9920-23A1B6BDA89C}';

  const query = gql`
    query GetProjectTemplates($projectTemplateFolderId: String!) {
      search(where: { name: "_path", value: $projectTemplateFolderId }) {
        results {
          id
          name
          parent {
            name
          }
        }
      }
    }
  `;
  const result = (await client.request(query, {
    templateName: templateName,
    projectTemplateFolderId: projectTemplateFolderId,
  })) as SearchResults;

  const pagesFolder = result.search.results.find((x) => x.name === 'Pages');

  if (!pagesFolder?.id) {
    return null;
  }

  const queryTemplates = gql`
    query GetProjectTemplates($pagesFolderId: String!) {
      search(where: { name: "_path", value: $pagesFolderId }, first: 20) {
        results {
          id
          name
          template {
            name
            id
          }
        }
      }
    }
  `;
  const resultTemplates = (await client.request(queryTemplates, {
    pagesFolderId: pagesFolder.id,
  })) as TemplateSearchResults;

  const tpl = resultTemplates.search.results.find((x) => x.template.name === templateName);

  if (!tpl?.template?.id) {
    return null;
  }

  return tpl.template.id;
};

const getProjectTemplateId = async (
  layoutData: LayoutServiceData,
  templateName: string
): Promise<string | null> => {
  if (process.env.JSS_MODE === constants.JSS_MODE.DISCONNECTED) {
    return null;
  }

  const siteName = layoutData?.sitecore?.context?.site?.name ?? '';
  if (!siteName) {
    return null;
  }

  const graphQLClient = createGraphQLClientFactory(config)();

  //If it is edge
  if (config.graphQLEndpoint.includes('edge.sitecorecloud.io')) {
    return await getProjectTemplateIdForEdge(graphQLClient, templateName);
  }

  const projectTemplateFolderId = '{825B30B4-B40B-422E-9920-23A1B6BDA89C}';

  const query = gql`
    query GetProjectTemplates($templateName: String!, $projectTemplateFolderId: String!) {
      search(
        where: {
          name: "_path"
          value: $projectTemplateFolderId
          AND: { name: "_name", value: $templateName }
        }
      ) {
        results {
          id
          name
          parent {
            name
          }
        }
      }
    }
  `;

  const result = (await graphQLClient.request(query, {
    templateName: templateName,
    projectTemplateFolderId: projectTemplateFolderId,
  })) as SearchResults;

  if (result.search.results?.length < 0) {
    return null;
  }

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

  const siteInfo = (await graphQLClient.request(querySite, {
    siteName: siteName,
  })) as SiteResults;

  const collectionPath = siteInfo?.layout?.item?.contentRoot?.parent?.path ?? '';

  if (!collectionPath) {
    return null;
  }

  for (let i = 0; i < result.search.results.length; i++) {
    const collectionName = result.search.results[i]?.parent?.name;

    if (collectionPath === `/sitecore/content/${collectionName}`) {
      return result.search.results[i].id;
    }
  }

  return null;
};

export { getProjectTemplateId };
