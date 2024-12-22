<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import HomeView from "./views/HomeView.vue";
import NavBar from "./components/navbar.vue";
import { useProfile } from "./stores/profile";
const profileStore = useProfile();
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
  <v-app>
    <NavBar />
    <div class="pa-5" v-if="profileStore.profile"><HomeView /></div>
    <div v-else class="ma-6">
      <v-alert type="info" variant="tonal" class="my-6">
        <p>Please enter your mnemonics</p>
      </v-alert>
    </div>
  </v-app>
</template>

<style scoped></style>
