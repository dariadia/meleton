<template>
  <v-app class="text-center">
    <v-container class="text-h1 mb-4" v-if="error.statusCode === 404">
      {{ pageNotFound }}
    </v-container>
    <v-container class="text-h1 mb-4" v-else>
      {{ otherError }}
    </v-container>
    <NuxtLink to="/">Home page</NuxtLink>
  </v-app>
</template>

<script>
export default {
  name: 'EmptyLayout',
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred'
    }
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return { title }
  }
}
</script>
