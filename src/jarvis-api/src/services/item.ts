import { gql } from "graphql-request";
import { GraphQLRequestClient } from "./client";
import { parseString, Builder } from "xml2js";
import { promisify } from "util";
import { generateUid, formatUid } from "./utils";
import { Item } from "../models/item";
import { filterPlaceholders } from "./utils/filter-placeholders";
import { ComponentRendering } from "../models/component";
type CloneRenderingBody = {
    itemId: string;
    language: string;
    renderingId: string;
    dataSource: string;
    placeholders?: { [key: string]: any[] };
};

const getNextDynamicPlaceholderId = (renderings: any[]): number => {
    // Find max DynamicPlaceholderId in renderings
    const maxId = renderings.reduce((max, rendering) => {
        const params = rendering.$?.["s:par"] || "";
        const match = params.match(/DynamicPlaceholderId=(\d+)/);
        if (match) {
            const id = parseInt(match[1]);
            return id > max ? id : max;
        }
        return max;
    }, 0);

    // Return next available ID
    return maxId + 1;
};

const updateDynamicPlaceholderId = (
    parameters: string,
    newId: number
): string => {
    // Split parameters into key-value pairs
    const pairs = parameters.split("&");

    // Map through pairs and update DynamicPlaceholderId if present
    const updatedPairs = pairs.map((pair) => {
        const [key, value] = pair.split("=");
        if (key === "DynamicPlaceholderId") {
            return `${key}=${newId}`;
        }
        return pair;
    });

    // Join pairs back together
    return updatedPairs.join("&");
};

const duplicateDatasource = async (datasourcePath: string): Promise<string> => {
    const fromShortIdToGuid = (guid: string): string => {
        // Convert to uppercase and add dashes
        const formatted = guid
            .toUpperCase()
            .replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5");
        return `{${formatted}}`;
    };
    const graphQLClient = new GraphQLRequestClient(
        process.env.GRAPH_QL_ENDPOINT as string,
        {
            apiKey: process.env.GRAPH_QL_API_KEY as string,
            timeout: 30000,
        }
    );

    const query = gql`
        mutation duplicateDatasource($datasourcePath: String!) {
            copyItem(input: { path: $datasourcePath }) {
                item {
                    itemId
                }
            }
        }
    `;

    try {
        const result = (await graphQLClient.request(query, {
            datasourcePath: datasourcePath,
        })) as any;

        return fromShortIdToGuid(result.copyItem.item.itemId);
    } catch (e) {
        console.error(e);
        return "";
    }
};

const cloneRenderingInLayout = async (
    renderings: any,
    uid: string,
    datasource: string,
    parentPlaceholder?: string | undefined,
    placeholder?: string | undefined,
    phDynamicId?: number | undefined
) => {
    const rendering = renderings.find((r: any) => r.$.uid == formatUid(uid));
    const lastRendering = renderings[renderings.length - 1];
    let newDatasourceId = "";
    if (rendering.$["s:ds"]) {
        newDatasourceId = await duplicateDatasource(datasource);
    }
    const nextDynamicPlaceholderId = getNextDynamicPlaceholderId(renderings);
    console.log("nextDynamicPlaceholderId", nextDynamicPlaceholderId);
    const clone = {
        $: {
            uid: generateUid(),
            "p:after": `r[@uid='${formatUid(lastRendering.$.uid)}']`,
            "s:ds": newDatasourceId,
            "s:id": rendering.$["s:id"],
            "s:par": updateDynamicPlaceholderId(
                rendering.$["s:par"],
                nextDynamicPlaceholderId
            ),
            "s:ph": phDynamicId
                ? "/" +
                  parentPlaceholder +
                  "/" +
                  placeholder?.replace(
                      /(-{[*]}|-\d+)/,
                      "-" + phDynamicId.toString()
                  )
                : rendering.$["s:ph"],
        },
    };
    renderings.push(clone);
    return { renderings, nextDynamicPlaceholderId, clone };
};

const processPlaceholders = async (
    renderings: any,
    placeholders: { [key: string]: any[] },
    parentPh: string,
    dynamicId: number
) => {
    for (const placeholder of Object.keys(placeholders)) {
        const filteredPlaceholders = filterPlaceholders(
            placeholders[placeholder] as ComponentRendering[]
        );
        for (const rendering of filteredPlaceholders) {
            const childCloneResponse = await cloneRenderingInLayout(
                renderings,
                rendering.uid as string,
                rendering.dataSource as string,
                parentPh,
                placeholder,
                dynamicId
            );
            renderings = childCloneResponse.renderings;
            const newDynamicId = childCloneResponse.nextDynamicPlaceholderId;
            // Recursively process nested placeholders if they exist
            if (
                rendering.placeholders &&
                Object.keys(rendering.placeholders).length > 0
            ) {
                renderings = await processPlaceholders(
                    renderings,
                    rendering.placeholders,
                    childCloneResponse.clone.$["s:ph"],
                    newDynamicId
                );
            }
        }
    }
    return renderings;
};

export const cloneRendering = async (body: CloneRenderingBody) => {
    const finalRendering = await getFinalRendering(body.itemId, body.language);
    const parseXml = promisify(parseString);
    try {
        const result = (await parseXml(finalRendering)) as any;
        let renderings = result.r.d[0].r;

        const cloneResponse = await cloneRenderingInLayout(
            renderings,
            body.renderingId,
            body.dataSource
        );
        renderings = cloneResponse.renderings;
        const nextDynamicPlaceholderId = cloneResponse.nextDynamicPlaceholderId;

        // Recursive function to handle nested placeholders

        // Process initial placeholders
        renderings = await processPlaceholders(
            renderings,
            body.placeholders ?? {},
            cloneResponse.clone.$["s:ph"],
            nextDynamicPlaceholderId
        );

        const builder = new Builder({
            renderOpts: { pretty: true },
        });

        const xml = builder.buildObject(result);

        var item = {
            id: body.itemId,
            fields: [
                {
                    name: "__Final Renderings",
                    value: xml,
                },
            ],
        };

        await updateItem(item, body.language);

        return renderings;
    } catch (error) {
        console.error("Error parsing XML:", error);
    }
};

export const updateItem = async (item: Item, language: string) => {
    const graphQLClient = new GraphQLRequestClient(
        process.env.GRAPH_QL_ENDPOINT as string,
        {
            apiKey: process.env.GRAPH_QL_API_KEY as string,
            timeout: 30000,
        }
    );
    const query = gql`
        mutation updateVideoItem(
            $id: ID!
            $fields: [FieldValueInput]!
            $language: String!
        ) {
            updateItem(
                input: { itemId: $id, fields: $fields, language: $language }
            ) {
                item {
                    itemId
                }
            }
        }
    `;
    try {
        const response = await graphQLClient.request(query, {
            id: item.id,
            fields: item.fields,
            language: language,
        });
        return response;
        //console.log(response);
    } catch (error) {
        console.error("Error", error);
        throw error;
    }
};

export const getFinalRendering = async (itemId: string, language: string) => {
    const graphQLClient = new GraphQLRequestClient(
        process.env.GRAPH_QL_ENDPOINT as string,
        {
            apiKey: process.env.GRAPH_QL_API_KEY as string,
            timeout: 30000,
        }
    );

    const query = gql`
        query getFinalRendering($itemId: ID!, $language: String!) {
            item(where: { itemId: $itemId, language: $language }) {
                itemId
                finalRendering: field(name: "__Final Renderings") {
                    value
                }
            }
        }
    `;

    try {
        const result: any = await graphQLClient.request(query, {
            itemId: itemId,
            language: language,
        });
        return result.item.finalRendering.value;
    } catch (e) {
        console.error(e);
    }
};

export const createItem = async (
    parentId: string,
    templateId: string,
    name: string,
    itemData: any
) => {
    const graphQLClient = new GraphQLRequestClient(
        process.env.GRAPH_QL_ENDPOINT as string,
        {
            apiKey: process.env.GRAPH_QL_API_KEY as string,
            timeout: 30000,
        }
    );

    function stringifyWithoutQuotes(obj: any): string {
        if (Array.isArray(obj)) {
            return "[ " + obj.map(stringifyWithoutQuotes).join(", ") + " ]";
        } else if (typeof obj === "object" && obj !== null) {
            let str = "{ ";
            for (let key in obj) {
                str += key + ": " + JSON.stringify(obj[key]) + ", ";
            }
            return str.slice(0, -2) + " }";
        } else {
            return JSON.stringify(obj);
        }
    }

    const query = gql`
    mutation createCallToActionRow($parent: ID!, $templateId: ID!, $name: String!) {
        createItem(input: {
            database: "master",
            language: "en",
            name: $name,
            parent: $parent,
            templateId: $templateId,
            fields: ${stringifyWithoutQuotes(itemData)}
        }) {
            item {
                itemId
            }
        }
    }
    `;

    try {
        const result = await graphQLClient.request(query, {
            parent: parentId,
            templateId: templateId,
            name: name,
        });
        return result;
    } catch (e) {
        console.error(e);
    }
};

export const getParentOptions = async () => {
    const graphQLClient = new GraphQLRequestClient(
        process.env.GRAPH_QL_ENDPOINT as string,
        {
            apiKey: process.env.GRAPH_QL_API_KEY as string,
            timeout: 30000,
        }
    );

    const query = gql`
        query getParentOptions {
            item(where: { itemId: "{34B1378B-8B5C-4FC1-AFCE-EA907C1E981A}" }) {
                children {
                    nodes {
                        name
                        itemId
                        insertOptions {
                            templateId
                        }
                    }
                }
            }
        }
    `;

    try {
        const result: any = await graphQLClient.request(query);
        return result;
    } catch (e) {
        console.error(e);
    }
};
