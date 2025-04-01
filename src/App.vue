<template>
  <main v-if="!loading">
    <div v-if="user">
      <!-- Authenticated: show your actual app -->
      <Todos />
    </div>
    <div v-else>
      <!-- Not authenticated: show login button -->
      <button @click="signIn">Sign In</button>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { userManager, signOutRedirect } from './auth';
import Todos from './components/Todos.vue';
import type { User } from 'oidc-client-ts';

export default defineComponent({
  components: { Todos },
  setup() {
    const user = ref<User | null>(null);
    const loading = ref<boolean>(true);

    const signIn = async (): Promise<void> => {
      await userManager.signinRedirect();
    };

    const signOut = async (): Promise<void> => {
      await signOutRedirect();
    };

    onMounted(async (): Promise<void> => {
      try {
        if (
          window.location.search.includes('code=') ||
          window.location.hash.includes('id_token')
        ) {
          await userManager.signinCallback();
          window.history.replaceState({}, '', '/');
        }

        const currentUser = await userManager.getUser();
        user.value = currentUser && !currentUser.expired ? currentUser : null;
      } catch (e) {
        console.warn('Auth error', e);
        user.value = null;
      } finally {
        loading.value = false;
      }
    });

    return {
      user,
      loading,
      signIn,
      signOut
    };
  }
});
</script>
