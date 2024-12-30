<template>
  <v-dialog v-model="isVisible" max-width="70%">
    <v-card>
      <v-sheet
        color="primary"
        class="w-100 d-flex align-center position-relative"
      >
        <p class="my-2 font-weight-bold text-h6 text-center w-100">
          {{ title }}
        </p>
        <v-btn
          icon
          flat
          class="justify-end ma-2"
          color="primary"
          @click="closeDialog"
        >
          <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </v-sheet>
      <v-card-text>
        <div>
          <slot name="actions" />
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, type PropType, watch } from "vue";

export default defineComponent({
  name: "RmbDialog",
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: "Dialog Title",
    },
  },
  emits: ["update:modelValue", "close"],
  setup(props, { emit }) {
    const isVisible = ref(props.modelValue);

    watch(
      () => props.modelValue,
      (newVal) => {
        isVisible.value = newVal;
      }
    );

    const closeDialog = () => {
      isVisible.value = false;
      emit("update:modelValue", false);
      emit("close");
    };

    return {
      isVisible,
      closeDialog,
      title: props.title,
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
