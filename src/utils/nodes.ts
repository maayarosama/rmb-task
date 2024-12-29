import { Client } from "@threefold/rmb_direct_client";
import { requestRmb } from "../client/client";
import { default as axios, type AxiosResponse } from "axios";
import urlJoin from "url-join";
import { ZOSVersionResultModel, type Node } from "@/types/types";
export async function pingNode(
  rmbClient: Client,
  nodeTwinId: number
): Promise<ZOSVersionResultModel | null | unknown> {
  try {
    const response = await requestRmb(
      rmbClient,
      [nodeTwinId],
      "zos.system.version",
      ""
    );
    return response as ZOSVersionResultModel;
  } catch (error) {
    throw new Error(
      `Error pinging node with Twin ID ${nodeTwinId}. Error: ${error}`
    );
  }
}

async function getNodes(
  page = 1,
  url = ""
): Promise<{ loadedNodes: Node[]; totalPages: number }> {
  const r = url || window.env.GRIDPROXY_URL;

  return axios
    .get<Node[]>(urlJoin(r, `/nodes?ret_count=true&page=${page}&status=up`))
    .then((response: AxiosResponse<Node[]>) => {
      return {
        loadedNodes: response.data.map((node) => ({
          twinId: node.twinId,
          nodeId: node.nodeId,
        })),
        totalPages: parseInt(response.headers.pages, 10),
      };
    })
    .catch((error) => {
      console.error("Error fetching the item list:", error);
      throw error;
    });
}

export async function getAllNodes(farmId = 0): Promise<Node[]> {
  let loadedNodes: Node[] = [];
  let totalPages = 0;

  if (farmId) {
    const result = await getFarmNodes(farmId);
    loadedNodes = result.loadedNodes;
    totalPages = result.totalPages;
  } else {
    const result = await getNodes();
    loadedNodes = result.loadedNodes;
    totalPages = result.totalPages;
  }

  const nodes: Node[] = [...loadedNodes];

  for (let i = 2; i <= totalPages; i++) {
    let result;
    if (farmId) {
      result = await getFarmNodes(farmId, i);
    } else {
      result = await getNodes(i);
    }
    nodes.push(...result.loadedNodes);
  }

  return nodes;
}

async function getFarmNodes(
  farmId: number,
  page = 1,
  url = ""
): Promise<{ loadedNodes: Node[]; totalPages: number }> {
  const r = url || window.env.GRIDPROXY_URL;
  return axios
    .get<Node[]>(
      urlJoin(
        r,
        `/nodes?ret_count=true&page=${page}&status=up&farm_ids=${[farmId]}`
      )
    )
    .then((response: AxiosResponse<Node[]>) => {
      return {
        loadedNodes: response.data.map((node) => ({
          twinId: node.twinId,
          nodeId: node.nodeId,
        })),
        totalPages: parseInt(response.headers.pages, 10),
      };
    })
    .catch((error) => {
      console.error("Error fetching the item list:", error);
      throw error;
    });
}

export async function batchPingNodes(
  rmbClient: Client,
  nodes: Node[],
  batchSize: number = 25
): Promise<{ node: Node; response: ZOSVersionResultModel | null }[]> {
  const batches: Node[][] = [];

  // Split nodes into batches
  for (let i = 0; i < nodes.length; i += batchSize) {
    batches.push(nodes.slice(i, i + batchSize));
  }

  const results: { node: Node; response: ZOSVersionResultModel | null }[] = [];

  await Promise.allSettled(
    batches.map(async (batch) => {
      const batchResults = await Promise.allSettled(
        batch.map(async (node) => {
          try {
            const response = await pingNode(rmbClient, node.twinId);
            return { node, response: response as ZOSVersionResultModel | null };
          } catch (error) {
            throw new Error(
              `Error pinging node with Twin ID ${node.twinId}. Error: ${error}`
            );
          }
        })
      );

      batchResults.forEach((result) => {
        if (result.status === "fulfilled") {
          results.push(result.value);
        } else {
          results.push({ node: result.reason, response: null });
        }
      });
    })
  );

  return results;
}

export async function getNodesSummary(
  rmbClient: Client,
  version: string,
  nodes: Node[]
): Promise<{
  nodes: Node[];
  matchedNodes: Node[];
  unMatchedNodes: Node[];
} | null> {
  try {
    const results = await batchPingNodes(rmbClient, nodes);
    for (const res of results) {
      res.node.version = res.response?.zos;
    }
    nodes = results.map((res) => res.node);
    const { matchedNodes, unMatchedNodes } = MatchNodesByVersion(
      nodes,
      version
    );
    return { nodes, matchedNodes, unMatchedNodes };
  } catch (error) {
    throw new Error(`Error getting summary. Error: ${error}`);
  }
}

function MatchNodesByVersion(
  nodes: Node[],
  version: string
): { matchedNodes: Node[]; unMatchedNodes: Node[] } {
  const matchedNodes: Node[] = [];
  const unMatchedNodes: Node[] = [];

  nodes.forEach((node) => {
    if (node.version === version) {
      matchedNodes.push(node);
    } else {
      unMatchedNodes.push(node);
    }
  });

  return { matchedNodes, unMatchedNodes };
}
