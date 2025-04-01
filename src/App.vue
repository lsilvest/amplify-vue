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

export default defineComponent({
  components: { Todos },
  setup() {
    const user = ref(null);
    const loading = ref(true);

    const signIn = () => userManager.signinRedirect();
    const signOut = () => signOutRedirect();

    onMounted(async () => {
      try {
        // If returning from Cognito, parse token
        if (window.location.search.includes('code=') || window.location.hash.includes('id_token')) {
          await userManager.signinCallback();
          window.history.replaceState({}, '', '/'); // Clean up URL
        }

        user.value = await userManager.getUser();
      } catch (e) {
        console.warn('Auth error', e);
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
