export default {
  state: {
    languages: [],
    loading: false,
    error: null,
    openMenu: false
  },
  mutations: {
    setLanguages(state, data) {
      state.languages = data;
    },

    setLoading(state, data) {
      state.loading = data;
    },

    setError(state, data) {
      state.error = data;
    },

    clearError(state) {
      state.error = null;
    },

    toggleOpenMenu(state, open = undefined) {
      if (open !== undefined) {
        state.openMenu = !state.openMenu;
      } else {
        state.openMenu = open;
      }
    }
  },
  actions: {
    setLoading({ commit }, data) {
      commit("setLoading", data);
    },

    actionSetError({ commit }, data) {
      commit("setError", data);
    },

    actionClearError({ commit }) {
      commit("clearError");
    },

    actionToggleOpenMenu({ commit }, open) {
      commit("toggleOpenMenu", open);
    }
  },
  getters: {
    loading(state) {
      return state.loading;
    },

    error(state) {
      return state.error;
    },

    openMenu(state) {
      return state.openMenu;
    }
  }
};
