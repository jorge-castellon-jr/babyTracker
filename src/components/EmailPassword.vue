<template>
  <q-form @submit="$emit('submit', email, password)" class="row">
    <q-input
      v-model="email"
      type="email"
      label="Email"
      class="col-12 q-mb-md"
      filled
    />
    <q-input
      v-model="password"
      type="password"
      label="Password"
      class="col-12 q-mb-lg"
      filled
    />
    <q-btn
      class="full-width self-stretch"
      size="xl"
      color="indigo-9"
      type="submit"
      push
      stack
      glossy
    >
      {{ callToAction }}
    </q-btn>
  </q-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineEmits(['submit']);
defineProps<{
  callToAction: string;
}>();

const email = ref('');
const password = ref('');
</script>
