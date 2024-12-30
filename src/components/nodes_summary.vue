<template>
  <v-container class="d-flex flex-column">
    <p>
      <span><strong>Total Number of Nodes: </strong></span>
      <span> {{ totalNodes }}</span>
    </p>
    <slot name="summary"></slot>
  </v-container>
</template>

<script setup lang="ts">
const props = defineProps({
  totalNodes: {
    type: Number,
    default: 0,
  },
});
</script>
<script lang="ts">
export default {
  name: "NodeSummary",
  components: {},
};
</script>
