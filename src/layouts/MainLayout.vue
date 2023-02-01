<template>
  <q-layout view="lHh Lpr fFf">
    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer v-if="storeTab.isLoggedIn">
      <q-tabs v-model="current_tab" class="bg-indigo-5" align="justify">
        <q-tab
          v-for="tab in tabs"
          :key="tab.name"
          :name="tab.name"
          :icon="tab.icon"
          :label="tab.label"
          @click="storeTab.changeTab(tab.name)"
        />
      </q-tabs>
    </q-footer>
    <loading-screen />
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useTabStore } from 'src/stores/tab-store';
import LoadingScreen from 'src/components/LoadingScreen.vue';

const storeTab = useTabStore();

const tabs = ref([
  { name: 'action', icon: 'mdi-checkbox-marked-outline', label: 'actions' },
  { name: 'stats', icon: 'mdi-chart-line', label: 'Data' },
  { name: 'settings', icon: 'mdi-cog', label: 'Options' },
]);
const current_tab = ref<string>('action');
</script>
