<template>
  <!-- <DialogComponent v-model:dialogVisible="dialogVisible" :response="response" /> -->

  <v-container class="d-flex flex-column justify-center align-center">
    <v-responsive class="mx-auto">
      <v-btn
        color="primary"
        class="elevated outlined"
        @click="handlePing()"
        :loading="isLoading"
        >Ping All Nodes</v-btn
      >
    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRmb } from "../stores/client";

const rmbStore = useRmb();
const dialogVisible = ref(false);
const isLoading = ref(false);

const failedNodes = ref<Node[]>([]);
const pingableNodes = ref<Node[]>([]);
const nodes = ref<Node[]>([]);

const handlePing = async () => {
  try {
    isLoading.value = true;
    nodes.value = await getNodes();
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
import { getNodes, pingNode } from "@/utils/nodes";
import { type Node } from "@/types/types";

export default {
  name: "PingNodes",
  components: { DialogComponent },
};
</script>
<style scoped></style>
