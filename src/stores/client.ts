import type { Client } from "@threefold/rmb_direct_client";
import { defineStore } from "pinia";
import { connectClient, disconnectClient } from "../client/client";

export interface IClient {
  client: Client | undefined;
}

const useRmb = defineStore("rmb-client", {
  state: (): IClient => {
    return { client: null as any };
  },

  actions: {
    async set(mnemonic: string | undefined) {
      if (mnemonic) {
        this.client = await connectClient(mnemonic);
      }
    },
    async clear() {
      if (this.client) {
        await disconnectClient(this.client);
        this.client = undefined;
      }
    },
  },
});

export { useRmb };
