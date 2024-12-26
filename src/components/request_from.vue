<template>
  <RmbDialog v-model:modelValue="dialogVisible" :title="'Response'">
    <template #actions>
      <pre>
          <code class="hljs json dark-bg" v-html="response"></code>
        </pre>
    </template>
  </RmbDialog>
  <v-form v-model="valid" class="mx-auto">
    <v-container class="d-flex flex-column justify-center align-center">
      <v-responsive class="mx-auto">
        <v-row>
          <v-col cols="12">
            <v-card
              class="py-4"
              color="surface-variant"
              rounded="lg"
              variant="outlined"
            >
              <v-text-field
                class="pa-4"
                v-model="formData.nodeId"
                hide-details="auto"
                type="number"
                label="Node Twin Id"
                :rules="isNumber"
                clearable
              ></v-text-field>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card
              class="py-4"
              color="surface-variant"
              rounded="lg"
              variant="outlined"
            >
              <v-text-field
                class="pa-4"
                v-model="formData.command"
                hide-details="auto"
                label="Rmb command"
                :rules="isCommand"
                clearable
              ></v-text-field>
              <v-chip-group class="pa-4">
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
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-card
              class="py-4"
              color="surface-variant"
              rounded="lg"
              variant="outlined"
            >
              <v-textarea
                class="pa-4"
                v-model="formData.payload"
                hide-details="auto"
                label="Payload"
                :rules="isJson"
                clearable
              ></v-textarea>
            </v-card>
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
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { requestRmb } from "../client/client";
import { useRmb } from "../stores/client";

const rmbStore = useRmb();
const response = ref();
const dialogVisible = ref(false);
const isLoading = ref(false);
const valid = ref(false);

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
    if (rmbStore.client) {
      response.value = await requestRmb(
        rmbStore.client as Client,
        [formData.value.nodeId],
        formData.value.command,
        formData.value.payload
      );
    }
    response.value = JSON.stringify(response.value, null, 2);

    dialogVisible.value = true;
  } catch (err) {
    console.error(`RMB Request failed due to ${err}`);
  } finally {
    isLoading.value = false;
  }
};
</script>
<script lang="ts">
import RmbDialog from "./dialoge.vue";
import { isCommand, isNumber, isJson } from "../utils/validators";
import type { Client } from "@threefold/rmb_direct_client";

export default {
  name: "RequestForm",
  components: { RmbDialog },
};
</script>
<style scoped></style>
