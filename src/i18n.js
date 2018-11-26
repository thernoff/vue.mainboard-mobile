import Vue from "vue";
import VueI18n from "vue-i18n";
import axios from "axios";

Vue.use(VueI18n);

function loadLocaleMessages() {
  const locales = require.context(
    "./locales",
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i
  );
  const messages = {};
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });
  return messages;
}

export default new VueI18n({
  //locale: process.env.VUE_APP_I18N_LOCALE || "en",
  //fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || "en",
  locale: getUserLanguage() || "en",
  fallbackLocale: getUserLanguage() || "en",
  messages: loadLocaleMessages()
  //messages: dictonary
  //messages: getMessagesAsync()
  //messages: []
});

function getUserLanguage() {
  var language = window.navigator
    ? window.navigator.language ||
      window.navigator.systemLanguage ||
      window.navigator.userLanguage
    : "ru";
  return (language = language.substr(0, 2).toLowerCase());
}

async function getMessagesAsync() {
  const messages = {};
  try {
    const response = await axios.get("/extusers/fpage/dictonary/");
    console.log("response", response);
    messages[response.data.lang] = response.data.dictonary;
  } catch (error) {
    console.log("error", error);
  }
  console.log("messages", messages);
  //.then(response => { return response.data.dictonary; });
  return messages;
}

/* async function getMessagesAsync() {
  //console.log("this.$i18n.locale", this.$i18n.locale);
  await axios
    .get(window.location.href + "extusers/fpage/dictonary/")
    .then(response => {
      console.log("response response.data", response.data);
      console.log(
        "response response.data.dictonary",
        response.data.dictonary
      );
      console.log("response response.data.lang", response.data.lang);
      console.log("response this.$i18n", this.$i18n);

      //this.$i18n.setLocalMessage(response.data.lang, response.data.dictonary);
      //this.$i18n.locale = response.data.lang;

      //console.log("this.$i18n.locale", this.$i18n.locale);
      console.log('response.data.dictonary 1', response.data.dictonary);
      return response.data.dictonary;
    })
    .catch(error => {
      console.log("error", error);
    });
} */

/* function setI18nLanguage (lang) {
  i18n.locale = lang
  axios.defaults.headers.common['Accept-Language'] = lang
  document.querySelector('html').setAttribute('lang', lang)
  return lang
}

export function loadLanguageAsync (lang) {
  if (i18n.locale !== lang) {
    if (!loadedLanguages.includes(lang)) {
      return import( `@/lang/${lang}`).then(msgs => {
        i18n.setLocaleMessage(lang, msgs.default)
        loadedLanguages.push(lang)
        return setI18nLanguage(lang)
      })
    }
    return Promise.resolve(setI18nLanguage(lang))
  }
  return Promise.resolve(lang)
} */
