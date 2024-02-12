/**
 * Vuetify3 Plugin
 */
import { createVuetify } from "vuetify";
import { loadFonts } from "./webfontloader";// Misc
loadFonts();

// Styles
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

const myCustomLightTheme = {
  dark: false,
  colors: {
    primary: "#80162B",   //maroon
    secondary: "#E1E1E1", //silver
    accent: "#47121D",    //dark maroon
    success: "#47121D",   //dark maroon
    error: "#EE5044",     //light red
    teal: "#63BAC0",
    blue: "#196CA2",
    yellow: "#F8C545",
    darkblue: "#032F45",
  },
};

const vuetify = createVuetify({
  theme: {
    defaultTheme: "myCustomLightTheme",
    themes: {
      myCustomLightTheme,
    },
  },
  icons: {
    defaultSet: "mdi",
  },
});

export default vuetify;
