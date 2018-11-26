<template>
  <div class="mainboard-frame">
    <div class="mainboard-frame__cover"/>
    <iframe
      ref="baseFrame"
      :src="src"
      class="mainboard-frame__frame"
      frameborder="0"
      @load="load"/>
  </div>
</template>

<script>
export default {
  props: {
    apiLink: {
      type: String,
      default: () => ""
    },
    backLink: {
      type: String,
      default: () => ""
    }
  },

  data() {
    return {
      src: this.apiLink,
      firstLoad: true
    };
  },

  watch: {
    backLink(newVal, oldVal) {
      if (newVal) {
        this.$refs.baseFrame.src = newVal;
      }
    }
  },

  methods: {
    load() {
      console.log("First load frame");
      if (!this.firstLoad) {
        let apiLink = "";
        const currentLink = this.$refs.baseFrame.contentWindow.location.href;
        const posRedirurl = this.apiLink.search(/redirurl/i);

        if (posRedirurl > 0) {
          let subApiLink = this.apiLink.slice(0, posRedirurl);
          let newRedirurl = btoa(currentLink);
          newRedirurl = newRedirurl.replace(/\+/g, "-");
          newRedirurl = newRedirurl.replace(/\//g, "_");
          newRedirurl = newRedirurl.replace(/=/g, ",");
          apiLink = subApiLink + "redirurl=" + newRedirurl;
        }
        const data = {
          title: this.$refs.baseFrame.contentWindow.document.title,
          apiLink,
          currentLink
        };

        this.$emit("loadFrame", data);
      } else {
        this.firstLoad = false;
      }
    }
  }
};
</script>

<style scoped>
.mainboard-frame {
  position: relative;
  width: 100%;
  height: 100%;
}

.mainboard-frame__frame {
  width: 100%;
  height: 100%;
}

.mainboard-frame__cover {
  display: none;
  width: 100%;
  height: 100%;
  z-index: 500;
  position: absolute;
  left: 0px;
  top: 0px;
  overflow: hidden;
}
</style>
