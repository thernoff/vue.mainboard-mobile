<template>
  <v-app class="mainboard-mobile">
    <v-navigation-drawer
      :clipped="$vuetify.breakpoint.lgAndUp"
      v-model="drawer"
      app
      fixed
      temporary
      width="250"
      :style="{'zIndex': 100}"
    >
      <!-- <v-layout row>
        <v-flex xs12 sm6>
      <v-card>-->
      <v-list dense>
        <v-list-group
          v-for="category in categories"
          v-if="parseInt(category.visible)"
          :key="category.id"
        >
          <v-list-tile slot="activator">
            <i class="material-icons icon-folder">folder</i>
            <v-list-tile-content>
              <!-- <v-list-tile-title>
                      <i class="material-icons icon-folder">folder</i>
              </v-list-tile-title>-->
              <v-list-tile-title>
                <!-- <span class="short-label-category">{{ category.label }}</span> -->
                {{ category.label }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-touch
            v-for="element in category.elements"
            v-if="parseInt(element.visible)"
            ref="menuitem"
            :key="element.id"
            :data-id="element.id"
            :title="element.label"
            class="mainboard-startmenu__item"
            @tap="createNewWindow(element)"
          >
            <v-list-tile tag="a">
              <img :src="element.image" :style="{width: '25px', marginRight: '5px'}">
              <v-list-tile-content>
                <v-list-tile-title>{{ element.label }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-touch>
        </v-list-group>
      </v-list>
      <!--           </v-card>
        </v-flex>
      </v-layout>-->
    </v-navigation-drawer>

    <!--Компонент верхнего тулбара-->
    <v-toolbar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      dark
      color="primary"
      height="50"
      app
      fixed
    >
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>{{titleToolbar}}</v-toolbar-title>
      <v-spacer/>
      <v-toolbar-title>{{ shortNameUser }}</v-toolbar-title>

      <v-btn
        v-if="countWindows"
        icon
        color="info"
        @click.stop="dialogThumbWindows = !dialogThumbWindows"
      >
        <span class="count-opened-windows">{{countWindows}}</span>
      </v-btn>
      <v-btn icon color="red" @click="logout">
        <i class="material-icons">exit_to_app</i>
      </v-btn>
    </v-toolbar>

    <!--Компонент рабочей области (используется для отображения остальных компонентов)-->
    <v-content>
      <v-container fluid fill-height class="mainboard-mobile__content-container">
        <v-layout justify-center align-center>
          <mainboard-frame-window
            v-for="window in windows"
            v-show="window.active"
            :key="window.id"
            :id="window.id"
            :options="window"
            @contextmenu.stop.prevent="''"
          />
          <!-- <div
            class="mainboard-mobile__wallpaper"
            :style="{ backgroundImage: 'url('+ require('@/assets/logo-incom.png') +')' }"
          ></div>-->
          <div class="mainboard-mobile__wallpaper">
            <mainboard-demo-info-widget v-if="isDemo"/>
            <div
              class="mainboard-workspace__logo text-xs-center"
              :style="{ backgroundImage: 'url('+ require('@/assets/logo-incom.png') +')' }"
            ></div>
          </div>

          <!-- <mainboard-frame-window
            v-if="activeWindow"
            :key="activeWindow.id"
            :id="activeWindow.id"
            :options="activeWindow"
            @contextmenu.stop.prevent="''"
          />-->
        </v-layout>
      </v-container>
    </v-content>

    <!--Компонент для вывода ошибок-->
    <template v-if="error">
      <v-snackbar
        :multi-line="true"
        :timeout="3000"
        :value="true"
        color="error"
        @input="closeError"
      >
        {{ error }}
        <v-btn dark flat @click="closeError">{{ $t('close') }}</v-btn>
      </v-snackbar>
    </template>

    <!--Компонент окна лоадера загрузки-->
    <v-dialog v-model="dialogLoading" class="mainboard-loading" fullscreen hide-overlay persistent>
      <div class="mainboard-loading__container text-md-center">
        <v-layout align-center justify-center column fill-height>
          <div class="mainboard-loading__progress">
            <img src="@/assets/logo-incom-loading.png">
            <v-progress-linear :indeterminate="true" color="deep-orange"/>
          </div>
          <div class="mainboard-loading__title">
            <span>{{ $t("loading") }}</span>
          </div>
        </v-layout>
      </div>
    </v-dialog>
    <!--Диалоговое окно для отображения миниатюр-окон-->
    <v-dialog
      class="mainboard-list-thumbs"
      v-model="dialogThumbWindows"
      fullscreen
      hide-overlay
      persistent
      scrollable
    >
      <div class="mainboard-list-thumbs__container text-md-center">
        <v-container fluid grid-list-sm>
          <v-layout align-center justify-center row wrap fill-height>
            <v-btn
              class="mainboard-list-thumbs__btn-close"
              fab
              dark
              depressed
              color="red"
              outline
              @click="closeDialogListThumbs"
              @tap="closeDialogListThumbs"
            >
              <v-icon dark>close</v-icon>
            </v-btn>
          </v-layout>

          <v-layout row wrap align-center>
            <v-flex v-for="window in windows" :key="window.id" class="flex-window" xs4 sm3 md2 lg1>
              <div
                class="mainboard-thumb-window text-xs-center"
                :class="{'mainboard-thumb-window--active': window.active}"
                @click.stop="setActiveWindow(window.id)"
              >
                <!-- <v-card flat tile> -->
                <div class="mainboard-thumb-window__container">
                  <div class="thumb-window-title">
                    <img :src="getImageThumbWindow(window.object.id)" :style="{width: '40px'}">
                  </div>
                  <div class="thumb-window-body text-xs-center">
                    <span>{{window.title}}</span>
                  </div>
                </div>
                <v-btn
                  class="thumb-window-btn-close"
                  absolute
                  fab
                  dark
                  small
                  depressed
                  color="pink"
                  @click.stop="closeWindow(window.id)"
                  @tap.stop="closeWindow(window.id)"
                >
                  <v-icon dark>close</v-icon>
                </v-btn>
                <!-- </v-card> -->
              </div>
            </v-flex>
          </v-layout>
        </v-container>
      </div>
    </v-dialog>
  </v-app>
</template>

<script>
import Toolbar from "@/components/Desktop/Toolbar/Toolbar.vue";
import FrameWindow from "@/components/Desktop/Window/FrameWindow.vue";
import SideBar from "@/components/Desktop/SideBar/BaseSideBar.vue";
import Frame from "@/components/Desktop/Base/BaseFrame.vue";
import DemoInfoWidget from "@/components/Desktop/Widgets/DemoInfoWidget.vue";

import axios from "axios";

export default {
  name: "App",

  components: {
    mainboardToolbar: Toolbar,
    mainboardFrameWindow: FrameWindow,
    mainboardSideBar: SideBar,
    mainboardFrameWindow: FrameWindow,
    mainboardFrame: Frame,
    mainboardDemoInfoWidget: DemoInfoWidget
  },
  data() {
    return {
      dialogLoading: true,
      drawer: false,
      dialogThumbWindows: false,
      startThumbWindow: 0
    };
  },

  computed: {
    error() {
      return this.$store.getters.error;
    },

    categories() {
      return this.$store.getters.categories;
    },

    activeWindow() {
      return this.$store.state.store.windows.find(window => window.active);
    },

    windows() {
      return this.$store.state.store.windows;
    },

    thumbWindows() {
      if (Math.abs(this.countWindows - this.startThumbWindow) >= 3) {
        return this.windows.slice(
          this.startThumbWindow,
          this.startThumbWindow + 3
        );
      }
      return this.windows;
    },

    countWindows() {
      return this.windows.length;
    },

    user() {
      return this.$store.state.store.user;
    },

    shortNameUser() {
      return this.user.firstname[0].toUpperCase() + "." + this.user.lastname;
    },

    isDemo() {
      const position = window.location.href.search(/demo/);
      if (position > 0) {
        return true;
      }
      return false;
    },

    titleToolbar() {
      const title = document.title || "";
      return title ? title : "Incom";
    }
  },

  beforeCreate() {
    const dictonary = {};
    axios
      //.get(window.location.href + "extusers/fpage/dictonary/")
      .get("/extusers/fpage/dictonary/")
      .then(response => {
        const lang = response.data.lang;
        dictonary[lang] = response.data.dictonary;
        this.$i18n.setLocaleMessage(lang, dictonary[lang]);
        this.$i18n.locale = lang;
      });

    /* const promise = this.getDictonary();
    console.log("created promise", promise);
    promise.then(response => {
      console.log("response", response);
      this.$i18n.setLocaleMessage("ru", response["ru"]);
      this.$i18n.locale = "ru";
    }); */
  },

  created() {
    this.$store.dispatch("actionGetDashboard").then(() => {
      const self = this;
      setTimeout(() => {
        self.dialogLoading = false;
      }, 800);
    });
  },

  methods: {
    closeError() {
      this.$store.dispatch("actionClearError");
    },

    async getDictonary() {
      const dictonary = {};
      try {
        const response = await axios.get("/extusers/fpage/dictonary/");
        console.log("getDictonary response", response);
        dictonary[response.data.lang] = response.data.dictonary;
      } catch (error) {
        console.log("error", error);
      }

      return dictonary;
    },

    createNewWindow(element) {
      this.$store.dispatch("actionCreateNewWindow", element).then(response => {
        //this.$store.commit("closeAllWindow");
        this.drawer = false;
        this.$store.commit("expandFullscreenWindow", response.id);
        if (response.minimize) {
          this.$store.commit("toggleMinimizeWindow", response.id);
        }
        this.$store.dispatch("actionSaveSettingsDesktop");
      });
    },

    getImageThumbWindow(objectId) {
      const element = this.$store.getters.itemStartmenuById(objectId);
      if (element) {
        return element.image;
      }
      return "";
    },

    setActiveWindow(windowId) {
      this.dialogThumbWindows = false;
      this.$store.commit("setActiveWindow", windowId);
      this.$store.dispatch("actionSaveSettingsDesktop");
    },

    closeDialogListThumbs() {
      this.dialogThumbWindows = false;
    },

    closeWindow(windowId) {
      this.$store.dispatch("actionCloseWindow", windowId).then(() => {
        if (!this.countWindows) {
          this.dialogThumbWindows = false;
        }
        this.$store.dispatch("actionSaveSettingsDesktop");
      });
    },

    logout() {
      axios({
        method: "post",
        headers: { "Content-Type": "application/form-data" },
        url: "/inner.php/extusers/fpage/logout/"
      })
        .then(() => {
          window.location.href = "/";
        })
        .catch(error => {
          console.log("error", error);
        });
    },

    swipe(direction) {
      switch (direction) {
        case "left":
          if (this.startThumbWindow > 0) {
            this.startThumbWindow--;
          }
          break;
        case "right":
          if (this.startThumbWindow < this.countWindows) {
            this.startThumbWindow++;
          }
          break;
      }

      console.log("swipe this.startThumbWindow", this.startThumbWindow);
    }
  }
};
</script>

<style scoped>
.mainboard {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.mainboard-workspace {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.icon-folder {
  margin-right: 3px;
  color: #f58815;
}

.short-label-category {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.count-opened-windows {
  font-size: 18px;
}

.mainboard-startmenu__item:nth-child(2n) {
  background-color: rgba(208, 225, 245, 0.5);
}

.mainboard-loading__container {
  height: 100%;
  background-color: rgb(51, 60, 68);
  border-color: rgb(51, 60, 68);
}

.mainboard-loading__progress {
  width: 150px;
  text-align: center;
}

.mainboard-loading__title {
  font-size: 16px;
  color: #fff;
}

.mainboard-list-thumbs__container {
  width: 100%;
  height: 100%;
  background-color: rgba(37, 47, 68, 0.8);
  overflow: auto;
}

.mainboard-list-thumbs__btn-close {
  margin-bottom: 20px !important;
}

.flex-window {
  margin-bottom: 15px;
}

.mainboard-thumb-window {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto;
  background-color: #fff;
  border: 1px solid #e91e6293 !important;
  border-radius: 4px;
  webkit-box-shadow: 1px 3px 9px rgba(0, 0, 0, 0.3);
  box-shadow: 1px 3px 9px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
}

.mainboard-thumb-window--active {
  border: 4px solid #e91e63 !important;
}

.mainboard-thumb-window__container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.thumb-window-title {
  font-size: 12px;
  margin-top: 10px;
  margin-bottom: 2px;
}

.thumb-window-body {
  padding: 3px;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.thumb-window-btn-close {
  width: 35px !important;
  height: 35px !important;
  top: -10px;
  right: -10px;
}

.mainboard-mobile__wallpaper111 {
  position: absolute;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-position: center center;
  -moz-background-size: cover; /* Firefox 3.6+ */
  -webkit-background-size: cover; /* Safari 3.1+ и Chrome 4.0+ */
  -o-background-size: cover; /* Opera 9.6+ */
  background-size: cover;
  background-repeat: no-repeat;
}

.mainboard-mobile__wallpaper {
  position: relative;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow: hidden;
  /* background-position: 50% 50%; */
  background-position: center center;
  -moz-background-size: cover; /* Firefox 3.6+ */
  -webkit-background-size: cover; /* Safari 3.1+ и Chrome 4.0+ */
  -o-background-size: cover; /* Opera 9.6+ */
  background-size: cover;
  background-repeat: no-repeat;

  background-color: #657b9b;
  /* IE9, iOS 3.2+ */
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAxIDEiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjxyYWRpYWxHcmFkaWVudCBpZD0idnNnZyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGN4PSIwJSIgY3k9IjAlIiByPSIxNDEuNDIxMzU2MjM3MzA5NSUiPjxzdG9wIHN0b3AtY29sb3I9IiM5OWFmY2MiIHN0b3Atb3BhY2l0eT0iMSIgb2Zmc2V0PSIwIi8+PHN0b3Agc3RvcC1jb2xvcj0iIzMxNDc2YSIgc3RvcC1vcGFjaXR5PSIxIiBvZmZzZXQ9IjEiLz48L3JhZGlhbEdyYWRpZW50PjxyZWN0IHg9Ii01MCIgeT0iLTUwIiB3aWR0aD0iMTAxIiBoZWlnaHQ9IjEwMSIgZmlsbD0idXJsKCN2c2dnKSIgLz48L3N2Zz4=);
  /* Android 2.3- hack (needed for the actual radial gradient) */
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAxIDEiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjxyYWRpYWxHcmFkaWVudCBpZD0idnNnZyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGN4PSIwJSIgY3k9IjAlIiByPSIxNDEuNDIxMzU2MjM3MzA5NSUiPjxzdG9wIHN0b3AtY29sb3I9IiM5OWFmY2MiIHN0b3Atb3BhY2l0eT0iMSIgb2Zmc2V0PSIwIi8+PHN0b3Agc3RvcC1jb2xvcj0iIzMxNDc2YSIgc3RvcC1vcGFjaXR5PSIxIiBvZmZzZXQ9IjEiLz48L3JhZGlhbEdyYWRpZW50PjxyZWN0IHg9Ii01MCIgeT0iLTUwIiB3aWR0aD0iMTAxIiBoZWlnaHQ9IjEwMSIgZmlsbD0idXJsKCN2c2dnKSIgLz48L3N2Zz4=),
    -webkit-gradient(radial, left top, 0, left top, 723, color-stop(0, rgb(153, 175, 204)), color-stop(1, rgb(49, 71, 106)));
  /* Android 2.3 */
  background-image: -webkit-radial-gradient(
    left top,
    ellipse farthest-corner,
    rgb(153, 175, 204) 0%,
    rgb(49, 71, 106) 100%
  );
  /* IE10+ */
  background-image: radial-gradient(
    ellipse farthest-corner at left top,
    rgb(153, 175, 204) 0%,
    rgb(49, 71, 106) 100%
  );
  background-image: -ms-radial-gradient(
    left top,
    ellipse farthest-corner,
    rgb(153, 175, 204) 0%,
    rgb(49, 71, 106) 100%
  );
}

.mainboard-mobile__content-container {
  padding: 0px !important;
}

.mainboard-workspace__logo {
  position: relative;
  width: 100%;
  height: 100%;
  background-position: center center;
  background-repeat: no-repeat;
}
</style>
