import Vue from "vue";
import Vuex from "vuex";
import desktop from "@/store/desktop.js";
import interfaces from "@/store/interfaces.js";
import shared from "@/store/shared.js";
import startmenu from "@/store/startmenu.js";
import store from "@/store/store.js";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    shared,
    startmenu,
    store,
    desktop,
    interfaces
  },
  strict: process.env.NODE_ENV !== "production"
});
