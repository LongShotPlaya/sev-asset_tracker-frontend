import { createApp } from "vue";
import App from "./App.vue";
import router from "./router.js";
import { loadingFonts, vuetify } from "./plugins/vuetify.js";

const startup = async () => {
    await loadingFonts;
    createApp(App).use(vuetify).use(router).mount("#app");
}

startup();