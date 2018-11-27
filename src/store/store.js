import axios from "axios";

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

export default {
  state: {
    topPrevShortcut: 5,
    leftPrevShortcut: 5,
    stepShift: 120,
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
        zIndex: 1,
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

    updateWindowTitle(state, options) {
      const id = options.id;
      let window = state.windows.find(window => {
        return window.id === id;
      });
      window.title = options.title;
    },

    minimizeWindows(state) {
      state.activeWorkspace.windows.forEach(function (window) {
        window.minimize = true;
      });
    },

    restoreMinimizeWindows(state, arrIndexesWindowsRestore) {
      arrIndexesWindowsRestore.forEach(
        index => (state.activeWorkspace.windows[index].minimize = false)
      );
    },

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

      for (let i = 0; i < state.windows.length; i++) {
        if (id === state.windows[i].id) {
          state.windows.splice(i, 1);
        }
      }
    },

    closeAllWindows(state) {
      state.activeWindow = null;
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
          id === state.activeWindow.id &&
          state.activeWindow.active
        ) {
          return;
        }

        if (id != "") {
          if (state.activeWindow !== null) {
            state.activeWindow.active = false;
          }

          state.activeWindow = state.windows.find(window => {
            return window.id === id;
          });
        } else {
          for (let i = 0; i < state.windows.length; i++) {
            if (state.windows[i].active) {
              state.activeWindow = state.windows[i];
              break;
            }
          }
          if (!state.activeWindow) {
            state.activeWindow = state.windows[0];
          }
          console.log("setActiveWindow state.activeWindow 1", state.activeWindow);
        }

        console.log("setActiveWindow state.activeWindow 2", state.activeWindow);
        state.activeWindow.active = true;
      } else {
        state.activeWindow = null;
      }

      /* if (state.activeWindow) {
        state.maxZIndex += 1;
        const zIndex = state.activeWindow.zIndex;
        state.windows.forEach(function (window) {
          if (window.zIndex > zIndex) {
            window.zIndex -= 1;
          }
        });
        state.activeWindow.zIndex = state.windows.length + 1;
      } */
    },

    unsetActiveWindow(state) {
      state.activeWindow.active = false;
      state.windows.some((window, index) => {
        if (!window.minimize) {
          console.log("index", index);
          state.activeWindow = window;
          state.activeWindow.active = true;
          return true;
        }
      });

      /* if (state.activeWindow) {
        state.maxZIndex += 1;
        const zIndex = state.activeWindow.zIndex;
        state.windows.forEach(function (window) {
          if (window.zIndex > zIndex) {
            window.zIndex -= 1;
          }
        });
        state.activeWindow.zIndex = state.windows.length;
      } */
    },

    setNotActiveWindows(state) {
      state.windows.forEach(function (window) {
        window.active = false;
      });
      state.activeWindow = null;
    },

    setUser(state, data) {
      state.user = data;
    },

    saveUser(state, user) {
      state.user.email = user.email;
    }
  },

  actions: {
    actionInit({ state, commit }, windows) {
      commit("setWindows", windows);
      commit("setActiveWindow");
    },

    actionGetDashboard({ commit, state, dispatch }) {
      commit("setWindows", []);
      axios
        .get("/extusers/fpage/desktopmobile/")
        .then(response => {
          //console.log("response", response.data);
          // Массив данных для отображения стартового меню
          const dashboard = response.data.dashboard;
          if (dashboard && dashboard.length > 0) {
            commit("setStartmenuItems", dashboard);
          }

          const user = response.data.user;
          if (user) {
            commit("setUser", user);
          }

          const interfaces = response.data.interfaces;
          if (interfaces && interfaces.length > 0) {
            commit("setInterfaces", interfaces);
          }

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
          if (process.env.NODE_ENV === "development") {
            const data = {
              status: 1,
              dashboard: [
                {
                  id: "17",
                  parent_id: "0",
                  server_id: "0",
                  user_id: "6",
                  access: null,
                  label: "\u0416\u0443\u0440\u043d\u0430\u043b\u044b",
                  image: null,
                  link: null,
                  visible: "1",
                  ordering: "1",
                  elements: [
                    {
                      id: "2",
                      parent_id: "17",
                      server_id: "1",
                      user_id: "6",
                      access: "vandalboxes",
                      label: "\u042f\u0449\u0438\u043a\u0438",
                      image:
                        "http://system.elxis.test/components/com_speedcams/images/vandal-proof.png",
                      link:
                        "http://system.elxis.test/inner.php/speedcams/vandalboxes/",
                      visible: "1",
                      ordering: "1",
                      type: "frame",
                      apiLink:
                        "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvdmFuZGFsYm94ZXMv"
                    },
                    {
                      id: "5",
                      parent_id: "17",
                      server_id: "1",
                      user_id: "6",
                      access: "joblog",
                      label:
                        "\u0416\u0443\u0440\u043d\u0430\u043b \u0440\u0430\u0431\u043e\u0442",
                      image:
                        "http://system.elxis.test/components/com_speedcams/images/diary.png",
                      link:
                        "http://system.elxis.test/inner.php/speedcams/joblog/",
                      visible: "1",
                      ordering: "2",
                      type: "frame",
                      apiLink:
                        "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvam9ibG9nLw,,"
                    }
                  ]
                },
                {
                  id: "16",
                  parent_id: "0",
                  server_id: "0",
                  user_id: "6",
                  access: null,
                  label:
                    "\u041a\u0430\u0442\u0435\u0433\u043e\u0440\u0438\u0438",
                  image: null,
                  link: null,
                  visible: "1",
                  ordering: "2",
                  elements: [
                    {
                      id: "6",
                      parent_id: "16",
                      server_id: "1",
                      user_id: "6",
                      access: "incident",
                      label:
                        "\u0418\u043d\u0446\u0438\u0434\u0435\u043d\u0442\u044b",
                      image:
                        "http://system.elxis.test/components/com_speedcams/images/incident.png",
                      link:
                        "http://system.elxis.test/inner.php/speedcams/incidents/",
                      visible: "1",
                      ordering: "1",
                      type: "frame",
                      apiLink:
                        "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvaW5jaWRlbnRzLw,,"
                    },
                    {
                      id: "8",
                      parent_id: "16",
                      server_id: "1",
                      user_id: "6",
                      access: "stationary",
                      label:
                        "\u041c\u043e\u043d\u0438\u0442\u043e\u0440\u0438\u043d\u0433 \u0441\u0442\u0430\u0446\u0438\u043e\u043d\u0430\u0440\u043e\u0432",
                      image:
                        "http://system.elxis.test/components/com_speedcams/images/stationary.png",
                      link:
                        "http://system.elxis.test/inner.php/speedcams/stationary/",
                      visible: "1",
                      ordering: "2",
                      type: "frame",
                      apiLink:
                        "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvc3RhdGlvbmFyeS8,"
                    }
                  ]
                },
                {
                  id: "1",
                  parent_id: "0",
                  server_id: "1",
                  user_id: "6",
                  access: null,
                  label: "Speedcams",
                  image: null,
                  link: null,
                  visible: "1",
                  ordering: "3",
                  elements: [
                    {
                      id: "3",
                      parent_id: "1",
                      server_id: "1",
                      user_id: "6",
                      access: "dtp",
                      label: "\u0414\u0422\u041f",
                      image:
                        "http://system.elxis.test/components/com_speedcams/images/dtp.png",
                      link: "http://system.elxis.test/inner.php/speedcams/dtp/",
                      visible: "1",
                      ordering: "1",
                      type: "frame",
                      apiLink:
                        "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvZHRwLw,,"
                    },
                    {
                      id: "19",
                      parent_id: "1",
                      server_id: "1",
                      user_id: "6",
                      access: "carinfo:view",
                      label:
                        "\u0421\u0435\u0440\u0432\u0438\u0441 \u0410\u0432\u0442\u043e-\u0418\u043d\u0444\u043e",
                      image:
                        "http://system.elxis.test/components/com_speedcams/images/carinfo.png",
                      link:
                        "http://system.elxis.test/inner.php/speedcams/carinfo/",
                      visible: "1",
                      ordering: "2",
                      type: "frame",
                      apiLink:
                        "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvY2FyaW5mby8,"
                    },
                    {
                      id: "20",
                      parent_id: "1",
                      server_id: "1",
                      user_id: "6",
                      access: "monitoring",
                      label:
                        "\u0422\u0435\u0445\u043d\u0438\u0447\u0435\u0441\u043a\u0438\u0439 \u043c\u043e\u043d\u0438\u0442\u043e\u0440\u0438\u043d\u0433",
                      image:
                        "http://system.elxis.test/components/com_speedcams/images/monitoring.png",
                      link:
                        "http://system.elxis.test/inner.php/speedcams/monitoring/",
                      visible: "1",
                      ordering: "3",
                      type: "frame",
                      apiLink:
                        "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvbW9uaXRvcmluZy8,"
                    },
                    {
                      id: "46",
                      parent_id: "1",
                      server_id: "1",
                      user_id: "6",
                      access: "guards:module",
                      label:
                        "\u041e\u0445\u0440\u0430\u043d\u043d\u0438\u043a\u0438",
                      image:
                        "http://system.elxis.test/components/com_speedcams/images/guard.png",
                      link:
                        "http://system.elxis.test/inner.php/speedcams/guards.html",
                      visible: "1",
                      ordering: "4",
                      type: "frame",
                      apiLink:
                        "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvZ3VhcmRzLmh0bWw,"
                    },
                    {
                      id: "47",
                      parent_id: "1",
                      server_id: "1",
                      user_id: "6",
                      access: "parkright",
                      label:
                        "\u041f\u0430\u0440\u043a\u0440\u0430\u0439\u0442\u044b",
                      image:
                        "http://system.elxis.test/components/com_speedcams/images/parkright.png",
                      link:
                        "http://system.elxis.test/inner.php/speedcams/parkrights/",
                      visible: "1",
                      ordering: "5",
                      type: "frame",
                      apiLink:
                        "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvcGFya3JpZ2h0cy8,"
                    },
                    {
                      id: "48",
                      parent_id: "1",
                      server_id: "1",
                      user_id: "6",
                      access: "timesheets_cameras",
                      label:
                        "\u0422\u0430\u0431\u0435\u043b\u0438 \u043f\u043e \u043a\u043e\u043c\u043f\u043b\u0435\u043a\u0441\u0430\u043c",
                      image:
                        "http://system.elxis.test/components/com_speedcams/images/timesheet.png",
                      link:
                        "http://system.elxis.test/inner.php/speedcams/timesheets/cameras/",
                      visible: "1",
                      ordering: "6",
                      type: "frame",
                      apiLink:
                        "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvdGltZXNoZWV0cy9jYW1lcmFzLw,,"
                    },
                    {
                      id: "49",
                      parent_id: "1",
                      server_id: "1",
                      user_id: "6",
                      access: "statistics:view",
                      label:
                        "\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043a\u0430",
                      image:
                        "http://system.elxis.test/components/com_speedcams/images/statistics.png",
                      link:
                        "http://system.elxis.test/inner.php/speedcams/statistics.html",
                      visible: "1",
                      ordering: "7",
                      type: "frame",
                      apiLink:
                        "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvc3RhdGlzdGljcy5odG1s"
                    },
                    {
                      id: "50",
                      parent_id: "1",
                      server_id: "1",
                      user_id: "6",
                      access: "employees:module",
                      label:
                        "\u0421\u043e\u0442\u0440\u0443\u0434\u043d\u0438\u043a\u0438",
                      image:
                        "http://system.elxis.test/components/com_speedcams/images/employees.png",
                      link:
                        "http://system.elxis.test/inner.php/speedcams/employees.html",
                      visible: "1",
                      ordering: "8",
                      type: "frame",
                      apiLink:
                        "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvZW1wbG95ZWVzLmh0bWw,"
                    },
                    {
                      id: "57",
                      parent_id: "1",
                      server_id: "1",
                      user_id: "6",
                      access: "cameras",
                      label:
                        "\u0413\u0435\u043e\u043b\u043e\u043a\u0430\u0446\u0438\u044f",
                      image:
                        "http://system.elxis.test/components/com_speedcams/images/geolocation.png",
                      link:
                        "http://system.elxis.test/inner.php/speedcams/cameras/",
                      visible: "1",
                      ordering: "9",
                      type: "frame",
                      apiLink:
                        "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvY2FtZXJhcy8,"
                    },
                    {
                      id: "58",
                      parent_id: "1",
                      server_id: "1",
                      user_id: "6",
                      access: "reports",
                      label: "\u041e\u0442\u0447\u0435\u0442\u044b",
                      image:
                        "http://system.elxis.test/components/com_speedcams/images/report.png",
                      link:
                        "http://system.elxis.test/inner.php/speedcams/reports/",
                      visible: "1",
                      ordering: "10",
                      type: "frame",
                      apiLink:
                        "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvcmVwb3J0cy8,"
                    },
                    {
                      id: "59",
                      parent_id: "1",
                      server_id: "1",
                      user_id: "6",
                      access: "moncomplex",
                      label:
                        "\u041c\u043e\u043d\u0438\u0442\u043e\u0440\u0438\u043d\u0433 \u043f\u0435\u0440\u0435\u0434\u0432\u0438\u0436\u043d\u044b\u0445 \u043a\u043e\u043c\u043f\u043b\u0435\u043a\u0441\u043e\u0432",
                      image:
                        "http://system.elxis.test/components/com_speedcams/images/mobile.png",
                      link:
                        "http://system.elxis.test/inner.php/speedcams/moncomplex/",
                      visible: "1",
                      ordering: "11",
                      type: "frame",
                      apiLink:
                        "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvbW9uY29tcGxleC8,"
                    },
                    {
                      id: "60",
                      parent_id: "1",
                      server_id: "1",
                      user_id: "6",
                      access: "violpayments:statuses",
                      label:
                        "\u0421\u0442\u0430\u0442\u0443\u0441\u044b \u043e\u0431\u0440\u0430\u0431\u043e\u0442\u043a\u0438/\u0432\u044b\u0433\u0440\u0443\u0437\u043a\u0438 \u043d\u0430\u0440\u0443\u0448\u0435\u043d\u0438\u0439",
                      image:
                        "http://system.elxis.test/components/com_speedcams/images/chart.png",
                      link:
                        "http://system.elxis.test/inner.php/speedcams/violations/statuses.html",
                      visible: "1",
                      ordering: "12",
                      type: "frame",
                      apiLink:
                        "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvdmlvbGF0aW9ucy9zdGF0dXNlcy5odG1s"
                    },
                    {
                      id: "62",
                      parent_id: "1",
                      server_id: "1",
                      user_id: "6",
                      access: "violpayments:analitics",
                      label:
                        "\u0410\u043d\u0430\u043b\u0438\u0442\u0438\u043a\u0430 \u043f\u043b\u0430\u0442\u0435\u0436\u0435\u0439 \u043e\u0442 \u0426\u0410\u0424\u0410\u041f",
                      image:
                        "http://system.elxis.test/components/com_speedcams/images/violpays_chart.png",
                      link:
                        "http://system.elxis.test/inner.php/speedcams/violpayments/analitics.html",
                      visible: "1",
                      ordering: "14",
                      type: "frame",
                      apiLink:
                        "http://system.elxis.test/inner.php/apiusers/api/login?uname=test2&pword=d58371c110100d4f9ff6d32aebdf6dc3d94c76c7&redirurl=aHR0cDovL3N5c3RlbS5lbHhpcy50ZXN0L2lubmVyLnBocC9zcGVlZGNhbXMvdmlvbHBheW1lbnRzL2FuYWxpdGljcy5odG1s"
                    }
                  ]
                }
              ],
              user: {
                firstname: "\u0412\u043b\u0430\u0434\u0438\u043c\u0438\u0440",
                lastname: "\u0414\u0443\u0434\u0438\u043a\u043e\u0432",
                uname: "test2",
                email: "test2@test.com",
                phone: "555-33-44",
                gid: 5
              },
              lang: "ru"
            };
            commit("setStartmenuItems", data.dashboard);

            dispatch("actionInit", []);

            const user = {
              firstname: "Владимир",
              lastname: "Дудиков",
              uname: "test2",
              email: "test2@test.com",
              phone: "555-33-44",
              gid: 5,
              idActiveInterface: 2
            };
            commit("setUser", user);

            const interfaces = [
              { id: 1, name: "Таблица" },
              { id: 2, name: "Десктоп" }
            ];
            commit("setInterfaces", interfaces);
          }
        });
    },

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


    actionMinimizeWindows({ commit }) {
      commit("minimizeWindows");
    },

    actionRestoreMinimizeWindows({ commit }, arrIndexesWindowsRestore) {
      commit("restoreMinimizeWindows", arrIndexesWindowsRestore);
    },

    actionCreateNewShortcut(
      { commit, state, rootState },
      { object, folderId, error }
    ) {
      const widthWorkspace = rootState.desktop.widthWorkspace;
      const heightWorkspace = rootState.desktop.heightWorkspace;
      const shortcuts = state.activeWorkspace.shortcuts;
      /*  const existShortcut = shortcuts.some(shortcut => {
         return object.id == shortcut.object.id;
       });   */

      //if (!existShortcut) {
      if (true) {
        commit("createNewShortcut", {
          object,
          folderId,
          widthWorkspace,
          heightWorkspace
        });

        if (rootState.desktop.modeGrid) {
          const shortcut = shortcuts[shortcuts.length - 1];
          let options = { id: shortcut.id };

          const widthCell = rootState.desktop.widthCell;
          const left = (shortcut.left / 100) * widthWorkspace;
          options.left = recalcCoordLeftForGridMode(left, widthCell, 0);

          const heightCell = rootState.desktop.heightCell;
          const top = (shortcut.top / 100) * heightWorkspace;
          console.log("actionCreateNewShortcut top", top);
          options.top = recalcCoordTopForGridMode(top, heightCell, 0);
          commit("updateShortcutCoords", {
            options,
            widthWorkspace,
            heightWorkspace
          });
        }
      } else {
        commit("setError", error);
        return null;
      }
      return shortcuts[shortcuts.length - 1];
    },

    actionSetActiveShortcut({ commit }, id) {
      commit("setActiveShortcut", id);
    },

    actionSetNotActiveShortcuts({ commit }) {
      commit("setNotActiveShortcuts");
    },

    actionUpdateOrderShortcuts({ commit }, data) {
      commit("updateOrderShortcuts", data);
    },

    actionSortShortcuts({ state, commit, rootState }) {
      const widthShortcut = state.widthShortcut;
      const heightShortcut = state.heightShortcut;
      const widthWorkspace = rootState.desktop.widthWorkspace;
      const heightWorkspace = rootState.desktop.heightWorkspace;
      commit("sortShortcuts", {
        widthShortcut,
        heightShortcut,
        widthWorkspace,
        heightWorkspace
      });
    },

    actionDeleteShortcut({ state, commit }, id) {
      const shortcut = state.activeWorkspace.shortcuts.find(shortcut => {
        return shortcut.id === id;
      });
      // Если удаляемый ярлык относится к папке, то удаляем все ярлыки, которые лежат в данной папке
      // (пока ярлык указывающий на папку и сама папка тождественно равны)
      if (shortcut.object.type === "folder") {
        state.activeWorkspace.shortcuts.forEach(s => {
          if (s.folderId === shortcut.object.id) {
            commit("deleteShortcut", s.id);
          }
        });
        // Удаляем саму папку на которую ссылается удаляемый ярлык
        commit("deleteFolder", shortcut.object.id);
      }

      commit("deleteShortcut", id);
    },

    actionUpdateShortcut({ commit }, data) {
      commit("updateShortcut", data);
    },

    actionUpdateShortcutCoords({ state, commit, rootState }, options) {
      const widthWorkspace = rootState.desktop.widthWorkspace;
      const heightWorkspace = rootState.desktop.heightWorkspace;

      commit("updateShortcutCoords", {
        options,
        widthWorkspace,
        heightWorkspace
      });

      if (rootState.desktop.modeGrid) {
        //const widthOneColumn = widthWorkspace / countColumns;
        const widthOneColumn = rootState.desktop.widthCell;

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

        //const heightOneRow = heightWorkspace / countRows;
        const heightOneRow = rootState.desktop.heightCell;

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

        commit("updateShortcutCoords", {
          options,
          widthWorkspace,
          heightWorkspace
        });

        /* setTimeout(function () {
          commit("updateShortcutCoords", {
            options,
            widthWorkspace,
            heightWorkspace
          });
          dispatch("actionSaveSettingsDesktop");
        }, 1); */
      } else {
        //dispatch("actionSaveSettingsDesktop");
      }

      //dispatch("actionSaveSettingsDesktop");
    },

    actionCreateNewFolder({ state, commit, rootState }, options) {
      const widthWorkspace = rootState.desktop.widthWorkspace;
      const heightWorkspace = rootState.desktop.heightWorkspace;
      const folder = options.folder;
      commit("createNewFolder", folder);
      commit("createNewShortcut", {
        object: state.folders[state.folders.length - 1],
        folderId: 0,
        widthWorkspace,
        heightWorkspace
      });

      if (rootState.desktop.modeGrid) {
        const shortcut =
          state.activeWorkspace.shortcuts[
          state.activeWorkspace.shortcuts.length - 1
          ];
        let options = { id: shortcut.id };

        const widthCell = rootState.desktop.widthCell;
        const left = (shortcut.left / 100) * widthWorkspace;
        options.left = recalcCoordLeftForGridMode(left, widthCell, 0);

        const heightCell = rootState.desktop.heightCell;
        const top = (shortcut.top / 100) * heightWorkspace;
        options.top = recalcCoordTopForGridMode(top, heightCell, 0);
        commit("updateShortcutCoords", {
          options,
          widthWorkspace,
          heightWorkspace
        });
      }
    },

    //actionDeleteFolder({ state, commit }, id) {},

    actionMoveElementToFolder({ commit }, data) {
      console.log("actionMoveElementToFolder data", data);
      commit("moveElementToFolder", data);
    },

    actionMoveElementFromFolderToDesktop({ commit }, data) {
      commit("moveElementFromFolderToDesktop", data);
    },

    actionSaveUser({ commit }, user) {
      axios({
        method: "post",
        headers: { "Content-Type": "application/form-data" },
        //url: 'http://esv.elxis.test/extusers/fpage/saveuser/',
        //url: window.location.href + "extusers/fpage/saveuser/",
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
    getWorkspaces(state) {
      return state.workspaces;
    },

    workspaces(state) {
      return state.workspaces;
    },

    getActiveWorkspace(state) {
      /* let activeWorkspace;
      for (let i = 0; i < state.workspaces.length; i++ ) {
        if ( state.workspaces[i].active ) {
          activeWorkspace = state.workspaces[i]
          break;
        }
      } */

      return state.activeWorkspace;
    },

    getWindowsActiveWorkspace(state) {
      /* let activeWorkspace;
      for (let i = 0; i < state.workspaces.length; i++ ) {
        if ( state.workspaces[i].active ) {
          activeWorkspace = state.workspaces[i]
          break;
        }
      } */

      return state.activeWorkspace.windows;
    },

    getTitleActiveWorkspace(state) {
      return state.activeWorkspace ? state.activeWorkspace.title : "";
    },

    shortcuts(state) {
      return state.activeWorkspace ? state.activeWorkspace.shortcuts : [];
    },

    indexActiveWorkspace(state) {
      return state.indexActiveWorkspace;
    },

    countWorkspaces(state) {
      return state.workspaces.length;
    },

    isActiveShortcut(state) {
      const activeShortcuts = state.activeWorkspace.shortcuts.filter(
        shortcut => shortcut.active
      );
      return activeShortcuts.length > 0 ? true : false;
    },

    shortcutById(state) {
      return id => {
        let shortcut = null;
        shortcut = state.activeWorkspace.shortcuts.find(
          shortcut => shortcut.id == id
        );
        return shortcut;
      };
    },

    widthCell({ rootState }) {
      return rootState.desktop.widthCell;
    },

    heightCell({ rootState }) {
      return rootState.desktop.heightCell;
    }
  }
};
