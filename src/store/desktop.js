export default {
  state: {
    modeGrid: true,
    countRows: 25,
    countColumns: 50,
    grid: [10, 5],
    widthGrid: 0,
    heightGrid: 0,
    widthWorkspace: 0,
    heightWorkspace: 0,
    widthCell: 25,
    heightCell: 25,
    showLeftSidebar: false
  },
  mutations: {
    setWidthGrid(state, widthGrid) {
      state.widthGrid = widthGrid;
    },

    setHeightGrid(state, heightGrid) {
      state.heightGrid = heightGrid;
    },

    setWidthWorkspace(state, widthWorkspace) {
      state.widthWorkspace = widthWorkspace;
    },

    setHeightWorkspace(state, heightWorkspace) {
      state.heightWorkspace = heightWorkspace;
    },

    setCountRows(state, heightCell) {
      state.countRows = Math.floor(state.heightWorkspace / heightCell);
      //console.log("state.countRows", state.countRows);
    },

    setCountColumns(state, widthCell) {
      state.countColumns = Math.floor(state.widthWorkspace / widthCell);
    },

    toggleModeGrid(state) {
      state.modeGrid = !state.modeGrid;
    },

    toggleShowLeftSidebar(state) {
      state.showLeftSidebar = !state.showLeftSidebar;
    }
  },

  getters: {
    getCountColumns(state) {
      return state.countColumns;
    },

    getCountRows(state) {
      return state.countRows;
    },

    getWidthGrid(state) {
      return state.widthGrid;
    },

    widthGrid(state) {
      return state.widthGrid;
    },

    getHeightGrid(state) {
      return state.heightGrid;
    },

    heightGrid(state) {
      return state.heightGrid;
    },

    isModeGrid(state) {
      return state.modeGrid;
    }
  }
};
