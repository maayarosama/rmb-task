import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles"; // Vuetify styles
import "./assets/main.css"; // Your custom styles
import { createPinia } from "pinia";

const app = createApp(App);

app.use(router);
app.use(vuetify);
app.use(createPinia());

app.mount("#app");
