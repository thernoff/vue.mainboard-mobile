module.exports = {
  runtimeCompiler: true,

  /* chainWebpack: config => {
    config.plugin("provide").use(require("webpack").ProvidePlugin, [
      {
        $: "jquery",
        jquery: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery"
      }
    ]);
  } */ pluginOptions: {
    i18n: {
      locale: "ru",
      fallbackLocale: "ru",
      localeDir: "locales",
      enableInSFC: true
    }
  }
};
