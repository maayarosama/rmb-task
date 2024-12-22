<template>
  <v-form v-model="valid" class="mx-auto">
    <v-row>
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
            return-object
            single-line
          ></v-select>
        </v-card>
      </v-col>

      <v-col cols="12" class="text-center">
        <v-btn
          color="primary"
          class="mt-4"
          @click="handleSubmit"
          :loading="isLoading"
        >
          Submit
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { requestRmb } from "../client/client";
import { useRmb } from "../stores/client";

const rmbStore = useRmb();
const mnemonic = ref("");
const selectedNetwork = ref("");
const networks = ref(["dev", "qa", "main", "test"]);
const profile = ref<Profile>({
  mnemonic: "",
  network: networks.value[0],
});
const valid = ref(false);

const dialogVisible = ref(false);
const isLoading = ref(false);
const profileStore = useProfile();

const handleSubmit = async () => {
  try {
    isLoading.value = true;
    await profileStore.set(profile.value);
  } catch (err) {
    console.error(`Couldn't load profile: ${err}`);
  } finally {
    isLoading.value = false;
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
