<template>
  <RmbDialog v-model:modelValue="dialogVisible" :title="'Nodes Summary'">
    <template #actions>
      <NodeSummary :totalNodes="nodes.length">
        <template #summary>
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
          <v-expand-transition v-if="showPingableNodes">
            <NodeTable
              title="Pingable Nodes"
              :items="pingableNodes"
              :tableHeaders="tableHeaders"
            />
          </v-expand-transition>
          <p>
            <span
              ><strong>Total Number of Nodes Failed to Respond: </strong></span
            >
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
              :items="failedNodes"
              :tableHeaders="tableHeaders"
            /> </v-expand-transition
        ></template>
      </NodeSummary>
    </template>
  </RmbDialog>
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
  <v-form v-model="valid" class="mx-auto">
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
              type="number"
              hide-details="auto"
              label="Farm Id"
              :rules="isNumber"
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
            :disabled="!valid"
          >
            Ping
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRmb } from "../stores/client";
import { isNumber } from "../utils/validators";

const rmbStore = useRmb();
const dialogVisible = ref(false);
const isLoading = ref(false);
const isFarm = ref(false);
const valid = ref(false);
const farmId = ref();

const failedNodes = ref<Node[]>([]);
const pingableNodes = ref<Node[]>([]);
const nodes = ref<Node[]>([]);
const showFailedNodes = ref(false);
const showPingableNodes = ref(false);

const tableHeaders = [
  { title: "Node ID", key: "nodeId" },
  { title: "Twin ID", key: "twinId" },
];

const handlePing = async () => {
  try {
    isLoading.value = true;
    failedNodes.value = [];
    pingableNodes.value = [];
    nodes.value = await getFarmNodes(farmId.value);
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
import { batchPingNodes, getFarmNodes } from "@/utils/nodes";
import { type Node } from "@/types/types";
import NodeSummary from "./nodes_summary.vue";
import RmbDialog from "./dialoge.vue";
import type { Client } from "@threefold/rmb_direct_client";
import NodeTable from "./nodes_table.vue";

export default {
  name: "PingFarmNodes",
  components: { NodeSummary, RmbDialog, NodeTable },
};
</script>
<style scoped></style>
