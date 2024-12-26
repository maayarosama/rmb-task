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
    console.error(`Error pinging node with Twin ID ${nodeTwinId}:`, error);
    return null;
  }
}

export async function getNodes(url = ""): Promise<Node[]> {
  const r = url || window.env.GRIDPROXY_URL;

  return axios
    .get<Node[]>(urlJoin(r, `/nodes`))
    .then((response: AxiosResponse<Node[]>) => {
      return response.data.map((node) => ({
        twinId: node.twinId,
        nodeId: node.nodeId,
      }));
    })
    .catch((error) => {
      console.error("Error fetching the item list:", error);
      throw error;
    });
}

export async function getFarmNodes(farmId: number, url = ""): Promise<Node[]> {
  const r = url || window.env.GRIDPROXY_URL;
  return axios
    .get<Node[]>(urlJoin(r, `/nodes?farm_ids=${[farmId]}`))
    .then((response: AxiosResponse<Node[]>) => {
      return response.data.map((node) => ({
        twinId: node.twinId,
        nodeId: node.nodeId,
      }));
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
            console.error(
              `Error pinging node with Twin ID ${node.twinId}:`,
              error
            );
            return { node, response: null };
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
