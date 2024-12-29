<template>
  <v-card>
    <v-card-title>
      <v-sheet color="primary" class="w-100 d-flex align-center justify-center">
        <p class="my-2 font-weight-bold text-h6">{{ title }}</p>
      </v-sheet>
    </v-card-title>

    <v-card-text>
      <v-data-table-virtual
        :headers="tableHeaders"
        :items="items"
        item-value="nodeId"
        class="elevation-1"
        item-height="100"
      >
        <template v-slot="{ items }">
          <tbody>
            <tr v-for="item in items" :key="item.nodeId">
              <td v-for="header in tableHeaders" :key="header.key">
                {{ item[header.key] || "-" }}
              </td>
            </tr>
          </tbody>
        </template>
      </v-data-table-virtual>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  tableHeaders: {
    // Dynamically specify headers with `title` and `key`
    type: Array as PropType<{ title: string; key: string }[]>,
    default: () => [],
  },
  items: {
    type: Array as PropType<Node[]>,
    default: () => [],
  },
});
</script>
<script lang="ts">
import { type Node } from "@/types/types";
import { type PropType } from "vue";

export default {
  name: "NodeTable",
};
</script>
