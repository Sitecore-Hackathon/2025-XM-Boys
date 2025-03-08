import { gql } from 'graphql-request';
import config from 'temp/config';
import { createGraphQLClientFactory } from 'lib/graphql-client-factory/create';

export type ParentPage = {
  parentUrl: string;
  parentPageId: string;
  parentPageName: string;
};

type ItemStructure = {
  name: string;
  id: string;
  url: {
    path: string;
  };
};

type ParentPagesResult = {
  item: ItemStructure & {
    ancestors: ItemStructure[];
  };
};

const getParentsPages = async (currentPageId: string, language: string): Promise<ParentPage[]> => {
  const query = gql`
    fragment breadcrumbFields on Item {
      name
      id
      url {
        path
      }
    }
    query GetParentPage($pageId: String!, $language: String!) {
      item(path: $pageId, language: $language) {
        ...breadcrumbFields
        ancestors(hasLayout: true) {
          ...breadcrumbFields
        }
      }
    }
  `;

  const graphQLClient = createGraphQLClientFactory(config)();

  const result = (await graphQLClient.request(query, {
    pageId: currentPageId,
    language: language,
  })) as ParentPagesResult;

  const parents: ParentPage[] = [];

  for (let i = 0; i < result.item.ancestors.length; i++) {
    const currentParent = result.item.ancestors[i];

    parents.push({
      parentUrl: currentParent.url.path ?? '',
      parentPageName: currentParent.name ?? '',
      parentPageId: currentParent.id ?? '',
    });
  }

  return parents;
};

export { getParentsPages };
