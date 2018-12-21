<template>
  <div class="mainboard-toolbar">
    <v-toolbar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      dark
      color="primary"
      height="40"
      app
      fixed
    >
      <v-toolbar-side-icon @click="showDrawer"></v-toolbar-side-icon>
      <v-toolbar-title>{{titleToolbar}}</v-toolbar-title>
      <v-spacer/>
    </v-toolbar>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      modeGrid: true,
      visibleDialogWindow: false,
      visibleInfoDialogWindow: false,
      visibleInputDialogWindow: false,
      visibleCover: false
    };
  },

  computed: {
    workspaces() {
      return this.$store.getters.workspaces;
    },

    countWorkspaces() {
      return this.workspaces.length;
    },

    isModeGrid() {
      return this.$store.getters.isModeGrid;
    },

    titleActiveWorkspace() {
      return this.$store.getters.getTitleActiveWorkspace;
    },

    titleToolbar() {
      const title = document.title || "";
      return title ? title : "Incom";
    }
  },

  methods: {
    showCover() {
      this.visibleCover = true;
    },

    hideCover() {
      this.visibleCover = false;
    },

    showDialogWindow() {
      this.hideCover();
      this.visibleDialogWindow = true;
    },

    hideDialogWindow() {
      this.visibleDialogWindow = false;
    },

    showInfoDialogWindow() {
      this.hideCover();
      this.visibleInfoDialogWindow = true;
    },

    hideInfoDialogWindow() {
      this.visibleInfoDialogWindow = false;
    },

    showInputDialogWindow() {
      this.hideCover();
      this.visibleInputDialogWindow = true;
    },

    hideInputDialogWindow() {
      this.visibleInputDialogWindow = false;
    },

    createNewWorkspace(nameWorkspace) {
      this.$store.dispatch("actionCreateNewWorkspace", nameWorkspace);
      this.$store.dispatch("actionSaveSettingsDesktop");
    },

    deleteCurrentWorkspace(accept) {
      this.visibleDialogWindow = false;
      if (this.countWorkspaces < 2 && accept) {
        this.showInfoDialogWindow();
        return;
      }

      if (accept) {
        this.$store.dispatch("actionDeleteCurrentWorkspace");
        this.$store.dispatch("actionSaveSettingsDesktop");
      }
    },

    toggleModeGrid() {
      console.log("toggleModeGrid");
      this.$store.commit("toggleModeGrid");
      if (this.isModeGrid) {
        $(".mainboard-window").draggable("option", "snap", false);
      } else {
        $(".mainboard-window").draggable("option", "snap", ".mainboard-window");
      }
    },

    setActiveWorkspace(index) {
      this.$store.dispatch("actionSetActiveWorkspace", index).then(() => {
        //this.$store.dispatch("actionSetActiveWindow");
        this.$store.dispatch("actionSaveSettingsDesktop");
      });
    },

    setNotActiveWindows() {
      this.$store.dispatch("actionSetNotActiveWindows").then(() => {
        this.$store.dispatch("actionSaveSettingsDesktop");
      });
    },

    showDrawer() {
      this.$emit("showDrawer");
      //this.$store.commit("toggleShowLeftSidebar");
    }
  }
};
</script>

<style scoped>
.mainboard-toolbar {
  height: 40px;
}

.mainboard-toolbar__btn-about {
  width: 30px !important;
  height: 30px !important;
  background-color: #7e456d !important;
  border-color: #7e456d !important;
}
</style>
