<template>
  <v-app class="mainboard-mobile">
    <v-navigation-drawer
      :clipped="$vuetify.breakpoint.lgAndUp"
      v-model="drawer"
      :touchless="false"
      app
      fixed
      width=200
    >
      <v-list dense>
        <v-list-group
          v-for="category in categories"
          v-if="parseInt(category.visible)"
          :key="category.id"
        >
        <v-list-tile
          slot="activator"
        >
          <i class="material-icons icon-folder">folder</i>
          <v-list-tile-content>
            <v-list-tile-title>
              {{ category.label }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <div
          v-for="element in category.elements"
          v-if="parseInt(element.visible)"
          ref="menuitem"
          :key="element.id"
          :data-id="element.id"
          :title="element.label"
          class="mainboard-startmenu__item"
          @click="createNewWindow(element)"
          @tap="createNewWindow(element)"
          @touchstart="createNewWindow(element)"
        >
          <v-list-tile
            tag="a"
          >
            <img
              :src="element.image"
              :style="{width: '25px', marginRight: '5px'}"
            >
            <v-list-tile-content>
              <v-list-tile-title>
                {{ element.label }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </div>
      </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <!--Компонент верхнего тулбара-->
    <v-toolbar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      dark
      color="primary"
      height="40"
      app
      fixed
    >
      <v-toolbar-side-icon
        @click="drawer = !drawer"
      ></v-toolbar-side-icon>
      <v-toolbar-title>
        Incom
      </v-toolbar-title>
      <v-spacer/>
      <v-btn
        v-if="countWindows"
        icon
        color="info"
        @click="dialogListWindows = !dialogListWindows"
      >
        {{countWindows}}
      </v-btn>
    </v-toolbar>

    <!--Компонент рабочей области (используется для отображения остальных компонентов)-->
     <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center align-center>
          <mainboard-frame-window
            v-if="activeWindow"
            :key="activeWindow.id"
            :id="activeWindow.id"
            :options="activeWindow"
            @contextmenu.stop.prevent="''"
          />
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
        <v-btn
          dark
          flat
          @click="closeError"
        >
          {{ $t('close') }}
        </v-btn>
      </v-snackbar>
    </template>

    <!--Компонент окна лоадера загрузки-->
    <v-dialog
      v-model="dialogLoading"
      class="mainboard-loading"
      fullscreen
      hide-overlay
      persistent
    >
      <div class="mainboard-loading__container text-md-center">
        <v-layout
          align-center
          justify-center
          column
          fill-height
        >
          <div class="mainboard-loading__progress">
            <img
              src="@/assets/logo-incom-loading.png"
            >
            <v-progress-linear
              :indeterminate="true"
              color="deep-orange"
            />
          </div>
          <div class="mainboard-loading__title">
            <span >{{ $t("loading") }}</span>
          </div>
        </v-layout>
      </div>
    </v-dialog>

    <v-dialog
      class="mainboard-list-thumbs"
      v-model="dialogListWindows"
      fullscreen
      hide-overlay
      persistent
    >
      <!-- <mainboard-thumb-frame-window
        v-for="window in windows"
        :key="window.id"
        :id="window.id"
        :options="window"
      >
      </mainboard-thumb-frame-window> -->
      <div class="mainboard-list-thumbs__container text-md-center">
        <v-layout
          align-center
          justify-center
          row
          fill-height

        >
        <div
          class="mainboard-thumb-window text-xs-center"
          v-for="window in thumbWindows"
          :key="window.id"
        >
        <v-card flat tile>
          <div class="thumb-window-title">
            <img
              :src="getImageThumbWindow(window.object.id)"
              :style="{width: '64px'}"
            />
          </div>
          <div class="thumb-window-body text-xs-center">
            {{window.title}}
          </div>
          <v-btn
            class="thumb-window-btn-close"
            absolute
            fab
            dark
            small
            depressed
            color="pink"
            @click="closeWindow(window.id)"
            @tap="closeWindow(window.id)"
          >
            <v-icon dark>close</v-icon>
          </v-btn>
        </v-card>
          <!-- <iframe :src="page/banner.html" width="468" height="60" align="left"> -->
        </div>
        </v-layout>
      </div>

    </v-dialog>
  </v-app>
</template>

<script>
import Toolbar from "@/components/Desktop/Toolbar/Toolbar.vue";
import FrameWindow from "@/components/Desktop/Window/FrameWindow.vue";
import SideBar from "@/components/Desktop/SideBar/BaseSideBar.vue";
import ThumbFrameWindow from "@/components/Desktop/Window/ThumbFrameWindow.vue";
import Frame from "@/components/Desktop/Base/BaseFrame.vue";

import axios from "axios";

export default {
  name: "App",

  components: {
    mainboardToolbar: Toolbar,
    mainboardFrameWindow: FrameWindow,
    mainboardSideBar: SideBar,
    mainboardFrameWindow: FrameWindow,
    mainboardThumbFrameWindow: ThumbFrameWindow,
    mainboardFrame: Frame
  },
  data() {
    return {
      visibleSideBar: false,
      dialogLoading: true,
      drawer: false,
      dialogListWindows: false,
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

  mounted() {},

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

    closeWindow(windowId) {
      console.log("closeWindow windowId", windowId);
      this.$store.dispatch("actionCloseWindow", windowId).then(() => {
        this.$store.commit("setActiveWindow");
        this.$store.dispatch("actionSaveSettingsDesktop");
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
  height: 100%;
  background-color: rgba(37, 47, 68, 0.6);
}

.mainboard-thumb-window {
  width: 150px;
  height: 150px;
  /* overflow: hidden; */
  margin-right: 5px;
  background-color: #fff;
  border: 2px solid #e91e6244 !important;
  border-radius: 4px;
  webkit-box-shadow: 1px 3px 9px rgba(0, 0, 0, 0.3);
  box-shadow: 1px 3px 9px rgba(0, 0, 0, 0.3);
}

.thumb-window-title {
  font-size: 12px;
  margin-top: 20px;
  margin-bottom: 10px;
}

.thumb-window-btn-close {
  /* position: absolute; */
  top: -40px;
  right: -20px;
}
</style>
