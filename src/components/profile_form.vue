<template>
  <v-form v-model="valid" class="mx-auto">
    <v-row>
      <v-col cols="12" v-if="isLogged" class="d-flex justify-end">
        <v-btn icon color="error" @click="handleLogout">
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </v-col>

      <v-col cols="12">
        <v-card
          class="py-4"
          color="surface-variant"
          rounded="lg"
          variant="outlined"
        >
          <v-text-field
            class="pa-4"
            v-model="profile.mnemonic"
            hide-details="auto"
            type="string"
            label="Mnemonic"
            :disabled="isLogged"
            :rules="isMnemonic"
            clearable
          ></v-text-field>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card
          class="py-4"
          color="surface-variant"
          rounded="lg"
          variant="outlined"
        >
          <v-select
            class="px-4"
            v-model="profile.network"
            :items="networks"
            item-value="abbr"
            label="Network"
            :disabled="isLogged"
            return-object
            single-line
          ></v-select>
        </v-card>
      </v-col>

      <v-col cols="12" class="text-center" v-if="!isLogged">
        <v-btn
          color="primary"
          class="mt-4"
          @click="handleSubmit"
          :loading="isLoading"
          :disabled="!valid || isLoading"
        >
          Login
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRmb } from "../stores/client";
import { isMnemonic } from "../utils/validators";

const emit = defineEmits(["close"]);
const rmbStore = useRmb();
const networks = ref(["dev", "qa", "main", "test"]);
const profileStore = useProfile();
const profile = ref<Profile>({
  mnemonic: profileStore.profile?.mnemonic || "",
  network: profileStore.profile?.network || networks.value[0],
});
const valid = ref(false);

const isLoading = ref(false);
const isLogged = computed(() => {
  if (
    profileStore.profile &&
    Object.keys(profileStore.profile).length > 0 &&
    rmbStore.client
  ) {
    return true;
  } else {
    return false;
  }
});

const handleSubmit = async () => {
  try {
    isLoading.value = true;
    await profileStore.set(profile.value);
    await rmbStore.set(profileStore.profile?.mnemonic);
    emit("close");
  } catch (err) {
    console.error(`Couldn't load profile: ${err}`);
  } finally {
    isLoading.value = false;
  }
};
const handleLogout = async () => {
  try {
    profileStore.clear();
    rmbStore.clear();
    emit("close");
  } catch (err) {
    console.error(`Couldn't logout: ${err}`);
  }
};
</script>
<script lang="ts">
import RmbDialog from "./dialoge.vue";
import type { Profile } from "@/types/types";
import { useProfile } from "@/stores/profile";

export default {
  name: "ProfileForm",
  components: { RmbDialog },
};
</script>
<style scoped></style>
