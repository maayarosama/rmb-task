<template>
  <v-container class="d-flex flex-column">
    <div>
      <p>
        <span><strong>Total Number of Nodes: </strong></span>
        <span> {{ totalNodes }}</span>
      </p>
      <p>
        <span><strong>Total Number of Pingable Nodes: </strong></span>
        <span> {{ pingableNodes }}</span>
        <br />
      </p>

      <p>
        <span><strong>Total Number of Nodes Failed to Respond: </strong></span>
        <span> {{ failedNodes.length }}</span>

        <v-icon
          color="primary"
          v-if="failedNodes.length"
          class="cursor-pointer ma-2"
          @click="toggleFailedNodes"
        >
          {{
            showFailedNodes
              ? "mdi-arrow-up-drop-circle-outline"
              : "mdi-arrow-down-drop-circle-outline"
          }}
        </v-icon>
      </p>
    </div>

    <v-expand-transition>
      <v-card v-if="showFailedNodes">
        <v-card-title>
          <v-sheet
            color="primary"
            class="w-100 d-flex align-center justify-center"
          >
            <p class="my-2 font-weight-bold text-h6">Failed Nodes</p>
          </v-sheet>
        </v-card-title>

        <v-card-text>
          <v-data-table-virtual
            :headers="tableHeaders"
            :items="failedNodes"
            item-value="nodeId"
            class="elevation-1"
            item-height="100"
          >
            <template v-slot:items="props">
              <tbody>
                <tr v-for="item in props.items" :key="item.nodeId">
                  <td>{{ item.nodeId }}</td>
                  <td>{{ item.twinId }}</td>
                </tr>
              </tbody>
            </template>
          </v-data-table-virtual>
        </v-card-text>
      </v-card>
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
    type: Number,
    default: 0,
  },
  failedNodes: {
    type: Array as PropType<Node[]>,
    default: () => [],
  },
});
const showFailedNodes = ref(false);
const tableHeaders = [
  { title: "Node ID", align: "start", key: "nodeId" },
  { title: "Twin ID", align: "start", key: "twinId" },
];
const toggleFailedNodes = () => {
  showFailedNodes.value = !showFailedNodes.value;
};
</script>
<script lang="ts">
import { type Node } from "@/types/types";
import { ref, type PropType } from "vue";

export default {
  name: "NodeSummary",
};
</script>
