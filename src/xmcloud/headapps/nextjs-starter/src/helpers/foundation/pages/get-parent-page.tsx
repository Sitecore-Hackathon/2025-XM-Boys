import { constants, Field } from '@sitecore-jss/sitecore-jss-nextjs';
import { mapToNew } from '@constellation4sitecore/mapper';
import { gql } from 'graphql-request';
import config from 'temp/config';
import { createGraphQLClientFactory } from 'lib/graphql-client-factory/create';

type ParentPageFields = {
  id: string;
  name: string;
  title: Field<string>;
};

type ParentPageResult = {
  items: {
    parent: {
      id: string;
      name: string;
      fields: ParentPageFields;
    };
  };
};

const getParentPage = async (pageId: string, language: string) => {
  if (process.env.JSS_MODE === constants.JSS_MODE.DISCONNECTED) {
    return null;
  }

  const graphQLClient = createGraphQLClientFactory(config)();

  const query = gql`
    query GetParentPage($pageId: String!, $language: String!) {
      items: item(path: $pageId, language: $language) {
        parent {
          id
          name
          fields {
            name
            jsonValue
          }
        }
      }
    }
  `;

  const result = (await graphQLClient.request(query, {
    pageId: pageId,
    language: language,
  })) as ParentPageResult;

  if (result.items?.parent) {
    const parentPage = mapToNew<ParentPageFields>(result.items?.parent);

    if (parentPage) {
      parentPage.id = result.items?.parent?.id ?? '';
      parentPage.name = result.items?.parent?.name ?? '';
      return parentPage;
    }
  }

  return null;
};

export { getParentPage };
