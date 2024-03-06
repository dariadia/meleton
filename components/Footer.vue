<template>
  <v-footer :absolute="!fixed">
    <v-container tag="span">
      {{ new Date().getFullYear() }} ft.
      <a class="text-decoration-none" :href="githubLink" target="_blank" rel="noopener">
        &copy;{{ githubName }}
      </a>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  data() {
    return {
      fixed: false,
      githubLink: "https://github.com/dariadia/",
      githubName: "dariadia",
    }
  }
}
</script>
