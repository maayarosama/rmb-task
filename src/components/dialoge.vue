<template>
  <v-dialog v-model="dialog" max-width="70%">
    <v-card>
      <v-sheet color="primary" class="w-100 d-flex align-center justify-center">
        <p class="my-2 font-weight-bold text-h6">Response</p>
      </v-sheet>
      <v-card-text>
        <pre>
          <code class="hljs json dark-bg" v-html="formattedResponse"></code>
        </pre>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" variant="outlined" @click="closeDialog"
          >Close</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch, type PropType } from "vue";

export default defineComponent({
  name: "DialogComponent",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    response: {
      type: Object as PropType<any>,
      default: () => ({}),
    },
  },
  setup(props, { emit }) {
    const dialog = ref(props.dialogVisible);

    watch(
      () => props.dialogVisible,
      (newVal) => {
        dialog.value = newVal;
      }
    );

    const formattedResponse = computed(() => {
      return props.response
        ? JSON.stringify(props.response, null, 2)
        : "No response";
    });

    const closeDialog = () => {
      dialog.value = false;
      emit("update:dialogVisible", false);
    };

    return {
      dialog,
      formattedResponse,
      closeDialog,
    };
  },
});
</script>

<style lang="scss">
@import "highlight.js/styles/atom-one-dark.css";

.dark-bg {
  background-color: var(--v-theme-background-overlay-multiplier);
}
</style>
