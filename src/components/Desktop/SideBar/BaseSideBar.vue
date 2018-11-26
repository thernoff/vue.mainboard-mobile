<template>
  <div class="mainboard-base-sidebar">
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
  </div>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      drawer: null
    };
  },
  computed: {
    categories() {
      return this.$store.getters.categories;
    }
  },
  watch: {
    visible(value) {
      if (this.drawer) {
        this.drawer = null;
      } else {
        this.drawer = value;
      }
    }
  },
  methods: {
    input() {
      console.log("input");
      this.$emit("input", this.drawer);
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
    }
  }
};
</script>
