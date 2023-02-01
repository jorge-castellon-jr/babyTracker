<template>
  <q-page class="row items-center justify-center">
    <q-tab-panels v-model="storeTab.tab" animated>
      <q-tab-panel name="action">
        <div class="row justify-center">
          <div
            v-for="button in buttons"
            :key="button.name"
            class="col-6 col-md-4 justify-center q-pa-sm"
          >
            <q-btn
              class="full-width self-stretch"
              size="xl"
              color="indigo-9"
              style="height: 150px"
              @click="track(button.name)"
              push
              stack
              glossy
            >
              <q-icon :name="button.icon" size="xl" />
              <div>{{ button.name }}</div>
            </q-btn>
          </div>
        </div>
      </q-tab-panel>
      <q-tab-panel name="stats">
        <div class="row justify-center">
          <!-- {{ tracking }} -->
          <div
            v-for="(stat, i) in tracking"
            :key="i"
            class="col-12 col-sm-6 col-md-4 justify-center q-pa-sm"
          >
            <q-card bordered flat @click="statOpen[i] = !statOpen[i]">
              <q-card-section>
                <div class="row">
                  <div class="col-6">
                    <div class="text-h2 text-center">
                      {{ get24hrs(i) }}
                    </div>
                    <div class="text-subtitle2 text-center text-grey">
                      Last 24 hours
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="text-h2 text-center">
                      {{ stat.length }}
                    </div>
                    <div class="text-subtitle2 text-center text-grey">
                      All Time
                    </div>
                  </div>
                </div>
              </q-card-section>
              <q-card-section>
                <div class="text-h5 text-center">{{ i }}</div>
              </q-card-section>
              <q-slide-transition>
                <div v-show="statOpen[i]">
                  <q-separator />
                  <q-card-section class="text-subitle2">
                    <q-list bordered separator>
                      <q-item v-for="time in stat" :key="time">
                        {{ getReadableTime(time) }}
                      </q-item>
                    </q-list>
                  </q-card-section>
                </div>
              </q-slide-transition>
            </q-card>
          </div>
        </div>
      </q-tab-panel>
      <q-tab-panel name="settings">
        <div class="row" style="width: calc(100vw - 32px)">
          <div class="col full-width">
            <div class="text-h2 q-pb-lg">Options</div>
            <q-btn @click="logOut">Sign Out</q-btn>
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
import { Button } from 'components/models';
import { onMounted, reactive, ref, watchEffect } from 'vue';
import { useTabStore } from 'src/stores/tab-store';
import { supabase } from 'src/lib/supabaseClient';
import { useRouter } from 'vue-router';

const storeTab = useTabStore();
const router = useRouter();

const buttons = ref<Button[]>([
  {
    name: 'Bottle Feeding',
    icon: 'mdi-baby-bottle',
  },
  {
    name: 'Breast Pumping',
    icon: 'mdi-air-horn',
  },
  {
    name: 'Nursing',
    icon: 'mdi-mother-nurse',
  },
  {
    name: 'Sleep',
    icon: 'mdi-sleep',
  },
  // {
  //   name: 'Medication',
  //   icon: 'mdi-pill',
  // },
  {
    name: 'Wet Diaper',
    icon: 'mdi-water',
  },
  {
    name: 'Dirty Diaper',
    icon: 'mdi-emoticon-poop',
  },
]);

const tracking = ref({
  'Bottle Feeding': [],
  'Breast Pumping': [],
  Nursing: [],
  Sleep: [],
  // Medication: [],
  'Wet Diaper': [],
  'Dirty Diaper': [],
});
const tracking_names = Object.getOwnPropertyNames(tracking.value);

const track = async (name: string) => {
  const current_time = new Date();

  let t = tracking.value;

  t[name].push(current_time);

  const { error } = await supabase.from('trackers').insert({
    name: name,
    created_at: current_time,
    user_id: (await user).data.user?.id,
  });

  if (error) {
    console.log(error);
  }
};

const get24hrs = reactive((name: string) => {
  const last24 = tracking.value[name].filter((t) => {
    return new Date(t).getTime() > Date.now() - 24 * 60 * 60 * 1000;
  });
  return last24.length;
});

const doubleDigit = (num) => {
  return num < 10 ? '0' + num : num;
};

const getReadableTime = reactive((time: string) => {
  const read = new Date(time);
  return `${read.toDateString()} ${doubleDigit(read.getHours())}:${doubleDigit(
    read.getMinutes()
  )}:${doubleDigit(read.getSeconds())}`;
});

const statOpen = ref<boolean[]>([]);

const logOut = async () => {
  storeTab.doneLoading();
  await supabase.auth.signOut();
  storeTab.loggedOut();
  router.push('/login');
};

const user = supabase.auth.getUser();
onMounted(async () => {
  storeTab.doneLoading();
  const active_user = (await user).data.user;
  watchEffect(async () => {
    if (!active_user) {
      console.log('user', active_user);

      storeTab.doneLoading();
      router.push('/login');
    } else {
      storeTab.loggedIn();
    }
  });

  const { data } = await supabase
    .from('trackers')
    .select('*')
    .eq('user_id', active_user?.id);
  console.log(data);
  data?.map((d) => {
    tracking.value[d.name].push(d.created_at);
  });
});
</script>
