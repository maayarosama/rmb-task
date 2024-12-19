<template>
  <!-- <DialogComponent v-model:dialogVisible="dialogVisible" :response="response" /> -->
  <v-container class="d-flex flex-column justify-center align-center">
    <v-responsive class="mx-auto">
      <v-btn
        color="primary"
        class="elevated outlined"
        @click="isFarm = !isFarm"
        :disabled="isLoading"
        >Ping Nodes In a specific Farm</v-btn
      >
    </v-responsive>
  </v-container>
  <v-container v-if="isFarm" class="justify-center align-center">
    <v-row>
      <v-col cols="9">
        <v-card
          class="py-1"
          color="surface-variant"
          rounded="lg"
          variant="outlined"
        >
          <v-text-field
            class="py-1 px-2"
            v-model="farmId"
            hide-details="auto"
            label="Farm Id"
            clearable
          ></v-text-field>
        </v-card>
      </v-col>

      <v-col cols="3" class="text-center">
        <v-btn
          color="primary"
          class="mt-4"
          @click="handlePing"
          :loading="isLoading"
        >
          Submit
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRmb } from "../stores/client";

const rmbStore = useRmb();
const dialogVisible = ref(false);
const isLoading = ref(false);
const isFarm = ref(false);
const farmId = ref();

const failedNodes = ref<Node[]>([]);
const pingableNodes = ref<Node[]>([]);
const nodes = ref<Node[]>([]);

const handlePing = async () => {
  try {
    isLoading.value = true;
    nodes.value = await getFarmNodes(farmId.value);
    console.log("nodes twin ids:", nodes);
    for (const node of nodes.value) {
      console.log("pinging node:", node.twinId);
      if (await pingNode(rmbStore.client, node.twinId)) {
        pingableNodes.value.push(node);
      } else {
        failedNodes.value.push(node);
      }
    }
    console.log("failed: " + failedNodes.value);
    console.log("passed: " + pingableNodes.value);
  } catch (err) {
    console.error(`RMB Client connection failed due to ${err}`);
  } finally {
    isLoading.value = false;
  }
};
</script>
<script lang="ts">
import DialogComponent from "./dialoge.vue";
import { getFarmNodes, pingNode } from "@/utils/nodes";
import { type Node } from "@/types/types";

export default {
  name: "PingFarmNodes",
  components: { DialogComponent },
};
</script>
<style scoped></style>
