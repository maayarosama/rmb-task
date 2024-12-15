<script setup lang="ts">
defineProps<{
  msg: string;
}>();
import { Client } from "@threefold/rmb_direct_client";
import { onMounted, ref } from "vue";
import { connectClient, requestRmb } from "../client/client";

let client: Client | undefined;

onMounted(async () => {
  try {
    client = await connectClient();
  } catch (err) {
    console.error(`RMB Client connection failed due to ${err}`);
  }
});
const formData = ref({
  command: "",
  payload: "",
});
const handleSubmit = () => {
  console.log("Form Submitted:", formData.value);

  if (!client) return;
  requestRmb(client, formData.value.command, formData.value.payload);

  // Perform your action (e.g., API call)
  // alert(`Submitted: ${JSON.stringify(formData.value)}`);
};
</script>

<template>
  <v-container class="fill-height">
    <v-responsive class="align-center fill-height mx-auto" max-width="900">
      <div class="text-center">
        <h1 class="text-h2 font-weight-bold" color="primary">
          Rmb Client Task
        </h1>
      </div>

      <div class="py-4" />
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

        <!-- Submit Button -->
        <v-col cols="12" class="text-center">
          <v-btn color="primary" class="mt-4" @click="handleSubmit">
            Submit
          </v-btn>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
