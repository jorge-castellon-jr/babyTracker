<template>
  <q-layout view="lHh Lpr fFf">
    <q-page-container>
      <router-view />
    </q-page-container>
    <MainAlert />
  </q-layout>
</template>

<script setup lang="ts">
import MainAlert from 'src/components/MainAlert.vue';
</script>
