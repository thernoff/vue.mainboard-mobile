<template>
  <div
    ref="window"
    :data-id="id"
    :style="{
      top: options.top * heightWorkspace / 100 + 'px',
      left: options.left * widthWorkspace / 100 + 'px',
      width: options.width + '%',
      height: options.height + '%',
      zIndex: options.zIndex,
    }"
    :class="[{'fullscreen': options.fullscreen, 'window-active': options.active}, options.classesCss.join(' ')]"
    class="mainboard-window"
    @contextmenu.stop.prevent="''"
  >
    <v-card
      tile
      class="mainboard-window__card"
    >
      <v-card-title
        :class = "{'mainboard-window__header--active': options.active}"
        :title="options.title"
        class="mainboard-window__header"
        primary-title
      >
        <div class="mainboard-window__title">{{ options.title }}</div>
        <v-spacer/>
        <slot name="buttons"/>
        <div
          class="mainboard-window__group-buttons">
          <!-- <v-btn
            :title=" $t('minimize') "
            icon
            small
            class="mainboard-window__btn"
            @click.stop="minimizeWindow"
            @mousedown="''"
          >
            <v-icon color="white">minimize</v-icon>
          </v-btn> -->
          <v-btn
            :title=" $t('window.close') "
            icon
            small
            class="mainboard-window__btn"
            @click.stop="closeWindow"
          >
            <v-icon color="white">close</v-icon>
          </v-btn>
        </div>
      </v-card-title>
      <div
        ref="windowBody"
        class="mainboard-window__body"
        @mousedown="''"
      >
        <slot name="body"/>
      </div>
      <v-divider/>
    </v-card>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    id: {
      type: String,
      required: true
    },
    options: {
      type: Object,
      required: true
    }
  },
  data() {
    return {};
  },
  computed: {
    showBtnBack() {
      return this.history.length > 1;
    },

    widthWorkspace() {
      return this.$store.state.desktop.widthWorkspace;
    },

    heightWorkspace() {
      return this.$store.state.desktop.heightWorkspace;
    }
  },

  methods: {
    toggleClassWindow(classCss) {
      this.$store.commit("toggleClassWindow", {
        id: this.id,
        classCss: classCss
      });
      this.$store.dispatch("actionSaveSettingsDesktop");
    },

    setActiveWindow() {
      this.$store.commit("setActiveWindow", this.id);
      this.$store.dispatch("actionSaveSettingsDesktop");
    },

    minimizeWindow() {
      this.$store.commit("toggleMinimizeWindow", this.id);
      if (this.options.active) {
        //this.$store.commit("unsetActiveWindow");
      }
      this.$store.dispatch("actionSaveSettingsDesktop");
    },

    closeWindow() {
      this.$store.dispatch("actionCloseWindow", this.id).then(() => {
        this.$store.commit("setActiveWindow");
        this.$store.dispatch("actionSaveSettingsDesktop");
      });
    }
  }
};
</script>

<style>
.mainboard-window {
  position: absolute;
  /* border: 2px solid rgba(92, 107, 192, 0.8); */
  border-radius: 5px;
  box-sizing: border-box;
  webkit-box-shadow: 1px 3px 9px rgba(0, 0, 0, 0.5);
  box-shadow: 1px 3px 9px rgba(0, 0, 0, 0.5);
  background-color: #fff;
}

.mainboard-window--fullheight {
  top: 0px !important;
  height: 100% !important;
}

.mainboard-window--fullwidth {
  width: 100% !important;
}

.mainboard-window--top-half {
  top: 0px !important;
  left: 0px !important;
  width: 100% !important;
  height: 50% !important;
}

.mainboard-window--bottom-half {
  bottom: 0px !important;
  left: 0px !important;
  width: 100% !important;
  height: 50% !important;
}

.mainboard-window__card {
  position: relative;
  width: 100%;
  height: 100%;
  border: 2px solid #5b7aa1;
  border-radius: inherit;
}

.mainboard-window__header {
  font-size: 16px;
  background-color: #c5cae9;
  border-color: #c5cae9;
  color: #fff;
  cursor: move;
  padding: 0 5px !important;
  height: 30px;
  border-top-left-radius: 0px !important;
  border-top-right-radius: 0px !important;
}

.mainboard-window__header--active {
  background-color: #4a6588 !important;
  border-color: #4a6588 !important;
}

.mainboard-window__title {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.mainboard-window__group-buttons {
  /*   width: 40%;
  float: right; */
}

.mainboard-window__btn {
  margin: 0 !important;
}

.mainboard-window__body {
  height: calc(100% - 40px);
  position: relative;
  padding: 0;
  margin: 0;
  /* border-radius: inherit; */
}

.fullscreen {
  position: absolute !important;
  z-index: 1000;
  width: 100% !important;
  height: 100% !important;
  top: 0 !important;
  left: 0 !important;
  bottom: 0 !important;
  right: 0 !important;
}

.half-height {
  height: 90% !important;
}

.half-width {
  width: 90% !important;
}

@media (max-width: 1200px) {
  .mainboard-window__title {
    width: 55%;
    font-size: 14px;
  }
}

@media (max-width: 800px) {
  .mainboard-window__title {
    display: none;
  }
}
</style>
