<template>
  <q-page class="row items-center justify-center">
    <q-card style="max-width: 400px">
      <q-card-section>
        <EmailPassword :call-to-action="cta" @submit="signCheck" />
        <div class="text-right text-grey-5 q-pt-sm">
          <q-btn @click="isSignUp = !isSignUp" flat>
            <span v-if="isSignUp"> Have an account? Log in instead </span>
            <span v-else> Create a new account </span>
          </q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue';
import EmailPassword from 'src/components/EmailPassword.vue';
import { useTabStore } from 'src/stores/tab-store';
import { supabase } from 'src/lib/supabaseClient';
import { AuthError } from '@supabase/gotrue-js';
import { useRouter } from 'vue-router';

const storeTab = useTabStore();
const router = useRouter();
// definePageMeta({
//   middleware: ['auth']
// })
const isSignUp = ref(false);
const cta = computed(() => (isSignUp.value ? 'Sign Up' : 'Login'));

const signCheck = (email: string, password: string) => {
  console.log('trying to sign in', email, password);
  if (isSignUp.value) {
    signUp(email, password);
  } else {
    login(email, password);
  }
};

const setError = (error: AuthError) => {
  storeTab.setAlertMessage(error.message, 'error');
  console.log('error', error);
};

const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });
  console.log('user', data);
  if (error) {
    setError(error);
  } else {
    storeTab.setAlertMessage('Comfirm email to continue', 'success');
  }
};
const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
  console.log('user', data);
  if (error) {
    setError(error);
  } else if (data.user) {
    storeTab.doneLoading('/');
    storeTab.loggedIn();
  }
};
const user = supabase.auth.getUser();
onMounted(() => {
  storeTab.doneLoading();
  watchEffect(async () => {
    const active_user = (await user).data.user;
    if (active_user) {
      console.log('user', active_user);

      storeTab.doneLoading('/');
      storeTab.loggedIn();
    }
  });
});
</script>
