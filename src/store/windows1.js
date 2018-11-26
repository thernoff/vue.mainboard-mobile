function getRandomId() {
  var id = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 10; i++) {
    id += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  id += Math.floor(Date.now() / 1000);
  return id;
}

function recalcCoordLeftForGridMode(left, widthCell, diffLeft = 0) {
  if (diffLeft) {
    return Math.floor(left / widthCell) * widthCell;
  } else {
    return Math.round(left / widthCell) * widthCell;
  }
}

function recalcCoordTopForGridMode(top, heightCell, diffTop = 0) {
  if (diffTop) {
    return Math.floor(top / heightCell) * heightCell;
  } else {
    return Math.round(top / heightCell) * heightCell;
  }
}

import { CONST_STORE_WINDOW } from "@/const.js";

export default {
  state: {
    maxZIndex: 0,
    //topPrevWindow: 5, // значение координаты top окна в пикселях
    //leftPrevWindow: 5, // значение координаты left окна в пикселях
    topPrevWindow: CONST_STORE_WINDOW.TOP_PREV_WINDOW, // значение координаты top окна в процентах
    leftPrevWindow: CONST_STORE_WINDOW.LEFT_PREV_WINDOW, // значение координаты left окна в процентах
    //stepShift: 10, // сдвиг в пикселях
    stepShift: 1, // сдвиг в процентах
    indexActiveWindow: null,
    idActiveWindow: "",
    activeWindow: null,
    windows: [] // хранится ссылка на массив activeWorkspace.windows
  },
  mutations: {
    setWindows(state, windows) {
      state.windows = windows;
    },

    createNewWindow(state, object) {
      console.log("createNewWindow object", object);
      const title = object.title || object.label;
      const top = state.topPrevWindow > 0 ? state.topPrevWindow : 1;
      const left = state.leftPrevWindow > 0 ? state.leftPrevWindow : 1;
      const newWindow = {
        id: getRandomId(),
        title,
        top,
        left,
        width: 40,
        height: 45,
        zIndex: state.windows.length + 2,
        minimize: false,
        fullscreen: false,
        closed: false,
        active: true,
        classesCss: [],
        type: "window",
        object: {
          id: object.id,
          type: object.type || "frame"
        }
      };

      switch (object.type) {
        case "folder":
          break;
        default:
          newWindow.link = object.link;
          newWindow.apiLink = object.apiLink;
          newWindow.currentLink = object.link;
          newWindow.itemId = object.objectId;
          break;
      }

      const length = state.windows.push(newWindow);
      //state.activeWindow = state.windows[length - 1];
      state.indexActiveWindow = length - 1;

      state.topPrevWindow += state.stepShift;
      state.leftPrevWindow += state.stepShift;
    },

    updateWindow(state, options) {
      console.log("updateWindow options", options);
      const id = options.id;
      let window = state.windows.find(window => {
        return window.id === id;
      });
      window = Object.assign(window, options);
    },

    updateWindowCoords(state, { options, widthWorkspace, heightWorkspace }) {
      console.log("updateWindowCoords options", options);
      const id = options.id;
      let window = state.windows.find(window => {
        return window.id === id;
      });
      if (!window.fullscreen) {
        window.top = (+options.top / heightWorkspace) * 100;
        window.left = (+options.left / widthWorkspace) * 100;
        //state.topPrevWindow -= state.stepShift
        //state.leftPrevWindow -= state.stepShift
      }
    },

    updateWindowSize(state, options) {
      console.log("updateWindowSize options", options);
      const id = options.id;
      let window = state.windows.find(window => {
        return window.id === id;
      });
      if (!window.fullscreen) {
        window.width = +options.width;
        window.height = +options.height;
      }
    },

    updateWindowTitle(state, options) {
      const id = options.id;
      let window = state.windows.find(window => {
        return window.id === id;
      });
      window.title = options.title;
    },

    /* updateWindowApiLink(state, options) {
      let window = state.windows[options.index];
      window.apiLink = options.apiLink;
    }, */

    toggleClassWindow(state, { id, classCss }) {
      const window = state.windows.find(window => {
        return window.id === id;
      });
      let classesCss = window.classesCss;
      let i = classesCss.indexOf(classCss);
      if (i > -1) {
        classesCss.splice(i, 1);
      } else {
        classesCss.push(classCss);
      }
    },

    closeWindow(state, id) {
      state.activeWindow = null;
      state.indexActiveWindow = null;
      state.idActiveWindow = "";

      for (let i = 0; i < state.windows.length; i++) {
        if (id === state.windows[i].id) {
          state.topPrevWindow = state.windows[i].top;
          state.leftPrevWindow = state.windows[i].left;
          state.windows.splice(i, 1);
        }
      }

      state.topPrevWindow -= state.stepShift;
      state.leftPrevWindow -= state.stepShift;
    },

    closeAllWindows(state) {
      state.activeWindow = null;
      state.indexActiveWindow = null;
      state.idActiveWindow = "";

      state.windows = [];

      state.topPrevWindow = CONST_STORE_WINDOW.TOP_PREV_WINDOW;
      state.leftPrevWindow = CONST_STORE_WINDOW.LEFT_PREV_WINDOW;
    },

    minimizeWindow(state, id) {
      const window = state.windows.find(window => {
        return window.id === id;
      });

      window.minimize = true;
    },

    toggleMinimizeWindow(state, id) {
      const window = state.windows.find(window => {
        return window.id === id;
      });

      window.minimize = !window.minimize;
    },

    toggleFullscreenWindow(state, id) {
      const window = state.windows.find(window => {
        return window.id === id;
      });

      window.fullscreen = !window.fullscreen;
    },

    expandFullscreenWindow(state, id) {
      console.log("expandFullscreenWindow id", id)
      const window = state.windows.find(window => {
        return window.id === id;
      });

      window.fullscreen = true;
    },

    fullscreenWindowOff(state, id) {
      const window = state.windows.find(window => {
        return window.id === id;
      });

      window.fullscreen == false;
    },

    setActiveWindow(state, id = "") {
      if (state.windows.length > 0) {
        if (
          id &&
          state.activeWindow &&
          id === state.idActiveWindow &&
          state.activeWindow.active
        ) {
          //state.activeWindow.minimize = false;
          return;
        }

        if (id != "") {
          if (state.activeWindow !== null) {
            state.activeWindow.active = false;
          }

          state.activeWindow = state.windows.find(window => {
            return window.id === id;
          });
          state.idActiveWindow = state.activeWindow.id;
        } else {
          for (let i = 0; i < state.windows.length; i++) {
            if (state.windows[i].active) {
              state.activeWindow = state.windows[i];
              state.idActiveWindow = state.windows[i].id;
              break;
            }
          }

          if (!state.activeWindow || !state.idActiveWindow) {
            state.activeWindow = state.windows[0];
            state.idActiveWindow = state.windows[0].id;
          }
        }
        //state.activeWindow.minimize = false;
        state.activeWindow.active = true;
        console.log("setActiveWindow state.activeWindow", state.activeWindow);
      } else {
        state.activeWindow = null;
        state.idActiveWindow = "";
      }

      if (state.activeWindow) {
        state.maxZIndex += 1;
        const zIndex = state.activeWindow.zIndex;
        state.windows.forEach(function (window) {
          if (window.zIndex > zIndex) {
            window.zIndex -= 1;
          }
        });
        state.activeWindow.zIndex = state.windows.length + 1;
      }
    },

    unsetActiveWindow(state) {
      state.activeWindow.active = false;
      state.windows.some((window, index) => {
        if (!window.minimize) {
          console.log("index", index);
          state.activeWindow = window;
          state.activeWindow.active = true;
          state.idActiveWindow = state.activeWindow.id;
          return true;
        }
      });

      if (state.activeWindow) {
        state.maxZIndex += 1;
        const zIndex = state.activeWindow.zIndex;
        state.windows.forEach(function (window) {
          if (window.zIndex > zIndex) {
            window.zIndex -= 1;
          }
        });
        state.activeWindow.zIndex = state.windows.length;
      }
    },

    setNotActiveWindows(state) {
      state.windows.forEach(function (window) {
        window.active = false;
      });
      state.activeWindow = null;
      state.indexActiveWindow = null;
      state.idActiveWindow = "";
    }
  },
  actions: {
    actionCreateNewWindow({ state, commit, rootState }, object) {

      let window = null;
      window = state.windows.find(window => window.object.id === object.id);
      if (window) {
        console.log('actionCreateNewWindow old window', window);
        commit("setActiveWindow", window.id);
      } else {
        commit("setNotActiveWindows");
        commit("createNewWindow", object);
        console.log('actionCreateNewWindow new window from object', object);
        window = state.windows[state.windows.length - 1];
        commit("setActiveWindow", window.id);
      }
      return window;
    },

    actionCloseWindow({ state, commit }, id) {
      commit("closeWindow", id);

      let idActiveWindow = "";
      for (let i = 0; i < state.windows.length; i++) {
        if (!state.windows[i].minimize) {
          idActiveWindow = state.windows[i].id;
          break;
        }
      }

      commit("setActiveWindow", idActiveWindow); // устанавливаем первое не свернутое окно активным
    },

    actionSetActiveWindow({ commit }) {
      commit("setActiveWindow"); // устанавливаем первое окно активным
    },

    actionSetNotActiveWindows({ commit }) {
      commit("setNotActiveWindows");
    },

    actionSetWindows({ commit }, windows) {
      commit("setWindows", windows);
    },

    actionToggleWindows({ commit }, windows) {
      commit("toggleWindows", windows);
    },

    actionUpdateWindow({ commit }, options) {
      commit("updateWindow", options);
    },

    actionUpdateWindowCoords({ commit, dispatch, rootState }, options) {
      const widthWorkspace = rootState.desktop.widthWorkspace;
      const heightWorkspace = rootState.desktop.heightWorkspace;

      commit("updateWindowCoords", {
        options,
        widthWorkspace,
        heightWorkspace
      });

      if (rootState.desktop.modeGrid) {
        const widthWorkspace = rootState.desktop.widthWorkspace;
        //const widthOneColumn = widthWorkspace / countColumns;
        const widthOneColumn = rootState.desktop.widthCell;
        //const countColumns = rootState.desktop.countColumns;
        const countColumns = widthWorkspace / widthOneColumn;

        /* if (options.diffLeft) {
          options.left =
            Math.floor(options.left / widthOneColumn) * widthOneColumn;
        } else {
          options.left =
            Math.round(options.left / widthOneColumn) * widthOneColumn;
        } */

        options.left = recalcCoordLeftForGridMode(
          options.left,
          widthOneColumn,
          options.diffLeft
        );

        const heightWorkspace = rootState.desktop.heightWorkspace;
        //const heightOneRow = heightWorkspace / countRows;
        const heightOneRow = rootState.desktop.heightCell;
        //const countRows = rootState.desktop.countRows;
        const countRows = heightWorkspace / heightOneRow;

        /* if (options.diffTop) {
          options.top = Math.floor(options.top / heightOneRow) * heightOneRow;
        } else {
          options.top = Math.round(options.top / heightOneRow) * heightOneRow;
        } */

        //options.top = Math.floor(options.top / heightOneRow) * heightOneRow;
        options.top = recalcCoordTopForGridMode(
          options.top,
          heightOneRow,
          options.diffTop
        );

        options.width = (100 * options.width) / widthWorkspace;
        options.height = (100 * options.height) / heightWorkspace;

        const widthColumnPercent = 100 / countColumns;
        options.width =
          Math.ceil(options.width / widthColumnPercent) * widthColumnPercent;

        if (options.width > 100) {
          options.width = 100;
        }

        const heightRowPercent = 100 / countRows;
        options.height =
          Math.ceil(options.height / heightRowPercent) * heightRowPercent;

        if (options.height > 100) {
          options.height = 100;
        }

        /* commit("updateWindowSize", options);
        commit("updateWindowCoords", {
          options,
          widthWorkspace,
          heightWorkspace
        }); */

        setTimeout(function () {
          commit("updateWindowSize", options);
          commit("updateWindowCoords", {
            options,
            widthWorkspace,
            heightWorkspace
          });
          dispatch("actionSaveSettingsDesktop");
        }, 1);
      } else {
        dispatch("actionSaveSettingsDesktop");
      }
    },

    actionUpdateWindowSize({ commit, dispatch, rootState }, options) {
      const widthWorkspace = rootState.desktop.widthWorkspace;
      const heightWorkspace = rootState.desktop.heightWorkspace;
      options.width =
        (100 * options.width) / widthWorkspace <= 100
          ? (100 * options.width) / widthWorkspace
          : 100;
      options.height =
        (100 * options.height) / heightWorkspace <= 100
          ? (100 * options.height) / heightWorkspace
          : 100;
      commit("updateWindowCoords", {
        options,
        widthWorkspace,
        heightWorkspace
      });
      commit("updateWindowSize", options);
      if (rootState.desktop.modeGrid) {
        const widthWorkspace = rootState.desktop.widthWorkspace;
        //const widthOneColumn = widthWorkspace / countColumns;
        const widthOneColumn = rootState.desktop.widthCell;
        //const countColumns = rootState.desktop.countColumns;
        const countColumns = widthWorkspace / widthOneColumn;

        if (options.diffLeft) {
          options.left =
            Math.floor(options.left / widthOneColumn) * widthOneColumn;
        } else {
          options.left =
            Math.round(options.left / widthOneColumn) * widthOneColumn;
        }

        const heightWorkspace = rootState.desktop.heightWorkspace;
        //const heightOneRow = heightWorkspace / countRows;
        const heightOneRow = rootState.desktop.heightCell;
        //const countRows = rootState.desktop.countRows;
        const countRows = heightWorkspace / heightOneRow;

        if (options.diffTop) {
          options.top = Math.floor(options.top / heightOneRow) * heightOneRow;
        } else {
          options.top = Math.round(options.top / heightOneRow) * heightOneRow;
        }

        const widthColumnPercent = 100 / countColumns;
        options.width =
          Math.ceil(options.width / widthColumnPercent) * widthColumnPercent;

        if (options.width > 100) {
          options.width = 100;
        }

        const heightRowPercent = 100 / countRows;
        options.height =
          Math.ceil(options.height / heightRowPercent) * heightRowPercent;

        if (options.height > 100) {
          options.height = 100;
        }

        /* commit("updateWindowCoords", {
          options,
          widthWorkspace,
          heightWorkspace
        });
        commit("updateWindowSize", options); */

        //console.log('actionUpdateWindowSize', options.width)
        setTimeout(function () {
          commit("updateWindowCoords", {
            options,
            widthWorkspace,
            heightWorkspace
          });
          commit("updateWindowSize", options);
          dispatch("actionSaveSettingsDesktop");
        }, 1);
      } else {
        dispatch("actionSaveSettingsDesktop");
      }
    }
  },
  getters: {
    indexActiveWindow(state) {
      return state.indexActiveWindow;
    },

    windows(state) {
      console.log("state.windows", state.windows);
      return state.windows;
    },

    frameWindows(state) {
      return state.windows.filter(window => {
        return !("type" in window) || window.object.type === "frame";
      });
    },

    folderWindows(state) {
      return state.windows.filter(window => {
        return window.object.type === "folder";
      });
    },

    getMinimizeWindows(state) {
      return state.windows.filter(window => {
        return window.minimize;
      });
    },

    isActiveWindow(state) {
      return state.indexActiveWindow !== null ? true : false;
    }
  }
};
