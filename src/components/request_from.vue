<template>
  <DialogComponent v-model:dialogVisible="dialogVisible" :response="response" />

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
            <v-textarea
              class="pa-4"
              v-model="formData.payload"
              hide-details="auto"
              label="Payload"
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
          >
            Submit
          </v-btn>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { requestRmb } from "../client/client";
import { useRmb } from "../stores/client";

const rmbStore = useRmb();
const response = ref();
const dialogVisible = ref(false);
const isLoading = ref(false);

const formData = ref({
  command: "",
  payload: "",
  nodeId: 17,
});

const handleSubmit = async () => {
  try {
    isLoading.value = true;
    if (rmbStore.client) {
      response.value = await requestRmb(
        rmbStore.client,
        [formData.value.nodeId],
        formData.value.command,
        formData.value.payload
      );
    }

    dialogVisible.value = true;
  } catch (err) {
    console.error(`RMB Request failed due to ${err}`);
  } finally {
    isLoading.value = false;
  }
};
</script>
<script lang="ts">
import DialogComponent from "./dialoge.vue";

export default {
  name: "RequestForm",
  components: { DialogComponent },
};
</script>
<style scoped></style>
