// src/plugins/vuetify.ts
import "@mdi/font/css/materialdesignicons.css"; // Ensure you are using css-loader
import "vuetify/styles"; // Vuetify styles
import { createVuetify } from "vuetify";

// Vuetify theme configuration (optional)
const vuetify = createVuetify({
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        colors: {
          primary: "green",
          secondary: "#424242",
        },
      },
    },
  },
});

export default vuetify;
