<template>
  <!-- <RmbDialog v-model:modelValue="dialogVisible" :title="'Nodes Summary'">
    <template #actions>
      <NodeSummary
        :totalNodes="nodes.length"
        :pingableNodes="pingableNodes"
        :failedNodes="failedNodes"
      />
    </template>
  </RmbDialog> -->

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
            :rules="isRequired"
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

const handleSummary = async () => {
  try {
    if (isFarm.value) {
      isLoadingFarm.value = true;
      nodes.value = await getFarmNodes(farmId.value);
    } else {
      isLoading.value = true;
      nodes.value = await getNodes();
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

    // dialogVisible.value = true;
  } catch (err) {
    console.error(`RMB Client connection failed due to ${err}`);
  } finally {
    isLoading.value = false;
    isLoadingFarm.value = false;
  }
};
</script>
<script lang="ts">
import { getFarmNodes, getNodes, getNodesSummary } from "@/utils/nodes";
import { type Node } from "@/types/types";
import NodeSummary from "./nodes_summary.vue";
import RmbDialog from "./dialoge.vue";
import type { Client } from "@threefold/rmb_direct_client";
import { isRequired } from "@/utils/validators";
export default {
  name: "NodeUpdates",
  components: { NodeSummary, RmbDialog },
};
</script>
<style scoped></style>
