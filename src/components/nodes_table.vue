<template>
  <v-card>
    <v-card-title>
      <v-sheet color="primary" class="w-100 d-flex align-center justify-center">
        <p class="my-2 font-weight-bold text-h6">{{ title }}</p>
      </v-sheet>
    </v-card-title>

    <v-card-text>
      <v-data-table
        :headers="tableHeaders"
        :items="items"
        item-value="nodeId"
        class="elevation-1"
        item-height="10"
      >
        <template v-slot="{ items }">
          <tbody>
            <tr v-for="item in items" :key="item.nodeId">
              <td v-for="header in tableHeaders" :key="header.key">
                {{ getValue(item, header.key) || "-" }}
              </td>
            </tr>
          </tbody>
        </template>
      </v-data-table>
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
    type: Array as PropType<{ title: string; key: string }[]>,
    default: () => [],
  },
  items: {
    type: Array as PropType<Node[]>,
    default: () => [],
  },
});
const getValue = (item: Node, key: string) => {
  if (key in item) {
    return item[key as keyof Node];
  }
  return "-";
};
</script>
<script lang="ts">
import { type Node } from "@/types/types";
import { type PropType } from "vue";

export default {
  name: "NodeTable",
};
</script>
