<template>
  <q-dialog v-model="storeTab.alert" position="bottom">
    <q-card style="width: 350px" :class="alertType">
      <q-card-section class="row items-center no-wrap">
        <q-icon name="error" size="md" class="q-pr-sm" />
        <!-- <div class="text-weight-bold q-pr-sm">{{ storeTab.alertType }}</div> -->
        <div class="text-grey-8">{{ storeTab.alertMessage }}</div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed } from 'vue';
import { useTabStore } from 'src/stores/tab-store';
const storeTab = useTabStore();

const alertType = computed(() => {
  let css = 'bg-';
  switch (storeTab.alertType) {
    case 'error':
      css += 'red-2';
      break;
    case 'success':
      css += 'green-2';
      break;

    default:
      css += '';
      break;
  }
  return css;
});
</script>

<style lang="scss" scoped></style>
