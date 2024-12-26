<template>
  <v-container class="d-flex flex-column">
    <p>
      <span><strong>Total Number of Nodes: </strong></span>
      <span> {{ totalNodes }}</span>
    </p>
    <p>
      <span><strong>Total Number of Pingable Nodes: </strong></span>
      <span> {{ pingableNodes.length }}</span>
      <v-icon
        color="primary"
        v-if="pingableNodes.length"
        class="cursor-pointer ma-2"
        @click="showPingableNodes = !showPingableNodes"
      >
        {{
          showPingableNodes
            ? "mdi-arrow-up-drop-circle-outline"
            : "mdi-arrow-down-drop-circle-outline"
        }}
      </v-icon>
    </p>
    {{ showPingableNodes }}
    <v-expand-transition v-if="showPingableNodes">
      <NodeTable
        title="Pingable Nodes"
        :items="pingableItems"
        :tableHeaders="tableHeaders"
      />
    </v-expand-transition>
    <p>
      <span><strong>Total Number of Nodes Failed to Respond: </strong></span>
      <span> {{ failedNodes.length }}</span>

      <v-icon
        color="primary"
        v-if="failedNodes.length"
        class="cursor-pointer ma-2"
        @click="showFailedNodes = !showFailedNodes"
      >
        {{
          showFailedNodes
            ? "mdi-arrow-up-drop-circle-outline"
            : "mdi-arrow-down-drop-circle-outline"
        }}
      </v-icon>
    </p>

    <v-expand-transition v-if="showFailedNodes">
      <NodeTable
        title="Failed Nodes"
        :items="items"
        :tableHeaders="tableHeaders"
      />
    </v-expand-transition>
  </v-container>
</template>

<script setup lang="ts">
const props = defineProps({
  totalNodes: {
    type: Number,
    default: 0,
  },
  pingableNodes: {
    type: Array as PropType<Node[]>,
    default: () => [],
  },
  failedNodes: {
    type: Array as PropType<Node[]>,
    default: () => [],
  },
});

const items = ref(props.failedNodes);
const pingableItems = ref(props.pingableNodes);
const showFailedNodes = ref(false);
const showPingableNodes = ref(false);

const tableHeaders = [
  { title: "Node ID", key: "nodeId" },
  { title: "Twin ID", key: "twinId" },
];
</script>
<script lang="ts">
import { type Node } from "@/types/types";
import { ref, type PropType } from "vue";
import NodeTable from "./nodes_table.vue";

export default {
  name: "NodeSummary",
  components: { NodeTable },
};
</script>
