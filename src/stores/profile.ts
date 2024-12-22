import type { Profile } from "@/types/types";
import { defineStore } from "pinia";
import { useRmb } from "./client";

export interface State {
  profile: Profile | null;
}

const useProfile = defineStore("profile", {
  state: (): State => {
    return { profile: null };
  },

  actions: {
    set(profile: Profile | null) {
      this.profile = profile;
      // if (this.profile) {
      //   useRmb().set(this.profile?.mnemonic);
      // }
    },

    updateNetwork(network: string) {
      if (this.profile) {
        this.profile.network = network;
      }
    },
    clear() {
      this.profile = null;
    },
  },
});

export { useProfile };
