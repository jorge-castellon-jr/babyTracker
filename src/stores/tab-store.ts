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
    doneLoading(to = '') {
      this.loading = true;
      setTimeout(() => ((this.loading = false), this.router.push(to)), 750);
      this.tab = 'action';
    },
    setAlertMessage(message: string, type = '') {
      this.alertMessage = message;
      this.alertType = type;
      this.alert = true;
      console.log('set to true');
      setTimeout(() => {
        this.alert = false;
        console.log('set to false');
      }, 3000);
    },
    loggedIn() {
      this.isLoggedIn = true;
    },
    loggedOut() {
      this.isLoggedIn = false;
    },
  },
});
