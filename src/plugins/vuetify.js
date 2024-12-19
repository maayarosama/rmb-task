// src/plugins/vuetify.js
import { createVuetify } from 'vuetify';
import 'vuetify/styles';

const vuetify = createVuetify({
  theme: {
    defaultTheme: "dark",
    themes: {
      dark: {
        dark: true,
        colors: {
          primary: "#1AA18F",
          secondary: "#74DDC3",
          title: "#7de3c8",
          info: "#7de3c8",
          warning: "#FFCC00",
          link: "#5695ff",
          anchor: "#ffffff",
        },
      },

    },
  },
});

export default vuetify;
