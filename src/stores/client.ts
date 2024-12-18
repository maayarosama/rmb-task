import type { Client } from "@threefold/rmb_direct_client";
import { defineStore } from "pinia";
import { connectClient } from "../client/client";

export interface IClient {
  client: Client | undefined;
}

const useRmb = defineStore("rmb-client", {
  state: (): IClient => {
    return { client: null as any };
  },

  actions: {
    async set() {
      this.client = await connectClient();
    },
  },
});

export { useRmb };
