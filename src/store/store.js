import axios from "axios";
import { data } from "@/store/data/data.js"

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

function findWindowById(state, windowId) {
  const window = state.windows.find(window => {
    return window.id === windowId;
  });

  return window ? window : null;
}

export default {
  state: {
    windows: [],
    activeWindow: null,
    shortcuts: [],
    widthShortcut: 100,
    heightShortcut: 100,
    folders: [],
    dashboard: null,
    user: {
      firstname: "Guest",
      lastname: "Guest",
      uname: "guest",
      email: "",
      phone: "",
      gid: 7,
      idActiveInterface: 2
    }
  },

  mutations: {
    /***** WINDOWS *****/
    setWindows(state, windows) {
      state.windows = windows;
    },

    // Данная мутация создает новое окно
    createNewWindow(state, object) {
      console.log("createNewWindow from object", object);
      const title = object.title || object.label;
      const newWindow = {
        id: getRandomId(),
        title,
        zIndex: 1,
        minimize: false,
        fullscreen: true,
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
      console.log("createNewWindow new window", newWindow);
      state.windows.push(newWindow);
    },

    // Данная мутация обновляет свойства окна
    updateWindow(state, options) {
      console.log("updateWindow options", options);
      let window = findWindowById(state, options.id);
      window = Object.assign(window, options);
    },

    // Данная мутация изменяет заголовок окна
    updateWindowTitle(state, options) {
      let window = findWindowById(state, options.id);
      if (window) {
        window.title = options.title;
      }
    },

    // Данная мутация делает все окна свернутыми
    minimizeWindows(state) {
      state.activeWorkspace.windows.forEach(function (window) {
        window.minimize = true;
      });
    },

    // Данная мутация добавляет или удаляет css-класс у окна
    toggleClassWindow(state, { id, classCss }) {
      let window = findWindowById(state, id);
      let classesCss = window.classesCss;
      let i = classesCss.indexOf(classCss);
      if (i > -1) {
        classesCss.splice(i, 1);
      } else {
        classesCss.push(classCss);
      }
    },

    // Данная мутация закрывает окно по переданному идентификатору
    closeWindow(state, id) {
      state.activeWindow = null;

      for (let i = 0; i < state.windows.length; i++) {
        if (id === state.windows[i].id) {
          state.windows.splice(i, 1);
        }
      }
    },

    // Данная мутация закрывает все окна
    closeAllWindows(state) {
      state.activeWindow = null;
      state.windows = [];
    },

    // Данная мутация переключает полноэкранное отображение окна
    toggleFullscreenWindow(state, id) {
      let window = findWindowById(state, id);
      window.fullscreen = !window.fullscreen;
    },

    // Данная мутация раскрывает окно на весь экран
    expandFullscreenWindow(state, id) {
      let window = findWindowById(state, id);
      window.fullscreen = true;
    },

    // Данная мутация переводит раскрытое окно в обычный вид
    fullscreenWindowOff(state, id) {
      let window = findWindowById(state, id);
      window.fullscreen == false;
    },

    // Данная мутация устанавливает окно активным в зависимости от того передан идентификатор или нет
    setActiveWindow(state, id = "") {
      if (state.windows.length > 0) {
        if (
          id &&
          state.activeWindow &&
          id === state.activeWindow.id &&
          state.activeWindow.active
        ) {
          return;
        }

        if (id != "") {
          if (state.activeWindow !== null) {
            state.activeWindow.active = false;
          }
          state.activeWindow = findWindowById(state, id);
        } else {
          for (let i = 0; i < state.windows.length; i++) {
            if (state.windows[i].active) {
              state.activeWindow = state.windows[i];
              break;
            }
          }

          if (state.windows.length && !state.activeWindow) {
            state.activeWindow = state.windows[0];
          }
        }
        state.activeWindow.active = true;
      } else {
        state.activeWindow = null;
      }
    },

    // Данная мутация делает все окна не активными
    setNotActiveWindows(state) {
      state.windows.forEach(function (window) {
        window.active = false;
      });
      state.activeWindow = null;
    },

    // Данная мутация устанавливает пользовательские данные
    setUser(state, data) {
      state.user = data;
    },

    // Данная мутация сохраняет пользовательские данные в хранилище
    saveUser(state, user) {
      state.user.email = user.email;
    }
  },

  actions: {
    // Данный экшен получает данные с удаленного сервера и инициализирует с их помощью хранилище
    // Запускается в хуке жизненного цикла created в App.vue
    actionGetDashboard({ commit, state, dispatch }) {
      commit("setWindows", []);
      axios
        .get("/extusers/fpage/desktopmobile/")
        .then(response => {
          //console.log("response", response.data);

          // Массив данных для отображения стартового меню
          const startMenuItems = response.data.dashboard;
          if (startMenuItems && startMenuItems.length > 0) {
            commit("setStartmenuItems", startMenuItems);
          }

          // Установка данных текущего пользователя
          const user = response.data.user;
          if (user) {
            commit("setUser", user);
          }

          // Установка данных интерфейса
          /* const interfaces = response.data.interfaces;
          if (interfaces && interfaces.length > 0) {
            commit("setInterfaces", interfaces);
          } */

          const languages = response.data.languages;
          if (languages && languages.length > 0) {
            commit("setLanguages", languages);
          }

          if (response.data.settingsDesktop) {
            const windows = response.data.settingsDesktop.windows;
            if (windows && windows.length > 0) {
              commit("setWindows", windows);
              commit("setActiveWindow");
            }
          }
        })
        .catch(error => {
          console.log("error", error);
          // В режиме разработки заполняем хранилище тестовыми данными
          if (process.env.NODE_ENV === "development") {
            const dashboard = data.dashboard;
            commit("setStartmenuItems", dashboard);

            commit("setWindows", []);

            const user = data.user;
            commit("setUser", user);

            /* const interfaces = [
              { id: 1, name: "Таблица" },
              { id: 2, name: "Десктоп" }
            ];
            commit("setInterfaces", interfaces); */
          }
        });
    },

    // Данный экшен отправляет запрос на сохранение данных на удаленный сервер
    actionSaveSettingsDesktop({ state }) {
      const windows = state.windows;
      axios({
        method: "post",
        headers: { "Content-Type": "application/form-data" },
        url: "/extusers/fpage/savedesktopmobile/",
        data: {
          settings: { windows }
        }
      })
        .then(response => {
          console.log("response", response);
        })
        .catch(error => {
          console.log("error", error);
        });
    },

    // Данный экшен создает новое окно
    actionCreateNewWindow({ state, commit, rootState }, object) {

      let window = null;
      // Если существует окно, которое отображает переданный объект (фрейм или папка), то делаем его активным
      // иначе создаем новое окно для отображения переданного объекта (object)
      window = state.windows.find(window => window.object.id === object.id);
      if (window) {
        commit("setActiveWindow", window.id);
      } else {
        commit("setNotActiveWindows");
        commit("createNewWindow", object);
        window = state.windows[state.windows.length - 1];
        commit("setActiveWindow", window.id);
      }
      return window;
    },

    // Данный экшен закрывает окно по переданному идентификатору и устанавливает активным первое не свернутое окно
    actionCloseWindow({ state, commit }, id) {
      commit("closeWindow", id);
      commit("setActiveWindow");
    },

    /* actionSetActiveWindow({ commit }) {
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
    }, */

    // Данный экшен изменяет свойства окна
    actionUpdateWindow({ commit }, options) {
      commit("updateWindow", options);
    },


    /* actionMinimizeWindows({ commit }) {
      commit("minimizeWindows");
    }, */

    /* actionRestoreMinimizeWindows({ commit }, arrIndexesWindowsRestore) {
      commit("restoreMinimizeWindows", arrIndexesWindowsRestore);
    }, */

    actionSaveUser({ commit }, user) {
      axios({
        method: "post",
        headers: { "Content-Type": "application/form-data" },
        url: "/extusers/fpage/saveuser/",
        data: user
      })
        .then(response => {
          console.log("response", response);
          commit("saveUser", user);
        })
        .catch(error => {
          console.log("error", error);
          commit("saveUser", user);
        });
    }
  },
  getters: {
    widthCell({ rootState }) {
      return rootState.desktop.widthCell;
    },

    heightCell({ rootState }) {
      return rootState.desktop.heightCell;
    }
  }
};
