import colors from 'vuetify/es5/util/colors'

export default {
  ssr: false,
  head: {
    titleTemplate: '%s - meleton-test-task',
    title: 'Meleton: My Calendar',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  components: true,
  buildModules: [
    '@nuxtjs/vuetify',
  ],
  vuetify: {
    theme: {
      dark: false,
      themes: {
        light: {
          primary: colors.deepPurple.accent2,
          accent: colors.grey.darken4,
          secondary: colors.deepPurple.accent2,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  build: {}
}
