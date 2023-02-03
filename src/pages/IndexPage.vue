<template>
  <q-page class="row items-center justify-center">
    <q-tab-panels v-model="store.tab" animated>
      <q-tab-panel name="action" class="q-pa-sm">
        <div class="row justify-center">
          <div
            v-for="button in buttons"
            :key="button.name"
            class="col-6 col-md-4 q-pa-xs"
          >
            <q-btn
              class="full-width self-stretch"
              size="lg"
              color="indigo-9"
              style="height: 150px"
              @click="track(button.name)"
              push
              stack
              glossy
            >
              <div class="row items-center full-width">
                <div class="col-4">
                  <q-icon :name="button.icon" size="xl" />
                </div>
                <div class="col-8">
                  <div>{{ button.name }}</div>
                  <div class="text-subtitle2 text-grey text-lowercase">
                    {{ checkLast(button.name) }}
                    ago
                  </div>
                </div>
              </div>
            </q-btn>
          </div>
        </div>
      </q-tab-panel>
      <q-tab-panel name="stats">
        <div class="row justify-center" style="margin-bottom: 72px">
          <!-- {{ tracking }} -->
          <div class="col-12">
            <div class="text-h4 text-center">
              Last Reset: <br />{{ timeBetween(resetTime) }} ago
            </div>
          </div>
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
                      {{ getSinceLastReset(i) }}
                    </div>
                    <div class="text-subtitle2 text-center text-grey">
                      Since Last Reset
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
        <q-card
          class="fixed"
          style="
            bottom: 72px;
            left: 0px;
            width: 100%;
            border-top: solid 1px #ddd;
            border-radius: 0;
          "
          flat
        >
          <q-card-section>
            <q-btn class="full-width" color="indigo-9" @click="resetTimer"
              >Reset</q-btn
            >
          </q-card-section>
        </q-card>
      </q-tab-panel>
      <q-tab-panel name="settings">
        <div class="row" style="width: calc(100vw - 32px)">
          <div class="col full-width">
            <div class="text-h2 q-pb-lg">Options</div>
            <div class="text-h6">Current User: {{ current_user.email }}</div>
            <q-btn @click="logOut">Sign Out</q-btn>
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
import { Button } from 'components/models';
import { computed, onMounted, reactive, ref, watchEffect } from 'vue';
import { useTabStore } from 'src/stores/tab-store';
import { supabase } from 'src/lib/supabaseClient';

const store = useTabStore();

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
    store.setAlertMessage(`Something went wrong, ${error}`, 'error');
  } else {
    store.setAlertMessage(`${name} was tracked successfully`, 'success');
  }
};

const checkLast = (name: string) => {
  const last_time = tracking.value[name];
  // console.log(last_time);
  if (!last_time[0]) return 'N/A';

  last_time.sort((a: string, b: string) => new Date(b) - new Date(a));

  return timeBetween(last_time[0]);
};

const timeBetween = (start_date: string) => {
  const start = new Date(start_date).getTime();
  const end = new Date().getTime();

  const time_between = Math.abs(end - start);
  const minutes = Math.floor(time_between / 1000 / 60) + 'm';
  const hoursExact = time_between / 1000 / 60 / 60;

  const hours =
    Math.floor(hoursExact) +
    'h ' +
    Math.floor((hoursExact - Math.floor(hoursExact)) * 60) +
    'm';

  return time_between < 1000 * 60
    ? '1m'
    : time_between < 1000 * 60 * 60
    ? minutes
    : hours;
};

const resetTime = ref('');

const resetTimer = async () => {
  const current_time = new Date();

  const { error } = await supabase.from('resets').insert({
    created_at: current_time,
    user_id: (await user).data.user?.id,
  });

  if (error) {
    console.log(error);
    store.setAlertMessage(`Something went wrong, ${error}`, 'error');
  } else {
    resetTime.value = current_time;
    store.setAlertMessage('Reset was successfully', 'success');
  }
};

const get24hrs = reactive((name: string) => {
  const last24 = tracking.value[name].filter((t) => {
    return new Date(t).getTime() > Date.now() - 24 * 60 * 60 * 1000;
  });
  return last24.length;
});

const getSinceLastReset = reactive((name: string) => {
  const last24 = tracking.value[name].filter((t) => {
    return new Date(t).getTime() > new Date(resetTime.value).getTime();
  });
  return last24.length;
});

const doubleDigit = (num) => {
  return num < 10 ? '0' + num : num;
};

const getReadableTime = reactive((time: string) => {
  if (time == '') return 'No time set';
  const read = new Date(time);
  return `${read.toDateString()} ${doubleDigit(read.getHours())}:${doubleDigit(
    read.getMinutes()
  )}`;
});

const statOpen = ref<boolean[]>([]);

const logOut = async () => {
  store.doneLoading('/login');
  await supabase.auth.signOut();
  store.loggedOut();
};

const user = supabase.auth.getUser();

const current_user = ref();

onMounted(async () => {
  store.doneLoading();
  const active_user = (await user).data.user;
  current_user.value = active_user;
  watchEffect(async () => {
    if (!active_user) {
      console.log('user', active_user);

      store.doneLoading('/login');
    } else {
      store.loggedIn();
    }
  });

  const { data: trackerData } = await supabase
    .from('trackers')
    .select('*')
    .eq('user_id', active_user?.id);

  const { data: resetData } = await supabase
    .from('resets')
    .select('*')
    .eq('user_id', active_user?.id)
    .order('created_at', { ascending: false })
    .limit(1);

  trackerData?.map((d) => {
    tracking.value[d.name].push(d.created_at);
  });

  if (resetData[0]) {
    resetTime.value = resetData[0].created_at;
  }
});
</script>
