import { defineStore } from 'pinia';

export const useTabStore = defineStore('tab', {
  state: () => ({
    tab: 'action',
    loading: true,
  }),
  getters: {
    currentTab: (state) => state.tab,
  },
  actions: {
    changeTab(tab: string) {
      this.tab = tab;
    },
    doneLoading() {
      this.loading = false;
    },
  },
});
