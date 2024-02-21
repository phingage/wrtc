import { provideApolloClients } from '@vue/apollo-composable';

export default defineNuxtPlugin((nuxtApp) => {
  // @ts-expect-error nuxt-apollo module needs updated types
  provideApolloClients(nuxtApp.$apollo.clients);
});