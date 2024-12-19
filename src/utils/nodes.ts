import { Client } from "@threefold/rmb_direct_client";
import { requestRmb } from "../client/client";
import { default as axios, type AxiosResponse } from "axios";
import urlJoin from "url-join";
import { ZOSVersionResultModel, type Node } from "@/types/types";

export async function pingNode(
  rmbClient: Client,
  nodeTwinId: number
): Promise<ZOSVersionResultModel | unknown> {
  let response;

  try {
    response = await requestRmb(
      rmbClient,
      [nodeTwinId],
      "zos.system.version",
      ""
    );
    return response;
  } catch (error) {
    console.error(`Error pinging node with Twin ID ${nodeTwinId}:`, error);
  }
  return response;
}

export async function getNodes(url = ""): Promise<Node[]> {
  const r = url || "https://gridproxy.dev.grid.tf/";

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
  const r = url || "https://gridproxy.dev.grid.tf/";
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
