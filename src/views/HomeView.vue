<template>
  <v-container>
    <v-row>
      <v-col cols="6" class="d-flex flex-column align-center justify-center">
        <PingNodes />
        <PingFarmNodes />
      </v-col>
      <v-col cols="6">
        <RequestForm />
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts"></script>

<script lang="ts">
import RequestForm from "../components/request_from.vue";
import PingNodes from "../components/ping_nodes.vue";
import PingFarmNodes from "../components/ping_nodes_farms.vue";

export default {
  name: "HomeView",
  components: { RequestForm, PingNodes, PingFarmNodes },
};
</script>
