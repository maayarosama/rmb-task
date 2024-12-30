<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import HomeView from "./views/HomeView.vue";
import NavBar from "./components/navbar.vue";
import { useProfile } from "./stores/profile";
const profileStore = useProfile();
import { useRmb } from "./stores/client";
const rmbStore = useRmb();
</script>

<template>
  <v-app>
    <NavBar />
    <div class="pa-5" v-if="profileStore.profile && rmbStore.client">
      <HomeView />
    </div>
    <div v-else class="ma-6">
      <v-alert type="info" variant="tonal" class="my-6">
        <p>Please enter your Mnemonic.</p>
      </v-alert>
    </div>
  </v-app>
</template>

<style scoped></style>
