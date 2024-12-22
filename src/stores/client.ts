import type { Client } from "@threefold/rmb_direct_client";
import { defineStore } from "pinia";
import { connectClient } from "../client/client";
import { useProfile } from "./profile";
import type { Profile } from "@/types/types";

export interface IClient {
  client: Client | undefined;
}

const useRmb = defineStore("rmb-client", {
  state: (): IClient => {
    return { client: null as any };
  },

  actions: {
    // async set(mnemonic: string | null) {

    async set() {
      this.client = await connectClient();
    },
  },
});

export { useRmb };
