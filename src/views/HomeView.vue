<template>
  <v-container>
    <v-row>
      <v-col
        cols="6"
        class="py-10 my-10 d-flex flex-column align-center justify-center"
      >
        <v-card
          class="py-1 pb-1 my-5"
          color="surface-variant"
          rounded="lg"
          variant="outlined"
        >
          <NodeUpdates />
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card
          class="py-1 pb-1 my-5"
          color="surface-variant"
          rounded="lg"
          variant="outlined"
        >
          <RequestForm />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup lang="ts"></script>

<script lang="ts">
import RequestForm from "../components/request_from.vue";
import NodeUpdates from "../components/node_updates.vue";

export default {
  name: "HomeView",
  components: { RequestForm, NodeUpdates },
};
</script>
