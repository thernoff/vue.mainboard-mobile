export default {
  state: {
    interfaces: []
  },
  mutations: {
    setInterfaces(state, data) {
      state.interfaces = data;
    }
  },
  actions: {},
  getters: {
    interfaces(state) {
      return state.interfaces;
    }
  }
};
