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
    const results = await batchPingNodes(
      rmbStore.client as Client,
      nodes.value
    );

    for (const res of results) {
      if (res.response) {
        pingableNodes.value.push(res.node);
      } else {
        failedNodes.value.push(res.node);
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

import { batchPingNodes, getNodes } from "@/utils/nodes";
import { type Node } from "@/types/types";
import type { Client } from "@threefold/rmb_direct_client";

export default {
  name: "PingNodes",
  components: { RmbDialog, NodeSummary },
};
</script>
