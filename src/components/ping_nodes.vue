<template>
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

    <RmbDialog v-model:modelValue="dialogVisible" :title="'Nodes Summary'">
      <template #actions>
        <NodeSummary
          :totalNodes="nodes.length"
          :pingableNodes="pingableNodes.length"
          :failedNodes="failedNodes"
        />
      </template>
    </RmbDialog>
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
    failedNodes.value = [];
    pingableNodes.value = [];
    for (const node of nodes.value) {
      console.log("pinging node:", node.twinId);
      if (await pingNode(rmbStore.client, node.twinId)) {
        pingableNodes.value.push(node);
      } else {
        failedNodes.value.push(node);
      }
    }
    dialogVisible.value = true;
  } catch (err) {
    console.error(`RMB Client connection failed due to ${err}`);
  } finally {
    isLoading.value = false;
  }
};
</script>
<script lang="ts">
import NodeSummary from "./nodes_summary.vue";
import RmbDialog from "./dialoge.vue";

import { getNodes, pingNode } from "@/utils/nodes";
import { type Node } from "@/types/types";

export default {
  name: "PingNodes",
  components: { RmbDialog, NodeSummary },
};
</script>
