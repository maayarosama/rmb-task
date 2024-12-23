<template>
  <RmbDialog v-model:modelValue="dialogVisible" :title="'Nodes Summary'">
    <template #actions>
      <NodeSummary
        :totalNodes="nodes.length"
        :pingableNodes="pingableNodes.length"
        :failedNodes="failedNodes"
      />
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

const handlePing = async () => {
  try {
    isLoading.value = true;
    failedNodes.value = [];
    pingableNodes.value = [];
    nodes.value = await getFarmNodes(farmId.value);
    if (rmbStore.client) {
      for (const node of nodes.value) {
        if (await pingNode(rmbStore.client as Client, node.twinId)) {
          pingableNodes.value.push(node);
        } else {
          failedNodes.value.push(node);
        }
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
import { getFarmNodes, pingNode } from "@/utils/nodes";
import { type Node } from "@/types/types";
import NodeSummary from "./nodes_summary.vue";
import RmbDialog from "./dialoge.vue";
import type { Client } from "@threefold/rmb_direct_client";
export default {
  name: "PingFarmNodes",
  components: { NodeSummary, RmbDialog },
};
</script>
<style scoped></style>
