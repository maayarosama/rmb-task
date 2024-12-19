<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import HomeView from "./views/HomeView.vue";

import { onMounted } from "vue";
import { useRmb } from "./stores/client";
const rmbStore = useRmb();

onMounted(async () => {
  try {
    await rmbStore.set();
  } catch (err) {
    console.error(`RMB Client connection failed due to ${err}`);
  }
});
</script>

<template>
  <v-sheet color="primary" class="w-100 d-flex align-center justify-center">
    <p class="my-2 font-weight-bold text-h6">Rmb Executer</p>
  </v-sheet>
  <div class="pa-5"><HomeView /></div>
</template>

<style scoped></style>
