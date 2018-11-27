// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
//import 'material-design-icons-iconfont/dist/material-design-icons.css' // Ensure you are using css-loader
//import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
//import '@fortawesome/fontawesome-free/css/all.css' // Ensure you are using css-loader

import Vue from "vue";
import VueTouch from 'vue-touch'
import App from "@/App.vue";
import router from "@/router";
import store from "@/store";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import colors from "vuetify/es5/util/colors";
import i18n from "./i18n";

//import "@/stylus/main.styl"
import "@/main.css";

Vue.use(VueTouch);

//console.log('main.js i18n', i18n);
Vue.use(Vuetify, {
  theme: {
    // primary: colors.indigo.darken1, // #E53935
    primary: "#3b5375",
    titleWindow: "#4a6588",
    // minimizeWindowTaskbar: colors.indigo.darken3,
    minimizeWindowTaskbar: "#293c56",
    btnTaskbar: "#293c56",
    btnReload: colors.blue.lighten1,
    btnLogout: colors.red.darken1,
    secondary: colors.red.lighten4, // #FFCDD2
    accent: colors.indigo.base // #3F51B5
  }
});

Vue.config.productionTip = false;

/* eslint-disable no-new */
//var dictonary = dictonaryfdfdf || [];
//console.log('main.js dictonary 1', dictonary);
//console.log('main.js dictonaryfdfdf 1', dictonaryfdfdf);
jQuery(document).ready(function () {
  //console.log('main.js dictonary 2', dictonary);
  //console.log('main.js dictonaryfdfdf 2', dictonaryfdfdf);
  new Vue({
    el: "#app",
    router,
    store,
    components: { App },
    i18n,
    template: "<App/>"
  });
});
