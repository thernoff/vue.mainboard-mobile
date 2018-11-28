<template>
  <base-window :id="id" :options="options" class="mainboard-frame-window">
    <div slot="buttons" class="mainboard-window__group-buttons">
      <v-btn v-if="showBtnBack" icon class="mainboard-window__btn" title="Назад" @click="back">
        <v-icon color="white">fas fa-arrow-left</v-icon>
      </v-btn>
      <v-btn
        :title=" $t('window.refresh') "
        icon
        class="mainboard-window__btn"
        @click.stop="reloadWindow"
      >
        <v-icon color="white">refresh</v-icon>
      </v-btn>
    </div>

    <div slot="body" class="mainboard-frame-window__body">
      <div v-if="!options.active" class="mainboard-window__cover-window" @click="setActiveWindow"/>
      <base-mainboard-frame
        ref="baseMainboardFrame"
        :back-link="backLink"
        :api-link="options.apiLink"
        @loadFrame="updateWindow($event)"
      />
    </div>
  </base-window>
</template>

<script>
import baseWindow from "@/components/Desktop/Window/BaseWindow.vue";
import baseFrame from "@/components/Desktop/Base/BaseFrame.vue";
export default {
  components: {
    baseMainboardFrame: baseFrame,
    baseWindow: baseWindow
  },
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
    return {
      apiLink: "",
      backLink: "",
      history: [],
      pressBtnReload: false,
      pressBtnBack: false
    };
  },
  computed: {
    showBtnBack() {
      return this.history.length > 1;
    },

    isModeGrid() {
      return this.$store.isModeGrid;
    },

    widthWorkspace() {
      return this.$store.state.desktop.widthWorkspace;
    },

    heightWorkspace() {
      return this.$store.state.desktop.heightWorkspace;
    }
  },

  created() {
    this.apiLink = this.options.apiLink;
    this.history.push(this.options.apiLink);
  },

  methods: {
    setActiveWindow() {
      this.$store.commit("setActiveWindow", this.id);
      this.$store.dispatch("actionSaveSettingsDesktop");
    },

    reloadWindow() {
      this.$refs.baseMainboardFrame.$refs.baseFrame.src = this.options.apiLink;
    },

    updateWindow(data) {
      console.log("updateWindow data", data);
      this.updateHistory(data.currentLink);
      let options = Object.assign({}, data, { id: this.id });
      this.$store.dispatch("actionUpdateWindow", options).then(() => {
        this.$store.dispatch("actionSaveSettingsDesktop");
      });
    },

    updateWindowTitle(title) {
      this.$store.commit("updateWindowTitle", { id: this.id, title });
      this.$store.dispatch("actionSaveSettingsDesktop");
    },

    updateHistory(apiLink) {
      if (!this.pressBtnReload && !this.pressBtnBack) {
        this.history.push(apiLink);
      }

      this.pressBtnReload = false;
      this.pressBtnBack = false;
      this.backLink = "";
      //console.log("Window.history", this.history);
    },

    back() {
      if (this.history.length > 1) {
        this.pressBtnBack = true;
        this.backLink = this.history[this.history.length - 2];
        this.history.pop();
      }
    }
  }
};
</script>

<style scoped>
.mainboard-frame-window__body {
  height: 100%;
}

.mainboard-window__cover-window {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 10;
}
</style>
