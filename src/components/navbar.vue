<template>
  <v-container>
    <v-app-bar color="primary" dark>
      <v-app-bar-title class="w-100 ma-5">
        <p class="my-2 font-weight-bold text-h6">Rmb Executor</p>
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="toggleDialog">
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <RmbDialog v-model:modelValue="dialogVisible" :title="'Rmb Executor'">
      <template #actions>
        <ProfileForm @close="dialogVisible = false" />
      </template>
    </RmbDialog>
  </v-container>
</template>

<script setup lang="ts">
const dialogVisible = ref(false);

const toggleDialog = () => {
  dialogVisible.value = !dialogVisible.value;
};
</script>

<script lang="ts">
import RmbDialog from "./dialoge.vue";
import ProfileForm from "../components/profile_form.vue";
import { ref } from "vue";

export default {
  name: "NavBar",
  components: { RmbDialog, ProfileForm },
};
</script>
