import type { Profile } from "@/types/types";
import { defineStore } from "pinia";
import { useRmb } from "./client";
import getDefaultUrls from "@/utils/urls";

export interface State {
  profile: Profile | null;
}

const useProfile = defineStore("profile", {
  state: (): State => {
    return { profile: null };
  },

  actions: {
    set(profile: Profile) {
      this.profile = profile;
      getDefaultUrls(this.profile.network);
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
