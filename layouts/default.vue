<template>
  <v-app>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed">
      <span>
        {{ new Date().getFullYear() }} ft.
        <NuxtLink class="text-decoration-none" to="https://github.com/dariadia/" target="_blank" rel="noopener">
          &copy;dariadia
        </NuxtLink>
      </span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {
      fixed: false,
      title: 'Vuetify.js'
    }
  }
}
</script>
