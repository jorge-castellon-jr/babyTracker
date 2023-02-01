import { defineStore } from 'pinia';

export const useTabStore = defineStore('tab', {
  state: () => ({
    tab: 'action',
    loading: true,
    alert: false,
    alertMessage: '',
    alertType: '',
    isLoggedIn: false,
  }),
  getters: {
    currentTab: (state) => state.tab,
  },
  actions: {
    changeTab(tab: string) {
      this.tab = tab;
    },
    doneLoading() {
      this.loading = true;
      setTimeout(() => (this.loading = false), 750);
    },
    setAlertMessage(message: string, type = '') {
      this.alertMessage = message;
      this.alertType = type;
      this.alert = true;
    },
    loggedIn() {
      this.isLoggedIn = true;
    },
    loggedOut() {
      this.isLoggedIn = false;
    },
  },
});
