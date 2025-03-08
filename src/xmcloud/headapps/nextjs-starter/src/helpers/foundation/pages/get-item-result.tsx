import { constants } from '@sitecore-jss/sitecore-jss-nextjs';

import config from 'temp/config';
import { gql } from 'graphql-request';
import { createGraphQLClientFactory } from 'lib/graphql-client-factory/create';

type ItemResult = {
  item: unknown;
};

export async function getItemResult(itemId: string) {
  if (process.env.JSS_MODE === constants.JSS_MODE.DISCONNECTED) {
    return null;
  }

  const graphQLClient = createGraphQLClientFactory(config)();

  const query = gql`
    query GetItem($itemId: String!, $language: String!) {
      item: item(path: $itemId, language: $language) {
        id
        name
        url {
          url
        }
        fields {
          name
          jsonValue
        }
      }
    }
  `;

  const result = (await graphQLClient.request(query, {
    itemId: itemId,
    language: config.defaultLanguage,
  })) as ItemResult;

  return result;
}
