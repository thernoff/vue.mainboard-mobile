<template>
  <v-app class="mainboard-mobile">
    <!-- <mainboard-side-bar
      :visible="visibleSideBar"
      @input="hideShowDrawer($event)"
    ></mainboard-side-bar> -->

     <v-navigation-drawer
      v-model="drawer"
      :touchless="false"
      @input="input"
      fixed
      app
    >
      <v-list>
        <v-list-group
        v-for="category in categories"
        v-if="parseInt(category.visible)"
        :key="category.id"
        class="mainboard-startmenu__category"
      >
        <v-list-tile
          slot="activator"
        >
          <i class="material-icons icon-folder">folder</i>
          <v-list-tile-content>
            <v-list-tile-title>
              <!-- <span
                :class="[{'mainboard-startmenu__item--xs': $vuetify.breakpoint.xsOnly}]"
              > -->
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
    <mainboard-toolbar
      class="mainboard-toolbar"
      @showDrawer="handlerShowDrawer"
    />

    <!--Компонент рабочей области (используется для отображения остальных компонентов)-->
     <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center align-center>
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
          fill-height>
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
  </v-app>
</template>

<script>
import Toolbar from "@/components/Desktop/Toolbar/Toolbar.vue";
import FrameWindow from "@/components/Desktop/Window/FrameWindow.vue";
import SideBar from "@/components/Desktop/SideBar/BaseSideBar.vue";

import axios from "axios";

export default {
  name: "App",

  components: {
    mainboardToolbar: Toolbar,
    mainboardFrameWindow: FrameWindow,
    mainboardSideBar: SideBar
  },
  data() {
    return {
      visibleSideBar: false,
      dialogLoading: true
    };
  },

  computed: {
    error() {
      return this.$store.getters.error;
    }
  },

  watch: {},

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

    handlerShowDrawer() {
      this.visibleSideBar = true;
      console.log("handlerShowDrawer this.visibleSideBar", this.visibleSideBar);
    },

    hideShowDrawer(visibleSideBar) {
      if (!visibleSideBar) {
        this.visibleSideBar = visibleSideBar;
        console.log("hideShowDrawer visibleSideBar", visibleSideBar);
      }
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
}

.mainboard-loading__title {
  font-size: 16px;
  color: #fff;
}
</style>
