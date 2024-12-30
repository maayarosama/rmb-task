<template>
  <RmbDialog
    v-model:modelValue="dialogVisible"
    :title="'Response'"
    v-if="response"
  >
    <template #actions>
      <pre>
          <code class="hljs json dark-bg" v-html="response"></code>
        </pre>
    </template>
  </RmbDialog>

  <v-form v-model="valid" class="mx-auto">
    <v-container class="d-flex flex-column justify-center align-center">
      <v-responsive class="mx-auto">
        <v-sheet
          color="primary"
          class="w-100 d-flex align-center justify-center pt-0"
        >
          <p class="my-2 font-weight-bold text-h6">Request Form</p>
        </v-sheet>
        <v-row>
          <v-col cols="12">
            <v-select
              class="px-4 mt-10"
              v-model="target"
              :items="targets"
              item-value="abbr"
              label="Target"
              return-object
              single-line
            ></v-select>
          </v-col>
          <v-col cols="12" v-if="target === 'Node'">
            <v-text-field
              class="pa-4"
              v-model="formData.nodeId"
              hide-details="auto"
              type="number"
              label="Node Twin Id"
              :rules="isNumber"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" v-if="target === 'Farm'">
            <v-text-field
              class="pa-4"
              v-model="farmId"
              hide-details="auto"
              type="number"
              label="Farm Id"
              :rules="isNumber"
              clearable
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-text-field
              class="pa-4"
              v-model="formData.command"
              hide-details="auto"
              label="Rmb command"
              :rules="isCommand"
              clearable
            ></v-text-field>
            <v-row justify="center">
              <v-col cols="12" class="d-flex justify-center">
                <v-chip-group class="pa-4 d-flex justify-center">
                  <v-chip
                    v-for="command in commands"
                    :key="command.key"
                    class="pa-5 mb-3"
                    :variant="
                      selectedCommand === command.text ? 'flat' : 'outlined'
                    "
                    :color="
                      selectedCommand === command.text ? 'primary' : 'white'
                    "
                    @click="handleSelection(command)"
                  >
                    <div class="d-flex justify-center">
                      <p class="ml-2">{{ command.key }}</p>
                    </div>
                  </v-chip>
                </v-chip-group>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <v-textarea
              class="pa-4"
              v-model="formData.payload"
              hide-details="auto"
              label="Payload"
              :rules="isJson"
              clearable
            ></v-textarea>
          </v-col>

          <v-col cols="12" class="text-center">
            <v-btn
              color="primary"
              class="mt-4"
              @click="handleSubmit"
              :loading="isLoading"
              :disabled="!valid"
            >
              Submit
            </v-btn>
          </v-col>
        </v-row>
      </v-responsive>
    </v-container>
  </v-form>
  <RmbDialog
    v-if="formData.command === 'zos.system.version'"
    v-model:modelValue="dialogVisible"
    :title="'Nodes Summary'"
  >
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
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { requestRmb } from "../client/client";
import { useRmb } from "../stores/client";
const tableHeaders = [
  { title: "Node ID", key: "nodeId" },
  { title: "Twin ID", key: "twinId" },
];
const rmbStore = useRmb();
const response = ref();
const dialogVisible = ref(false);
const isLoading = ref(false);
const valid = ref(false);
const targets = ref(["All", "Node", "Farm"]);
const target = ref(targets.value[0]);
const farmId = ref();

const failedNodes = ref<Node[]>([]);
const pingableNodes = ref<Node[]>([]);
const nodes = ref<Node[]>([]);
const showFailedNodes = ref(false);
const showPingableNodes = ref(false);
const formData = ref({
  command: "",
  payload: "",
  nodeId: 17,
});

interface Command {
  key: string;
  text: string;
}
const commands = ref<Command[]>([
  { key: "Version", text: "zos.system.version" },
  { key: "Diagnostics", text: "zos.system.diagnostics" },
  { key: "Statistics", text: "zos.statistics.get" },
  { key: "PerfTests", text: "zos.perf.get_all" },
]);

const selectedCommand = ref<string>("");

const handleSelection = (command: Command) => {
  selectedCommand.value = command.text;
};
watch(selectedCommand, (newVal) => {
  if (newVal) {
    formData.value.command = newVal;
  }
});

watch(
  () => formData.value.command,
  (newVal) => {
    if (newVal !== selectedCommand.value) {
      selectedCommand.value = "";
    }
  }
);
const handleSubmit = async () => {
  try {
    isLoading.value = true;
    response.value = "";
    if (rmbStore.client) {
      if (target.value === "All" || target.value === "Farm") {
        nodes.value = await getAllNodes(farmId.value);
      }
      if (target.value === "Node") {
        response.value = await requestRmb(
          rmbStore.client as Client,
          [formData.value.nodeId],
          formData.value.command,
          formData.value.payload
        );
        response.value = JSON.stringify(response.value, null, 2);
      } else if (
        target.value !== "Node" &&
        formData.value.command === "zos.system.version"
      ) {
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
      } else {
        response.value = await batchRequest(
          rmbStore.client as Client,
          nodes.value,
          formData.value.command
        );
        response.value = JSON.stringify(response.value, null, 2);
      }
    }
    dialogVisible.value = true;
    toast.success("Request completed successfully", {
      theme: "colored",
      position: toast.POSITION.TOP_RIGHT,
    });
  } catch (err) {
    console.error(`RMB Request failed due to ${err}`);
    toast.error("Request failed", {
      theme: "colored",
      position: toast.POSITION.TOP_RIGHT,
    });
  } finally {
    isLoading.value = false;
  }
};
</script>
<script lang="ts">
import RmbDialog from "./dialoge.vue";
import { isCommand, isNumber, isJson } from "../utils/validators";
import type { Client } from "@threefold/rmb_direct_client";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { batchPingNodes, getAllNodes, batchRequest } from "../utils/nodes";
import { type Node } from "@/types/types";
import NodeSummary from "./nodes_summary.vue";
import NodeTable from "./nodes_table.vue";

export default {
  name: "RequestForm",
  components: { RmbDialog, NodeSummary, NodeTable },
};
</script>
<style scoped></style>
