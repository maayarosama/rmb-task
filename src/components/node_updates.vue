<template>
  <RmbDialog v-model:modelValue="dialogVisible" :title="'Nodes Update Summary'">
    <template #actions>
      <NodeSummary :totalNodes="nodes.length">
        <template #summary>
          <p>
            <span
              ><strong
                >Total Number of Nodes that has the update:
              </strong></span
            >
            <span> {{ matchNodes.length }}</span>
            <v-icon
              color="primary"
              v-if="matchNodes.length"
              class="cursor-pointer ma-2"
              @click="showMatchedNodes = !showMatchedNodes"
            >
              {{
                showMatchedNodes
                  ? "mdi-arrow-up-drop-circle-outline"
                  : "mdi-arrow-down-drop-circle-outline"
              }}
            </v-icon>
          </p>
          <v-expand-transition v-if="showMatchedNodes">
            <NodeTable
              title="Matched Nodes"
              :items="matchNodes"
              :tableHeaders="tableHeaders"
            />
          </v-expand-transition>
          <p>
            <span
              ><strong
                >Total Number of Nodes that don't have the update:
              </strong></span
            >
            <span> {{ unMatchNodes.length }}</span>

            <v-icon
              color="primary"
              v-if="unMatchNodes.length"
              class="cursor-pointer ma-2"
              @click="showUnMatchedNodes = !showUnMatchedNodes"
            >
              {{
                showUnMatchedNodes
                  ? "mdi-arrow-up-drop-circle-outline"
                  : "mdi-arrow-down-drop-circle-outline"
              }}
            </v-icon>
          </p>

          <v-expand-transition v-if="showUnMatchedNodes">
            <NodeTable
              title="Unmatched Nodes"
              :items="unMatchNodes"
              :tableHeaders="tableHeaders"
            /> </v-expand-transition
        ></template>
      </NodeSummary>
    </template>
  </RmbDialog>

  <v-container class="d-flex flex-column justify-center align-center">
    <v-responsive class="mx-auto">
      <v-sheet
        color="primary"
        class="w-100 d-flex align-center justify-center pt-0"
      >
        <p class="my-2 font-weight-bold text-h6">Nodes' Summary</p>
      </v-sheet>
      <v-form v-model="valid" class="mx-auto mt-2">
        <v-container class="justify-center align-center">
          <v-row>
            <v-col cols="12">
              <v-text-field
                class="pb-1 px-2"
                v-model="version"
                hide-details="auto"
                label="Node's Version"
                :rules="isVersionValid"
                clearable
              ></v-text-field>
            </v-col>

            <v-col cols="6" class="text-center">
              <v-btn
                color="primary"
                class="mt-4"
                @click="handleSummary"
                :loading="isLoading"
                :disabled="!valid || isLoadingFarm"
              >
                Summary
              </v-btn>
            </v-col>
            <v-col cols="6" class="text-center">
              <v-btn
                color="primary"
                class="mt-4 wrap-text"
                @click="isFarm = !isFarm"
                :disabled="!valid || isLoadingFarm || isLoading"
              >
                Summary In Farm
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>

      <v-col cols="12">
        <v-form v-model="validFarm" class="mx-auto">
          <v-container v-if="isFarm" class="justify-center align-center">
            <v-row>
              <v-col cols="8">
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

              <v-col cols="4" class="text-center">
                <v-btn
                  color="primary"
                  class="mt-4"
                  @click="handleSummary"
                  :loading="isLoadingFarm"
                  :disabled="!validFarm"
                >
                  Summary
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-col>
    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRmb } from "../stores/client";
import { isNumber } from "../utils/validators";

const rmbStore = useRmb();
const dialogVisible = ref(false);
const isLoading = ref(false);
const isLoadingFarm = ref(false);

const isFarm = ref(false);
const valid = ref(false);
const validFarm = ref(false);

const farmId = ref();
const version = ref();

const nodes = ref<Node[]>([]);
const matchNodes = ref<Node[]>([]);
const unMatchNodes = ref<Node[]>([]);
const showUnMatchedNodes = ref(false);
const showMatchedNodes = ref(false);

const tableHeaders = [
  { title: "Node ID", key: "nodeId" },
  { title: "Twin ID", key: "twinId" },
  { title: "Version", key: "version" },
];

const handleSummary = async () => {
  try {
    if (isFarm.value) {
      isLoadingFarm.value = true;
      nodes.value = await getAllNodes(farmId.value);
    } else {
      isLoading.value = true;
      nodes.value = await getAllNodes();
    }
    const result = await getNodesSummary(
      rmbStore.client as Client,
      version.value,
      nodes.value
    );

    if (result !== null) {
      const { nodes, matchedNodes, unMatchedNodes } = result;
      matchNodes.value = matchedNodes;
      unMatchNodes.value = unMatchedNodes;
    }
    isFarm.value = false;
    dialogVisible.value = true;
  } catch (err) {
    console.error(`RMB Client connection failed due to ${err}`);
  } finally {
    isLoading.value = false;
    isLoadingFarm.value = false;
  }
};
</script>
<script lang="ts">
import { getAllNodes, getNodesSummary } from "@/utils/nodes";
import { type Node } from "@/types/types";
import NodeSummary from "./nodes_summary.vue";
import RmbDialog from "./dialoge.vue";
import type { Client } from "@threefold/rmb_direct_client";
import { isVersionValid } from "@/utils/validators";
import NodeTable from "./nodes_table.vue";

export default {
  name: "NodeUpdates",
  components: { NodeSummary, RmbDialog, NodeTable },
};
</script>
<style scoped></style>
